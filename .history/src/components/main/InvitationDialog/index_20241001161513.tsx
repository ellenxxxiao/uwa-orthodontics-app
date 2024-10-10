import React, { useState } from "react";

// 模态对话框组件
function InvitationDialog({ isOpen, onClose, onSend }) {
  if (!isOpen) return null;

  const [email, setEmail] = useState("");

  return (
    <>
      <div className="modal-backdrop">
        <div className="modal">
          <h2>Invitation</h2>
          <p>Add a patient.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <button onClick={() => onSend(email)}>Send</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal {
          background: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 300px; // 可根据需求调整宽度
        }
      `}</style>
    </>
  );
}

export default InvitationDialog;
