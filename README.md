<div align="center">

# GlimmerTasks

[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

モダンなUIを備えたタスク管理アプリケーション。グラスモーフィズムデザインを採用し、Next.js（フロントエンド）とFastAPI（バックエンド）で構築されています。

## 🎯 主な機能

- タスクの追加・削除
- タスクの完了/未完了の切り替え
- 未完了/完了済みタスクの分類表示
- グラスモーフィズムを用いたモダンなUI
- レスポンシブデザイン対応

## 🛠️ 技術スタック

### 🌐 フロントエンド
- Next.js
- TypeScript
- Tailwind CSS
- useState, useEffect（状態管理）
- fetch/axios（API通信）

### ⚙️ バックエンド
- FastAPI（Python）
- Pydantic（データバリデーション）
- SQLAlchemy（データベース連携）
- SQLite（開発用DB）

## 📡 API仕様

| エンドポイント      | メソッド | 説明                     |
| ----------------- | ------ | ------------------------ |
| `/api/tasks`      | GET    | タスク一覧取得             |
| `/api/tasks`      | POST   | 新規タスク作成             |
| `/api/tasks/{id}` | PUT    | タスク更新                |
| `/api/tasks/{id}` | DELETE | タスク削除                |

## 📁 プロジェクト構造
```
.
├── frontend/     # Next.jsアプリケーション
└── backend/      # FastAPIアプリケーション
```

## 🚀 セットアップ

### 🔧 バックエンド
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 🎨 フロントエンド
```bash
cd frontend
npm install
npm run dev
```

## 🌐 開発環境
- フロントエンド: http://localhost:3000
- バックエンド API: http://localhost:8000

## 🔮 拡張予定の機能
- タスクの優先度設定
- タスクの期日設定
- タスクのカテゴリ分け
- タスク検索機能
- ダークモード対応

## 📄 ライセンス
MITライセンスで提供されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。
