import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  actionType: "created" | "updated" | "deleted";
  description: string;
  startDate: string;
  endDate: string;
  type: string;
  intervalInDays: number;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  firstName,
  actionType,
  description,
  startDate,
  endDate,
  type,
  intervalInDays
}) => {
  // Define a subject line based on the action type
  const actionMessages = {
    created: "New Reminder Created",
    updated: "Reminder Updated",
    deleted: "Reminder Deleted",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        color: "#333",
        maxWidth: "600px",
        margin: "0 auto",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          backgroundColor: "#007bff",
          padding: "20px",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <h1>{actionMessages[actionType]}</h1>
      </div>

      <div
        style={{
          padding: "20px",
          backgroundColor: "#ffffff",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <p style={{ fontSize: "16px" }}>
          Hi {firstName},
        </p>

        <p style={{ fontSize: "16px" }}>
          {description}
        </p>

        <ul style={{ fontSize: "16px", listStyleType: "none", padding: 0 }}>
          <li><strong>Type:</strong> {type}</li>
          <li><strong>Start Date:</strong> {formatDate(startDate)}</li>
          <li><strong>End Date:</strong> {formatDate(endDate)}</li>
          <li><strong>Repeat Interval:</strong> Every {intervalInDays} days</li>
        </ul>

        <p style={{ fontSize: "16px", marginTop: "20px" }}>
          Thank you for using OrthoChat!
        </p>

        <p style={{ fontSize: "14px", color: "#777", textAlign: "center" }}>
          OrthoChat | 123 Healthcare St. | City, State, ZIP
        </p>
      </div>
    </div>
  );
};
