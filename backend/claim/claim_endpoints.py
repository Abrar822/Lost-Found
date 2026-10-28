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
        query = """INSERT INTO "ClaimRequests" ("L_id","F_id") VALUES (%s,%s) RETURNING *;"""
        cursor.execute(query,(claim.L_id, claim.F_id))
        result = cursor.fetchone()
        if not result:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create claim request.",
            )
        conn.commit()
        
        return result
    
    except HTTPException as httpErr:
        print(httpErr)
        if conn:
            conn.rollback()
        raise httpErr
    except Exception as err:
        print(str(err))
        if cursor:
            cursor.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Some Error Occurred" + str(err),
        )
    finally:
        if cursor:
            cursor.close()


@claim_endpoints.get('/claim/all_details')
def fetch(conn = Depends(db_connect), user_id = Depends(get_u_id)):
    cur = None
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT F.* FROM "ClaimRequests" as C JOIN "Finder" as F ON C."F_id" = F."F_id" WHERE F."U_id" = (%s)
        """
        cur.execute(query, (user_id,))
        d = cur.fetchall()
        return d
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to fetch claim requests.')
    finally:
        if cur: cur.close()
            
@claim_endpoints.get("/claim/details", status_code=status.HTTP_200_OK)
def details(conn=Depends(db_connect), user_id : int =Depends(get_u_id)):
    cursor = None
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """SELECT c."L_id",c."F_id" FROM "ClaimRequests" AS c INNER JOIN "Finder" AS f ON c."F_id" = f."F_id" WHERE f."U_id" = %s; """
        cursor.execute(query,(user_id,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get data",
            )
        query = """SELECT * FROM "Finder" WHERE "F_id" = %s; """
        cursor.execute(query,(result['F_id'],))
        data = cursor.fetchone()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get found item data",
            )
        response = {
            "found_item":data
        }
        query = """SELECT * FROM "Loser" WHERE "L_id" = %s; """
        cursor.execute(query,(result['L_id'],))
        data = cursor.fetchone()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get lost item data",
            )
        response['lost_item'] = data
        
        query = """SELECT u.* FROM "User" AS u INNER JOIN "Finder" AS f ON u."U_id" = f."U_id" WHERE f."F_id" = %s AND u."U_id" = %s; """
        cursor.execute(query,(result['F_id'],response['found_item']['U_id']))
        data = cursor.fetchone()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get user data",
            )
        response['user'] = data
        return response
    
    except HTTPException as httpErr:
        print(httpErr)
        raise httpErr
    except Exception as err:
        print(str(err))
        if cursor:
            cursor.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Some Error Occurred" + str(err),
        )
    finally:
        if cursor:
            cursor.close()
