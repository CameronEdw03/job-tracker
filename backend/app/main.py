from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from app import models, schemas, crud, database
import requests  # 👈 for calling Arbeitnow API

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Arbeitnow API
ARBEITNOW_API = "https://www.arbeitnow.com/api/job-board-api"

# CORS setup (allow all origins for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/jobs/", response_model=schemas.Job)
def create_job_endpoint(job: schemas.JobCreate, db: Session = Depends(get_db)):
    return crud.create_job(db, job)


@app.get("/jobs/", response_model=list[schemas.Job])
def get_jobs_endpoint(db: Session = Depends(get_db)):
    return crud.get_jobs(db)


@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"detail": "Job deleted"}


@app.put("/jobs/{job_id}", response_model=schemas.Job)
def update_job_status(job_id: int, updated_job: schemas.JobCreate, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.company = updated_job.company
    job.position = updated_job.position
    job.status = updated_job.status
    
    db.commit()
    db.refresh(job)
    return job


# Fetch live jobs from Arbeitnow API
@app.get("/external-jobs")
def fetch_external_jobs(page: int = 1, keyword: str = None, location: str = None):
    try:
        # Fetch from Arbeitnow
        response = requests.get(f"{ARBEITNOW_API}?page={page}")
        response.raise_for_status()
        data = response.json()

        jobs = data.get("data", [])

        print(f"Fetched {len(jobs)} jobs from Arbeitnow")

       
        if keyword:
            keyword = keyword.lower()
            jobs = [
                job for job in jobs
                if keyword in job.get("title", "").lower()
                or keyword in job.get("company_name", "").lower()
                or keyword in job.get("description", "").lower()
            ]

        if location:
            location = location.lower()
            jobs = [
                job for job in jobs
                if location in job.get("location", "").lower()
            ]

        print(f"After filtering: {len(jobs)} jobs left")

        return {"data": jobs, "count": len(jobs)}

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching jobs: {str(e)}")

 