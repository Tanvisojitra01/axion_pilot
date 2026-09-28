import smtplib
import os
from pathlib import Path
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load .env
load_dotenv(Path(__file__).resolve().parent / ".env")

EMAIL_USER = os.environ.get("EMAIL_USER", "")
EMAIL_PASS = os.environ.get("EMAIL_PASS", "")

print(f"EMAIL_USER loaded: {EMAIL_USER}")
print(f"EMAIL_PASS loaded: {'***' + EMAIL_PASS[-4:] if EMAIL_PASS else 'NOT SET'}")

if not EMAIL_USER or not EMAIL_PASS:
    print("ERROR: Credentials not loaded from .env!")
    exit(1)

# Try to send a real test email
RECIPIENT = "your-email@example.com"
OTP = "123456"

msg = MIMEMultipart()
msg["From"] = f"Axion Pilot <{EMAIL_USER}>"
msg["To"] = RECIPIENT
msg["Subject"] = "Axion Pilot - Test OTP Email"
msg.attach(MIMEText(f"<h2>Test OTP: <b>{OTP}</b></h2><p>If you see this, email delivery is working!</p>", "html"))

try:
    print(f"\nConnecting to SMTP...")
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        # server.set_debuglevel(1) # Enable debug if needed
        server.ehlo()
        server.starttls()
        server.ehlo()
        print("Logging in...")
        server.login(EMAIL_USER, EMAIL_PASS)
        print("Sending email...")
        server.send_message(msg)
        print(f"\n✅ SUCCESS! Test email sent to {RECIPIENT}")
except Exception as e:
    print(f"\n❌ FAILED: {e}")
