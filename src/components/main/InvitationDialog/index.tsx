import React, { useState } from "react";

interface InvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: string) => void;
}

function InvitationDialog({ isOpen, onClose, onSend }: InvitationDialogProps) {
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const handleSend = (email: string) => {
    onSend(email); 
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false); 
      onClose(); 
    }, 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          width: "350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h2 style={{ marginBottom: "10px", fontSize: "24px", color: "#333" }}>
          Invitation
        </h2>
        <p style={{ marginBottom: "20px", fontSize: "16px", color: "#666" }}>
          Add a patient.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{
            width: "100%",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between"
          }}
        >
          <button
            onClick={onClose}
            style={{
              marginRight: "10px",
              backgroundColor: "#f44336",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleSend(email)}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Send
          </button>
        </div>
        {showToast && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              background: "rgba(0, 150, 0, 0.9)",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "16px"
            }}
          >
            Sending Successful!
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitationDialog;
