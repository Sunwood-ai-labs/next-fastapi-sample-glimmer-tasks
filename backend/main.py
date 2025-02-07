from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
import databases
import sqlalchemy
from typing import List, Optional
import logging
from logging.config import dictConfig

# ロギング設定
logging_config = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        }
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr"
        }
    },
    "loggers": {
        "task_api": {"handlers": ["default"], "level": "INFO"}
    }
}
dictConfig(logging_config)
logger = logging.getLogger("task_api")

# Database URL
DATABASE_URL = "sqlite:///./tasks.db"

# Database instance
database = databases.Database(DATABASE_URL)

# SQLAlchemy
metadata = sqlalchemy.MetaData()

# Tasks table
tasks = sqlalchemy.Table(
    "tasks",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("title", sqlalchemy.String(255), nullable=False),  # 文字数制限とNOT NULL制約
    sqlalchemy.Column("completed", sqlalchemy.Boolean, default=False, nullable=False),
)

# Create database engine
engine = sqlalchemy.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
metadata.create_all(engine)

class TaskCreate(BaseModel):
    """
    タスク作成時のリクエストモデル
    """
    title: str

    class Config:
        schema_extra = {
            "example": {
                "title": "プロジェクトの計画を立てる"
            }
        }

class TaskUpdate(BaseModel):
    """
    タスク更新時のリクエストモデル
    """
    completed: bool

    class Config:
        schema_extra = {
            "example": {
                "completed": True
            }
        }

class Task(BaseModel):
    """
    タスクの完全なモデル
    """
    id: int
    title: str
    completed: bool

    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "title": "プロジェクトの計画を立てる",
                "completed": False
            }
        }

# FastAPI app
app = FastAPI(
    title="GlimmerTasks API",
    description="タスク管理のためのRESTful API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # 3001ポートを追加
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    """アプリケーション起動時の処理"""
    try:
        await database.connect()
        logger.info("データベースに接続しました")
    except Exception as e:
        logger.error(f"データベース接続エラー: {e}")
        raise

@app.on_event("shutdown")
async def shutdown():
    """アプリケーション終了時の処理"""
    try:
        await database.disconnect()
        logger.info("データベース接続を切断しました")
    except Exception as e:
        logger.error(f"データベース切断エラー: {e}")

@app.get("/api/tasks", response_model=List[Task], summary="タスク一覧の取得")
async def get_tasks():
    """
    登録されているすべてのタスクを取得します。

    Returns:
        List[Task]: タスクのリスト
    """
    try:
        query = tasks.select()
        result = await database.fetch_all(query)
        logger.info(f"{len(result)}件のタスクを取得しました")
        return result
    except Exception as e:
        logger.error(f"タスク一覧取得エラー: {e}")
        raise HTTPException(status_code=500, detail="タスクの取得に失敗しました")

@app.post("/api/tasks", response_model=Task, summary="新規タスクの作成")
async def create_task(task: TaskCreate):
    """
    新しいタスクを作成します。

    Args:
        task (TaskCreate): 作成するタスクの情報

    Returns:
        Task: 作成されたタスク情報
    """
    try:
        query = tasks.insert().values(title=task.title, completed=False)
        last_record_id = await database.execute(query)
        logger.info(f"新規タスクを作成しました: {task.title}")
        return {**task.dict(), "id": last_record_id, "completed": False}
    except ValidationError as e:
        logger.error(f"バリデーションエラー: {e}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"タスク作成エラー: {e}")
        raise HTTPException(status_code=500, detail="タスクの作成に失敗しました")

@app.put("/api/tasks/{task_id}", response_model=Task, summary="タスクの更新")
async def update_task(task_id: int, task: TaskUpdate):
    """
    指定されたIDのタスクを更新します。

    Args:
        task_id (int): 更新対象のタスクID
        task (TaskUpdate): 更新するタスクの情報

    Returns:
        Task: 更新後のタスク情報
    """
    try:
        query = tasks.update().where(tasks.c.id == task_id).values(completed=task.completed)
        result = await database.execute(query)
        if result == 0:
            raise HTTPException(status_code=404, detail=f"タスクが見つかりません: {task_id}")
        
        select_query = tasks.select().where(tasks.c.id == task_id)
        updated_task = await database.fetch_one(select_query)
        logger.info(f"タスクを更新しました: ID {task_id}")
        return updated_task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"タスク更新エラー: {e}")
        raise HTTPException(status_code=500, detail="タスクの更新に失敗しました")

@app.delete("/api/tasks/{task_id}", summary="タスクの削除")
async def delete_task(task_id: int):
    """
    指定されたIDのタスクを削除します。

    Args:
        task_id (int): 削除対象のタスクID

    Returns:
        dict: 削除完了メッセージ
    """
    try:
        query = tasks.delete().where(tasks.c.id == task_id)
        result = await database.execute(query)
        if result == 0:
            raise HTTPException(status_code=404, detail=f"タスクが見つかりません: {task_id}")
        logger.info(f"タスクを削除しました: ID {task_id}")
        return {"message": "タスクを削除しました"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"タスク削除エラー: {e}")
        raise HTTPException(status_code=500, detail="タスクの削除に失敗しました")
