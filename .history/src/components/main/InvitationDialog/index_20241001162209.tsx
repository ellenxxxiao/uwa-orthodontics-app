import React, { useState } from "react";

// InvitationDialog 组件
function InvitationDialog({ isOpen, onClose, onSend }) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

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
        zIndex: 1000 // 确保模态在最前面
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          width: "300px", // 根据需要调整宽度
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h2 style={{ margin: "0 0 20px 0" }}>Invitation</h2>
        <p style={{ margin: "0 0 20px 0" }}>Add a patient.</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: "100%", marginBottom: "20px", padding: "10px" }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between"
          }}
        >
          <button onClick={onClose} style={{ marginRight: "10px" }}>
            Cancel
          </button>
          <button onClick={() => onSend(email)}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default InvitationDialog;
