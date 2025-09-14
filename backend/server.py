from flask import Flask, request, jsonify
import fitz  # PyMuPDF for PDF text extraction
from flask_cors import CORS
import os

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

    # Save temporarily
    pdf_path = f"temp_{pdf_file.filename}"
    pdf_file.save(pdf_path)

    try:
        # Extract first word
        first_word = extract_first_word(pdf_path)
    finally:
        # Delete temporary file
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

    return jsonify({"first_word": first_word})

if __name__ == "__main__":
    app.run(debug=True)
