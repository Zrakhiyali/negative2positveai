
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";
import ProcessingPanel from "./components/ProcessingPanel";

function App() {

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedMethod, setSelectedMethod] = useState("positive");

  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {

    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }

    alert("Backend connection will be added in the next step.");

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

          <ImageUploader
            onImageSelect={setSelectedImage}
          />

          <ProcessingPanel
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
            onProcess={handleProcess}
            isProcessing={isProcessing}
          />

        </section>

      </main>

    </div>
  );
}

export default App;
