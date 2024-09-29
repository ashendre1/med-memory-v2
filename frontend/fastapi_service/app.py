from fastapi import FastAPI, File, HTTPException, UploadFile
import pdfplumber
import re
from typing import Dict
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Only allow your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers (content-type, authorization, etc.)
)

patterns = {
    'Hemoglobin': r'hemoglobin.*?(\d+(\.\d+)?)',
    'RBC': r'rbc.*?(\d+(\.\d+)?)',
    'HCT': r'hct.*?(\d+(\.\d+)?)',
    'MCV': r'mcv.*?(\d+(\.\d+)?)',
    'PLT': r'plt.*?(\d+(\.\d+)?)',
    'Platelets': r'platelet.*?(\d+(\.\d+)?)',
    'MCH': r'mch.*?(\d+(\.\d+)?)', 
    'MCHC': r'mchc.*?(\d+(\.\d+)?)'
}

# Function to extract values from the PDF
def extract_values_from_pdf(pdf_file) -> Dict[str, str]:
    extracted_values = {}
    print('reached')
    # Open the PDF file using pdfplumber
    with pdfplumber.open(pdf_file) as pdf:
        full_text = ""  # Accumulate text from all pages
        for page in pdf.pages:
            full_text += page.extract_text()  # Add text from each page to full_text

    # Search for the patterns in the extracted text
    for test_name, pattern in patterns.items():
        match = re.search(pattern, full_text, re.IGNORECASE)
        if match:
            extracted_values[test_name] = match.group(1)  # Extract the matched value
    
    return extracted_values

@app.post("/upload")
async def extract_values(file: UploadFile = File(...)):
    # print("Working")
    # Check if file is a PDF
    print('working')
    if file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF file.")
    
    try:
        # Extract values using the function
        extracted_data =  extract_values_from_pdf(file.file)
        return extracted_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

