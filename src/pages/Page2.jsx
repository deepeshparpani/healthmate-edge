import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button.jsx";

function Page2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Get summary from navigation state
  const summary = location.state?.summary || "No summary available";

  const pdfPath = location.state?.pdf
    ? location.state.pdf.path
    : null;

  const toggleSpeech = () => {
    if (isSpeaking) {
      // Pause speech
      window.speechSynthesis.pause();
      setIsSpeaking(false);
      console.log("Speech paused");
    } else {
      // Resume or start speech
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsSpeaking(true);
        console.log("Speech resumed");
      } else {
        // Start new speech
        console.log("Speaking summary:", summary);

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(summary);
        utterance.rate = 0.9; // Slightly slower than normal
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => {
          setIsSpeaking(true);
          console.log("Speech started");
        };

        utterance.onend = () => {
          console.log("Speech completed");
          setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
          console.error("Speech error:", event.error);
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, color: "#333" }}>
          Summary
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={toggleSpeech}
            disabled={!summary || summary === "No summary available"}
            style={{
              padding: "8px 12px",
              backgroundColor:
                summary && summary !== "No summary available"
                  ? isSpeaking
                    ? "#FF5722"
                    : "#4CAF50"
                  : "#ccc",
              color:
                summary && summary !== "No summary available"
                  ? "white"
                  : "#666",
              border: "none",
              borderRadius: "6px",
              cursor:
                summary && summary !== "No summary available"
                  ? "pointer"
                  : "not-allowed",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            title={
              summary && summary !== "No summary available"
                ? isSpeaking
                  ? "Pause speech"
                  : "Play speech"
                : "No summary available"
            }
          >
            {isSpeaking ? "⏸️" : "▶️"} {isSpeaking ? "Pause" : "Play"}
          </button>
          <Button onClick={() => navigate("/")}>Home</Button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          height: "calc(100vh - 120px)",
        }}
      >
        {/* Left Section - PDF Viewer */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #e0e0e0",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              padding: "15px",
              backgroundColor: "#4a90e2",
              color: "white",
              fontWeight: "bold",
            }}
          >
            PDF Viewer
          </div>
          {
            pdfPath && (
                <div
            style={{
              flex: 1,
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <iframe
              src={pdfPath}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "4px",
              }}
              title="PDF Viewer"
            />
          </div>
            )
          }
        </div>

        {/* Right Section - Summary Display */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              padding: "15px",
              backgroundColor: "#50c878",
              color: "white",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Summary</span>
          </div>
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              backgroundColor: "#fafafa",
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px 0",
                  color: "#333",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                Medical Report Summary
              </h3>
              <div
                style={{
                  color: "#555",
                  fontSize: "15px",
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                }}
              >
                {summary}
              </div>
            </div>

            {summary !== "No summary available" && (
              <div
                style={{
                  backgroundColor: "#e8f5e8",
                  padding: "15px",
                  borderRadius: "6px",
                  border: "1px solid #c8e6c8",
                }}
              >
                <div
                  style={{
                    color: "#2e7d32",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  💡 Summary Generated
                </div>
                <div
                  style={{
                    color: "#388e3c",
                    fontSize: "13px",
                  }}
                >
                  This summary has been automatically generated from your
                  uploaded PDF document. Click the play button above to hear it
                  read aloud.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page2;
