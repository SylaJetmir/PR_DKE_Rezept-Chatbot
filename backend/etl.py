import os
import openai
import psycopg2
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

texts = [
    "Tomatoes are rich in vitamin C and great in pasta.",
    "You can boil or scramble eggs for breakfast.",
    "Bananas are high in potassium and very sweet."
]

def get_embedding(text):
    response = openai.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding

conn = psycopg2.connect(
    dbname="ragdb",
    user="postgres",
    password="admin",
    host="localhost",
    port="5432"
)
cur = conn.cursor()

for text in texts:
    embedding = get_embedding(text)
    cur.execute(
        "INSERT INTO documents (content, embedding) VALUES (%s, %s)",
        (text, embedding)
    )

conn.commit()
cur.close()
conn.close()

print("ETL completed and embeddings saved.")
