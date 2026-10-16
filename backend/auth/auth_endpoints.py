from fastapi import APIRouter, Depends, status, HTTPException
from ..pydantic_models.schemas import AdminSignup, UserSignup, Login
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from .security import hash_password, verify_password
from .jwt import create_jwt

db_endpoints = APIRouter()


@db_endpoints.post("/admin_signup", status_code=status.HTTP_201_CREATED)
def admin_signup(admin: AdminSignup, conn=Depends(db_connect)):
    tupl = (
        admin.organization_name,
        admin.code,
        admin.email,
        hash_password(admin.password),
    )
    cur = None
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # checking the user exists
        query = """SELECT "Name" FROM "Organization" WHERE "Email" = %s"""
        cur.execute(query, (admin.email,))
        result = cur.fetchone()
        if result:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail=f"The user already exists."
            )

        query = """INSERT INTO "Organization" ("Name", "Code", "Email", "Password") VALUES (%s, %s, %s, %s)"""
        cur.execute(query, tupl)
        conn.commit()
        return {"message": "Admin registered successfully."}
    except HTTPException as httpErr:
        raise httpErr
    except Exception as err:
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Some Error Occurred" + str(err),
        )
    finally:
        if cur:
            cur.close()


@db_endpoints.post("/user_signup", status_code=status.HTTP_201_CREATED)
def user_signup(user: UserSignup, conn=Depends(db_connect)):
    cur = None
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Verifying the code
        query = """SELECT "O_id" from "Organization" WHERE "Code" = %s"""
        cur.execute(query, (user.code,))
        result = cur.fetchone()
        if result:
            o_id = result["O_id"]
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Registration failed: Invalid or unrecognized organization invitation code.",
            )

        # check the user exists
        query = """SELECT "Name" FROM "User" WHERE "Email" = %s"""
        cur.execute(query, (user.email,))
        result = cur.fetchone()
        if result:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail=f"The user already exists."
            )

        tupl = (o_id, user.email, user.phone_number, hash_password(user.password), user.name)
        query = """INSERT INTO "User" ("O_id", "Email", "Phone_Number", "Password", "Name") 
            VALUES (%s, %s, %s, %s, %s);"""
        cur.execute(query, tupl)
        conn.commit()
        return {"message": "User registered successfully."}
    except HTTPException as httpErr:
        raise httpErr
    except Exception as err:
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Some Error Occurred" + str(err),
        )
    finally:
        if cur:
            cur.close()


@db_endpoints.post("/admin_login", status_code=status.HTTP_200_OK)
def admin_login(admin: Login, conn=Depends(db_connect)):
    cur = None
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # retrieving the password
        query = """SELECT "O_id", "Password" FROM "Organization" WHERE "Email" = %s"""
        cur.execute(query, (admin.email,))
        result = cur.fetchone()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="The Entered credentials are invalid.",
            )

        stored_hash = result["Password"]
        if verify_password(admin.password, stored_hash):
            o_id = result["O_id"]
            payload = {"o_id": o_id}
            token = create_jwt(payload)
            return {"access_token": token, "token_type": "bearer"}
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="The Entered credentials are invalid.",
            )
    except HTTPException as httpErr:
        raise httpErr
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Some Error Occurred" + str(err),
        )
    finally:
        if cur:
            cur.close()


@db_endpoints.post("/user_login", status_code=status.HTTP_200_OK)
def user_login(user: Login, conn=Depends(db_connect)):
    cur = None
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # checking if the user exists
        query = """SELECT "U_id", "Password" FROM "User" WHERE "Email" = %s"""
        cur.execute(query, (user.email,))
        result = cur.fetchone()
        if result:
            stored_password = result["Password"]
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="The Entered Credentials are invalid.",
            )

        if verify_password(user.password, stored_password):
            u_id = result["U_id"]
            payload = {"u_id": u_id}
            token = create_jwt(payload)
            return {"access_token": token, "token_type": "bearer"}
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="The Entered Credentials are invalid.",
            )
    except HTTPException as httpErr:
        raise httpErr
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Some Error Occurred" + str(err),
        )
    finally:
        if cur:
            cur.close()
