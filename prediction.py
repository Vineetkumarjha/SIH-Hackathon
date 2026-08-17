"""
predictor.py
Model, label encoder aur saara supporting data (description/precautions/diet/
workout/medications) yahan load hota hai — ek hi baar, jab server start ho.
"""

import os
import ast
import numpy as np
import pandas as pd
import joblib

# -----------------------------------------------------------
# Base paths (taaki file kahin se bhi run ho, path galat na ho)
# -----------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = BASE_DIR
DATA_DIR = BASE_DIR

# -----------------------------------------------------------
# Model aur encoder load karo
# -----------------------------------------------------------
model = joblib.load(os.path.join(MODEL_DIR, "disease_model.pkl"))
label_encoder = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
symptom_columns = joblib.load(os.path.join(MODEL_DIR, "symptom_columns.pkl"))

# -----------------------------------------------------------
# Supporting data load karo (description, precautions, diet, workout, medications)
# -----------------------------------------------------------

# Original training dataset — symptom suggestion ke liye chahiye
df = pd.read_csv(os.path.join(DATA_DIR, "Diseases_and_Symptoms_dataset.csv"))
description_df = pd.read_csv(os.path.join(DATA_DIR, "description.csv"))
precautions_df = pd.read_csv(os.path.join(DATA_DIR, "precautions.csv"))
diets_df = pd.read_csv(os.path.join(DATA_DIR, "diets.csv"))
workout_df = pd.read_csv(os.path.join(DATA_DIR, "workout.csv"))
medications_df = pd.read_csv(os.path.join(DATA_DIR, "medications.csv"))

# Disease naam normalize karo: lowercase + strip
for frame in [description_df, precautions_df, diets_df, workout_df, medications_df]:
    frame["Disease"] = frame["Disease"].str.strip().str.lower()

precautions_df["Disease"] = precautions_df["Disease"].replace(
    {"copd": "chronic obstructive pulmonary disease (copd)"}
)

# -----------------------------------------------------------
# Lookups banao
# -----------------------------------------------------------
description_lookup = dict(zip(description_df["Disease"], description_df["Description"]))

precaution_lookup = (
    precautions_df
    .set_index("Disease")[["Precaution_1", "Precaution_2", "Precaution_3", "Precaution_4"]]
    .to_dict("index")
)

diet_lookup = {
    row["Disease"]: ast.literal_eval(row["Diet"])
    for _, row in diets_df.iterrows()
}

workout_lookup = {
    row["Disease"]: ast.literal_eval(row["Workouts"])
    for _, row in workout_df.iterrows()
}

medication_lookup = {
    row["Disease"]: ast.literal_eval(row["Medication"])
    for _, row in medications_df.iterrows()
}

print("predictor.py loaded successfully — model aur data ready hai.")






def get_confidence_level(probability):
    if probability >= 0.70:
        return "HIGH"
    elif probability >= 0.40:
        return "MODERATE"
    else:
        return "LOW"
    




def validate_symptoms(symptoms):
    """
    Symptoms ki list ko do groups mein todta hai:
    - valid: jo symptom_columns mein maujood hain
    - invalid: jo dataset mein hi nahi hain (typo ya galat naam)
    """
    valid = [s for s in symptoms if s in symptom_columns]
    invalid = [s for s in symptoms if s not in symptom_columns]

    return valid, invalid   
    
    
def predict_disease_details(symptoms, top_n=5):

    # Step 1: har symptom ke liye 0 se start karo
    input_data = np.zeros(len(symptom_columns), dtype=int)

    # Step 2: user ke diye gaye symptoms ko 1 karo
    for symptom in symptoms:
        if symptom in symptom_columns:
            index = list(symptom_columns).index(symptom)
            input_data[index] = 1

    # Step 3: model ko same column names ke saath DataFrame chahiye
    input_df = pd.DataFrame([input_data], columns=symptom_columns)

    # Step 4: har disease ki probability nikalo
    probabilities = model.predict_proba(input_df)[0]

    # Step 5: sabse zyada probability wali top_n diseases
    top_indices = np.argsort(probabilities)[-top_n:][::-1]

    top_predictions = [
        {
            "disease": label_encoder.inverse_transform([i])[0],
            "probability": float(probabilities[i])
        }
        for i in top_indices
    ]

    # Step 6: best (rank 1) prediction ke details nikalo
    best = top_predictions[0]
    disease_key = best["disease"].strip().lower()
    conf_level = get_confidence_level(best["probability"])
    triage_info = calculate_triage(best["disease"], symptoms, conf_level)

    return {
        "status": "success",
        "top_predictions": top_predictions,
        "best_disease": best["disease"],
        "confidence": best["probability"],
        "confidence_level": conf_level,
        "triage": triage_info,
        "description": description_lookup.get(disease_key),
        "precautions": precaution_lookup.get(disease_key),
        "diet": diet_lookup.get(disease_key),
        "workout": workout_lookup.get(disease_key),
        "medications": medication_lookup.get(disease_key),
    }

