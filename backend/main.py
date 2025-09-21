from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# LangChain
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

app = FastAPI(title="LangChain FastAPI Chat", version="1.0.0")

# CORS（開発中は * でOK。公開時はフロントのドメインに限定してください）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ←ここを正しく
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_message: str

class ChatResponse(BaseModel):
    reply: str

# --- LangChain 基本セットアップ ---
# 簡単な「役割付け」をして、毎回安定した口調と出力を得るためのSystemプロンプト
SYSTEM_PROMPT = """あなたは親切で実用的なAIメンターです。
・箇条書きで簡潔に。
・必要なら短いコード例も。
・嘘はつかない。わからない時は正直に言う。"""

# ここでは温度低めで安定した回答に
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# ChatPromptTemplateのサンプル（拡張しやすい形）
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        ("human", "{question}")
    ]
)

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    # LangChainでメッセージを作って呼び出し
    chain = prompt | llm
    result = chain.invoke({"question": req.user_message})
    return ChatResponse(reply=result.content)
