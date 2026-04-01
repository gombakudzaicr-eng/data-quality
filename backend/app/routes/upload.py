import os
from fastapi import APIRouter, File, UploadFile, HTTPException
import pandas as pd

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def read_file(file_path: str) -> pd.DataFrame:
    if file_path.endswith(".csv"):
        return pd.read_csv(file_path)
    elif file_path.endswith(".xlsx") or file_path.endswith(".xls"):
        return pd.read_excel(file_path)
    else:
        raise ValueError("Unsupported file format")


@router.post("/")
async def upload_dataset(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    try:
        contents = await file.read()

        with open(file_path, "wb") as f:
            f.write(contents)

        df = read_file(file_path)

        return {
            "filename": file.filename,
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1]),
            "column_names": df.columns.tolist(),
            "preview": df.head(10).fillna("").to_dict(orient="records"),
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))