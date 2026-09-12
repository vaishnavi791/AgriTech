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

## Database Collections & Persistence Infrastructure

The persistence layer organizes data into three primary collections:
1. `users`: User account records managed via [user_service.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/services/user_service.py) and [user.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/models/user.py). Plaintext passwords are never stored; only password hashes are persisted.
2. `predictions`: Prediction and estimation histories across crop, disease, cost, and price modules managed via [prediction_service.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/services/prediction_service.py) and [prediction.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/models/prediction.py).
3. `chat_messages`: Conversational context and message histories for the AI Agri Assistant managed via [chat_service.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/services/chat_service.py) and [chat.py](file:///c:/Users/YUKTI/Desktop/projects/agri%20tech%20final/AgriTech/backend/app/models/chat.py).
