from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import httpx
from DTOs import ConversationRequest, PromptRequest
from llm import LLM

load_dotenv()

SPOONACULAR_API_URL = "https://api.spoonacular.com/recipes/findByIngredients"
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
llm = LLM()

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

    ai_response = llm.generate_response(recipes, request.ingredients, request.preferences)
    return ai_response


@app.post("/continueConversation")
async def continueConversation(request: ConversationRequest):
    #weiterführen der konversation
    response = llm.continueConversation(request.prompt)

    return response


# 🚀 For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
