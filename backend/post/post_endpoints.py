from fastapi import APIRouter, status, Depends, HTTPException
from ..pydantic_models.schemas import PostItem
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from ..auth.jwt import get_u_id

post_endpoints = APIRouter()

@post_endpoints.post("/post_lost", status_code=status.HTTP_201_CREATED)
def lostItem(item: PostItem, conn=Depends(db_connect), user_id : int =Depends(get_u_id)):
    cursor = None
    try:
        lost_item = item.model_dump()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            'INSERT INTO "Loser" ("U_id","Item_Name","Description","Date_Lost","Location_Lost","Image_Upload") VALUES (%s,%s,%s,%s,%s,%s) RETURNING *;',
            (
                user_id,
                lost_item["item_name"],
                lost_item["description"],
                lost_item["date"],
                lost_item["location"],
                lost_item["image"],
            ),
        )
        lost_item = cursor.fetchone()
        if not lost_item:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create lost item.",
            )
        conn.commit()
        return lost_item
    except HTTPException as httpErr:
        if conn:
            conn.rollback()
        raise httpErr
    except Exception as err:
        if cursor:
            cursor.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Some Error Occurred" + str(err),
        )
    finally:
        if cursor:
            cursor.close()


@post_endpoints.post("/post_found", status_code=status.HTTP_201_CREATED)
def foundItem(item: PostItem, conn=Depends(db_connect), user_id : int =Depends(get_u_id)):
    cursor = None
    try:
        found_item = item.model_dump()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            'INSERT INTO "Finder" ("U_id","Item_Name","Description","Date_Found","Location_Lost","Image_Upload") VALUES (%s,%s,%s,%s,%s,%s) RETURNING *;',
            (
                user_id,
                found_item["item_name"],
                found_item["description"],
                found_item["date"],
                found_item["location"],
                found_item["image"],
            ),
        )
        found_item = cursor.fetchone()
        if not found_item:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create a Found Item",
            )
        conn.commit()
        return found_item
    except HTTPException as httpErr:
        raise httpErr
    except Exception as err:
        conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Some Error Occurred" + str(err),
        )
    finally:
        if cursor:
            cursor.close()
