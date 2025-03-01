from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import SessionLocal, engine, get_db
from models import Base, User,UserRegister, UserResponse, UserLogin, Character
from fastapi.middleware.cors import CORSMiddleware
from auth import create_access_token, get_current_user, ALGORITHM, SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES

from routes import characters

import logging

app = FastAPI()

app.include_router(characters.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['http://localhost:3000'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

    
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')



@app.get('/')
def read_root():
    return { 'message' : 'Hello z FastAPI!'}

@app.post("/register", response_model=UserResponse)
async def register(user: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail='Email already taken')
    
    hashed_password = pwd_context.hash(user.password)

    new_user = User(email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post('/login')
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == form_data.username).first()
    if not db_user or not pwd_context.verify(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": form_data.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get('/dashboard')
def dashboard(user: User = Depends(get_current_user)):
    return {'id': user.id, 'email' : user.email}

@app.get('/characters')
def characters(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
     user_characters = db.query(Character).filter(Character.user_id == user.id).all()

     if not user_characters:
          raise HTTPException(status_code=404, detail='No characters')
     return user_characters

@app.get('/characters/{id}')
def character_details(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
     character_details = db.query(Character).filter(Character.id == 1).first()

     if not character_details:
          raise HTTPException(status_code=404, detail='No characters with this ID')
     return character_details

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
	exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
	logging.error(f"{request}: {exc_str}")
	content = {'status_code': 10422, 'message': exc_str, 'data': None}
	return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)






if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)