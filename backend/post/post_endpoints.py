from fastapi import APIRouter, status, Depends, HTTPException, UploadFile, File, Form
from ..pydantic_models.schemas import PostItem
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from ..auth.jwt import get_u_id
from ..search.vectorization import vectorize_found, vectorize_lost
from ..search import data
from ..search.vectorization import retrieve_items
import os
from uuid import uuid4
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SECRET_KEY'])
bucket = 'item-images'

post_endpoints = APIRouter()

def upload_image(image):
    allowed_types = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp"
    }
    if image.content_type not in allowed_types:
        raise ValueError("Only JPG, PNG, and WEBP images are allowed")

    image_bytes = image.file.read()
    path = f"{uuid4().hex}{allowed_types[image.content_type]}"
    supabase.storage.from_(bucket).upload(
        path=path, file=image_bytes, file_options={"content-type": image.content_type}
    )
    path = supabase.storage.from_(bucket).get_public_url(path)
    return path

@post_endpoints.post("/post_lost", status_code=status.HTTP_201_CREATED)
def lostItem(item_name: str = Form(...), description: str = Form(...), location: str = Form(...), date: str = Form(...), image: UploadFile | None = File(None), conn=Depends(db_connect), user_id : int =Depends(get_u_id)):
    print('start post lost')
    cursor = None
    image_path = ""
    try:
        item = {
            'item_name': item_name, 'description': description, 'location': location, 'date': date
        }
        if image:
            image_path = upload_image(image)
        item.update({'image': image_path})

        cursor = conn.cursor(cursor_factory=RealDictCursor)
        lost_item = item.copy()
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
        retrieve_items()
        vectorize_lost(data.data)
        return lost_item
    except HTTPException as httpErr:
        print(str(httpErr))
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


@post_endpoints.post("/post_found", status_code=status.HTTP_201_CREATED)
def foundItem(item_name: str = Form(...), description: str = Form(...), location: str = Form(...), date: str = Form(...), image: UploadFile | None = File(None), conn=Depends(db_connect), user_id : int =Depends(get_u_id)):
    cursor = None
    image_path = ""
    try:
        if image:
            image_path = upload_image(image)
        item = {
            'item_name': item_name, 'description': description, 'date': date, 'location': location
        }
        item.update({'image': image_path})
        found_item = item.copy()
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
        retrieve_items()
        vectorize_found(data.data)
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
