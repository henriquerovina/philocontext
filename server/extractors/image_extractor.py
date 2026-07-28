from PIL import Image
import pytesseract


class ImageParser:
    def __init__(self, image_path: str):
        self.image_path = image_path

    def extract_text(self, max_pages: int = 50) -> str:
        try:
            img = Image.open(self.image_path)
            gray = img.convert("L")
            threshold = 128
            bw = gray.point(lambda x: 255 if x > threshold else 0, mode="L")
            text = pytesseract.image_to_string(bw)
            return text
        except Exception as e:
            return f"Error reading image: {str(e)}"

    def extract_specific_section(self, section_title: str) -> str:
        full_text = self.extract_text(max_pages=50)
        start_index = full_text.lower().find(section_title.lower())
        if start_index == -1:
            return full_text[:5000]
        return full_text[start_index : start_index + 10000]
