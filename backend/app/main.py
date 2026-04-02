from fastapi import FastAPI
from app.routes import quality
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload, eda

app = FastAPI(
    title="Dura Capital Data Quality API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(quality.router, prefix="/api/quality", tags=["Quality"])
app.include_router(eda.router, prefix="/api/eda", tags=["EDA"])

@app.get("/")
def root():
    return {"message": "Dura Capital Data Quality API is running"}