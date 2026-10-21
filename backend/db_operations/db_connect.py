import psycopg2
from dotenv import load_dotenv
import os

load_dotenv('./backend/.env')

def db_connect():
    conn = None
    try:
        conn = psycopg2.connect(dbname=os.getenv('DATABASE'), host=os.getenv('HOST'), user=os.getenv('USER'), port=int(os.getenv('PORT')), password=os.getenv('PASSWORD'))
        yield conn
    except psycopg2.OperationalError as err:
        raise RuntimeError(f'Failed to connect to database.' + str(err))
    finally:
        if conn: conn.close()

def get_connection_obj():
    return psycopg2.connect(dbname=os.getenv('DATABASE'), host=os.getenv('HOST'), user=os.getenv('USER'), port=int(os.getenv('PORT')), password=os.getenv('PASSWORD'))