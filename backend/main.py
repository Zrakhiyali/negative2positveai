
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image, UnidentifiedImageError

from io import BytesIO
import numpy as np
import base64

from processor import process_image


# ============================================================
# 1. CREATE FASTAPI APP
# ============================================================
API_URL = "http://localhost:8000";
app = FastAPI(
    title="FilmRestore AI API",
    description="Film Negative Restoration Service",
    version="1.0.0"
)


# ============================================================
# 2. CORS SETTINGS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:5177", "http://127.0.0.1:5177",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 3. CONVERT NUMPY IMAGE TO BASE64
# ============================================================

def image_to_base64(image):

    buffer = BytesIO()

    Image.fromarray(image).save(
        buffer,
        format="PNG"
    )

    encoded = base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")

    return f"data:image/png;base64,{encoded}"


# ============================================================
# 4. HOME ENDPOINT
# ============================================================

@app.get("/")
def home():

    return {
        "message": "FilmRestore AI API is running",
        "status": "online"
    }


# ============================================================
# 5. IMAGE PROCESSING ENDPOINT
# ============================================================

@app.post("/process")
async def process_uploaded_image(
    file: UploadFile = File(...),
    color_method: str = "Percentile",
    low_percentile: float = 1,
    high_percentile: float = 99,
    kernel_size: int = 5,
    sigma: float = 1.0
):

    # Validate file type

    if file.content_type not in [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]:

        raise HTTPException(
            status_code=400,
            detail="Unsupported image format."
        )

    # Validate settings

    if color_method not in ["Percentile", "Gray World"]:

        raise HTTPException(
            status_code=400,
            detail="Invalid color correction method."
        )

    if not (
        0 <= low_percentile < high_percentile <= 100
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid percentile settings."
        )

    if kernel_size < 3 or kernel_size > 31 or kernel_size % 2 == 0:

        raise HTTPException(
            status_code=400,
            detail="Kernel size must be an odd number between 3 and 31."
        )

    if not np.isfinite(sigma) or sigma <= 0 or sigma > 20:

        raise HTTPException(
            status_code=400,
            detail="Sigma must be between 0 and 20."
        )

    try:

        contents = await file.read()

        if len(contents) > 15 * 1024 * 1024:

            raise HTTPException(
                status_code=413,
                detail="Image size must not exceed 15 MB."
            )

        original = Image.open(
            BytesIO(contents)
        ).convert("RGB")

        original_image = np.array(
            original,
            dtype=np.uint8
        )

    except HTTPException:

        raise

    except (UnidentifiedImageError, OSError):

        raise HTTPException(
            status_code=400,
            detail="Could not read the uploaded image."
        )

    try:

        # Run the original processing pipeline

        results = process_image(
            original_image,
            color_method=color_method,
            low_percentile=low_percentile,
            high_percentile=high_percentile,
            kernel_size=kernel_size,
            sigma=sigma
        )

        # Convert results to Base64

        response = {

            "success": True,

            "image_size": {
                "width": original_image.shape[1],
                "height": original_image.shape[0]
            },

            "results": {

                "positive": image_to_base64(
                    results["positive"]
                ),

                "corrected": image_to_base64(
                    results["corrected"]
                ),

                "gaussian": image_to_base64(
                    results["gaussian"]
                ),

                "histogram": image_to_base64(
                    results["histogram"]
                )

            }

        }

        return response

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Image processing failed: {str(error)}"
        )
