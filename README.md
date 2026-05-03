# Alzheimer's MRI Classification (VGG16)

Deep learning project that classifies brain MRI scans into **four Alzheimer's-related stages** using **VGG16 transfer learning**. It includes an optional **Google Colab** training workflow and a **production-style web app**: **FastAPI** backend plus **React + Vite + Tailwind** frontend.

> **Medical disclaimer:** This work is for **education and research only**. It is **not** for clinical use, diagnosis, or treatment. Outputs **must not** replace advice from a qualified healthcare professional.

[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Repository:** [github.com/M-Amine-HM/Alzheimer-MRI-Classification-VGG16](https://github.com/M-Amine-HM/Alzheimer-MRI-Classification-VGG16)

---

## Web application

- Upload a JPG/JPEG/PNG brain MRI; backend runs inference and returns class, confidence, and per-class probabilities.
- Dark UI with stage explanations, probability bars, loading overlay, and prominent research disclaimer.
- **No authentication** (local/demo use).

### Prerequisites

- Python **3.10+** (project tested with 3.12)
- Node.js **18+** and npm
- Trained weights file: `backend/model/model.h5` (see [Model weights](#model-weights))

### Backend (FastAPI)

From the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

- Interactive API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health check: `GET /health`
- Prediction: `POST /predict` with multipart field **`file`** (image)

CORS is enabled for the Vite dev server (`http://localhost:5173` and `http://127.0.0.1:5173`).

### Frontend (React + Vite)

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Optional API base URL (copy `frontend/.env.example` to `frontend/.env.local`):

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Model weights

- Place **`model.h5`** under **`backend/model/`** (the repo keeps `backend/model/.gitkeep`; large `.h5` files are listed in **`.gitignore`** so they are not committed by default—use [Git LFS](https://git-lfs.com/) or distribute weights separately if you need them in version control).

### Inference loading (Keras 3)

Some HDF5 checkpoints saved as **Sequential + nested Functional** (VGG16) fail `tf.keras.models.load_model()` on **Keras 3** during graph reconstruction. This project rebuilds the trained topology (VGG16 → GlobalAveragePooling2D → dense head) and loads weights with **`load_weights(..., by_name=True)`** in `backend/inference.py`. No change is required if you only replace `model.h5` with a compatible checkpoint using the same layer names.

### Quiet TensorFlow oneDNN logs (Windows, optional)

```powershell
set TF_ENABLE_ONEDNN_OPTS=0
```

---

## Dataset

[Kaggle: Alzheimer MRI 4 Classes Dataset](https://www.kaggle.com/datasets/marcopinamonti/alzheimer-mri-4-classes-dataset)

| Stage (folder / encoding) | Approx. training images |
|---------------------------|-------------------------|
| Non Demented (`NonDemented`) | 3,200 |
| Very Mild Demented (`VeryMildDemented`) | 2,240 |
| Mild Demented (`MildDemented`) | 896 |
| Moderate Demented (`ModerateDemented`) | 64 |

Label indices follow **`sorted()` folder names** in the notebook (see `backend/inference.py` for the mapping to UI display names).

---

## Model architecture

- **Backbone:** VGG16 (ImageNet weights for training), **128×128** RGB inputs, pixels scaled with **`rescale=1/255`** (matches training `ImageDataGenerator`).
- **Head:** Global Average Pooling → Dense(512, ReLU) → BatchNorm → Dropout(0.5) → Dense(256, ReLU) → BatchNorm → Dropout(0.3) → Dense(4, softmax).

### Reported performance (notebook)

- Test accuracy ~**58.13%**
- Optimizer: Adam (lr **0.001**)
- Augmentation (rotation, flip, zoom) and **class weights** for imbalance

---

## Training with Google Colab

1. Configure Kaggle credentials (for example Colab secrets `KAGGLE_USERNAME`, `KAGGLE_KEY`).
2. Open **`Alzheimer's_Disease_Classification.ipynb`** and run cells to download data, train, and evaluate.
3. Export your best **`model.h5`** into **`backend/model/`** for the web stack.

---

## Project layout

```
backend/
  main.py              # FastAPI app, CORS, /predict, /health
  inference.py         # preprocess + model forward (weights load compatible with Keras 3)
  requirements.txt
  model/
    model.h5           # add locally (gitignored by default)
    .gitkeep

frontend/
  src/
    App.jsx
    main.jsx
    index.css
    classInfo.js
    components/        # Hero, Disclaimer, upload, results, etc.
  index.html
  vite.config.js
  tailwind.config.js
  postcss.config.js
  .env.example

Alzheimer's_Disease_Classification.ipynb   # Colab training notebook
README.md
.gitignore
```

---

## Credits

Built by **Amine** — VGG16 transfer learning pipeline and web UI for research and teaching.
