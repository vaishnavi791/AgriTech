# AgriTech Backend

FastAPI backend foundation for the AgriTech intelligent agriculture platform.

## Technology Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Data Validation & Settings**: [Pydantic v2](https://docs.pydantic.dev/) & `pydantic-settings`
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with `motor` (async driver)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # Application entrypoint, CORS, lifespan, exception handlers
│   ├── core/
│   │   ├── config.py        # Pydantic Settings and environment configuration
│   │   ├── database.py      # MongoDB Atlas connection infrastructure, health check, collection accessors
│   │   └── security.py      # Security placeholders
│   ├── routes/
│   │   ├── api.py           # Top-level API router (/api) & health endpoint
│   │   ├── auth.py          # Auth route module contract
│   │   ├── crop.py          # Crop recommendation route module contract
│   │   ├── disease.py       # Disease detection route module contract
│   │   ├── cost.py          # Cost estimation route module contract
│   │   ├── price.py         # Price forecasting route module contract
│   │   └── chatbot.py       # Chatbot route module contract
│   ├── schemas/
│   │   ├── health.py        # Health response Pydantic schema
│   │   ├── common.py        # Generic response & error schemas
│   │   ├── auth.py          # Auth contract schemas (TBD)
│   │   ├── chatbot.py       # Chatbot contract schemas (TBD)
│   │   ├── crop.py          # Crop recommendation contract schemas (TBD)
│   │   ├── disease.py       # Disease detection contract schemas (TBD)
│   │   ├── cost.py          # Cost estimation contract schemas (TBD)
│   │   └── price.py         # Price forecasting contract schemas (TBD)
│   ├── models/
│   │   ├── user.py          # UserDocument database document model
│   │   ├── prediction.py    # PredictionDocument database document model
│   │   └── chat.py          # ChatMessageDocument database document model
│   ├── services/
│   │   ├── user_service.py       # Reusable persistence operations for 'users' collection
│   │   ├── prediction_service.py # Reusable persistence operations for 'predictions' collection
│   │   ├── chat_service.py       # Reusable persistence operations for 'chat_messages' collection
│   │   ├── auth_service.py       # Auth service placeholder
│   │   ├── chatbot_service.py    # Chatbot service placeholder
│   │   ├── crop_service.py       # Crop service placeholder
│   │   ├── disease_service.py    # Disease service placeholder
│   │   ├── cost_service.py       # Cost service placeholder
│   │   └── price_service.py      # Price service placeholder
│   └── utils/
│       └── helpers.py       # Helper utilities (serialization, timestamps)
├── .env.example             # Example environment variables
├── requirements.txt         # Python dependencies
└── README.md                # Backend documentation
```

---

## MongoDB Atlas Database Setup

The backend utilizes MongoDB Atlas with asynchronous driver `motor`.

### 1. Required Environment Variables

Configure these variables in your `.env` file:

```env
MONGODB_URL="mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority"
DATABASE_NAME="agritech_db"
```

### 2. How to Obtain the Connection String

1. Log into your [MongoDB Atlas](https://cloud.mongodb.com/) account.
2. In the **Database Deployments** screen, click **Connect** next to your cluster.
3. Choose **Drivers** (Driver: `Python`, Version: `3.12 or later`).
4. Copy the connection string format:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Replace `<username>` and `<password>` with your database user credentials.
6. Ensure your network IP is whitelisted under **Network Access** in the MongoDB Atlas console (or allow access from anywhere `0.0.0.0/0` for development).

### 3. Application Behavior When MongoDB Is Unavailable

The backend is engineered to handle database outages gracefully:
- **Startup Resilience**: If MongoDB Atlas is offline, unreachable, or unconfigured at boot time, connection errors do **not** crash FastAPI. A warning is logged, and the server starts in local degraded mode.
- **Health Verification**: Non-database endpoints (such as `GET /api/health` and OpenAPI documentation) continue serving normally.
- **Runtime Persistence Guard**: Any service attempting database operations when the connection is unavailable raises `DatabaseUnavailableException`, which the global exception handler translates into an HTTP 503 response using the standard error envelope:
  ```json
  {
    "success": false,
    "error": {
      "code": 503,
      "message": "Database service is currently unavailable. Please try again later."
    }
  }
  ```

### 4. Security Reminder

> [!CAUTION]
> **Never commit real credentials or database connection strings to git.**
> Keep `.env` listed in `.gitignore` and only distribute `.env.example` with sanitized placeholders.

---

## Getting Started

### 1. Prerequisites

- Python 3.10+
- pip

### 2. Setup Virtual Environment (Recommended)

From the `backend/` directory:

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Copy `.env.example` to `.env` and set your configuration parameters:

```bash
cp .env.example .env
```

### 5. Run the Development Server

From the `backend/` directory:

```bash
uvicorn app.main:app --reload
```

The API will be available at:
- **Base URL**: `http://127.0.0.1:8000`
- **API Root**: `http://127.0.0.1:8000/api`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## Health Check Endpoint

