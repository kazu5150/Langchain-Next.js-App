from http.server import BaseHTTPRequestHandler
import json
import base64
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

        try:
            # リクエストボディを読み込み
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))

            # Base64エンコードされた画像データを取得
            image_data = request_data.get('image', '')
            user_prompt = request_data.get('prompt', '画像の内容を詳しく分析してください。')

            if not image_data:
                raise ValueError("画像データが提供されていません")

            # OpenAI Vision API設定
            llm = ChatOpenAI(
                model="gpt-4o-mini",  # Vision対応モデル
                temperature=0
            )

            # 画像解析用のメッセージを構築
            message = HumanMessage(
                content=[
                    {
                        "type": "text",
                        "text": f"""以下の画像を分析し、構造化された形で情報を提供してください。

{user_prompt}

以下の形式で回答してください：
1. 画像の概要
2. 主要な要素・オブジェクト
3. 色彩・構成
4. 注目すべき詳細
5. 推測される文脈・用途"""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_data}",
                            "detail": "high"
                        }
                    }
                ]
            )

            # Vision APIで画像を解析
            result = llm.invoke([message])

            response = {
                "analysis": result.content,
                "status": "success"
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            error_response = {
                "error": f"画像解析エラー: {str(e)}",
                "status": "error"
            }
            self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        # CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()