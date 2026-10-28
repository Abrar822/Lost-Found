from fastapi import FastAPI
from .auth.auth_endpoints import db_endpoints
from .post.post_endpoints import post_endpoints
from fastapi.middleware.cors import CORSMiddleware
from .profile.profile_endpoints import profile_endpoints
from .admin.admin_endpoints import admin_endpoints
from .search.search_endpoints import search_endpoints
from .claim.claim_endpoints import claim_endpoints

app = FastAPI()

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
app.include_router(admin_endpoints)
app.include_router(search_endpoints)
app.include_router(claim_endpoints)