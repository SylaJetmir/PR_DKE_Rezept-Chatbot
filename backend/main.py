from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import httpx
from google import genai
import json

load_dotenv()

SPOONACULAR_API_URL = "https://api.spoonacular.com/recipes/findByIngredients"
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genaiClient = genai.Client(api_key=GEMINI_API_KEY)
chat = genaiClient.chats.create(model="gemini-2.0-flash")

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class PromptRequest(BaseModel):
    ingredients: str
    preferences: str

class ConversationRequest(BaseModel):
    prompt: str

# 🧠 AI logic
def generate_response(recipes, ingredients:str, preferences:str):
    genaiClient = genai.Client(api_key=GEMINI_API_KEY)
    chat = genaiClient.chats.create(
        model="gemini-2.0-flash",   
    )
    
    prompt = "Geniere, basierend auf den beigefügten Rezepten, ein Rezept, das " + ingredients + " beinhaltet. Weiters sollen folgende Präferenzen beachtet werden: " + preferences + ". Bitte gib im ersten Satz auch die Namen der Rezepte an, auf denen das generierte Rezept basiert"

    response = genaiClient.models.generate_content(
        model="gemini-2.0-flash", contents=[prompt, json.dumps(recipes)]
    )
    chat.send_message(prompt)

    return response.text

# 🔁 Main endpoint
@app.post("/retrieve")
async def retrieve(request: PromptRequest):
    print("/retrieve")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                SPOONACULAR_API_URL,
                params={
                    "ingredients": request.ingredients,
                    "number": 5,
                    "apiKey": SPOONACULAR_API_KEY
                }
            )
            response.raise_for_status()  # Will raise error if status != 200
            recipes = response.json()
        except Exception as e:
            print("❌ Spoonacular error:", e)
            print("❌ Response text:", response.text)
            return {"error": "Failed to fetch recipes"}

    # Ensure it received a list of recipes
    if not isinstance(recipes, list):
        return {"error": "Unexpected response format from Spoonacular"}

    ai_response = generate_response(recipes, request.ingredients, request.preferences)
    return ai_response

# 🚀 For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

@app.post("/continueConversation")
async def continueConversation(request: ConversationRequest):
    #weiterführen der konversation
    response = chat.send_message(request.prompt + "Bitte erstelle ein neues Rezept, basierend auf deinem Vorherigen.")

    return response.text
