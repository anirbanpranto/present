from typing import List, Union

from beanie import PydanticObjectId

from models.user import User, Attendance

user_collection = User
att_collection = Attendance


async def add_user(new_user: User) -> User:
    user_check = await user_collection.find_one({"email" : new_user.email})
    if user_check:
        return {"error" : "Email already exists"}
    user = await new_user.create()
    return user

async def add_att(email : str) -> Attendance:
    user_check = await user_collection.find_one({"email" : email})
    att = Attendance(user=user_check)
    att = await att.create()
    return att

async def retrieve_users() -> List[User]:
    users = await user_collection.all().to_list()
    return users


async def retrieve_user(id: PydanticObjectId) -> User:
    user = await user_collection.get(id)
    if user:
        return user


async def delete_user(id: PydanticObjectId) -> bool:
    user = await user_collection.get(id)
    if user:
        await user.delete()
        return True


async def update_user_data(id: PydanticObjectId, data: dict) -> Union[bool, User]:
    des_body = {k: v for k, v in data.items() if v is not None}
    update_query = {"$set": {
        field: value for field, value in des_body.items()
    }}
    user = await user_collection.get(id)
    if user:
        await user.update(update_query)
        return user
    return False
