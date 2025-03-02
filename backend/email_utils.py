import smtplib
from email.mime.text import MIMEText
from auth import SMTP_SERVER, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD

def send_reset_email(email: str, token: str):
    reset_link = f'http://localhost:3000/reset-password?token={token}'
    msg = MIMEText(f'Kliknij tutaj, aby zresetować hasło: {reset_link}')
    msg['Subject'] = "Resetowanie hasła"
    msg['From'] = SMTP_EMAIL
    msg['To'] = email
    
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, email, msg.as_string())