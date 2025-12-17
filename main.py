import json
from fastapi import FastAPI, Request, Form, status, Depends, WebSocket
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseModel, EmailStr
from starlette.middleware.sessions import SessionMiddleware
import os
from dotenv import load_dotenv
import asyncio
import random

# Load secrets :3
load_dotenv()

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.urandom(24))

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


# Language configs
def load_translations(lang):
    with open(f"languages/{lang}.json", encoding="utf-8") as f:
        return json.load(f)

# Gets the preferred language
def get_preferred_language(request: Request, supported=("en", "de"), default="en"):
    accept_language = request.headers.get("accept-language", "")
    for lang in accept_language.split(","):
        code = lang.split(";")[0].strip().lower()
        if code in supported:
            return code
        if "-" in code and code.split("-")[0] in supported:
            return code.split("-")[0]
    return default

# Mail config
conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv('MAIL_USERNAME'),
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD'),
    MAIL_FROM = os.getenv('MAIL_FROM'),
    MAIL_PORT = os.getenv('MAIL_PORT'),
    MAIL_SERVER = os.getenv('MAIL_SERVER'),
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

class ContactForm(BaseModel):
    email: EmailStr
    message: str

@app.get("/")
async def index(request: Request, msg: str = None):
    # Translation support
    lang = get_preferred_language(request)
    translations = load_translations(lang)
    return templates.TemplateResponse("index.html", {"request": request, "msg": msg, "t": translations})

@app.get("/legal/")
async def dsgvo(request: Request):
    # Translation support
    lang = get_preferred_language(request)
    translations = load_translations(lang)
    return templates.TemplateResponse("legal.html", {"request": request, "t": translations})

@app.post("/")
async def submit_form(request: Request, email: str = Form(...), message: str = Form(...)):    
    # Save to file
    with open("messages.txt", "a") as f:
        f.write(f"Email: {email}\nMessage: {message}\n\n")

    # Send email
    fm = FastMail(conf)
    msg = MessageSchema(
        subject=f"New Contact Form Submission from {email}",
        recipients=["davidernst0902@gmail.com", "davidernst0902@web.de"],
        body=f"{message} \n\n\n This message was from davidwesch.de from the mail \n {email}",
        subtype="plain",
        sender=email
    )
    await fm.send_message(msg)

    # Redirect with message
    url = app.url_path_for("index") + "?msg=Message+sent+successfully!"
    return RedirectResponse(url=url, status_code=status.HTTP_303_SEE_OTHER)

@app.get("/ip")
async def get_ip(request: Request):
    client_ip = request.client.host
    print(client_ip)
    return {"status": "success", "ip": client_ip}

@app.get("/tiktok/random")
async def get_ip(request: Request):
    with open("static/src/data/tiktokDecember2025.json", 'r', encoding='utf-8') as file:
        json_text = file.read()
        json_data = json.loads(json_text)

        return {"status": "sucess", "url": random.choice(json_data)}


@app.websocket("/ws/bitcoin")
async def websocket_bitcoin(websocket: WebSocket):
    await websocket.accept()
    try:
        
        while True:
            await websocket.send_text(f"BTC: {random.random()* 60000}")
            await asyncio.sleep(1)
    except:
        print("Something went wrong with the websocket!!")
            


@app.get("/download-cv")
async def download_cv(request: Request):
    lang = get_preferred_language(request, supported=("en", "de"), default="en")
    file_path = f"static/files/cv/cv_{lang}.pdf"
    if lang == "de":
        download_name = "Lebenslauf David Wesch.pdf"
    else:
        download_name = "CV from David Wesch.pdf"
    return FileResponse(file_path, media_type="application/pdf", filename=download_name)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=9600, reload=True) # Testing
