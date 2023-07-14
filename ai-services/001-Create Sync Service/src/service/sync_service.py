from asyncio.log import logger
import logging
import os
import sys
from io import BytesIO

from fastapi import FastAPI, Response, BackgroundTasks, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware


logging.basicConfig(stream=sys.stdout, level=logging.ERROR)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

bearer_scheme = HTTPBearer()
BEARER_TOKEN = os.environ.get("BEARER_TOKEN")
assert BEARER_TOKEN is not None

def validate_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    if credentials.scheme != "Bearer" or credentials.credentials != BEARER_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
    return credentials

app = FastAPI( title="Awesome AI service",
    summary="Brief summary of your service here",
    description="Full description of your awesome AI model here",
    version="1.0.0",
    dependencies=[Depends(validate_token)]
)
   
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Replace * with your frontend's actual origin(s)
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return "Hello World!"

@app.get("/ai_service")
def ai_service(param1, param2):
    logger.debug("Processing AI service with params: " + param1 + ',' + param2)

    # calling the AI function. It returns a string with the result
    # place your function here
    result = awesome_ai_service.execute(param1, param2)

    return {"result": result}
   

@app.get("/ai_service_binary")
def ai_service_binary(param1, param2, background_tasks: BackgroundTasks):
    logger.debug("Processing AI service with params: " + param1 + ',' + param2)

    # calling the AI function. It returns a path where a result pdf file was generated
    # place your function here
    result_path = awesome_ai_service.execute(param1, param2)
   
    with open(result_path, "rb") as file:
        bytes_stream = BytesIO(file.read())

    # close the byte stream using a background task, after its been used for the response 
    background_tasks.add_task(bytes_stream.close)
   
    # returns the content of a pdf
    headers = {'Content-Disposition': 'inline; filename="result.pdf"'}
    return Response(bytes_stream.getvalue(), headers=headers, media_type='application/pdf')