- **GET** `/api/health`
- **Response**:
  ```json
  {
    "status": "healthy",
    "service": "AgriTech Backend API",
    "version": "1.0.0",
    "environment": "development"
  }
  ```

---

## Authentication

Authentication is provided through three endpoints:

- **POST** `/api/auth/register`: validates an email, password, and optional name, hashes the password with Argon2, and stores only the hash.
- **POST** `/api/auth/login`: verifies credentials and returns a JWT access token with the authenticated user's basic information.
- **GET** `/api/auth/me`: returns the current user and requires `Authorization: Bearer <token>`.

Configure these environment variables before using authentication:

```env
JWT_SECRET_KEY=<your-secret-key>
JWT_ALGORITHM=<configured-algorithm>
ACCESS_TOKEN_EXPIRE_MINUTES=<expiration-in-minutes>
```

Tokens contain the user identity and an expiration claim. Expired, malformed, invalid, or missing tokens are rejected with the standard `401` error response. Passwords are never returned by the API and must never be logged or committed in plaintext. Never commit real JWT secrets or other credentials; keep them in the local `.env` file.

---

## Crop Recommendation

`POST /api/crop/predict` loads `ml/crop/crop_recommendation_model.pkl` with `joblib` and calls the supplied `RandomForestClassifier`. The runtime dependency is pinned to scikit-learn `1.7.1`, matching the version recorded in the artifact warning during verification.

Request body:

```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.879744,
  "humidity": 82.002744,
  "ph": 6.502985,
  "rainfall": 202.935536
}
```

All seven fields are required numeric values: `N`, `P`, `K`, `temperature`, `humidity`, `ph`, and `rainfall`. The service preserves this exact feature order and passes named columns to the model.

Response body:

```json
{
  "prediction": "rice",
  "confidence": 0.9
}
```

`prediction` comes from `predict()`. `confidence` is the maximum value returned by `predict_proba()` and is constrained to `[0, 1]`. Missing or malformed fields return `422`. Missing, incompatible, or failing model loading/inference returns a controlled `500` response without exposing stack traces.

The model is loaded lazily and cached for reuse. scikit-learn compatibility warnings are not suppressed; the dependency is pinned to the verified artifact version.

---

## Plant Disease Detection

`POST /api/disease/predict` processes uploaded plant leaf imagery using the fine-tuned MobileNetV2 disease model (`ml/disease/fine_tuned_model.h5`).

### Model Architecture & Runtime
- **Model**: MobileNetV2 base (157 layers) + `GlobalAveragePooling2D` + `Dense(128)` + `Dense(38, activation='softmax')`.
- **Runtime Loader**: Loaded once at FastAPI startup via `tf_keras.models.load_model(..., compile=False)`.
- **Dependencies**: `tensorflow==2.21.0`, `tf-keras==2.21.0`, `pillow==12.3.0`, `python-multipart>=0.0.9`.

### Request Format
- **HTTP Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Field**: `file` (binary image)
- **Accepted MIME Types**: `image/jpeg`, `image/png`, `image/webp`
- **Max File Size**: 10 MB

### Preprocessing Pipeline
1. In-memory Pillow decoding and conversion to RGB (`image.convert("RGB")`).
2. Resized to `(224, 224)` via bilinear interpolation.
3. External MobileNetV2 normalization to `[-1, 1]` via `(x / 127.5) - 1.0` (zero double-normalization risk; model contains no internal `Rescaling` layers).
3. Kaggle notebook normalization to `[0.0, 1.0]` via `image / 255.0` (zero double-normalization risk; model contains no internal `Rescaling` layers).
4. Expanded to batch tensor `(1, 224, 224, 3)`.

