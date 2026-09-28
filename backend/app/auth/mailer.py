import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

class Mailer:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_name = "Axion Pilot"

    @property
    def email_user(self) -> str:
        """Read lazily so hot-reload / late .env loading is handled correctly."""
        return os.environ.get("EMAIL_USER") or ""

    @property
    def email_pass(self) -> str:
        return os.environ.get("EMAIL_PASS") or ""

    @property
    def is_dev(self) -> bool:
        return os.environ.get("ENV", "development") == "development"

    def _log_otp_to_console(self, recipient_email: str, otp: str, purpose: str):
        """Fallback: print OTP to console so developer is not blocked."""
        separator = "=" * 50
        logger.warning(f"\n{separator}\n[DEV MODE] OTP FOR: {recipient_email}\nPURPOSE: {purpose}\nCODE: {otp}\n{separator}\n")

    def send_otp(self, recipient_email: str, otp: str, purpose: str = "login"):
        """Sends an OTP email via Gmail SMTP with enhanced connectivity."""
        
        # Check if we are using placeholders
        is_placeholder = not self.email_user or not self.email_pass or "your-email" in self.email_user or "your-app-password" in self.email_pass
        
        if is_placeholder:
            if self.is_dev:
                logger.info(f"Using placeholder SMTP credentials. Printing OTP to console.")
                self._log_otp_to_console(recipient_email, otp, purpose)
                return True
            else:
                logger.error(f"SMTP credentials missing in production. Cannot send OTP to {recipient_email}")
                return False

        try:
            subject = f"Your {self.sender_name} {purpose.capitalize()} OTP"
            
            # Create the body
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4F46E5; text-align: center;">{self.sender_name} Verification</h2>
                    <p>Hello,</p>
                    <p>Your One-Time Password (OTP) for <strong>{purpose}</strong> is:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; background: #F3F4F6; padding: 10px 20px; border-radius: 5px;">{otp}</span>
                    </div>
                    <p>This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666; text-align: center;">
                        This is an automated message from {self.sender_name}. Please do not reply.
                    </p>
                </div>
            </body>
            </html>
            """

            msg = MIMEMultipart()
            msg["From"] = f"{self.sender_name} <{self.email_user}>"
            msg["To"] = recipient_email
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "html"))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(self.email_user, self.email_pass)
                server.send_message(msg)

            logger.info(f"OTP sent successfully to {recipient_email}")
            return True

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Failed to send email to {recipient_email}: {error_msg}")
            
            if "(535," in error_msg and "Username and Password not accepted" in error_msg:
                logger.warning("HINT: Gmail rejected your credentials. Ensure you are using an 'App Password' and not your main account password.")
            
            if self.is_dev:
                logger.info("Falling back to console logging for development.")
                self._log_otp_to_console(recipient_email, otp, purpose)
                return True
            
            return False

    def send_signup_otps(self, recipient_email: str, email_otp: str, mobile_otp: str):
        """Sends both Email and Mobile OTPs in a single welcome email."""
        # Use send_otp logic for placeholders
        is_placeholder = not self.email_user or not self.email_pass or "your-email" in self.email_user or "your-app-password" in self.email_pass
        
        if is_placeholder:
            if self.is_dev:
                logger.info(f"Using placeholder SMTP credentials for signup. Printing OTPs to console.")
                self._log_otp_to_console(recipient_email, f"EMAIL: {email_otp}, MOBILE: {mobile_otp}", "Signup Verification")
                return True
            else:
                logger.error(f"SMTP credentials missing in production. Cannot send signup OTPs to {recipient_email}")
                return False

        try:
            subject = f"Welcome to {self.sender_name} - Verify Your Account"
            
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; text-align: left;">
                    <h2 style="color: #4F46E5; text-align: center;">Welcome to {self.sender_name}!</h2>
                    <p>To complete your registration, please enter the following verification codes in the app:</p>
                    
                    <div style="margin: 20px 0; padding: 15px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
                        <p style="margin: 0 0 10px 0; font-weight: bold; color: #6B7280;">EMAIL OTP</p>
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #4F46E5;">{email_otp}</span>
                    </div>

                    <div style="margin: 20px 0; padding: 15px; background: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
                        <p style="margin: 0 0 10px 0; font-weight: bold; color: #6B7280;">MOBILE OTP</p>
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #4F46E5;">{mobile_otp}</span>
                    </div>

                    <p style="font-size: 14px; color: #6B7280;">These codes are valid for 5 minutes. If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
                        Automated message from {self.sender_name}
                    </p>
                </div>
            </body>
            </html>
            """

            msg = MIMEMultipart()
            msg["From"] = f"{self.sender_name} <{self.email_user}>"
            msg["To"] = recipient_email
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "html"))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(self.email_user, self.email_pass)
                server.send_message(msg)

            logger.info(f"Signup OTPs sent successfully to {recipient_email}")
            return True

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Failed to send signup email to {recipient_email}: {error_msg}")
            
            if self.is_dev:
                logger.info("Falling back to console logging for development.")
                self._log_otp_to_console(recipient_email, f"EMAIL: {email_otp}, MOBILE: {mobile_otp}", "Signup Verification")
                return True
                
            return False

# Singleton instance
mailer = Mailer()
