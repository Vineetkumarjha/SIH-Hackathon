"""
app.py
Flask server jo prediction.py ke functions ko web API ke rospan mein expose karta hai.
Ab isme JWT auth (login/signup) aur Mapbox-based nearby hospitals bhi hain.
"""

import os
import functools

from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify, render_template, g
from flask_cors import CORS

from prediction import (
    predict_disease_details,
    find_confusing_diseases,
    suggest_additional_symptoms,
    validate_symptoms,
    symptom_columns
)
import auth
import hospitals_service

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)   # taaki frontend (alag port par chalne wala) is API ko call kar sake


# -----------------------------------------------------------
# Auth helper: protects routes that require a logged-in user
# -----------------------------------------------------------
def login_required(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"status": "error", "message": "Not authenticated. Log in to continue."}), 401
        token = header.split(" ", 1)[1]
        try:
            payload = auth.decode_token(token)
        except Exception:
            return jsonify({"status": "error", "message": "Session expired or invalid. Log in again."}), 401
        user = auth.get_user_by_id(int(payload["sub"]))
        if user is None:
            return jsonify({"status": "error", "message": "Account not found. Log in again."}), 401
        g.user = user
        return f(*args, **kwargs)
    return wrapper


@app.route("/", methods=["GET"])
def home():
    return render_template(
        "index.html",
        mapbox_token=os.getenv("MAPBOX_PUBLIC_TOKEN", ""),
    )


@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    """Returns sorted list of all valid symptom names for checklist & autocomplete."""
    return jsonify({
        "status": "success",
        "symptoms": sorted(list(symptom_columns))
    })


# -----------------------------------------------------------
# Auth routes
# -----------------------------------------------------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    if not auth.is_configured():
        return jsonify({"status": "error", "message": "Auth not configured on server. Set JWT_SECRET_KEY in .env."}), 503

    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    if not email or "@" not in email:
        return jsonify({"status": "error", "message": "A valid email is required."}), 400
    if len(password) < 8:
        return jsonify({"status": "error", "message": "Password must be at least 8 characters."}), 400

    try:
        user = auth.create_user(email, password)
    except ValueError as exc:
        return jsonify({"status": "error", "message": str(exc)}), 409

    token = auth.create_access_token(user["id"])
    return jsonify({"status": "success", "token": token, "user": {"id": user["id"], "email": user["email"]}})


@app.route("/api/auth/login", methods=["POST"])
def login():
    if not auth.is_configured():
        return jsonify({"status": "error", "message": "Auth not configured on server. Set JWT_SECRET_KEY in .env."}), 503

    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""

    user = auth.authenticate_user(email, password)
    if user is None:
        return jsonify({"status": "error", "message": "Incorrect email or password."}), 401

    token = auth.create_access_token(user["id"])
    return jsonify({"status": "success", "token": token, "user": {"id": user["id"], "email": user["email"]}})


@app.route("/api/auth/me", methods=["GET"])
@login_required
def me():
    return jsonify({"status": "success", "user": {"id": g.user["id"], "email": g.user["email"]}})


# -----------------------------------------------------------
# Nearby hospitals (Mapbox) — public, no login required to view
# -----------------------------------------------------------
@app.route("/api/hospitals", methods=["GET"])
def get_hospitals():
    try:
        lat = float(request.args.get("lat"))
        lng = float(request.args.get("lng"))
    except (TypeError, ValueError):
        return jsonify({"status": "error", "message": "'lat' and 'lng' query params are required numbers."}), 400

    if not hospitals_service.is_configured():
        return jsonify({
            "status": "success",
            "results": [],
            "note": "Mapbox not configured — set MAPBOX_SECRET_TOKEN in hackathon/.env."
        })

    try:
        results = hospitals_service.nearby(lat, lng)
    except Exception as exc:
        return jsonify({"status": "error", "message": f"Hospital lookup failed: {exc}"}), 502

    return jsonify({"status": "success", "results": results})


# -----------------------------------------------------------
# Disease prediction — requires login
# -----------------------------------------------------------
@app.route("/predict", methods=["POST"])
@login_required
def predict():
    try:
        data = request.get_json()
    except Exception:
        return jsonify({"status": "error", "message": "Invalid JSON body"}), 400

    if not data or "symptoms" not in data:
        return jsonify({"status": "error", "message": "'symptoms' field is required"}), 400

    symptoms = data.get("symptoms", [])

    # symptoms ek list honi chahiye, kuch aur nahi
    if not isinstance(symptoms, list) or not symptoms:
        return jsonify({"status": "error", "message": "'symptoms' must be a non-empty list"}), 400

    # Symptoms ko clean karo — extra spaces, lowercase (dataset ke format se match karne ke liye)
    symptoms = [s.strip().lower() for s in symptoms if isinstance(s, str) and s.strip()]

    valid_symptoms, invalid_symptoms = validate_symptoms(symptoms)

    # Sab symptoms galat hain -> prediction possible hi nahi
    if not valid_symptoms:
        return jsonify({
            "status": "error",
            "message": "None of the provided symptoms were recognized",
            "invalid_symptoms": invalid_symptoms
        }), 400

    try:
        result = predict_disease_details(valid_symptoms)
    except Exception as e:
        return jsonify({"status": "error", "message": f"Prediction failed: {str(e)}"}), 500

    # Kuch symptoms galat the lekin baaki se prediction ho gaya -> warning ke sath batao
    if invalid_symptoms:
        result["warning"] = f"These symptoms were not recognized and ignored: {invalid_symptoms}"

    if result["confidence_level"] != "HIGH":
        confusing = find_confusing_diseases(result["top_predictions"])
        suggestions = suggest_additional_symptoms(confusing, valid_symptoms)
        result["suggested_symptoms"] = suggestions

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
