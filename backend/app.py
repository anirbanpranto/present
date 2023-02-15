from fastapi import FastAPI, Depends

from auth.jwt_bearer import JWTBearer
from config.config import initiate_database
from routes.user import router as UserRouter
from routes.inference import router as Inference
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

token_listener = JWTBearer()


@app.on_event("startup")
async def start_database():
    await initiate_database()


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to this fantastic app."}

# app.include_router(UserRouter, tags=["Users"], prefix="/user", dependencies=[Depends(token_listener)])
app.include_router(UserRouter, tags=["Users"], prefix="/user")
app.include_router(Inference, tags=["Inferences"], prefix="/inference")