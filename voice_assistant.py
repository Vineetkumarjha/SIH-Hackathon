"""
voice_assistant.py
Enhanced Healthcare Voice Assistant & Symptom Matcher.
Listens to spoken symptoms, matches them against Flask backend /symptoms list with fuzzy/synonym logic,
calls /predict API, announces triage & prediction, and handles the iterative symptom refinement loop.

IMPORTANT: Run 'python app.py' in another terminal before starting this script.
"""

import re
import sys
import requests
import threading
import traceback
from difflib import SequenceMatcher

API_BASE = "http://127.0.0.1:5000"

# Optional PyTTSx3 for Speech Output
try:
    import pyttsx3
    HAS_TTS = True
except ImportError:
    HAS_TTS = False

# Optional SpeechRecognition for Microphone Input
try:
    import speech_recognition as sr
    HAS_SR = True
except ImportError:
    HAS_SR = False


# -----------------------------------------------------------
# Common Spoken Phrase & Synonym Mapping
# Maps common spoken patient phrases to dataset symptom keywords
# -----------------------------------------------------------
COMMON_SYNONYMS = {
    "headache": ["headache", "head pain", "head hurting", "head aches", "pain in head"],
    "fever": ["fever", "high temperature", "running fever", "body burning", "feeling hot"],
    "high_fever": ["high fever", "very high fever", "severe fever"],
    "cough": ["cough", "coughing", "dry cough", "coughing up"],
    "vomiting": ["vomiting", "vomit", "throwing up", "puking", "emesis"],
    "nausea": ["nausea", "feeling nauseous", "feeling sick", "queasy"],
    "fatigue": ["fatigue", "tired", "tiredness", "exhausted", "feeling weak", "low energy"],
    "chest_pain": ["chest pain", "pain in chest", "chest hurting", "tightness in chest"],
    "breathlessness": ["breathlessness", "shortness of breath", "hard to breathe", "difficulty breathing", "gasping"],
    "stomach_pain": ["stomach pain", "stomach ache", "belly pain", "abdominal pain"],
    "joint_pain": ["joint pain", "joints hurt", "knee pain", "elbow pain"],
    "muscle_pain": ["muscle pain", "body ache", "body pain", "muscles sore"],
    "itching": ["itching", "itchy", "skin itching", "itchiness"],
    "skin_rash": ["skin rash", "rashes", "red spots", "skin spots"],
    "chills": ["chills", "feeling cold", "shivering", "shivers"],
    "dizziness": ["dizziness", "dizzy", "head spinning", "lightheaded"],
    "diarrhoea": ["diarrhea", "diarrhoea", "loose motion", "watery stool"],
    "sore_throat": ["sore throat", "throat pain", "throat irritation", "pain swallowing"],
    "loss_of_appetite": ["loss of appetite", "not hungry", "don't want to eat", "no appetite"],
    "sweating": ["sweating", "profuse sweating", "night sweats", "sweat"],
}


def speak(text):
    """Speaks text out loud if TTS is available, and prints to console."""
    print(f"\n💬 Assistant: {text}")
    if not HAS_TTS:
        return

    def run_speech():
        try:
            eng = pyttsx3.init()
            eng.setProperty('rate', 155)
            eng.setProperty('volume', 1.0)
            eng.say(text)
            eng.runAndWait()
            eng.stop()
        except Exception as e:
            # Fallback if audio driver fails
            pass

    thread = threading.Thread(target=run_speech)
    thread.start()
    thread.join()


def listen():
    """
    Listens through the microphone.
    If speech recognition is missing/fails, falls back seamlessly to terminal text input.
    """
    if not HAS_SR:
        return input("\n🎤 (Mic unavailable) Type your symptoms: ").strip().lower()

    r = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print("\n🎤 Listening... (Speak your symptoms clearly)")
            r.adjust_for_ambient_noise(source, duration=0.8)
            audio = r.listen(source, timeout=6, phrase_time_limit=10)
            print("⏳ Processing audio...")
            content = r.recognize_google(audio, language='en-US')
            print(f"👤 You said: \"{content}\"")
            return content.lower()
    except sr.WaitTimeoutError:
        print("⚠️ No speech detected in time.")
        return ""
    except sr.UnknownValueError:
        print("⚠️ Could not understand the audio.")
        return ""
    except Exception as e:
        print(f"⚠️ Microphone error ({e}). Switching to text input.")
        return input("\n⌨️ Type your symptoms: ").strip().lower()


def check_server_running():
    try:
        requests.get(f"{API_BASE}/", timeout=3)
        return True
    except Exception:
        return False


def get_valid_symptoms():
    try:
        res = requests.get(f"{API_BASE}/symptoms", timeout=5)
        if res.status_code == 200:
            return res.json().get("symptoms", [])
    except Exception as e:
        print("⚠️ Failed to fetch symptoms from backend:", e)
    return None


def clean_str(s):
    """Normalize string for fuzzy comparison."""
    return re.sub(r'[^a-z0-9\s]', ' ', s.lower().replace('_', ' ')).strip()


