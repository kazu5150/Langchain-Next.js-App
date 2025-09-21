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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 画像をBase64に変換する関数
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // data:image/jpeg;base64, の部分を除去してBase64のみを取得
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // 画像解析の関数
  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setLogs((prev) => [...prev, {
      role: "user",
      content: `画像を解析中: ${selectedImage.name}`
    }]);

    try {
      const base64Image = await convertToBase64(selectedImage);

      const body = {
        image: base64Image,
        prompt: input.trim() || "この画像の内容を詳しく分析してください。"
      };

      const res = await fetch(`${API_BASE}/analyze-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setLogs((prev) => [...prev, {
        role: "assistant",
        content: data.analysis || data.error
      }]);

      // 画像をクリア
      setSelectedImage(null);
      setImagePreview(null);
      setInput("");

    } catch (e: any) {
      setLogs((prev) => [
        ...prev,
        { role: "assistant", content: `画像解析エラー: ${e?.message ?? e}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    // 画像が選択されている場合は画像解析を実行
    if (selectedImage) {
      await analyzeImage();
      return;
    }

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

  // 画像選択時の処理
  const handleImageSelect = (file: File) => {
    setSelectedImage(file);

    // プレビュー用のURLを作成
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ファイルドロップ時の処理
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleImageSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>LangChain × Next.js AI Chat</h1>
      <p style={{ color: "#555", marginBottom: 16 }}>
        テキストチャットと画像解析に対応したAIアシスタントです。画像をアップロードして分析することもできます。
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

      {/* 画像アップロード＆プレビューエリア */}
      {selectedImage && (
        <div style={{
          border: "2px solid #22c55e",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          background: "#f0fdf4"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Selected"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb"
                }}
              />
            )}
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600, color: "#16a34a" }}>
                画像選択済み: {selectedImage.name}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#666" }}>
                「送信」ボタンを押すと画像解析が開始されます
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              削除
            </button>
          </div>
        </div>
      )}

      {/* ドラッグ&ドロップエリア */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #d1d5db",
          borderRadius: 12,
          padding: 20,
          textAlign: "center",
          marginBottom: 16,
          background: "#f9fafb",
          cursor: "pointer"
        }}
        onClick={() => document.getElementById('imageInput')?.click()}
      >
        <p style={{ margin: 0, color: "#6b7280" }}>
          📸 画像をここにドラッグ&ドロップ、またはクリックして選択
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>
          JPG、PNG、GIF対応
        </p>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageSelect(file);
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder={selectedImage ? "画像解析の指示を入力（省略可）" : "メッセージを入力して Enter で送信"}
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
          disabled={loading || (!selectedImage && input.trim().length === 0)}
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
          {selectedImage ? "画像解析" : "送信"}
        </button>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
        API: <code>{API_BASE}/chat</code>
      </div>
    </main>
  );
}
