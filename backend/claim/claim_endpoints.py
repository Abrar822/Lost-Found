from fastapi import APIRouter, status, Depends, HTTPException
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from ..auth.jwt import get_u_id
import os
from dotenv import load_dotenv
from ..pydantic_models.schemas import ClaimRequest

claim_endpoints = APIRouter()

@claim_endpoints.post("/claim/request", status_code=status.HTTP_201_CREATED)
def claim_request(claim:ClaimRequest, conn=Depends(db_connect), user_id : int =Depends(get_u_id)):
    cursor = None
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """INSERT INTO "ClaimRequests" ("L_id","F_id") VALUES (%s,%s);"""
        cursor.execute(query,(claim.L_id, claim.L_id))
        result = cursor.fetchone()
        