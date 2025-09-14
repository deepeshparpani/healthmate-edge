from flask import Flask, request, jsonify
import fitz  # PyMuPDF for PDF text extraction
import requests
from flask_cors import CORS
import os
import re
from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import torch
from prompt import generate_prompt

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

def extract_first_word(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    words = text.strip().split()
    return words[0] if words else "YOYO"

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({"error": "No PDF uploaded"}), 400

    pdf_file = request.files['pdf']
    body = request.form
    print(body)
    detail = body.get('detail')
    role = body.get('role')
    print(role)

    # Save temporarily
    pdf_path = f"temp_{pdf_file.filename}"
    pdf_file.save(pdf_path)
    response = "YOYO"
    try:
        # Extract cleaned medical text
        raw_text = extract_text_from_pdf(pdf_path)
        cleaned_lines = clean_text(raw_text)
        medical_lines = filter_medical_lines(cleaned_lines)
        # Join all medical lines into a single string
        cleaned_text = " ".join(medical_lines)
        payload = {
        "message": generate_prompt(cleaned_text, mode=f"{role}_mode", detail_level='brief'),
        "mode": "chat",
        "reset": False
        }
        token = "D7FY75D-H4T46JN-KCYF7NS-9V7PXQJ"
        ANYTHINGLLM_API_URL = "http://localhost:3001/api/v1/workspace/healthmate/chat"
        response = requests.post(ANYTHINGLLM_API_URL, json=payload,headers={"Authorization": f"Bearer {token}"})
    finally:
        # Delete temporary file
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

    return jsonify({"summary": response.json()["textResponse"]})


#-------------------------------------------


# Step 1: Extract raw text from PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = []
    for page in doc:
        text.append(page.get_text())
    return "\n".join(text)

# Step 2: Basic cleanup (remove excessive spaces, page numbers, etc.)
def clean_text(raw_text):
    stop_words = set([
        "the", "and", "is", "in", "at", "of", "a", "an", "to", "for", "on", "with", "by", "from", "as", "that", "this"
    ])
    lines = raw_text.split("\n")
    cleaned = []
    for line in lines:
        line = line.strip()
        # Remove bullet points and leading symbols
        line = re.sub(r"^[•\-–●\*\d\.\)\s]+", "", line)
        # Remove empty lines, page numbers, headers
        if not line or re.match(r"^\s*\d+\s*$", line):
            continue
        # Split into words using re.split and remove stop words
        words = re.split(r'\W+', line)
        words = [word for word in words if word and word.lower() not in stop_words]
        if words:
            cleaned.append(" ".join(words))
    return cleaned

# Step 3: Keep only medical-relevant lines using small model
# We'll use a zero-shot classifier with DistilBERT
classifier = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")

def filter_medical_lines(lines):
    relevant = []
    for line in lines:
        result = classifier(
            line,
            candidate_labels=["medical information", "noise"],
            multi_label=False
        )
        if result["labels"][0] == "medical information":
            relevant.append(line)
    return relevant

# Step 4: Save final text
def save_to_file(lines, output_file="cleaned_report.txt"):
    # Join all lines into a single string, separated by spaces
    single_line = " ".join(lines)
    with open(output_file, "w") as f:
        f.write(f'"{single_line}"')

# Full pipeline
def preprocess_pdf(pdf_path, output_file="cleaned_report_blood_test.txt"):
    raw_text = extract_text_from_pdf(pdf_path)
    cleaned_lines = clean_text(raw_text)
    medical_lines = filter_medical_lines(cleaned_lines)
    save_to_file(medical_lines, output_file)
    print(f"✅ Cleaned medical report saved to {output_file}")

# Example
# preprocess_pdf("Blood Test Report.pdf")


#-------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)
