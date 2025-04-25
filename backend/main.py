from fastapi import FastAPI
from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from models import Document
from pydantic import BaseModel
import openai
import os

# Load environment variables
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

# Database setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

# FastAPI app
app = FastAPI()

# Pydantic model for the input
class PromptRequest(BaseModel):
    prompt: str

# Get OpenAI embedding
def get_embedding(text):
    response = openai.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding

# Endpoint
@app.post("/retrieve")
async def retrieve(request: PromptRequest):
    query = request.prompt
    user_embedding = get_embedding(query)

    stmt = (
        select(Document)
        .order_by(Document.embedding.l2_distance(user_embedding))
        .limit(5)
    )
    results = session.execute(stmt).scalars().all()

    return {
        "results": [
            {"content": doc.content}
            for doc in results
        ]
    }

# Entry point
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
