from fastapi import APIRouter, status, Depends, HTTPException
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from ..pydantic_models.schemas import UserDetails, UpdateUser
from ..auth.jwt import get_u_id
from typing import List

profile_endpoints = APIRouter()

@profile_endpoints.get(
    "/user", response_model=UserDetails, status_code=status.HTTP_200_OK
)
def get_user(conn=Depends(db_connect), user_id: int = Depends(get_u_id)):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            """SELECT u."Name",u."Phone_Number",u."Email",o."Code" FROM "User" AS u LEFT JOIN "Organization" AS o ON u."O_id" = o."O_id" WHERE u."U_id" = %s""",
            (user_id,),
        )
        result = cursor.fetchone()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        return result

    except HTTPException as httpErr:
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


@profile_endpoints.put(
    "/user/edit", response_model=UserDetails, status_code=status.HTTP_200_OK
)
def update_user(
    data: UpdateUser, conn=Depends(db_connect), user_id: int = Depends(get_u_id)
):
    cursor = None

    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Find the organization using the new code
        cursor.execute(
            """
            SELECT "O_id", "Code"
            FROM "Organization"
            WHERE "Code" = %s
            """,
            (data.Code,),
        )

        organization = cursor.fetchone()

        if not organization:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid organization code. Please enter an existing code.",
            )

        # Update the user's organization association
        cursor.execute(
            """
            UPDATE "User"
            SET "Name" = %s,
                "Phone_Number" = %s,
                "Email" = %s,
                "O_id" = %s
            WHERE "U_id" = %s
            RETURNING "Name", "Phone_Number", "Email"
            """,
            (data.Name, data.Phone_Number, data.Email, organization["O_id"], user_id),
        )

        updated_user = cursor.fetchone()

        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        conn.commit()

        return {
            "Name": updated_user["Name"],
            "Phone_Number": updated_user["Phone_Number"],
            "Email": updated_user["Email"],
            "Code": organization["Code"],
        }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as err:
        conn.rollback()
        print(f"Profile update error: {err}")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update user details",
        ) from err

    finally:
        if cursor:
            cursor.close()


@profile_endpoints.get("/user/lost-items", status_code=status.HTTP_200_OK)
def get_lost_items(
    conn=Depends(db_connect),
    user_id: int = Depends(get_u_id),
):
    cursor = None

    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT
                l."L_id" AS id,
                l."Item_Name" AS title,
                'Lost' AS type,
                l."Date_Lost" AS date,
                l."Location_Lost" AS location,
                l."Image_Upload" AS image,
                l."Description" AS description,
                u."Phone_Number" AS contact
            FROM "Loser" AS l
            LEFT JOIN "User" AS u
                ON l."U_id" = u."U_id"
            ORDER BY
                l."Date_Lost" DESC NULLS LAST,
                l."L_id" DESC
        """)

        return cursor.fetchall()

    except Exception as err:
        print(f"Error fetching lost items: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch lost items",
        ) from err

    finally:
        if cursor:
            cursor.close()


@profile_endpoints.get("/user/found-items", status_code=status.HTTP_200_OK)
def get_found_items(
    conn=Depends(db_connect),
    user_id: int = Depends(get_u_id),
):
    cursor = None

    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT
                f."F_id" AS id,
                f."Item_Name" AS title,
                'Found' AS type,
                f."Date_Found" AS date,
                f."Location_Lost" AS location,
                f."Image_Upload" AS image,
                f."Description" AS description,
                u."Phone_Number" AS contact
            FROM "Finder" AS f
            LEFT JOIN "User" AS u
                ON f."U_id" = u."U_id"
            ORDER BY
                f."Date_Found" DESC NULLS LAST,
                f."F_id" DESC
        """)

        return cursor.fetchall()

    except Exception as err:
        print(f"Error fetching found items: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to fetch found items",
        ) from err

    finally:
        if cursor:
            cursor.close()
