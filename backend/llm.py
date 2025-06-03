from google import genai
import os
from dotenv import load_dotenv
import json

load_dotenv()


class LLM:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    genaiClient = genai.Client(api_key=GEMINI_API_KEY)
    chat = genaiClient.chats.create(model="gemini-2.0-flash")
    user_ingredients = ""
    user_preferences = ""
    
    def generate_response(self, recipes, ingredients:str, preferences:str):
        LLM.genaiClient = genai.Client(api_key=LLM.GEMINI_API_KEY)
        LLM.chat = LLM.genaiClient.chats.create(
            model="gemini-2.0-flash",   
        )

        LLM.user_ingredients = ingredients
        LLM.user_preferences = preferences
        print(LLM.user_ingredients)
    
        prompt =    """Geniere, basierend auf den beigefügten Rezepten, ein Rezept, das """ + ingredients + """ beinhaltet. " +
                Weiters sollen folgende Präferenzen beachtet werden: """ + preferences +  """. 
                Bitte gib im ersten Satz auch die Namen der Rezepte an, auf denen das generierte Rezept basiert."""

        response = LLM.genaiClient.models.generate_content(
            model="gemini-2.0-flash", contents=[prompt, json.dumps(recipes)]
        )
        LLM.chat.send_message(prompt)
        LLM.chat.send_message(response.text)

        return response.text
    
    def continueConversation(self, request: str):
     #weiterführen der konversation
     print(LLM.user_ingredients)
     print(LLM.self.user_preferences)

     print(LLM.chat.get_history)
     response = LLM.chat.send_message(request.prompt + """. 
     Bitte erstelle ein neues Rezept. 
     Beachte außerdem die Präferenzen: """ + LLM.user_preferences + """ und angegebenen Zutaten: """ + LLM.user_ingredients + """ des Users."""
     )

     return response.text
