from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import smtplib
import ssl
import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


class DemoRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: str = Field(..., min_length=1)
    email: EmailStr
    phone: str = Field(..., min_length=1)
    restaurant: str = Field(..., min_length=1)
    country: str = Field(..., min_length=1)


def _build_demo_email(data: DemoRequest, submitted_at: str):
    subject = f"New Demo Request - {data.restaurant}"

    text_body = (
        "New Demo Request\n\n"
        f"Full Name: {data.name}\n"
        f"Email Address: {data.email}\n"
        f"Phone Number: {data.phone}\n"
        f"Restaurant / Website: {data.restaurant}\n"
        f"Country / Location: {data.country}\n"
        f"Submission Time: {submitted_at}\n"
    )

    html_body = f"""\
<html>
  <body style="margin:0;padding:24px;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#273033;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6e0d5;">
      <div style="background:#c9572d;padding:20px 26px;">
        <h1 style="margin:0;font-size:18px;color:#ffffff;letter-spacing:.02em;">New Demo Request</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;padding:0;" cellpadding="0" cellspacing="0">
        <tbody>
          {_row('Full Name', data.name)}
          {_row('Email Address', data.email)}
          {_row('Phone Number', data.phone)}
          {_row('Restaurant / Website', data.restaurant)}
          {_row('Country / Location', data.country)}
          {_row('Submission Time', submitted_at)}
        </tbody>
      </table>
    </div>
  </body>
</html>"""
    return subject, text_body, html_body


def _row(label: str, value: str) -> str:
    return (
        '<tr>'
        '<td style="padding:12px 26px;font-size:11px;font-weight:bold;text-transform:uppercase;'
        'letter-spacing:.06em;color:#8a8f8a;border-bottom:1px solid #eee7db;width:42%;vertical-align:top;">'
        f'{label}</td>'
        '<td style="padding:12px 26px;font-size:14px;color:#273033;border-bottom:1px solid #eee7db;">'
        f'{value}</td>'
        '</tr>'
    )


def _send_demo_email_sync(data: DemoRequest, submitted_at: str) -> None:
    host = os.environ.get('SES_SMTP_HOST')
    port = int(os.environ.get('SES_SMTP_PORT', '587'))
    username = os.environ.get('SES_SMTP_USERNAME')
    password = os.environ.get('SES_SMTP_PASSWORD')
    from_email = os.environ.get('DEMO_FROM_EMAIL')
    to_email = os.environ.get('DEMO_TO_EMAIL', 'info@serv-ai.com')

    if not all([host, username, password, from_email, to_email]):
        raise RuntimeError("SES SMTP configuration is incomplete. Please set SES_SMTP_* and DEMO_*_EMAIL env vars.")

    subject, text_body, html_body = _build_demo_email(data, submitted_at)

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = formataddr(('ServAI Demo Requests', from_email))
    msg['To'] = to_email
    msg['Reply-To'] = str(data.email)
    msg.attach(MIMEText(text_body, 'plain', 'utf-8'))
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    context = ssl.create_default_context()
    if port == 465:
        with smtplib.SMTP_SSL(host, port, context=context, timeout=20) as server:
            server.login(username, password)
            server.sendmail(from_email, [to_email], msg.as_string())
    else:
        with smtplib.SMTP(host, port, timeout=20) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(username, password)
            server.sendmail(from_email, [to_email], msg.as_string())


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


@api_router.post("/demo-request")
async def create_demo_request(payload: DemoRequest):
    submitted_dt = datetime.now(timezone.utc)
    submitted_at = submitted_dt.strftime("%d %b %Y, %H:%M UTC")

    # Persist the submission (best-effort)
    doc = payload.model_dump()
    doc['email'] = str(doc['email'])
    doc['id'] = str(uuid.uuid4())
    doc['submitted_at'] = submitted_dt.isoformat()
    try:
        await db.demo_requests.insert_one({**doc})
    except Exception as e:  # noqa: BLE001
        logger.error(f"Failed to store demo request: {e}")

    # Send the notification email via AWS SES SMTP (run blocking IO in a thread)
    try:
        await asyncio.to_thread(_send_demo_email_sync, payload, submitted_at)
    except Exception as e:  # noqa: BLE001
        logger.error(f"Failed to send demo request email: {e}")
        raise HTTPException(
            status_code=503,
            detail="Something went wrong. Please try again or email us directly at info@serv-ai.com.",
        )

    return {"status": "success", "message": "Demo request received."}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()