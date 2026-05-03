"""
Inference utilities for the Alzheimer's MRI classifier (VGG16 transfer learning).
Model output indices follow training label_encoding:
  0 MildDemented, 1 ModerateDemented, 2 NonDemented, 3 VeryMildDemented
Images are expected at 128x128 with pixels scaled to [0, 1] (rescale 1/255).
"""
from pathlib import Path

import numpy as np
from PIL import Image
import tensorflow as tf

_MODEL = None

# Display names must match API / frontend contract (sorted by model index)
_MODEL_INDEX_TO_DISPLAY = (
    "Mild Demented",
    "Moderate Demented",
    "Non Demented",
    "Very Mild Demented",
)

_IMG_SIZE = 128
_MODEL_PATH = Path(__file__).resolve().parent / "model" / "model.h5"


def _build_model():
    """
    Same head as training (see notebook): VGG16 backbone + GAP + Dense/BN/Dropout stack.
    We rebuild explicitly because tf.keras.models.load_model() on this HDF5 fails on Keras 3:
    Sequential + nested Functional deserializes incorrectly and wires two tensors into Dense.
    """
    inp = tf.keras.Input(shape=(_IMG_SIZE, _IMG_SIZE, 3))
    base = tf.keras.applications.VGG16(
        include_top=False,
        weights=None,
        input_tensor=inp,
        pooling=None,
    )
    x = tf.keras.layers.GlobalAveragePooling2D(name="global_average_pooling2d")(base.output)
    x = tf.keras.layers.Dense(512, activation="relu", name="dense")(x)
    x = tf.keras.layers.BatchNormalization(name="batch_normalization")(x)
    x = tf.keras.layers.Dropout(0.5, name="dropout")(x)
    x = tf.keras.layers.Dense(256, activation="relu", name="dense_1")(x)
    x = tf.keras.layers.BatchNormalization(name="batch_normalization_1")(x)
    x = tf.keras.layers.Dropout(0.3, name="dropout_1")(x)
    out = tf.keras.layers.Dense(4, activation="softmax", name="dense_2")(x)
    return tf.keras.Model(inputs=inp, outputs=out)


def load_model() -> None:
    """Load Keras weights once at application startup."""
    global _MODEL
    if _MODEL is not None:
        return
    if not _MODEL_PATH.is_file():
        raise FileNotFoundError(f"Model file not found: {_MODEL_PATH}")
    model = _build_model()
    model.load_weights(str(_MODEL_PATH), by_name=True)
    _MODEL = model


def _ensure_rgb(pil_image: Image.Image) -> Image.Image:
    if pil_image.mode == "RGB":
        return pil_image
    if pil_image.mode == "RGBA":
        bg = Image.new("RGB", pil_image.size, (255, 255, 255))
        bg.paste(pil_image, mask=pil_image.split()[3])
        return bg
    return pil_image.convert("RGB")


def predict_alzheimer(pil_image: Image.Image):
    """
    Run inference on a PIL image.

    Returns:
        dict with keys: class (str), confidence (float), probabilities (dict[str, float])
    """
    global _MODEL
    if _MODEL is None:
        load_model()

    img = _ensure_rgb(pil_image)
    img = img.resize((_IMG_SIZE, _IMG_SIZE), Image.Resampling.LANCZOS)
    arr = np.asarray(img, dtype=np.float32) / 255.0
    batch = np.expand_dims(arr, axis=0)

    preds = _MODEL.predict(batch, verbose=0)[0]
    idx = int(np.argmax(preds))
    confidence = float(preds[idx])

    probabilities = {
        _MODEL_INDEX_TO_DISPLAY[i]: float(preds[i]) for i in range(len(_MODEL_INDEX_TO_DISPLAY))
    }

    return {
        "class": _MODEL_INDEX_TO_DISPLAY[idx],
        "confidence": confidence,
        "probabilities": probabilities,
    }
