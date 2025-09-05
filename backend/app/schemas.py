from pydantic import BaseModel

class JobCreate(BaseModel):
    company: str
    position: str
    status: str

class Job(JobCreate):
    id: int

    class Config:
        orm_mode = True
