import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

def send_otp_email(recipient_email: str, otp_code: str):
    # Fallback/Console log (Always print to console for local testing and backup!)
    print("\n" + "="*80)
    print(f" MOCK EMAIL: [EduVise Login OTP]")
    print(f" To: {recipient_email}")
    print(f" Your 5-digit verification code is: {otp_code}")
    print("="*80 + "\n")

    # Check if SMTP configuration is provided
    if not settings.SMTP_HOST or not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print("[SMTP] Configuration missing. Skipping actual email delivery.")
        return False

    try:
        # Create message container
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "EduVise Giris Dogrulama Kodu"
        msg['From'] = settings.SMTP_FROM or settings.SMTP_USERNAME
        msg['To'] = recipient_email

        # HTML Body
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #0d1117; color: #c9d1d9; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
              <h2 style="color: #58a6ff; margin-bottom: 24px;">EduVise Giris Kodu</h2>
              <p style="font-size: 16px; margin-bottom: 30px; line-height: 1.6;">
                EduVise platformuna giris yapabilmeniz icin tek kullanimlik 5 haneli guvenlik kodunuz asagidadir:
              </p>
              <div style="background-color: #0d1117; border: 1px solid #30363d; border-radius: 8px; display: inline-block; padding: 15px 40px; margin-bottom: 30px;">
                <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #34d399;">{otp_code}</span>
              </div>
              <p style="font-size: 14px; color: #8b949e; margin-top: 20px;">
                Bu kod 5 dakika boyunca gecerlidir. Kodunuzu kimseyle paylasmayiniz.
              </p>
            </div>
          </body>
        </html>
        """

        msg.attach(MIMEText(html, 'html', 'utf-8'))

        # Connect to server
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=5)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        
        # Send email
        server.sendmail(msg['From'], recipient_email, msg.as_string())
        server.quit()
        print(f"[SMTP] OTP email successfully sent to {recipient_email}")
        return True
    except Exception as e:
        print(f"[SMTP ERROR] Failed to send OTP email to {recipient_email}: {e}")
        return False


def send_reset_email(recipient_email: str, reset_link: str):
    # Fallback/Console log (Always print to console for local testing and backup!)
    print("\n" + "="*80)
    print(f" MOCK EMAIL: [EduVise Password Reset]")
    print(f" To: {recipient_email}")
    print(f" Reset Link: {reset_link}")
    print("="*80 + "\n")

    # Check if SMTP configuration is provided
    if not settings.SMTP_HOST or not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print("[SMTP] Configuration missing. Skipping actual email delivery.")
        return False

    try:
        # Create message container
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "EduVise Sifre Sifirlama Talebi"
        msg['From'] = settings.SMTP_FROM or settings.SMTP_USERNAME
        msg['To'] = recipient_email

        # HTML Body
        html = f"""
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #0d1117; color: #c9d1d9; padding: 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
              <h2 style="color: #58a6ff; margin-bottom: 24px;">EduVise Sifre Sifirlama</h2>
              <p style="font-size: 16px; margin-bottom: 30px; line-height: 1.6;">
                Hesabinizin sifresini sifirlamak icin asagidaki butona tiklayabilirsiniz:
              </p>
              <div style="margin-bottom: 30px;">
                <a href="{reset_link}" target="_blank" style="background-color: #238636; border: 1px solid #2ea44f; border-radius: 6px; display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                  Sifremi Sifirla
                </a>
              </div>
              <p style="font-size: 14px; color: #8b949e; margin-top: 20px;">
                Bu link 15 dakika boyunca gecerlidir. Talepte bulunmadiysaniz bu e-postayi gormezden gelebilirsiniz.
              </p>
              <hr style="border: 0; border-top: 1px solid #30363d; margin: 20px 0;">
              <p style="font-size: 12px; color: #8b949e;">
                Butona tiklayamiyorsaniz, asagidaki adresi tarayiciniza yapistirabilirsiniz:<br>
                <a href="{reset_link}" style="color: #58a6ff; word-break: break-all;">{reset_link}</a>
              </p>
            </div>
          </body>
        </html>
        """

        msg.attach(MIMEText(html, 'html', 'utf-8'))

        # Connect to server
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=5)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        
        # Send email
        server.sendmail(msg['From'], recipient_email, msg.as_string())
        server.quit()
        print(f"[SMTP] Reset email successfully sent to {recipient_email}")
        return True
    except Exception as e:
        print(f"[SMTP ERROR] Failed to send reset email to {recipient_email}: {e}")
        return False

