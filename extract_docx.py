import zipfile
import xml.etree.ElementTree as ET

def extract_text_from_docx(docx_path):
    try:
        document = zipfile.ZipFile(docx_path)
        xml_content = document.read('word/document.xml')
        document.close()
        
        tree = ET.XML(xml_content)
        namespace = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paragraphs = tree.findall('.//w:p', namespace)
        
        text = []
        for paragraph in paragraphs:
            texts = paragraph.findall('.//w:t', namespace)
            if texts:
                text.append(''.join([t.text for t in texts if t.text]))
        
        return '\n'.join(text)
    except Exception as e:
        return str(e)

content = extract_text_from_docx('graduate_1_final_with_images.docx')
with open('docx_output.txt', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done. Check docx_output.txt')
