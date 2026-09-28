import socket
import smtplib
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

def test_smtp():
    target = "smtp.gmail.com"
    port = 587
    user = os.environ.get("EMAIL_USER")
    pas = os.environ.get("EMAIL_PASS")
    
    print(f"Testing connectivity to {target}:{port}...")
    try:
        with socket.create_connection((target, port), timeout=10) as s:
            print("  [SUCCESS] TCP Connection established.")
    except Exception as e:
        print(f"  [FAILED] TCP Connection failed: {e}")
        return

    print(f"Testing SMTP Handshake (ehlo, starttls) for {user}...")
    try:
        with smtplib.SMTP(target, port, timeout=10) as server:
            server.set_debuglevel(1) # Show full conversation
            server.ehlo()
            server.starttls()
            server.ehlo()
            if not user or not pas:
                print("  [FAILED] Missing credentials in .env")
                return
            server.login(user, pas)
            print("  [SUCCESS] SMTP Login successful.")
            
            # Send the test email to the user directly
            msg = f"Subject: SMTP Test Axion\n\nThis is a test to verify SMTP at {target}."
            server.sendmail(user, user, msg)
            print(f"  [SUCCESS] Test email sent to {user}.")
            
    except Exception as e:
        print(f"  [FAILED] SMTP sequence failed: {e}")

if __name__ == "__main__":
    test_smtp()
