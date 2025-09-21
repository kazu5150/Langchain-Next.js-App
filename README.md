# LangChain × Next.js チャットデモ

OpenAI GPTとLangChainを使用したリアルタイムチャットアプリケーションです。フロントエンドにNext.js、バックエンドにFastAPIを使用したフルスタック構成になっています。

## 🚀 機能

- リアルタイムチャット機能
- LangChainによるAI応答生成
- TypeScript対応
- レスポンシブデザイン
- 日本語対応

## 🛠 技術スタック

### フロントエンド
- **Next.js 14** - Reactフレームワーク
- **TypeScript** - 型安全性
- **React 18** - ユーザーインターフェース

### バックエンド
- **FastAPI** - Python Webフレームワーク
- **LangChain** - AI/LLMオーケストレーション
- **OpenAI API** - GPT-4o-mini
- **Uvicorn** - ASGIサーバー

## 📁 プロジェクト構成

```
langchain-next-demo/
├── frontend/           # Next.js アプリケーション
│   ├── app/
│   │   ├── page.tsx   # メインチャットページ
│   │   ├── layout.tsx # レイアウトコンポーネント
│   │   └── api.d.ts   # 型定義
│   ├── package.json
│   └── tsconfig.json
├── backend/            # FastAPI サーバー
│   ├── main.py        # メインAPIサーバー
│   └── requirements.txt
├── CLAUDE.md          # Claude Code用ガイド
└── README.md
```

## 🔧 セットアップ

### 必要な環境
- Node.js 18以上
- Python 3.8以上
- OpenAI APIキー

### 1. リポジトリのクローン
```bash
git clone <リポジトリURL>
cd langchain-next-demo
```

### 2. バックエンドの設定

```bash
cd backend

# 仮想環境の作成と有効化
python -m venv myenv

# macOS/Linux
source myenv/bin/activate

# Windows
myenv\Scripts\activate

# 依存関係のインストール
pip install -r requirements.txt
```

### 3. 環境変数の設定

`backend/.env` ファイルを作成：
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. フロントエンドの設定

```bash
cd frontend

# 依存関係のインストール
npm install
```

（オプション）`frontend/.env.local` ファイルを作成：
```bash
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## 🚀 起動方法

### バックエンドサーバーの起動
```bash
cd backend
source myenv/bin/activate  # 仮想環境の有効化
python main.py
```
→ http://localhost:8000 でAPIサーバーが起動

### フロントエンドの起動
```bash
cd frontend
npm run dev
```
→ http://localhost:3000 でアプリケーションが起動

## 📖 使用方法

1. ブラウザで http://localhost:3000 にアクセス
2. テキストボックスにメッセージを入力
3. 「送信」ボタンをクリックまたはEnterキーを押す
4. AIからの応答が表示されます

## 🔄 開発コマンド

### フロントエンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
```

### バックエンド
```bash
python main.py   # FastAPIサーバー起動
```

## 🌐 API仕様

### POST /chat
チャットメッセージを送信してAI応答を取得

**リクエスト:**
```json
{
  "user_message": "こんにちは"
}
```

**レスポンス:**
```json
{
  "reply": "こんにちは！何かお手伝いできることはありますか？"
}
```

### GET /health
サーバーのヘルスチェック

**レスポンス:**
```json
{
  "ok": true
}
```

## 🔒 セキュリティ

- 環境変数ファイル（`.env`, `.env.local`）は`.gitignore`で除外済み
- CORS設定により localhost:3000 からのアクセスのみ許可
- OpenAI APIキーはサーバーサイドでのみ使用

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🐛 トラブルシューティング

### よくある問題

**1. OpenAI APIキーエラー**
- `backend/.env`ファイルにOPENAI_API_KEYが正しく設定されているか確認
- APIキーの有効性を確認

**2. CORS エラー**
- フロントエンドが http://localhost:3000 で起動しているか確認
- バックエンドのCORS設定を確認

**3. モジュールが見つからないエラー**
- 仮想環境が有効化されているか確認
- `pip install -r requirements.txt`を再実行

**4. ポートエラー**
- 他のアプリケーションがポート3000/8000を使用していないか確認
- 必要に応じてポート番号を変更