import io
import logging
from typing import Any, Dict, Optional, Tuple

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from inference import load_model, predict_alzheimer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ALLOWED_CONTENT_TYPES = frozenset(
    {"image/jpeg", "image/jpg", "image/png", "image/x-png", "application/octet-stream"}
)
ALLOWED_EXTENSIONS = frozenset({".jpg", ".jpeg", ".png"})

CLASS_META: Dict[str, Dict[str, Any]] = {
    "Non Demented": {"severity_level": 0, "color": "#27AE60"},
    "Very Mild Demented": {"severity_level": 1, "color": "#F39C12"},
    "Mild Demented": {"severity_level": 2, "color": "#E67E22"},
    "Moderate Demented": {"severity_level": 3, "color": "#E74C3C"},
}

app = FastAPI(title="Alzheimer MRI Classification API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_model_ready = False
_model_error: Optional[str] = None


@app.on_event("startup")
def startup_load_model() -> None:
    global _model_ready, _model_error
    try:
        load_model()
        _model_ready = True
        _model_error = None
        logger.info("Model loaded successfully.")
    except Exception as exc:  # noqa: BLE001 — surface startup failures clearly
        _model_ready = False
        _model_error = str(exc)
        logger.exception("Failed to load model at startup: %s", exc)


def _normalize_prediction(raw: Any) -> Tuple[str, float, Dict[str, float]]:
    if isinstance(raw, dict):
        cls = raw.get("class") or raw.get("predicted_class")
        conf = raw.get("confidence")
        probs = raw.get("probabilities")
        if cls is None or conf is None or probs is None:
            raise ValueError("Invalid prediction dict shape")
        return str(cls), float(conf), dict(probs)
    if isinstance(raw, tuple) and len(raw) >= 3:
        cls, conf, probs = raw[0], raw[1], raw[2]
        return str(cls), float(conf), dict(probs)
    raise ValueError("Unsupported prediction return type")


@app.get("/health")
def health() -> Dict[str, str]:
    if _model_ready:
        return {"status": "ok", "model": "loaded"}
    return {"status": "degraded", "model": _model_error or "not_loaded"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> Dict[str, Any]:
    if not _model_ready:
        raise HTTPException(
            status_code=503,
            detail="Model is not available. Place model.h5 under backend/model/ and restart.",
        )

    filename = (file.filename or "").lower()
    suffix = ""
    if "." in filename:
        suffix = "." + filename.rsplit(".", 1)[-1]

    content_type = (file.content_type or "").lower()
    if content_type and content_type not in ALLOWED_CONTENT_TYPES:
        if suffix not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload a JPG or PNG image.",
            )
    elif suffix and suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a JPG or PNG image.",
        )

    try:
        data = await file.read()
        if not data:
            raise HTTPException(status_code=400, detail="Empty file uploaded.")
        image = Image.open(io.BytesIO(data))
        image.load()
    except UnidentifiedImageError as exc:
        raise HTTPException(
            status_code=400,
            detail="Could not read image. The file may be corrupted.",
        ) from exc
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        logger.exception("Image decode error")
        raise HTTPException(
            status_code=400,
            detail="Could not read image. The file may be corrupted.",
        ) from exc

    try:
        raw = predict_alzheimer(image)
        predicted_class, confidence, probabilities = _normalize_prediction(raw)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        logger.exception("Inference failed")
        raise HTTPException(
            status_code=500,
            detail="Analysis failed. Please try again.",
        ) from exc

    meta = CLASS_META.get(predicted_class)
    if not meta:
        raise HTTPException(
            status_code=500,
            detail="Analysis failed. Please try again.",
        )

    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "probabilities": probabilities,
        "severity_level": meta["severity_level"],
        "color": meta["color"],
    }
