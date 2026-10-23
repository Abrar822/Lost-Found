from fastapi import APIRouter, Depends, status, HTTPException
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from ..auth.jwt import get_u_id
from . import data
from .vectorization import (
    vectorize_found,
    vectorize_lost,
    calculate_similarity_found,
    calculate_similarity_lost,
)
from ..pydantic_models.schemas import SearchDetails

search_endpoints = APIRouter(prefix="/search_section")


@search_endpoints.get("/display_lost_items", status_code=status.HTTP_200_OK)
def display_lost_items(conn=Depends(db_connect), user_id=Depends(get_u_id)):
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        query = """SELECT "O_id" from "User" WHERE "U_id" = %s """
        cur.execute(query, (user_id, ))
        o_id = cur.fetchone()['O_id']

        query = """SELECT "U_id" FROM "User" WHERE "O_id" = %s """
        cur.execute(query, (o_id, ))
        user_ids = cur.fetchall()
        if not user_ids:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No other users belong to the organization you work in.')
        user_ids = [row["U_id"] for row in user_ids]
        

        query = """SELECT * FROM "Loser" WHERE "U_id" = ANY(%s) """
        cur.execute(query, (user_ids, ))
        d = cur.fetchall()
        d = [
            [
                row["Item_Name"],
                row["Description"],
                row["Location_Lost"],
                row["Date_Lost"],
                row["Image_Upload"],
                row["L_id"],
                row["U_id"]
            ]
            for row in d
        ]
        data.data["lost_items_data"] = d
        vectorize_lost(data.data)
        return d
    except Exception as err:
        print(repr(err))
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch details.",
        )
    finally:
        if cur:
            cur.close()


@search_endpoints.get("/display_found_items", status_code=status.HTTP_200_OK)
def display_found_items(conn=Depends(db_connect), user_id=Depends(get_u_id)):
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # getting Oid
        query = """SELECT "O_id" from "User" WHERE "U_id" = %s """
        cur.execute(query, (user_id,))
        o_id = cur.fetchone()
        o_id = o_id["O_id"]

        # getting user ids with same Oid
        query = """SELECT "U_id" FROM "User" WHERE "O_id" = %s """
        cur.execute(query, (o_id,))
        user_ids = cur.fetchall()
        if not user_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No other users belong to the organization you work in.",
            )
        user_ids = [d["U_id"] for d in user_ids]

        query = """SELECT * FROM "Finder" WHERE "U_id" = ANY(%s) """

        cur.execute(query, (user_ids, ))
        d = cur.fetchall()
        d = [
            [
                row["Item_Name"],
                row["Description"],
                row["Location_Lost"],
                row["Date_Found"],
                row["Image_Upload"],
                row["F_id"],
                row["U_id"]
            ]
            for row in d
        ]
        data.data["found_items_data"] = d
        vectorize_found(data.data)
        return d
    except Exception as err:
        print(repr(err))
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch details.",
        )
    finally:
        if cur:
            cur.close()


@search_endpoints.post("/search", status_code=status.HTTP_200_OK)
def search(details: SearchDetails, user_id=Depends(get_u_id)):
    try:
        if details.role == "finder":
            query = [
                details.item_name,
                details.description,
                details.location,
                details.date,
            ]
            result = calculate_similarity_found(data.data, query)
            return result

        elif details.role == "loser":
            query = [
                details.item_name,
                details.description,
                details.location,
                details.date,
            ]
            result = calculate_similarity_lost(data.data, query)
            return result
    except Exception as err:
        print(repr(err))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search Items.",
        )
