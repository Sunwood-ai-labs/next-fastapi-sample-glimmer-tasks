# GlimmerTasks 仕様書

## 1. 概要

ユーザーがタスクを追加、削除、完了状態を更新できる、基本的なTODOアプリケーションを開発する。バックエンドはFastAPI、フロントエンドはNext.jsを使用し、UIにはグラスモーフィズムデザインを採用してリッチな外観を実現する。

## 2. 対象ユーザー

*   タスク管理をシンプルかつ視覚的に行いたいユーザー

## 3. 機能要件

*   **タスクの追加:**
    *   ユーザーは新しいタスクのタイトルを入力できる。
    *   入力されたタイトルは、未完了タスクとしてリストに追加される。
*   **タスクの表示:**
    *   未完了タスクと完了済みタスクを分けて表示する。
    *   各タスクのタイトルを表示する。
*   **タスクの完了/未完了切り替え:**
    *   ユーザーは各タスクのチェックボックスをクリックすることで、完了/未完了状態を切り替えられる。
*   **タスクの削除:**
    *   ユーザーは各タスクの削除ボタンをクリックすることで、タスクを削除できる。

## 4. 非機能要件

*   **パフォーマンス:**
    *   タスクの追加、削除、状態更新はスムーズに行えること。
    *   多数のタスクを表示しても、パフォーマンスが著しく低下しないこと。
*   **ユーザビリティ:**
    *   直感的で分かりやすいUIであること。
    *   操作に迷わない、シンプルな操作性であること。
*   **デザイン:**
    *   グラスモーフィズムデザインを採用し、モダンで洗練されたUIにすること。
        *   半透明の背景
        *   ぼかし効果
        *   薄い境界線
        *   浮遊感のある要素
*   **レスポンシブ対応:**
    *   PC、タブレット、スマートフォンなど、様々なデバイスで適切に表示されること。

## 5. 技術スタック

*   **バックエンド:**
    *   FastAPI (Python)
    *   Pydantic (データバリデーション)
    *   Databases または SQLAlchemy (データベース連携)
*   **フロントエンド:**
    *   Next.js (React)
    *   TypeScript (推奨)
    *   useState, useEffect (状態管理、副作用処理)
    *   fetch または axios (API通信)
    *   CSS Modules または styled-components (スタイリング)
*   **データベース:**
    *   SQLite (開発用)
    *   PostgreSQL または MySQL (本番用)
*   **開発ツール:**
    *   Vite (開発サーバー、ビルドツール)
    *   ESLint, Prettier (コードの品質維持)

## 6. 画面構成

*   **タスクリスト画面:**
    *   ヘッダー (アプリケーションタイトル: GlimmerTasks)
    *   タスク追加フォーム (入力欄、追加ボタン)
    *   未完了タスクリスト
    *   完了済みタスクリスト

## 7. API設計 (FastAPI)

| エンドポイント      | メソッド | 説明                                                                                                                               | リクエストボディ                                         | レスポンスボディ                                                                                                       |
| ----------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `/api/tasks`      | GET    | 全てのタスクを取得する                                                                                                                     | (なし)                                                   | `[{"id": int, "title": str, "completed": bool}, ...]`                                                                   |
| `/api/tasks`      | POST   | 新しいタスクを作成する                                                                                                                       | `{"title": str}`                                         | `{"id": int, "title": str, "completed": bool}`                                                                   |
| `/api/tasks/{id}` | PUT    | 指定されたIDのタスクを更新する (完了状態の切り替えなど)                                                                                                 | `{"completed": bool}` (部分的な更新も可能にする場合は他のフィールドも) | `{"id": int, "title": str, "completed": bool}`                                                                   |
| `/api/tasks/{id}` | DELETE | 指定されたIDのタスクを削除する                                                                                                                       | (なし)                                                   | (成功時) `{"message": "Task deleted"}` または空のレスポンス                                                             |

## 8. グラスモーフィズムUIの実装ポイント

*   **背景:** メインの背景には、ぼかし効果を適用した半透明のコンテナを配置する。
*   **カード:** タスク項目は、わずかに浮き上がったように見えるカードとしてデザインする。カードには、薄い境界線と、背景とのコントラストを出すためのドロップシャドウを適用する。
*   **色使い:** 全体的に淡い色調で統一し、アクセントカラーを効果的に使う。
*   **フォント:** 読みやすく、モダンなフォントを選択する。
*   **CSS:**
    *   `backdrop-filter: blur(10px);` (背景のぼかし)
    *   `background: rgba(255, 255, 255, 0.2);` (半透明の背景)
    *   `border: 1px solid rgba(255, 255, 255, 0.3);` (薄い境界線)
    *   `box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);` (ドロップシャドウ)

## 9. 今後の拡張性

*   **タスクの優先度設定:** タスクに優先度 (高/中/低) を設定できるようにする。
*   **タスクの期日設定:** タスクに期日を設定し、カレンダービューを追加する。
*   **タスクのカテゴリ分け:** タスクをカテゴリ別に分類できるようにする。
*   **タスクの検索機能:** タスクをタイトルで検索できるようにする。
*   **ダークモード対応:** ダークモードとライトモードを切り替えられるようにする。