def match_symptoms(spoken_text, valid_symptoms):
    """
    Advanced matching logic:
    1. Direct match on normalized symptom string
    2. Synonym mapping check
    3. Word boundary regex search
    4. Fuzzy string similarity matching
    """
    matched = set()
    spoken_clean = clean_str(spoken_text)
    spoken_words = set(spoken_clean.split())

    # Map dataset symptoms to clean version
    clean_to_symptom = {clean_str(sym): sym for sym in valid_symptoms}

    # 1. Check Synonym mapping first
    for sym_key, phrases in COMMON_SYNONYMS.items():
        for phrase in phrases:
            if phrase in spoken_clean:
                # Find matching valid dataset symptom
                for valid_clean, orig_sym in clean_to_symptom.items():
                    if sym_key in valid_clean or phrase in valid_clean:
                        matched.add(orig_sym)

    # 2. Check exact & word boundary substring matches against valid symptoms
    for valid_clean, orig_sym in clean_to_symptom.items():
        # Word boundary match
        pattern = r'\b' + re.escape(valid_clean) + r'\b'
        if re.search(pattern, spoken_clean):
            matched.add(orig_sym)
            continue

        # Substring match for multi-word symptoms
        if len(valid_clean) > 4 and valid_clean in spoken_clean:
            matched.add(orig_sym)

    # 3. Fuzzy similarity fallback for unmatched spoken words
    if not matched:
        for valid_clean, orig_sym in clean_to_symptom.items():
            ratio = SequenceMatcher(None, spoken_clean, valid_clean).ratio()
            if ratio >= 0.70:
                matched.add(orig_sym)

    return list(matched)


def get_prediction(symptoms):
    try:
        res = requests.post(f"{API_BASE}/predict", json={"symptoms": symptoms}, timeout=10)
        return res.json()
    except Exception as e:
        return {"status": "error", "message": f"Connection to prediction server failed: {str(e)}"}


def announce_result(result):
    if result.get("status") == "error":
        speak(result.get("message", "An error occurred during prediction."))
        return

    disease = result.get("best_disease", "Unknown Condition")
    confidence = result.get("confidence", 0) * 100
    level = result.get("confidence_level", "LOW")
    triage = result.get("triage", {})

    triage_title = triage.get("title", "")
    triage_level = triage.get("level", "SELF_CARE")

    speak(f"Analysis Complete. Most likely condition: {disease}, with {confidence:.0f}% confidence ({level} confidence).")
    
    if triage_level == "EMERGENCY":
        speak(f"EMERGENCY WARNING: {triage_title}. Please seek immediate emergency medical evaluation!")
    elif triage_level == "SEE_DOCTOR":
        speak(f"Triage Advice: {triage_title}. Schedule a clinical consultation soon.")
    else:
        speak("Triage Advice: Self-care and symptom monitoring recommended.")

    description = result.get("description")
    if description:
        speak(f"About this condition: {description}")

    precautions = result.get("precautions")
    if precautions and isinstance(precautions, dict):
        prec_list = [v for k, v in precautions.items() if v]
        if prec_list:
            speak("Recommended precautions: " + ", ".join(prec_list[:3]))

    suggestions = result.get("suggested_symptoms", [])
    if suggestions and level != "HIGH":
        clean_suggs = [s.replace('_', ' ') for s in suggestions[:4]]
        speak(f"To increase confidence, do you also experience any of these symptoms: {', '.join(clean_suggs)}?")


def main_process():
    print("=" * 60)
    print("  AI HEALTHCARE VOICE ASSISTANT & TRIAGE ENGINE")
    print("=" * 60)

    if not check_server_running():
        print("\n❌ Flask backend server is NOT running at http://127.0.0.1:5000!")
        print("👉 Please start the server by running: python app.py")
        return

    valid_symptoms = get_valid_symptoms()
    if not valid_symptoms:
        print("\n❌ Could not fetch symptom registry from Flask server.")
        return

    print(f"\n✅ Connected to Flask backend ({len(valid_symptoms)} symptoms loaded).")
    speak("Hello! I am your AI Healthcare Voice Assistant. What symptoms are you experiencing?")

    current_symptoms = []
    max_rounds = 4

    for round_num in range(1, max_rounds + 1):
        spoken = listen()

        if not spoken:
            speak("I didn't hear anything. Please state your symptoms or type 'exit' to quit.")
            continue

        if any(w in spoken for w in ["exit", "stop", "quit", "bye", "cancel"]):
            speak("Thank you for using Healthcare Assistant. Take care and stay healthy!")
            break

        matched = match_symptoms(spoken, valid_symptoms)

        if not matched:
            speak("I didn't recognize any specific symptoms in what you said. Try saying e.g. 'I have fever, cough, and headache'.")
            continue

        # Add newly matched symptoms
        current_symptoms = list(set(current_symptoms + matched))
        readable_symptoms = [s.replace('_', ' ') for s in current_symptoms]
        speak(f"Got it. Symptoms recorded ({len(current_symptoms)} total): {', '.join(readable_symptoms)}.")

        print("\n⏳ Calling Prediction API...")
        result = get_prediction(current_symptoms)
        announce_result(result)

        if result.get("confidence_level") == "HIGH":
            speak("We have a high confidence match. Please review your full details on screen!")
            break

        if round_num < max_rounds:
            print("\n--------------------------------------------------")
            prompt_ans = input("\nWould you like to add more symptoms? (yes/no or state symptoms): ").strip().lower()
            if prompt_ans in ["no", "n", "stop", "exit"]:
                speak("Understood. Displaying final prediction analysis.")
                break
            elif prompt_ans in ["yes", "y"]:
                speak("Please speak or type your additional symptoms.")
            else:
                # Treat prompt answer as additional symptoms text directly!
                new_matched = match_symptoms(prompt_ans, valid_symptoms)
                if new_matched:
                    current_symptoms = list(set(current_symptoms + new_matched))
                    result = get_prediction(current_symptoms)
                    announce_result(result)


if __name__ == "__main__":
    try:
        main_process()
    except Exception:
        print("\n❌ Error encountered:")
        traceback.print_exc()