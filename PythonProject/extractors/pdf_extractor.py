from pypdf import PdfReader


class PhiloParser:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path

    def extract_text(self, max_pages: int = 50) -> str:
        try:
            reader = PdfReader(self.pdf_path)
            content = ""
            for i in range(min(max_pages, len(reader.pages))):
                content += reader.pages[i].extract_text()
            return content
        except Exception as e:
            return f"Error reading PDF: {str(e)}"

    def extract_specific_section(self, section_title: str) -> str:
        full_text = self.extract_text(max_pages=50)
        start_index = full_text.lower().find(section_title.lower())
        if start_index == -1:
            return full_text[:5000]
        return full_text[start_index : start_index + 10000]
