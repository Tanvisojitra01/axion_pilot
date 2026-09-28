import io
import zipfile
import json
from app.core.generators.report_gen import generate_report
from app.core.generators.ppt_gen import generate_ppt

def generate_code_zip(project_data):
    files = project_data.get('files', [])
    if isinstance(files, dict):
        files = [files]
    zip_buffer = io.BytesIO()
    try:
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            if isinstance(files, list):
                for file in files:
                    if not isinstance(file, dict):
                        continue
                    filename = str(file.get('filename', 'unknown.txt'))
                    content = file.get('content', '')
                    if not isinstance(content, (str, bytes)):
                        content = json.dumps(content, indent=2)
                    zip_file.writestr(filename, content)
    except Exception as e:
        print(f"Error zipping code: {e}")
    zip_buffer.seek(0)
    return zip_buffer

def generate_full_zip(project_data):
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        # Add Code Files
        files = project_data.get('files', [])
        if isinstance(files, dict):
            files = [files]
        if isinstance(files, list):
            for file in files:
                if not isinstance(file, dict):
                    continue
                filename = str(file.get('filename', 'unknown.txt'))
                content = file.get('content', '')
                if not isinstance(content, (str, bytes)):
                    content = json.dumps(content, indent=2)
                zip_file.writestr(f"code/{filename}", content)
            
        # Add Report
        try:
            report_buffer = generate_report(project_data)
            zip_file.writestr("Project_Report.docx", report_buffer.read())
        except Exception as e:
            zip_file.writestr("Project_Report_Error.txt", f"Failed to generate report: {str(e)}")
            
        # Add PPT
        try:
            ppt_buffer = generate_ppt(project_data)
            zip_file.writestr("Project_Presentation.pptx", ppt_buffer.read())
        except Exception as e:
            zip_file.writestr("Project_Presentation_Error.txt", f"Failed to generate UI: {str(e)}")

        # Add Viva Questions
        viva = project_data.get('viva_questions', [])
        viva_text = "Viva Questions:\n\n"
        for v in viva:
            viva_text += f"Q: {v.get('question', '')}\nA: {v.get('answer', '')}\n\n"
        zip_file.writestr("Viva_Questions.txt", viva_text)
        
        # Add General Documentation
        doc_text = f"Project Summary: {project_data.get('title')}\n"
        doc_text += f"Domain: {project_data.get('domain')}\n"
        doc_text += f"Difficulty: {project_data.get('difficulty')}\n"
        doc_text += f"Abstract:\n{project_data.get('abstract')}\n\n"
        doc_text += f"Problem Statement:\n{project_data.get('problem_statement')}\n\n"
        doc_text += f"Technology Stack:\n{project_data.get('tech_stack')}\n"
        zip_file.writestr("Documentation.txt", doc_text)
        
    zip_buffer.seek(0)
    return zip_buffer
