
import {
  RefreshCw,
  Droplets,
  BarChart3,
  Settings2
} from "lucide-react";

const methods = [
  {
    id: "positive",
    title: "Negative to Positive",
    description: "Convert film negative into positive image.",
    icon: RefreshCw,
    color: "purple",
    tag: "Color Inversion"
  },
  {
    id: "gaussian",
    title: "Gaussian Filter",
    description: "Reduce image noise using Gaussian convolution.",
    icon: Droplets,
    color: "blue",
    tag: "Noise Reduction"
  },
  {
    id: "histogram",
    title: "Histogram Equalization",
    description: "Improve image contrast and brightness.",
    icon: BarChart3,
    color: "orange",
    tag: "Contrast Enhancement"
  }
];

function ProcessingPanel({
  selectedMethod,
  onMethodChange,
  onProcess,
  isProcessing
}) {
  return (
    <section className="processing-section">

      <div className="section-heading">
        <div>
          <h3>Image Processing Methods</h3>
          <p>Select a method to process your image.</p>
        </div>
      </div>

      <div className="processing-grid">

        {methods.map((method) => {
          const Icon = method.icon;

          return (
            <div
              key={method.id}
              className={`processing-card ${
                selectedMethod === method.id ? "selected" : ""
              }`}
              onClick={() => onMethodChange(method.id)}
            >

              <div className={`method-icon ${method.color}`}>
                <Icon size={24} />
              </div>

              <span className="method-tag">
                {method.tag}
              </span>

              <h4>{method.title}</h4>

              <p>{method.description}</p>

              <div className="card-footer">
                <span>
                  {selectedMethod === method.id
                    ? "Selected"
                    : "Select Method"}
                </span>

                <Settings2 size={17} />
              </div>

            </div>
          );
        })}

      </div>

      <button
        className="process-button"
        onClick={onProcess}
        disabled={isProcessing}
      >
        <RefreshCw size={18} />
        {isProcessing ? "Processing..." : "Process Image"}
      </button>

    </section>
  );
}

export default ProcessingPanel;
