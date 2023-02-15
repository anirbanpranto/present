from fastapi import APIRouter, Body

from database.database import *
from models.user import *

router = APIRouter()


@router.get("/", response_description="Users retrieved", response_model=Response)
async def get_users():
    users = await retrieve_users()
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Users data retrieved successfully",
        "data": users
    }

@router.post("/attendance/", response_model=Response)
async def save_attendance(email = Body(...)):
    email = email["email"]
    users = await add_att(email)
    print(users)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Users data retrieved successfully",
        "data": ""
    }

@router.get("/{id}", response_description="User data retrieved", response_model=Response)
async def get_user_data(id: PydanticObjectId):
    user = await retrieve_user(id)
    if user:
        return {
            "status_code": 200,
            "response_type": "success",
            "description": "User data retrieved successfully",
            "data": user
        }
    return {
        "status_code": 404,
        "response_type": "error",
        "description": "User doesn't exist",
    }


@router.post("/", response_description="User data added into the database", response_model=Response)
async def add_user_data(user: User = Body(...)):
    new_user = await add_user(user)
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "User created successfully",
        "data": new_user
    }


@router.delete("/{id}", response_description="User data deleted from the database")
async def delete_user_data(id: PydanticObjectId):
    deleted_user = await delete_user(id)
    if deleted_user:
        return {
            "status_code": 200,
            "response_type": "success",
            "description": "User with ID: {} removed".format(id),
            "data": deleted_user
        }
    return {
        "status_code": 404,
        "response_type": "error",
        "description": "User with id {0} doesn't exist".format(id),
        "data": False
    }


@router.put("/{id}", response_model=Response)
async def update_user(id: PydanticObjectId, req: UpdateUserModel = Body(...)):
    updated_user = await update_user_data(id, req.dict())
    if updated_user:
        return {
            "status_code": 200,
            "response_type": "success",
            "description": "User with ID: {} updated".format(id),
            "data": updated_user
        }
    return {
        "status_code": 404,
        "response_type": "error",
        "description": "An error occurred. User with ID: {} not found".format(id),
        "data": False
    }
