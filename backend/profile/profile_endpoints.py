from fastapi import APIRouter, status, Depends, HTTPException
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from ..pydantic_models.schemas import UserDetails, ItemDetails
from ..auth.jwt import get_u_id

profile_endpoints = APIRouter()


@profile_endpoints.get("/user", response_model=UserDetails,status_code=status.HTTP_200_OK)
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
