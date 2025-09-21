# LangChain × Next.js AI Chat & Image Analysis

OpenAI GPT とLangChainを使用したAIチャットアプリケーションです。テキストチャットに加えて、OpenAI Vision APIを活用した画像解析機能も搭載しています。Next.jsフロントエンドとVercel Functionsを使用したサーバーレス構成になっています。

## 🌐 ライブデモ

**公開URL**: https://langchain-next-js-app.vercel.app

## 🚀 機能

### 💬 テキストチャット
- リアルタイムチャット機能
- LangChainによるAI応答生成
- 日本語対応

### 🖼️ 画像解析（NEW!）
- **ドラッグ&ドロップ**: 画像を直接ドラッグして簡単アップロード
- **OpenAI Vision API**: GPT-4o-miniによる高精度画像解析
- **構造化出力**: 画像の内容を体系的に分析
- **カスタムプロンプト**: 解析内容をユーザーが指定可能
- **対応形式**: JPG、PNG、GIF

### 🛠️ 技術仕様
- TypeScript対応
- レスポンシブデザイン
- サーバーレス環境での動作
- Base64画像エンコーディング

## 🛠 技術スタック

### フロントエンド
- **Next.js 14** - Reactフレームワーク
- **TypeScript** - 型安全性
- **React 18** - ユーザーインターフェース

### バックエンド
- **Vercel Functions** - サーバーレス関数
- **LangChain** - AI/LLMオーケストレーション
- **OpenAI API** - GPT-4o-mini（テキスト + Vision）
- **Python** - API関数の実装
- **Base64エンコーディング** - 画像データ処理

### インフラ
- **Vercel** - ホスティング・デプロイメント
- **GitHub** - ソースコード管理

## 📁 プロジェクト構成

```
langchain-next-demo/
├── frontend/           # Next.js アプリケーション
│   ├── app/
│   │   ├── page.tsx   # メインチャット＋画像解析ページ
│   │   ├── layout.tsx # レイアウトコンポーネント
│   │   └── api.d.ts   # 型定義
│   ├── api/           # Vercel Functions
│   │   ├── chat.py         # テキストチャットAPI
│   │   ├── analyze-image.py # 画像解析API（NEW!）
│   │   ├── health.py       # ヘルスチェックAPI
│   │   └── requirements.txt
│   ├── package.json
│   └── tsconfig.json
├── backend/            # ローカル開発用 FastAPI
│   ├── main.py        # ローカル開発サーバー
│   └── requirements.txt
├── CLAUDE.md          # Claude Code用ガイド
├── vercel.json        # Vercel設定
└── README.md
```

## 🚀 Vercelでのデプロイ

### 1. GitHubリポジトリの準備

```bash
git clone https://github.com/kazu5150/Langchain-Next.js-App.git
cd Langchain-Next.js-App
```

### 2. Vercelでのデプロイ

