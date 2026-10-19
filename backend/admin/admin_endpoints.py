from fastapi import APIRouter, HTTPException, status, Depends
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from ..pydantic_models.schemas import OrganizationDetails, UsersDetails, UpdateOrganization
from ..auth.jwt import get_o_id
from typing import List

admin_endpoints = APIRouter()

@admin_endpoints.get("/organization_details", response_model=OrganizationDetails, status_code=status.HTTP_200_OK)
def organization_details(conn=Depends(db_connect), organization_id: int = Depends(get_o_id)):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """SELECT "Name", "Code", "Email" FROM "Organization" WHERE "O_id" = %s;"""
        cursor.execute(query,(organization_id,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found"
            )
        
        query = """SELECT COUNT(*) FROM "User" WHERE "O_id" = %s;"""
        cursor.execute(query,(organization_id,))
        count = cursor.fetchone()
        result['Users'] = count['count']
            
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
            
@admin_endpoints.get("/get_users",response_model=List[UsersDetails] ,status_code=status.HTTP_200_OK)
def getUsers(conn=Depends(db_connect), organization_id: int = Depends(get_o_id)):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """SELECT "U_id", "Email", "Phone_Number", "Name" FROM "User" WHERE "O_id" = %s;"""
        cursor.execute(query,(organization_id,))
        result = cursor.fetchall()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Users not found in this organization"
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
            
@admin_endpoints.delete("/delete_user/{u_id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_user(u_id:int, conn=Depends(db_connect), organization_id: int = Depends(get_o_id)):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """DELETE FROM "User" WHERE "U_id" = %s AND "O_id" = %s RETURNING "U_id";"""
        cursor.execute(query,(u_id,organization_id,))
        result = cursor.fetchone()
        if not result:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found in your organization"
            )
        conn.commit()
    
    except HTTPException as httpErr:
        raise httpErr
    except Exception as err:
        if cursor:
            conn.rollback()
            cursor.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Some Error Occurred" + str(err),
        )
    finally:
        if cursor:
            cursor.close()
            
@admin_endpoints.put("/update_organization",status_code=status.HTTP_200_OK)
def update_organization(data:UpdateOrganization, conn=Depends(db_connect), organization_id: int = Depends(get_o_id)):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """UPDATE "Organization" SET "Name" = %s, "Code" = %s, "Email" = %s WHERE "O_id" = %s RETURNING "Name","Code","Email";"""
        cursor.execute(query,(data.name,data.code,data.email,organization_id,))
        result = cursor.fetchone()
        if not result:
            conn.rollback()
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found"
            )
        conn.commit()
        return result
    
    except HTTPException as httpErr:
        raise httpErr
    except Exception as err:
        if cursor:
            conn.rollback()
            cursor.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Some Error Occurred" + str(err),
        )
    finally:
        if cursor:
            cursor.close()