### Response Schema (`200 OK`)
```json
{
  "success": true,
  "predicted_class_index": 10,
  "prediction": null,
  "confidence": 0.9937,
  "message": "Inference completed successfully. Authoritative class-label mapping is pending confirmation."
  "predicted_class_index": 1,
  "prediction": "Apple___Black_rot",
  "confidence": 0.9965,
  "message": "Plant disease diagnosis completed successfully: Apple___Black_rot"
}
```
- `predicted_class_index`: Integer in `[0, 37]` corresponding to the model's argmax output.
- `prediction`: Always explicitly present with value `null` while authoritative class-label mapping is pending confirmation from the training dataset.
- `prediction`: Authoritative plant disease label mapped directly from the source Kaggle training notebook classes.
- `confidence`: Genuine maximum softmax probability float in `[0.0, 1.0]`.

### Error Responses
- `400 Bad Request`: Non-image file type, missing file, empty upload, or corrupted/unreadable image.
- `413 Payload Too Large`: Image file size exceeds 10MB.
- `503 Service Unavailable`: Disease model artifact missing or failed to load at startup.
- `500 Internal Server Error`: Controlled error if unexpected inference failure occurs (no internal paths or stack traces exposed).

---

## Database Collections & Persistence Infrastructure

The persistence layer organizes data into three primary collections:
1. `users`: User account records managed via [user_service.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/services/user_service.py) and [user.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/models/user.py). Plaintext passwords are never stored; only password hashes are persisted.
2. `predictions`: Prediction and estimation histories across crop, disease, cost, and price modules managed via [prediction_service.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/services/prediction_service.py) and [prediction.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/models/prediction.py).
3. `chat_messages`: Conversational context and message histories for the AI Agri Assistant managed via [chat_service.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/services/chat_service.py) and [chat.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/models/chat.py).



## Cost Estimation API

The Cost Estimation module provides a deterministic cultivation-cost
calculation through the FastAPI backend.

### Endpoint

```text
POST /api/cost/estimate

Calculation Flow

React Cost Form
      ↓
POST /api/cost/estimate
      ↓
FastAPI request validation
      ↓
app/routes/cost.py
      ↓
app/services/cost_service.py
      ↓
ml/cost/calculator.py
      ↓
Structured cost and profitability result
      ↓
React Cost Result UI



Request Schema

| Field                            | Type   | Description                                |
| -------------------------------- | ------ | ------------------------------------------ |
| `crop`                           | string | Crop name                                  |
| `land_size_acres`                | float  | Cultivated area in acres                   |
| `seed_rate_kg_per_acre`          | float  | Seed requirement per acre                  |
| `seed_price_inr_per_kg`          | float  | Seed price per kg                          |
| `n_rate_kg_per_acre`             | float  | Nitrogen input quantity per acre           |
| `p_rate_kg_per_acre`             | float  | Phosphorus input quantity per acre         |
| `k_rate_kg_per_acre`             | float  | Potassium input quantity per acre          |
| `fertilizer_price_inr_per_kg`    | float  | Fertilizer price per kg                    |
| `water_requirement_mm`           | float  | Crop water requirement                     |
| `water_rate_inr_per_mm_per_acre` | float  | Water/irrigation cost rate                 |
| `water_efficiency_factor`        | float  | Water efficiency factor; defaults to `1.0` |
| `labor_days_per_acre`            | float  | Labour requirement per acre                |
| `wage_inr_per_day`               | float  | Labour wage per day                        |
| `expected_yield_kg_per_acre`     | float  | Expected yield per acre                    |
| `market_price_inr_per_kg`        | float  | Market/mandi price per kg                  |
| `machinery_cost_inr_per_acre`    | float  | Optional machinery cost per acre           |
| `other_input_cost_inr_per_acre`  | float  | Optional additional input cost per acre    |

Response Schema

{
  "success": true,
  "message": "Cost estimation calculated successfully.",
  "estimate": {
    "crop": "Rice",
    "land_size_acres": 2.5,
    "breakdown": {
      "seed": 1750,
      "fertilizer": 2000,
      "water": 0,
      "labor": 25000,
      "machinery": 0,
      "other_inputs": 0
    },
    "total_cost": 28750,
    "estimated_revenue": 125000,
    "net_profit": 96250,
    "roi_percent": 334.78
  }
}