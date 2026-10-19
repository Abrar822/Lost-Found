from fastapi import APIRouter, status, Depends, HTTPException
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from ..pydantic_models.schemas import UserDetails, UpdateUser
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

@profile_endpoints.put("/user/edit",response_model= UserDetails)
def update_user(data: UpdateUser,conn=Depends(db_connect), user_id: int = Depends(get_u_id)):
    cursor = None

    try:
        cursor = conn.cursor(cursor_factory = RealDictCursor)
        cursor.execute(
            """update "User" set "Name"=%s,"Phone_Number"=%s,"Email"=%s where "U_id"=%s
            returning "Name","Phone_Number","Email","Code","O_id"
            """,
            (data.name,data.phone_number,data.email,data.code,user_id)
            )
        updated_user = cursor.fetchone()

        if not updated_user:
            conn.rollback()
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found",)

        conn.commit()

        return {
            "Name": updated_user["Name"],
            "Phone_Number": updated_user["Phone_Number"],
            "Email": updated_user["Email"],
            "Code": update_user["Code"] if update_user else "",
        }
    except HTTPException:
        raise
    except Exception as err:
        conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update user details",
        ) from err
    finally:
        if cursor:
            cursor.close()

