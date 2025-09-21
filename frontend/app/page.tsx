"use client";

import { useState } from "react";
import type { ChatRequest, ChatResponse } from "./api.d";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || (
  typeof window !== 'undefined' && window.location.origin
    ? `${window.location.origin}/api`
    : "http://localhost:8000"
);

export default function Home() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg) return;

    setLogs((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setLoading(true);

    try {
      const body: ChatRequest = { user_message: msg };
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: ChatResponse = await res.json();
      setLogs((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setLogs((prev) => [
        ...prev,
        { role: "assistant", content: `エラーが発生しました: ${e?.message ?? e}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>LangChain × Next.js ミニチャット</h1>
      <p style={{ color: "#555", marginBottom: 16 }}>
        バックエンド（FastAPI + LangChain）に投げて、返答を表示する最小アプリです。
      </p>

      <div style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        minHeight: 280,
        background: "#fafafa",
        marginBottom: 16,
        overflowY: "auto"
      }}>
        {logs.length === 0 && (
          <p style={{ color: "#777" }}>ここに会話が表示されます。右下のボックスからメッセージを送ってください。</p>
        )}
        {logs.map((m, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
              {m.role === "user" ? "あなた" : "アシスタント"}
            </div>
            <div style={{
              whiteSpace: "pre-wrap",
              background: m.role === "user" ? "white" : "#eef2ff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 12
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: "#666" }}>送信中...</div>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="メッセージを入力して Enter で送信"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          style={{
            flex: 1,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "10px 12px",
            outline: "none"
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || input.trim().length === 0}
          style={{
            border: "1px solid #6366f1",
            background: "#6366f1",
            color: "white",
            borderRadius: 8,
            padding: "10px 16px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          送信
        </button>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
        API: <code>{API_BASE}/chat</code>
      </div>
    </main>
  );
}
