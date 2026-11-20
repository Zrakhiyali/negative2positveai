
import { useRef, useState } from "react";
import { Upload, Image, X, FileImage } from "lucide-react";

function ImageUploader({ onImageSelect }) {
  const inputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
    setFileName(file.name);

    onImageSelect(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];

    handleFile(file);
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setFileName("");

    onImageSelect(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="upload-section">

      <div className="section-heading">
        <div>
          <h3>Upload Film Negative</h3>
          <p>Choose an image to start restoration.</p>
        </div>
      </div>

      {!preview ? (

        <div
          className={`upload-box ${dragging ? "dragging" : ""}`}

          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}

          onDragLeave={() => setDragging(false)}

          onDrop={handleDrop}

          onClick={() => inputRef.current.click()}
        >

          <div className="upload-icon">
            <Upload size={30} />
          </div>

          <h3>Drop your image here</h3>

          <p>or click to browse your files</p>

          <button className="browse-button">
            Browse Images
          </button>

          <small>Supported formats: JPG, PNG, JPEG</small>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />

        </div>

      ) : (

        <div className="preview-container">

          <div className="preview-header">

            <div className="file-info">
              <FileImage size={20} />

              <div>
                <strong>{fileName}</strong>
                <small>Image uploaded successfully</small>
              </div>
            </div>

            <button
              className="remove-button"
              onClick={removeImage}
            >
              <X size={18} />
              Remove
            </button>

          </div>

          <div className="uploaded-image">
            <img src={preview} alt="Uploaded negative" />
          </div>

        </div>

      )}

    </div>
  );
}

export default ImageUploader;
