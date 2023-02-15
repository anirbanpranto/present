from fastapi import APIRouter, Body, File, Form

from database.database import *
from models.user import *
from utils.upload import upload_bytes, download_bytes
import torch
import PIL.Image as Image
import torchvision.transforms as transforms
import io
from models.siamese import predict_x
import torch.nn.functional as F

router = APIRouter()

async def read_imagefile(file) -> Image.Image:
    image = Image.open(file)
    return image

@router.post("/register/", response_model=Response)
async def create_file(image : bytes = File(), name: str = Form(), password: str = Form(), email: str = Form(), user_type: str = Form()):
    user = User(fullname=name, password=password, user_type=user_type, email=email)
    new_user = await add_user(user)
    if "error" in new_user :
        return {
            "status_code": 400,
            "response_type": "success",
            "description": new_user["error"],
            "data": "Error"
        }
    
    upload_bytes(image, email+".png")
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "User created successfully",
        "data": new_user
    }

convert_tensor = transforms.ToTensor()

async def tranform_image(test1):
    test1 = test1.convert('L')
    test1 = test1.resize((100, 100))
    test1 = convert_tensor(test1)
    test1 = test1.unsqueeze(1)
    return test1

@router.post("/predict/", response_model=Response)
async def predict(file : bytes = File()):
    input = io.BytesIO(file)
    input = await read_imagefile(input)
    input = await tranform_image(input)
    users = await retrieve_users()
    min = 100.00
    min_user = ""
    for user in users:
        email = user.email
        image = await download_bytes(email + ".png")
        file = await read_imagefile(image)
        input_2 = await tranform_image(file)
        print(input.shape, input_2.shape)
        out1, out2 = predict_x(input.float(), input_2.float())
        euclidean_distance = F.pairwise_distance(out1, out2)
        dist = euclidean_distance.item()
        print(email, dist)
        print(email, dist)
        if(dist < min):
            min = dist
            min_user = user
        
    return {
        "status_code": 200,
        "response_type": "success",
        "description": "Prediction Successful",
        "data": min_user
    }
