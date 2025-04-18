from google import genai


def getResponse(usedIngredients, unusedIngredients, recipes) -> str:

    client = genai.Client(api_key="GOOGLE_API_KEY")

    prompt = "Geniere, basierend auf den beigefügten Rezepten, ein Rezept, das "
    for x in usedIngredients:
        prompt += x + ", "
    prompt += "beinhaltet, und "
    for x in unusedIngredients:
        prompt += x + ", "
    prompt += "nicht beinhaltet"

    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=[prompt, recipes]
    )

    return response.text

