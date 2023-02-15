from beanie import Document
from fastapi.security import HTTPBasicCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, Any

class User(Document):
    fullname: str
    email: EmailStr
    password: str
    user_type: str

    # class Collection:
    #     name = "user"

    class Config:
        schema_extra = {
            "example": {
                "fullname": "Abdulazeez Abdulazeez Adeshina",
                "email": "abdul@youngest.dev",
                "password": "3xt3m#",
                "user_type": "faculty"
            }
        }

class Attendance(Document):
    user : User



class UserSignIn(HTTPBasicCredentials):
    class Config:
        schema_extra = {
            "example": {
                "username": "abdul@youngest.dev",
                "password": "3xt3m#"
            }
        }


class UserData(BaseModel):
    fullname: str
    email: EmailStr
    user_type: str

    class Config:
        schema_extra = {
            "example": {
                "fullname": "Abdulazeez Abdulazeez Adeshina",
                "email": "abdul@youngest.dev",
                "user_type": "faculty"
            }
        }

class UpdateUserModel(BaseModel):
    fullname: Optional[str]
    email: Optional[EmailStr]
    user_type: Optional[str]

    class Collection:
        name = "user"

    class Config:
        schema_extra = {
            "example": {
                "fullname": "Abdulazeez Abdulazeez",
                "email": "abdul@school.com",
                "course_of_study": "Water resources and environmental engineering",
                "year": 4,
                "gpa": "5.0"
            }
        }

class ImageUserModel(BaseModel):
    fullname: str
    email: str
    user_type: Optional[str]

    class Collection:
        name = "user"

    class Config:
        schema_extra = {
            "example": {
                "fullname": "Abdulazeez Abdulazeez",
                "email": "abdul@school.com",
                "course_of_study": "Water resources and environmental engineering",
                "year": 4,
                "gpa": "5.0"
            }
        }

class Response(BaseModel):
    status_code: int
    response_type: str
    description: str
    data: Optional[Any]

    class Config:
        schema_extra = {
            "example": {
                "status_code": 200,
                "response_type": "success",
                "description": "Operation successful",
                "data": "Sample data"
            }
        }