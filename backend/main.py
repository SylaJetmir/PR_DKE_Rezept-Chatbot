from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware              # ← neu
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import httpx
from google import genai
import json
from typing import List, Optional                                # ← neu

load_dotenv()

SPOONACULAR_API_URL = "https://api.spoonacular.com/recipes/findByIngredients"
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI()

# === CORS-Middleware aktivieren für Angular unter localhost:4200 ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Port Angular-Dev-Servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==================================================================

# Request-Model passt jetzt zu Angular: Liste von Zutaten + optionale Präferenzen
class PromptRequest(BaseModel):
    ingredients: List[str]                # z.B. ["eggs", "bacon", "cheese"]
    preferences: Optional[str] = ""       # z.B. "vegetarisch"

# AI-Logik: nun inklusive Präferenzen
def generate_response(recipes, ingredients: str, preferences: str):
    client = genai.Client(api_key=GEMINI_API_KEY)
    prompt = (
        f"Geniere, basierend auf den beigefügten Rezepten, ein neues Rezept, "
        f"das die Zutaten {ingredients} beinhaltet"
        + (f" und den Präferenzen '{preferences}' entspricht." if preferences else ".")
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt, json.dumps(recipes)]
    )

    return response.text

# Main-Endpoint
@app.post("/retrieve")
async def retrieve(request: PromptRequest):
    # Zutaten-Liste zu CSV-String zusammenfassen
    ingredients_str = ",".join(request.ingredients)

    # Spoonacular-Call
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                SPOONACULAR_API_URL,
                params={
                    "ingredients": ingredients_str,
                    "number": 5,
                    "apiKey": SPOONACULAR_API_KEY
                }
            )
            resp.raise_for_status()
            recipes = resp.json()
        except Exception as e:
            print("❌ Spoonacular error:", e)
            return {"error": "Failed to fetch recipes"}

    if not isinstance(recipes, list):
        return {"error": "Unexpected response format from Spoonacular"}

    # AI-Response erzeugen
    ai_response = generate_response(recipes, ingredients_str, request.preferences)
    return {"result": ai_response}

# Für lokalen Test mit uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
