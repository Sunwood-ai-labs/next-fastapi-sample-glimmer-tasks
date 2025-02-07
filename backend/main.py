from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import databases
import sqlalchemy
from typing import List, Optional

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
    sqlalchemy.Column("title", sqlalchemy.String),
    sqlalchemy.Column("completed", sqlalchemy.Boolean, default=False),
)

# Create database engine
engine = sqlalchemy.create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
metadata.create_all(engine)

# Pydantic models
class TaskCreate(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    completed: bool

class Task(BaseModel):
    id: int
    title: str
    completed: bool

# FastAPI app
app = FastAPI()

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
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/api/tasks", response_model=List[Task])
async def get_tasks():
    query = tasks.select()
    return await database.fetch_all(query)

@app.post("/api/tasks", response_model=Task)
async def create_task(task: TaskCreate):
    query = tasks.insert().values(title=task.title, completed=False)
    last_record_id = await database.execute(query)
    return {**task.dict(), "id": last_record_id, "completed": False}

@app.put("/api/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, task: TaskUpdate):
    query = tasks.update().where(tasks.c.id == task_id).values(completed=task.completed)
    await database.execute(query)
    
    # Fetch updated task
    select_query = tasks.select().where(tasks.c.id == task_id)
    result = await database.fetch_one(select_query)
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return result

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int):
    query = tasks.delete().where(tasks.c.id == task_id)
    await database.execute(query)
    return {"message": "Task deleted"}
