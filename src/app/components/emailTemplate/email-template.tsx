import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  actionType: 'created' | 'updated' | 'deleted';
  description?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  intervalInDays?: number;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  firstName,
  actionType,
  description,
  startDate,
  endDate,
  type,
  intervalInDays,
}) => (
  <div
    style={{
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6',
      backgroundColor: '#f4f4f4',
      padding: '20px',
      color: '#333',
      maxWidth: '600px',
      margin: '0 auto',
      borderRadius: '8px',
    }}
  >
    <div
      style={{
        backgroundColor: '#007bff',
        padding: '20px',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#ffffff', fontSize: '24px', margin: 0 }}>
        {actionType === 'created' && `Your Reminder has been Created!`}
        {actionType === 'updated' && `Your Reminder has been Updated!`}
        {actionType === 'deleted' && `Your Reminder has been Deleted!`}
      </h1>
    </div>

    <div
      style={{
        padding: '20px',
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
      }}
    >
      <p style={{ fontSize: '16px' }}>
        Hi {firstName},
      </p>
      <p style={{ fontSize: '16px' }}>
        {actionType === 'created' && `Your reminder has been created successfully.`}
        {actionType === 'updated' && `Your reminder has been updated successfully.`}
        {actionType === 'deleted' && `Your reminder has been deleted successfully.`}
      </p>
      {description && <p style={{ fontSize: '16px' }}>Description: {description}</p>}
      {startDate && <p style={{ fontSize: '16px' }}>Start Date: {startDate}</p>}
      {endDate && <p style={{ fontSize: '16px' }}>End Date: {endDate}</p>}
      {type && <p style={{ fontSize: '16px' }}>Type: {type}</p>}
      {intervalInDays !== undefined && (
        <p style={{ fontSize: '16px' }}>Interval: {intervalInDays} day(s)</p>
      )}
      <p style={{ fontSize: '16px' }}>
        Best regards,
        <br />
        The OrthoChat Team
      </p>
    </div>

    <div
      style={{
        marginTop: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#777',
      }}
    >
      <p style={{ margin: '0 0 8px 0' }}>
        OrthoChat Inc. | 123 Healthcare Ave, Suite 456 | City, State ZIP
      </p>
      <p style={{ margin: '0' }}>
        If you no longer wish to receive emails from us, you can{' '}
        <a
          href="#"
          style={{ color: '#007bff', textDecoration: 'underline' }}
        >
          unsubscribe here
        </a>.
      </p>
    </div>
  </div>
);
