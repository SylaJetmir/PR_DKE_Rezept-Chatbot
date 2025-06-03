from pydantic import BaseModel

# Request models

class PromptRequest(BaseModel):
    ingredients: str
    preferences: str

class ConversationRequest(BaseModel):
    prompt: str