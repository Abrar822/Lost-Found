import psycopg2
from dotenv import load_dotenv
import os

load_dotenv('./backend/.env')
print("DB HOST:", os.getenv("HOST"))
print("DB USER:", repr(os.getenv("DB_USER")))
print("DB PORT:", os.getenv("DB_PORT"))
print("DB NAME:", os.getenv("DATABASE"))
print("PASSWORD SET:", bool(os.getenv("PASSWORD")))

def db_connect():
    conn = None
    try:
        conn = psycopg2.connect(dbname=os.getenv('DATABASE'), host=os.getenv('HOST'), user=os.getenv('DB_USER'), port=int(os.getenv('DB_PORT')), password=os.getenv('PASSWORD'))
        yield conn
    except psycopg2.OperationalError as err:
        raise RuntimeError(f'Failed to connect to database.' + str(err))
    finally:
        if conn: conn.close()

def get_connection_obj():
    return psycopg2.connect(dbname=os.getenv('DATABASE'), host=os.getenv('HOST'), user=os.getenv('DB_USER'), port=int(os.getenv('DB_PORT')), password=os.getenv('PASSWORD'))