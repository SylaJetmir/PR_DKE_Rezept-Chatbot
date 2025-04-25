from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import httpx

# ⏬ Load .env variables
load_dotenv()

SPOONACULAR_API_URL = "https://api.spoonacular.com/recipes/findByIngredients"
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")

app = FastAPI()

# ✅ Request model
class PromptRequest(BaseModel):
    ingredients: str  # Example: "eggs, bacon, cheese"

# 🧠 Placeholder for AI logic — teammate will plug into this
def generate_response(recipes):
    return "AI-generated text based on recipes: " + ", ".join(
        recipe["title"] for recipe in recipes
    )

# 🔁 Main endpoint
@app.post("/retrieve")
async def retrieve(request: PromptRequest):
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

    # Ensure we received a list of recipes
    if not isinstance(recipes, list):
        return {"error": "Unexpected response format from Spoonacular"}

    ai_response = generate_response(recipes)
    return {"result": ai_response}

# 🚀 For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
