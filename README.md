# AetherHealth AI

AI-powered symptom checker, disease prediction, and clinical triage assistant. Flask backend, ML model trained on 700+ conditions, JWT auth, Mapbox-based nearby hospital locator, voice assistant.

## Features

- Disease prediction from symptoms (scikit-learn model)
- Symptom validation, confusing-disease disambiguation, additional-symptom suggestions
- JWT-based signup/login
- Nearby hospitals via Mapbox (with emergency helpline quick-dial)
- Voice assistant (speech recognition + TTS)
- Diet, medication, precaution, and workout recommendations per disease

## Tech Stack

- Backend: Flask, flask-cors, PyJWT, bcrypt, python-dotenv
- ML: scikit-learn, pandas, numpy, joblib
- Voice: SpeechRecognition, pyttsx3
- Frontend: `templates/index.html` (Tailwind CDN + Mapbox GL JS), served directly by Flask
- `frontend/src/` contains React component source (reference only — not wired to a build; no bundler config included)

## Project Structure

```
hackathon/
├── app.py                  # Flask app, routes, auth middleware
├── auth.py                 # JWT auth logic
├── prediction.py           # Disease prediction, symptom validation
├── hospitals_service.py    # Mapbox nearby-hospitals integration
├── voice_assistant.py      # Speech recognition + TTS
├── templates/index.html    # Main served UI
├── static/images/          # Static assets
├── frontend/src/           # React component source (reference)
├── disease_model.pkl       # Trained ML model
├── label_encoder.pkl       # Label encoder for predictions
├── symptom_columns.pkl     # Symptom feature columns
├── *.csv                   # Datasets (symptoms, descriptions, precautions, medications, diets, workout)
├── model.ipynb / 01_data_understanding.ipynb   # Model training / EDA notebooks
├── requirements.txt
└── .env                    # Environment variables (not committed)
```

## Setup

### Prerequisites
- Python 3.10+

### Install

```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
```

### Environment variables

Create `.env` in project root:

```
JWT_SECRET_KEY=<your-secret-key>
MAPBOX_SECRET_TOKEN=<mapbox-secret-token>
MAPBOX_PUBLIC_TOKEN=<mapbox-public-token>
```

### Run

```bash
python app.py
```

App serves at `http://127.0.0.1:5000`.

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/` | Main UI |
| GET | `/symptoms` | List of valid symptom names |
| POST | `/api/auth/register` | Signup |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user (requires Bearer token) |
| GET | `/api/hospitals` | Nearby hospitals (Mapbox) |
| POST | `/predict` | Disease prediction from symptoms |

## Disclaimer

Predictions are informational only, not a substitute for professional medical diagnosis. In emergencies, contact local emergency services immediately.
