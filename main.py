from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from models import User, fake_db, hash_password, verify_password
from auth import create_access_token, verify_token
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import logging

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = 'login')

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['http://localhost:3000'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

@app.get('/')
def read_root():
    return { 'message' : 'Hello z FastAPI!'}

@app.post("/register")
def register(user: User):
    if user.email in fake_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pwd = hash_password(user.password)
    fake_db[user.email] = {"password": hashed_pwd}
    return {"message": "User registered successfully"}

@app.post('/login')
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_data = fake_db.get(form_data.username)
    if not user_data or not verify_password(form_data.password, user_data['password']):
        raise HTTPException(status_code=401, detail = 'Wrong email or passowrd')
    
    token = create_access_token({'sub': form_data.username})
    return {'access_token' : token, 'token_type' : 'bearer'}

@app.get('/protected')
def protected_route(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code = 401, detail = 'Token error')
    return {'message': 'You are authorized!', 'user' : payload['sub']}

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
	exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
	logging.error(f"{request}: {exc_str}")
	content = {'status_code': 10422, 'message': exc_str, 'data': None}
	return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)