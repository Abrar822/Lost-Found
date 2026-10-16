from pydantic import BaseModel, EmailStr, field_validator
from datetime import date,datetime
from typing import Optional

class AdminSignup(BaseModel):
    organization_name: str
    email: EmailStr
    code: str
    password: str

class UserSignup(BaseModel):
    name: str
    phone_number: str
    email: EmailStr
    code: str
    password: str
    otp: str

class Login(BaseModel):
    email: EmailStr
    password: str
    
class PostItem(BaseModel):
    item_name: str
    description: str
    date: date

    # @field_validator("date")
    # @classmethod
    # def validate_found_date(cls, value):

    #     try:
    #         parsed_date = datetime.strptime(
    #             value, "%d-%m-%Y"
    #         ).date()

    #     except ValueError:
    #         raise ValueError(
    #             "Date must be in DD-MM-YYYY format."
    #         )

    #     if parsed_date > date.today():
    #         raise ValueError(
    #             "Found date cannot be in the future."
    #         )

    #     return value
    
    location: str
    image: Optional[str] = ""
    
class UserDetails(BaseModel):
    Name: str
    Phone_Number: str
    Email: str
    
class ItemDetails(BaseModel):
    item_name: str
    description: str
    date: str
    location: str
    image: Optional[str] = None