import sys, os
sys.path.append(os.getcwd())
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

# Ensure models are loaded
import app.models.user
import app.models.project
import app.models.activity
import app.models.settings

from app.models.project import Project
from app.core.generators.code_gen import generate_code_zip
from app.core.generators.ppt_gen import generate_ppt
from app.core.generators.report_gen import generate_report

url = os.environ.get("DATABASE_URL")
if not url: url = "sqlite:///./sql_app.db"
    
engine = create_engine(url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_download_fail():
    db = SessionLocal()
    try:
        project = db.query(Project).order_by(Project.id.desc()).first()
        if not project:
            print("No projects to test")
            return
            
        print(f"Testing on project id={project.id}")
        data = project.data or {}
        
        try:
            buf = generate_code_zip(data)
            print("generate_code_zip len:", len(buf.getvalue()))
        except Exception as e:
            print(f"generate_code_zip FAILED: {str(e)}")
            import traceback; traceback.print_exc()
            
        try:
            buf = generate_ppt(data)
            print("generate_ppt len:", len(buf.getvalue()))
        except Exception as e:
            print(f"generate_ppt FAILED: {str(e)}")
            import traceback; traceback.print_exc()
            
        try:
            buf = generate_report(data)
            print("generate_report len:", len(buf.getvalue()))
        except Exception as e:
            print(f"generate_report FAILED: {str(e)}")
            import traceback; traceback.print_exc()
            
    finally:
        db.close()

if __name__ == "__main__":
    check_download_fail()
