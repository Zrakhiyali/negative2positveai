import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";
import ProcessingPanel from "./components/ProcessingPanel";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";s

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("positive");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleProcess = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const params = new URLSearchParams({
        color_method: "Percentile",
        low_percentile: 1,
        high_percentile: 99,
        kernel_size: 5,
        sigma: 1.0,
      });

      const response = await fetch(`${API_URL}/process?${params}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Processing failed");
      }

      setResults(data.results);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="dashboard-content">
          <h1>Welcome to FilmRestore AI</h1>

          <p>
            Transform your old film negatives
            into beautiful positive images.
          </p>

          <ImageUploader onImageSelect={setSelectedImage} />

          <ProcessingPanel
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
            onProcess={handleProcess}
            isProcessing={isProcessing}
          />

          {error && (
            <p style={{ color: "red", marginTop: "16px" }}>{error}</p>
          )}

          {results && (
            <div className="result-section" style={{ marginTop: "24px" }}>
              <h3>Result</h3>
              <img
                src={results[selectedMethod]}
                alt="Result"
                style={{ maxWidth: "100%", borderRadius: "12px" }}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;