from fastapi import APIRouter, status, Depends, HTTPException
from ..db_operations.db_connect import db_connect
from psycopg2.extras import RealDictCursor
from ..auth.jwt import get_u_id
import os
from dotenv import load_dotenv
