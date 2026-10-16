from dotenv import load_dotenv
import os
from datetime import datetime, timedelta, timezone
import jwt

load_dotenv('./backend/.env')
jwt_algorithm = os.getenv("JWT_ALGORITHM")
secret_key = os.getenv("JWT_SECRET_KEY")

def create_jwt(payload: dict):
    to_encode = payload.copy()
    exp = datetime.now(timezone.utc) + timedelta(minutes=10)
    to_encode.update({"exp": exp})

    encoded_jwt = jwt.encode(to_encode, secret_key, jwt_algorithm)
    return encoded_jwt


from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

oauth_scheme_user = OAuth2PasswordBearer(tokenUrl="/user_login")

def get_u_id(token=Depends(oauth_scheme_user)):
    try:
        payload = jwt.decode(token, secret_key, algorithms=[jwt_algorithm])
        u_id = payload.get("u_id")
        if u_id:
            return u_id
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Session has expired. Login again."
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Login again.",
        )


oauth_scheme_admin = OAuth2PasswordBearer(tokenUrl="/admin_login")


def get_o_id(token=Depends(oauth_scheme_admin)):
    try:
        payload = jwt.decode(token, secret_key, algorithms=[jwt_algorithm])
        o_id = payload.get("o_id")
        if o_id:
            return o_id
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid JWT Token."
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or token is invalid.",
        )
