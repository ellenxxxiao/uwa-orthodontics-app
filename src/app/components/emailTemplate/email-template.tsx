import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
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
        Welcome to OrthoChat, {firstName}!
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
        We're excited to have you on board! OrthoChat is designed to make
        communication in the healthcare space easier and more efficient.
        Whether you're chatting with colleagues or organizing patient records,
        we're here to help.
      </p>
      <p style={{ fontSize: '16px' }}>
        If you ever need any assistance, don't hesitate to reach out to our
        support team.
      </p>
      <p style={{ fontSize: '16px', marginBottom: '0' }}>
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
      <p>
        OrthoChat Inc. | 123 Healthcare Ave, Suite 456 | City, State ZIP
      </p>
      <p>
        If you no longer wish to receive emails from us, you can{' '}
        <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>
          unsubscribe here
        </a>.
      </p>
    </div>
  </div>
);
