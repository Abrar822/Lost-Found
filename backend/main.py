from fastapi import FastAPI
from contextlib import asynccontextmanager
from .db_operations.db_connect import db_connect
from .auth.auth_endpoints import db_endpoints
from .post.post_endpoints import post_endpoints
from fastapi.middleware.cors import CORSMiddleware
from .profile.profile_endpoints import profile_endpoints

@asynccontextmanager
async def lifespan(app: FastAPI):
    db_connect()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(db_endpoints)
app.include_router(post_endpoints)
app.include_router(profile_endpoints)