1. [Vercel](https://vercel.com) にサインアップ
2. GitHubアカウントと連携
3. 「New Project」からリポジトリを選択
4. 以下の設定を確認：

```
Root Directory: frontend
Framework Preset: Next.js
Build Command: npm run build (デフォルト)
Output Directory: .next (デフォルト)
Install Command: npm install (デフォルト)
```

### 3. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

```
OPENAI_API_KEY = your_openai_api_key_here
```

### 4. デプロイ完了

設定後、自動的にデプロイが開始され、数分で公開されます。

## 🔧 ローカル開発

### 必要な環境
- Node.js 18以上
- Python 3.8以上
- OpenAI APIキー

### 1. 依存関係のインストール

```bash
# フロントエンド
cd frontend
npm install

# バックエンド（ローカル開発用）
cd ../backend
python -m venv myenv
source myenv/bin/activate  # Windows: myenv\Scripts\activate
pip install -r requirements.txt
```

### 2. 環境変数の設定

`backend/.env` ファイルを作成：
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. ローカル起動

```bash
# バックエンド
cd backend
source myenv/bin/activate
python main.py
# → http://localhost:8000

# フロントエンド（別ターミナル）
cd frontend
npm run dev
# → http://localhost:3000
```

## 🌐 API エンドポイント

### GET /api/health
ヘルスチェック用エンドポイント

**レスポンス:**
```json
{
  "ok": true
}
```

### POST /api/chat
テキストチャット機能のエンドポイント

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

### POST /api/analyze-image（NEW!）
画像解析機能のエンドポイント

**リクエスト:**
```json
{
  "image": "base64_encoded_image_data",
  "prompt": "この画像の内容を詳しく分析してください。"
}
```

**レスポンス:**
```json
{
  "analysis": "構造化された画像解析結果...",
  "status": "success"
}
```

**解析結果の構造:**
- 画像の概要
- 主要な要素・オブジェクト
- 色彩・構成
- 注目すべき詳細
- 推測される文脈・用途

## 🔄 開発コマンド

### フロントエンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
```

### バックエンド（ローカル開発）
```bash
python main.py   # FastAPIサーバー起動
```

## 🔒 セキュリティ

- 環境変数ファイル（`.env`, `.env.local`）は`.gitignore`で除外済み
- CORS設定によりVercelドメインからのアクセスのみ許可
- OpenAI APIキーはサーバーサイドでのみ使用
- Vercel Functions内で安全に環境変数を管理

## 🏗 アーキテクチャ

```mermaid
graph TD
    A[ユーザー] --> B[Next.js Frontend]
    B --> C{入力タイプ}
    C -->|テキスト| D[/api/chat]
    C -->|画像| E[/api/analyze-image]
    D --> F[LangChain + GPT-4o-mini]
    E --> G[OpenAI Vision API]
    F --> H[テキスト応答]
    G --> I[画像解析結果]
    H --> B
    I --> B
    B --> A
```

### 🔄 データフロー

1. **テキストチャット**: ユーザー入力 → `/api/chat` → LangChain → OpenAI GPT-4o-mini → 応答
2. **画像解析**: 画像アップロード → Base64エンコード → `/api/analyze-image` → OpenAI Vision → 構造化解析結果

## 📊 パフォーマンス

- **Vercel Edge Network**: 世界中での高速配信
- **サーバーレス**: 自動スケーリング
- **Next.js**: 最適化されたReact体験
- **コールドスタート**: 最小限の遅延

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🐛 トラブルシューティング

### Vercelデプロイメント

**1. ビルドエラー**
- Root Directory が `frontend` に設定されているか確認
- 環境変数 `OPENAI_API_KEY` が正しく設定されているか確認

**2. API 404エラー**
- `/frontend/api/` ディレクトリにAPI関数が存在するか確認
- Vercel Functions タブでデプロイされた関数を確認

**3. OpenAI APIエラー**
- APIキーの有効性を確認
- 使用量制限に達していないか確認

### ローカル開発

**1. CORS エラー**
- フロントエンドが http://localhost:3000 で起動しているか確認
- バックエンドが http://localhost:8000 で起動しているか確認

**2. モジュールエラー**
- 仮想環境が有効化されているか確認
- `pip install -r requirements.txt` を再実行

## 🎯 使用方法

### テキストチャット
1. メッセージを入力欄に入力
2. 「送信」ボタンをクリックまたはEnterキー
3. AIからの応答を確認

### 画像解析
1. **画像選択**:
   - ドラッグ&ドロップエリアに画像をドロップ
   - または、エリアをクリックしてファイル選択
2. **カスタム指示**（オプション）:
   - 入力欄に解析の指示を入力
   - 例: "この写真の建築様式について教えて"
3. **解析実行**: 「画像解析」ボタンをクリック
4. **結果確認**: 構造化された解析結果を確認

### 対応画像形式
- **JPG/JPEG**: 最も一般的な写真形式
- **PNG**: 透明背景対応
- **GIF**: アニメーション画像（静止画として解析）

## 🚀 今後の改善予定

### v2.0 予定機能
- [ ] **チャット履歴の保存**: ブラウザローカルストレージ対応
- [ ] **複数画像解析**: 一度に複数の画像を比較分析
- [ ] **画像とテキストの組み合わせ**: 画像を参照した追加質問
- [ ] **解析結果のエクスポート**: JSON/PDF形式でのダウンロード

### v3.0 予定機能
- [ ] **ユーザー認証機能**: アカウント管理
- [ ] **リアルタイム通信**: WebSocketによるライブチャット
- [ ] **複数のAIモデル対応**: Claude、Gemini等の選択
- [ ] **マークダウン対応**: リッチテキスト表示
- [ ] **音声入力**: ボイスチャット機能