"""Disease detection service with startup model loading and in-memory inference."""

import asyncio
import io
import logging
from typing import Optional, Tuple
import numpy as np
from PIL import Image, UnidentifiedImageError
from fastapi import HTTPException, UploadFile, status
import tf_keras as keras

from app.core.config import BACKEND_DIR, settings
from app.schemas.disease import DiseasePredictResponse

logger = logging.getLogger("agritech.disease")

MODEL_PATH = BACKEND_DIR.parent / "ml" / "disease" / "fine_tuned_model.h5"
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
IMAGE_TARGET_SIZE = (224, 224)

# Authoritative 38-class mapping from the training Kaggle notebook
DISEASE_CLASSES: Tuple[str, ...] = (
    "Apple___Apple_scab",                           # 0
    "Apple___Black_rot",                            # 1
    "Apple___Cedar_apple_rust",                     # 2
    "Apple___healthy",                              # 3
    "Blueberry___healthy",                          # 4
    "Cherry_(including_sour)___Powdery_mildew",      # 5
    "Cherry_(including_sour)___healthy",             # 6
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",  # 7
    "Corn_(maize)___Common_rust_",                  # 8
    "Corn_(maize)___Northern_Leaf_Blight",           # 9
    "Corn_(maize)___healthy",                       # 10
    "Grape___Black_rot",                            # 11
    "Grape___Esca_(Black_Measles)",                 # 12
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",   # 13
    "Grape___healthy",                              # 14
    "Orange___Haunglongbing_(Citrus_greening)",     # 15
    "Peach___Bacterial_spot",                       # 16
    "Peach___healthy",                              # 17
    "Pepper,_bell___Bacterial_spot",                # 18
    "Pepper,_bell___healthy",                       # 19
    "Potato___Early_blight",                        # 20
    "Potato___Late_blight",                         # 21
    "Potato___healthy",                             # 22
    "Raspberry___healthy",                          # 23
    "Soybean___healthy",                            # 24
    "Squash___Powdery_mildew",                      # 25
    "Strawberry___Leaf_scorch",                     # 26
    "Strawberry___healthy",                         # 27
    "Tomato___Bacterial_spot",                      # 28
    "Tomato___Early_blight",                        # 29
    "Tomato___Late_blight",                         # 30
    "Tomato___Leaf_Mold",                           # 31
    "Tomato___Septoria_leaf_spot",                  # 32
    "Tomato___Spider_mites Two-spotted_spider_mite",# 33
    "Tomato___Target_Spot",                         # 34
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",       # 35
    "Tomato___Tomato_mosaic_virus",                 # 36
    "Tomato___healthy",                             # 37
)


def preprocess_image(img: Image.Image) -> np.ndarray:
    """Converts image to 224x224 RGB tensor scaled to [0.0, 1.0] via x / 255.0 matching the source Kaggle notebook."""
    rgb_img = img.convert("RGB")
    resized_img = rgb_img.resize(IMAGE_TARGET_SIZE, Image.Resampling.BILINEAR)
    arr = np.array(resized_img, dtype=np.float32)
    # Authoritative normalization from Kaggle training notebook: image / 255.0 -> [0.0, 1.0]
    arr = arr / 255.0
    return np.expand_dims(arr, axis=0)


class DiseaseService:
    """Service managing disease classification model lifecycle and prediction."""

    def __init__(self) -> None:
        self._model: Optional[keras.Model] = None

    async def load_model(self) -> None:
        """Loads fine_tuned_model.h5 once at application startup."""
        if not MODEL_PATH.exists():
            logger.warning(
                "Disease model artifact not found at %s. Service will be unavailable.",
                MODEL_PATH,
            )
            self._model = None
            return

        try:
            logger.info("Loading disease model from %s...", MODEL_PATH)
            # Use tf_keras for backward-compatible deserialization of legacy Keras 2 H5 format
            self._model = keras.models.load_model(str(MODEL_PATH), compile=False)
            logger.info(
                "Disease model successfully loaded into memory. Input: %s, Output: %s",
                self._model.input_shape,
                self._model.output_shape,
            )
        except Exception as exc:
            logger.error("Failed to load disease model from %s: %s", MODEL_PATH, str(exc))
            self._model = None
            raise RuntimeError(f"Could not load disease model: {exc}") from exc

    async def unload_model(self) -> None:
        """Releases model resource during shutdown."""
        self._model = None
        logger.info("Disease model unloaded.")

    @property
    def is_model_loaded(self) -> bool:
        """Indicates whether model is currently resident in memory."""
        return self._model is not None

    async def validate_image(self, file: UploadFile) -> bytes:
        """Validates file MIME type, size limit, and structural integrity."""
        if not file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file uploaded. Please upload a plant leaf image.",
            )

        if file.content_type not in ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only JPEG, PNG, and WebP images are accepted.",
            )

        # Stream read with size ceiling to prevent memory exhaustion
        contents = await file.read(MAX_FILE_SIZE_BYTES + 1)
        if len(contents) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image file size exceeds maximum limit of 10MB.",
            )

        if len(contents) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )

        # In-memory structural validation with Pillow
        try:
            with Image.open(io.BytesIO(contents)) as img:
                img.verify()
        except (UnidentifiedImageError, OSError, ValueError) as exc:
            logger.warning("Image integrity verification failed: %s", str(exc))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is corrupted or unreadable as an image.",
            ) from exc

        return contents

    def _preprocess_and_infer(self, image_bytes: bytes) -> Tuple[int, float]:
        """Synchronous CPU worker: decode, resize, normalize, and run forward pass."""
        with Image.open(io.BytesIO(image_bytes)) as img:
            batch = preprocess_image(img)

        predictions = self._model.predict(batch, verbose=0)
        probs = predictions[0]

        top_index = int(np.argmax(probs))
        confidence = float(probs[top_index])
        return top_index, confidence

    async def predict_disease(self, file: UploadFile) -> DiseasePredictResponse:
        """Processes leaf image upload, runs inference, and returns diagnostic response."""
        if not self.is_model_loaded:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Disease detection model service is currently unavailable.",
            )

        try:
            image_bytes = await self.validate_image(file)
            top_index, confidence = await asyncio.to_thread(
                self._preprocess_and_infer, image_bytes
            )
            prediction_label = DISEASE_CLASSES[top_index]

            return DiseasePredictResponse(
                success=True,
                predicted_class_index=top_index,
                prediction=prediction_label,
                confidence=round(confidence, 4),
                message=f"Plant disease diagnosis completed successfully: {prediction_label}",
            )
        except HTTPException:
            raise
        except Exception as exc:
            logger.exception("Inference execution failed: %s", str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred during disease diagnosis inference.",
            ) from exc
        finally:
            await file.close()


disease_service = DiseaseService()
