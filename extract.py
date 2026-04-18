import PyPDF2
import sys

try:
    reader = PyPDF2.PdfReader(sys.argv[1])
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    print(text[:10000])
except Exception as e:
    print("Error:", e)
