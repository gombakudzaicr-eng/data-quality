
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
def get_quality_report(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    df = read_file(file_path)

    missing_values = df.isnull().sum().sum()
    duplicate_rows = df.duplicated().sum()

    qualitative = df.select_dtypes(include=["object"]).columns.tolist()
    quantitative = df.select_dtypes(include=["number"]).columns.tolist()

    return {
        "missing_values": int(missing_values),
        "duplicate_rows": int(duplicate_rows),
        "qualitative_columns": len(qualitative),
        "quantitative_columns": len(quantitative),
    }