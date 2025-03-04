from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from models import ResetPasswordRequest, NewPasswordRequest
from auth import create_reset_token, verify_reset_token
from email_utils import send_reset_email
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter()

@router.post("/reset-password")
def request_password_reset(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Użytkownik nie znaleziony")

    token = create_reset_token(user.email)
    user.reset_token = token
    db.commit()

    #send_reset_email(user.email, token)
    print(token)
    return {"message": "Link do resetu hasła wysłany na e-mail"}

@router.post("/reset-password/confirm")
def reset_password(request: NewPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_token(request.token)
    if not email:
        raise HTTPException(status_code=400, detail="Nieprawidłowy lub wygasły token")

    user = db.query(User).filter(User.email == email).first()
    if not user or user.reset_token != request.token:
        raise HTTPException(status_code=400, detail="Nieprawidłowy token resetujący")

    user.password = pwd_context.hash(request.new_password)
    user.reset_token = None  # Usuwamy token po użyciu
    db.commit()

    return {"message": "Hasło zostało zresetowane"}
