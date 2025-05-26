# app/utils/parse_report.py
import os
import fitz  # PyMuPDF for PDF parsing
from PIL import Image
import pytesseract
from pathlib import Path
from typing import Optional
import logging

logger = logging.getLogger(__name__)

def parse_uploaded_file(file_path: str) -> str:
    """
    Parse uploaded file and extract text content
    Supports PDF, images (PNG, JPG, JPEG)
    """
    try:
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        file_extension = file_path.suffix.lower()
        
        if file_extension == '.pdf':
            return extract_text_from_pdf(str(file_path))
        elif file_extension in ['.png', '.jpg', '.jpeg']:
            return extract_text_from_image(str(file_path))
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
            
    except Exception as e:
        logger.error(f"Error parsing file {file_path}: {str(e)}")
        raise

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF file using PyMuPDF"""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        
        for page_num in range(doc.page_count):
            page = doc[page_num]
            text += page.get_text()
            
        doc.close()
        
        if not text.strip():
            # If no text found, try OCR on PDF images
            return extract_text_from_pdf_ocr(pdf_path)
            
        return clean_extracted_text(text)
        
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        # Fallback to OCR
        return extract_text_from_pdf_ocr(pdf_path)

def extract_text_from_pdf_ocr(pdf_path: str) -> str:
    """Extract text from PDF using OCR (for scanned PDFs)"""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        
        for page_num in range(doc.page_count):
            page = doc[page_num]
            # Convert page to image
            mat = fitz.Matrix(2, 2)  # Increase resolution
            pix = page.get_pixmap(matrix=mat)
            img_data = pix.tobytes("png")
            
            # Use OCR on the image
            image = Image.open(io.BytesIO(img_data))
            page_text = pytesseract.image_to_string(image, lang='eng')
            text += page_text + "\n"
            
        doc.close()
        return clean_extracted_text(text)
        
    except Exception as e:
        logger.error(f"Error with PDF OCR: {str(e)}")
        return "Error: Could not extract text from PDF"

def extract_text_from_image(image_path: str) -> str:
    """Extract text from image using OCR"""
    try:
        # Open and preprocess image
        image = Image.open(image_path)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Use OCR to extract text
        text = pytesseract.image_to_string(image, lang='eng')
        
        return clean_extracted_text(text)
        
    except Exception as e:
        logger.error(f"Error extracting text from image: {str(e)}")
        return "Error: Could not extract text from image"

def clean_extracted_text(text: str) -> str:
    """Clean and normalize extracted text"""
    if not text:
        return ""
    
    # Remove excessive whitespace
    lines = [line.strip() for line in text.split('\n')]
    lines = [line for line in lines if line]  # Remove empty lines
    
    # Join lines with single newlines
    cleaned_text = '\n'.join(lines)
    
    # Remove excessive spaces
    import re
    cleaned_text = re.sub(r' +', ' ', cleaned_text)
    
    return cleaned_text.strip()

def validate_medical_report(text: str) -> bool:
    """
    Basic validation to check if extracted text looks like a medical report
    """
    medical_keywords = [
        'patient', 'doctor', 'diagnosis', 'treatment', 'medication',
        'blood', 'glucose', 'diabetes', 'test', 'result', 'lab',
        'hospital', 'clinic', 'physician', 'prescription', 'symptoms'
    ]
    
    text_lower = text.lower()
    found_keywords = sum(1 for keyword in medical_keywords if keyword in text_lower)
    
    # If we find at least 2 medical keywords, consider it valid
    return found_keywords >= 2

# Helper function for preprocessing images before OCR
def preprocess_image_for_ocr(image_path: str) -> Image.Image:
    """
    Preprocess image to improve OCR accuracy
    """
    try:
        from PIL import ImageEnhance, ImageFilter
        
        image = Image.open(image_path)
        
        # Convert to grayscale
        if image.mode != 'L':
            image = image.convert('L')
        
        # Enhance contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)
        
        # Enhance sharpness
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(2.0)
        
        # Apply slight blur to reduce noise
        image = image.filter(ImageFilter.MedianFilter(size=3))
        
        return image
        
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        return Image.open(image_path)

# Additional utility functions
def get_file_info(file_path: str) -> dict:
    """Get basic information about uploaded file"""
    try:
        file_path = Path(file_path)
        stat = file_path.stat()
        
        return {
            "filename": file_path.name,
            "size": stat.st_size,
            "extension": file_path.suffix,
            "created": stat.st_ctime,
            "modified": stat.st_mtime
        }
    except Exception as e:
        logger.error(f"Error getting file info: {str(e)}")
        return {}

def is_supported_format(filename: str) -> bool:
    """Check if file format is supported"""
    supported_extensions = {'.pdf', '.png', '.jpg', '.jpeg'}
    return Path(filename).suffix.lower() in supported_extensions