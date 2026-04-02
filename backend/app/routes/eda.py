
from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter()

UPLOAD_DIR = "uploads"


def read_file(file_path: str) -> pd.DataFrame:
    if file_path.endswith(".csv"):
        return pd.read_csv(file_path)
    elif file_path.endswith(".xlsx") or file_path.endswith(".xls"):
        return pd.read_excel(file_path)
    else:
        raise ValueError("Unsupported file format")


@router.get("/{filename}")
def get_eda_summary(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    df = read_file(file_path)

    column_summary = []

    for col in df.columns:
        dtype = str(df[col].dtype)

        if pd.api.types.is_numeric_dtype(df[col]):
            category = "Quantitative"
        else:
            category = "Qualitative"

        column_summary.append({
            "name": col,
            "type": dtype,
            "category": category,
            "missing": int(df[col].isnull().sum())
        })

    return {
        "filename": filename,
        "column_summary": column_summary
    }