import smtplib
import os
from pathlib import Path
from dotenv import load_dotenv

def test():
    # Load .env
    env_path = Path(__file__).resolve().parent / ".env"
    print(f"Loading .env from: {env_path}")
    load_dotenv(env_path)

    user = os.environ.get("EMAIL_USER")
    pas = os.environ.get("EMAIL_PASS")

    print(f"USER: {user}")
    print(f"PASS: {'SET' if pas else 'NOT SET'}")

    if not user or not pas:
        print("Error: EMAIL_USER or EMAIL_PASS not set in .env")
        return

    try:
        print("Connecting to smtp.gmail.com:587...")
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)
        server.set_debuglevel(1)
        print("EHLO 1...")
        server.ehlo()
        print("STARTTLS...")
        server.starttls()
        print("EHLO 2...")
        server.ehlo()
        print("Logging in...")
        server.login(user, pas)
        print("Login SUCCESS!")
        
        msg = f"Subject: SMTP Test\n\nSMTP is working for {user}"
        server.sendmail(user, user, msg)
        print("Test email sent to yourself SUCCESS!")
        server.quit()
    except Exception as e:
        print(f"FAILURE: {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    test()
