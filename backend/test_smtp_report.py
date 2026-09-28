import smtplib
import os
from pathlib import Path
from dotenv import load_dotenv

def test():
    # Load .env
    env_path = Path(__file__).resolve().parent / ".env"
    load_dotenv(env_path)

    user = os.environ.get("EMAIL_USER")
    pas = os.environ.get("EMAIL_PASS")

    with open("smtp_test_report.txt", "w") as f:
        f.write(f"Testing for USER: {user}\n")
        if not user or not pas:
            f.write("Error: EMAIL_USER or EMAIL_PASS not set in .env\n")
            return

        try:
            f.write("Connecting to smtp.gmail.com:587...\n")
            server = smtplib.SMTP("smtp.gmail.com", 587, timeout=15)
            f.write("Connected.\n")
            server.ehlo()
            server.starttls()
            server.ehlo()
            f.write("Logging in...\n")
            server.login(user, pas)
            f.write("Login SUCCESS!\n")
            
            msg = f"Subject: SMTP Test Axion\n\nSMTP is working for {user}"
            server.sendmail(user, user, msg)
            f.write("Test email sent successfully!\n")
            server.quit()
        except Exception as e:
            f.write(f"FAILURE: {type(e).__name__}: {str(e)}\n")

if __name__ == "__main__":
    test()
