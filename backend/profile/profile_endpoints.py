from fastapi import APIRouter, status, Depends, HTTPException
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from ..pydantic_models.schemas import UserDetails, ItemDetails
from ..auth.jwt import get_u_id

profile_endpoints = APIRouter()


@profile_endpoints.get("/user", response_model=UserDetails)
def get_user(conn=Depends(db_connect), user_id: int = Depends(get_u_id)):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
            """SELECT "Name","Phone_Number","Email" FROM "User" WHERE "U_id" = %s""",
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