EMERGENCY_DISEASES = {
    "heart attack", "myocardial infarction", "stroke", "paralysis (brain hemorrhage)",
    "pneumonia", "tuberculosis", "hepatitis b", "hepatitis c", "hepatitis d", "hepatitis e",
    "dengue", "typhoid", "malaria", "chronic obstructive pulmonary disease (copd)",
    "appendicitis", "meningitis", "severe allergy", "anaphylaxis", "bronchial asthma",
    "gastroenteritis", "acute liver failure"
}

EMERGENCY_SYMPTOMS = {
    "chest_pain", "chest pain", "breathlessness", "shortness of breath",
    "high_fever", "coughing_up_blood", "bloody_stool", "loss_of_consciousness",
    "altered_sensorium", "paralysis", "stiff_neck", "acute_liver_failure"
}

SEE_DOCTOR_DISEASES = {
    "hypertension", "jaundice", "urinary tract infection", "uti",
    "migraine", "cervical spondylosis", "hyperthyroidism", "hypothyroidism",
    "hypoglycemia", "osteoarthristis", "arthritis", "varicose veins", "peptic ulcer diseae",
    "gerd", "psoriasis", "impetigo", "diabetes"
}

def calculate_triage(best_disease, user_symptoms, confidence_level):
    disease_clean = best_disease.strip().lower()
    
    # Check emergency red flags
    has_emergency_symptom = any(s in EMERGENCY_SYMPTOMS for s in user_symptoms)
    is_emergency_disease = any(ed in disease_clean for ed in EMERGENCY_DISEASES)
    
    if is_emergency_disease or has_emergency_symptom:
        return {
            "level": "EMERGENCY",
            "color": "red",
            "title": "Immediate Medical Attention Required",
            "description": "Your reported symptoms or predicted condition suggest a potential medical emergency. Please visit an emergency room or call emergency services immediately.",
            "emergency_flag": True,
            "badge_text": "Emergency Care Required"
        }
    
    is_see_doctor_disease = any(sd in disease_clean for sd in SEE_DOCTOR_DISEASES)
    if is_see_doctor_disease or confidence_level in ["MODERATE", "LOW"]:
        return {
            "level": "SEE_DOCTOR",
            "color": "amber",
            "title": "Schedule a Clinical Consultation",
            "description": "We recommend consulting a healthcare professional promptly for proper clinical evaluation and prescription treatment.",
            "emergency_flag": False,
            "badge_text": "Consult a Doctor Soon"
        }
    
    return {
        "level": "SELF_CARE",
        "color": "emerald",
        "title": "Self-Care & Monitoring",
        "description": "Your condition can likely be managed at home with rest, hydration, and over-the-counter care. Seek medical advice if symptoms persist.",
        "emergency_flag": False,
        "badge_text": "Self-Care & Monitor"
    }

    
    
    
def find_confusing_diseases(top_predictions, margin=0.15):
    """
    Top prediction ke probability ke 'margin' ke andar jo bhi diseases hain,
    unhe 'confusing' maana jayega (matlab model confuse ho raha hai in mein).
    """
    top_probability = top_predictions[0]["probability"]

    confusing = [
        pred["disease"] for pred in top_predictions
        if (top_probability - pred["probability"]) <= margin
    ]

    return confusing


def suggest_additional_symptoms(confusing_diseases, user_symptoms, top_k=5):
    """
    Confusing diseases ke actual data se aise symptoms dhundo
    jo un diseases ko ek doosre se alag karte hain.
    """
    disease_symptom_freq = {}

    for disease in confusing_diseases:
        disease_rows = df[df["diseases"].str.lower() == disease.lower()]
        disease_symptom_freq[disease] = disease_rows[symptom_columns].mean()

    symptom_scores = {}

    for symptom in symptom_columns:
        if symptom in user_symptoms:
            continue

        freqs = [disease_symptom_freq[d][symptom] for d in confusing_diseases]
        differentiation_score = max(freqs) - min(freqs)

        if differentiation_score > 0 and max(freqs) >= 0.4:
            symptom_scores[symptom] = differentiation_score

    sorted_symptoms = sorted(symptom_scores.items(), key=lambda x: x[1], reverse=True)

    return [symptom for symptom, score in sorted_symptoms[:top_k]]
    
    
    
if __name__ == "__main__":
    test_symptoms = ["sharp abdominal pain", "vomiting", "nausea"]
    result = predict_disease_details(test_symptoms)

    print("\nPredicted:", result["best_disease"])
    print("Confidence:", f"{result['confidence']:.2%}")
    print("Confidence Level:", result["confidence_level"])

    if result["confidence_level"] != "HIGH":
        confusing = find_confusing_diseases(result["top_predictions"])
        suggestions = suggest_additional_symptoms(confusing, test_symptoms)

        print("\nConfusing diseases:", confusing)
        print("Suggested additional symptoms:", suggestions)