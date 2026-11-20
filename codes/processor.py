

import cv2
import numpy as np


# ============================================================
# 1. NEGATIVE TO POSITIVE
# ============================================================

def negative_to_positive(image):

    positive = 255 - image

    return positive.astype(np.uint8)


# ============================================================
# 2. COLOR CORRECTION
# ============================================================

def color_correction(
    image,
    method="Percentile",
    low_percentile=1,
    high_percentile=99
):

    image = image.astype(np.float32)

    if method == "Percentile":

        corrected = np.zeros_like(image)

        for channel in range(3):

            channel_data = image[:, :, channel]

            low = np.percentile(
                channel_data,
                low_percentile
            )

            high = np.percentile(
                channel_data,
                high_percentile
            )

            if high > low:

                corrected[:, :, channel] = (
                    (channel_data - low) /
                    (high - low) * 255
                )

            else:

                corrected[:, :, channel] = channel_data

        corrected = np.clip(
            corrected,
            0,
            255
        )

        return corrected.astype(np.uint8)

    elif method == "Gray World":

        channel_means = np.mean(
            image,
            axis=(0, 1)
        )

        gray_mean = np.mean(channel_means)

        corrected = image * (
            gray_mean / (channel_means + 1e-8)
        )

        corrected = np.clip(
            corrected,
            0,
            255
        )

        return corrected.astype(np.uint8)

    else:

        raise ValueError("Unknown color correction method")


# ============================================================
# 3. GAUSSIAN KERNEL
# ============================================================

def gaussian_kernel(size=5, sigma=1.0):

    center = size // 2

    x, y = np.mgrid[
        -center:center + 1,
        -center:center + 1
    ]

    kernel = np.exp(
        -(x**2 + y**2) / (2 * sigma**2)
    )

    kernel = kernel / np.sum(kernel)

    return kernel.astype(np.float32)


# ============================================================
# 4. CUSTOM CONVOLUTION
# ============================================================

def convolution_numpy(image, kernel):

    image = image.astype(np.float32)

    is_gray = image.ndim == 2

    if is_gray:

        image = image[:, :, np.newaxis]

    h, w, channels = image.shape

    kh, kw = kernel.shape

    pad_h = kh // 2
    pad_w = kw // 2

    padded = np.pad(
        image,
        (
            (pad_h, pad_h),
            (pad_w, pad_w),
            (0, 0)
        ),
        mode="reflect"
    )

    output = np.zeros_like(image)

    for i in range(kh):

        for j in range(kw):

            output += (
                kernel[i, j] *
                padded[
                    i:i + h,
                    j:j + w,
                    :
                ]
            )

    output = np.clip(output, 0, 255)

    output = output.astype(np.uint8)

    if is_gray:

        output = output[:, :, 0]

    return output


# ============================================================
# 5. GAUSSIAN FILTER
# ============================================================

def gaussian_filter_numpy(
    image,
    kernel_size=5,
    sigma=1.0
):

    kernel = gaussian_kernel(
        size=kernel_size,
        sigma=sigma
    )

    return convolution_numpy(image, kernel)


# ============================================================
# 6. HISTOGRAM EQUALIZATION
# ============================================================

def histogram_equalization_numpy(gray):

    histogram = np.bincount(
        gray.ravel(),
        minlength=256
    )

    probabilities = histogram / gray.size

    cdf = np.cumsum(probabilities)

    nonzero_cdf = cdf[cdf > 0]

    cdf_min = nonzero_cdf[0]

    if cdf_min >= 1:

        return gray.copy()

    mapping = (
        (cdf - cdf_min) /
        (1 - cdf_min) * 255
    )

    mapping = np.clip(
        mapping,
        0,
        255
    ).astype(np.uint8)

    return mapping[gray]


# ============================================================
# 7. CONTRAST ENHANCEMENT
# ============================================================

def enhance_contrast(image):

    lab = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2LAB
    )

    L, A, B = cv2.split(lab)

    L_equalized = histogram_equalization_numpy(L)

    lab_equalized = cv2.merge(
        [L_equalized, A, B]
    )

    result = cv2.cvtColor(
        lab_equalized,
        cv2.COLOR_LAB2RGB
    )

    return result


# ============================================================
# 8. COMPLETE RESTORATION PIPELINE
# ============================================================

def process_image(
    original_image,
    color_method="Percentile",
    low_percentile=1,
    high_percentile=99,
    kernel_size=5,
    sigma=1.0
):

    # Method 1: Negative to Positive

    positive = negative_to_positive(
        original_image
    )

    # Color correction

    corrected = color_correction(
        positive,
        method=color_method,
        low_percentile=low_percentile,
        high_percentile=high_percentile
    )

    # Method 2: Gaussian Filter

    gaussian = gaussian_filter_numpy(
        corrected,
        kernel_size=kernel_size,
        sigma=sigma
    )

    # Method 3: Histogram Equalization

    histogram = enhance_contrast(
        corrected
    )

    return {
        "positive": positive,
        "corrected": corrected,
        "gaussian": gaussian,
        "histogram": histogram
    }
