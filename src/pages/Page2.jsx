import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";

const { ipcRenderer } = window.require("electron");

function Page2() {
  const navigate = useNavigate();
  const [streamedWords, setStreamedWords] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const wordsContainerRef = useRef(null);
  const pdfPath = "~/Users/sricharanramesh/Work/Resume/1 pager.pdf";

  // Refs for event handlers to avoid stale closures
  const handleWordStreamRef = useRef(null);
  const handleStreamCompleteRef = useRef(null);

  useEffect(() => {
    // Create fresh event handlers
    const handleWordStream = (event, word) => {
      setStreamedWords((prev) => {
        console.log("Received word:", word);
        return [...prev, word];
      });

      if (wordsContainerRef.current) {
        wordsContainerRef.current.scrollTop =
          wordsContainerRef.current.scrollHeight;
      }
    };

    const handleStreamComplete = () => {
      console.log("Stream completed");
      setIsStreaming(false);
    };

    // Store refs for cleanup
    handleWordStreamRef.current = handleWordStream;
    handleStreamCompleteRef.current = handleStreamComplete;

    // Add listeners
    ipcRenderer.on("word-stream", handleWordStream);
    ipcRenderer.on("word-stream-complete", handleStreamComplete);

    // Start initial stream
    startWordStream();

    // Cleanup function
    return () => {
      console.log("Cleaning up event listeners");
      ipcRenderer.removeListener("word-stream", handleWordStream);
      ipcRenderer.removeListener("word-stream-complete", handleStreamComplete);
    };
  }, []);

  const stopCurrentStream = async () => {
    console.log("Stopping current stream");
    try {
      await ipcRenderer.invoke("stop-word-stream");
    } catch (error) {
      console.error("Error stopping stream:", error);
    }
  };

  const startWordStream = async () => {
    console.log("Starting word stream");
    setIsStreaming(true);
    setStreamedWords([]);

    try {
      await ipcRenderer.invoke("start-word-stream");
    } catch (error) {
      console.error("Error starting word stream:", error);
      setIsStreaming(false);
    }
  };

  const restartStream = async () => {
    console.log("Restarting stream");

    // First, stop the current stream and clear state
    await stopCurrentStream();
    setStreamedWords([]);
    setIsStreaming(false);

    // Wait a bit to ensure everything is cleaned up
    setTimeout(async () => {
      await startWordStream();
    }, 100);
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
          Page 2 - PDF Viewer & Word Stream
        </h1>
        <div>
          <Button
            onClick={restartStream}
            disabled={isStreaming}
            style={{ marginRight: "10px" }}
          >
            {isStreaming ? "Streaming..." : "Restart Stream"}
          </Button>
          <Button onClick={() => navigate("/")}>Back to Page 1</Button>
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
              src={`file://${pdfPath}`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "4px",
              }}
              title="PDF Viewer"
            />
          </div>
        </div>

        {/* Right Section - Word Stream */}
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
            <span>Word Stream</span>
            <span style={{ fontSize: "14px" }}>
              {streamedWords.length} words received
            </span>
          </div>
          <div
            ref={wordsContainerRef}
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              backgroundColor: "#fafafa",
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            {streamedWords.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                }}
              >
                {isStreaming ? (
                  // Skeleton loading effect
                  Array.from({ length: 20 }, (_, index) => (
                    <div
                      key={index}
                      style={{
                        height: "24px",
                        width: `${Math.random() * 40 + 20}px`,
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        margin: "2px",
                        animation:
                          "skeletonPulse 1.5s ease-in-out infinite alternate",
                        animationDelay: `${index * 0.1}s`,
                      }}
                    />
                  ))
                ) : (
                  <div
                    style={{
                      color: "#666",
                      textAlign: "center",
                      marginTop: "50px",
                      width: "100%",
                    }}
                  >
                    Click "Restart Stream" to begin
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                }}
              >
                {streamedWords.map((word, index) => (
                  <span
                    key={index}
                    style={{
                      animation: "fadeIn 0.3s ease-in",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes skeletonPulse {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}

export default Page2;
