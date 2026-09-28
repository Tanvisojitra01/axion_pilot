#!/usr/bin/env python
"""Test Gmail SMTP connection and send a test OTP."""
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')

print(f'Email User: {EMAIL_USER}')
print(f'Email Pass: {"***" if EMAIL_PASS else "NOT SET"}')
print('\nTesting SMTP connection...\n')

try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    print('✓ Connected to smtp.gmail.com:587')
    
    server.starttls()
    print('✓ STARTTLS enabled')
    
    server.login(EMAIL_USER, EMAIL_PASS)
    print('✓ Login successful!\n')
    
    # Create test email with HTML
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = EMAIL_USER
    msg['Subject'] = 'Test OTP - ProjectPilot'
    
    body = """
    <html>
    <body>
        <h2>Test OTP Email</h2>
        <p>Your test OTP is: <strong>123456</strong></p>
        <p>This is a test to verify Gmail SMTP is working correctly.</p>
    </body>
    </html>
    """
    msg.attach(MIMEText(body, 'html'))
    
    server.send_message(msg)
    print('✓ Test email sent successfully to: ' + EMAIL_USER)
    print('\nIf you did not receive the email after a few seconds:')
    print('  1. Check SPAM/Promotions folder')
    print('  2. Verify the App Password is correct (not your Gmail password)')
    print('  3. Enable "Allow less secure apps" if prompted\n')
    
    server.quit()
    
except smtplib.SMTPAuthenticationError:
    print('✗ AUTHENTICATION FAILED')
    print('  - Check if EMAIL_USER and EMAIL_PASS are correct')
    print('  - Verify you created an App Password (not using regular Gmail password)')
    print('  - Go to: https://myaccount.google.com/apppasswords')
    
except smtplib.SMTPException as e:
    print(f'✗ SMTP Error: {str(e)}')
    
except Exception as e:
    print(f'✗ Error: {str(e)}')
