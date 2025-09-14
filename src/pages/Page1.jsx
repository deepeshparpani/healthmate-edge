import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Page1() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [role, setRole] = useState('patient');
  const [detail, setDetail] = useState('');
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setDetail('');
    setPdf(null);
    setError('');
  };

  const handleDetailChange = (e) => {
    setDetail(e.target.value);
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdf(file);
      setError('');
    } else if (file) {
      setPdf(null);
      setError('Only PDF files are allowed.');
    } else {
      setPdf(null);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setPdf(file);
      setError('');
    } else if (file) {
      setPdf(null);
      setError('Only PDF files are allowed.');
    }
  };

  const handleCustomFileClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pdf) {
      setError('Please upload a PDF file.');
      return;
    }
    if (role === 'patient' && !detail) {
      setError('Please select the report detail level.');
      return;
    }
    if (pdf && pdf.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }
    setError('');
    // TODO: Pass pdf and detail to your AI model here
    navigate('/page2');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        padding: 32,
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        background: '#fff',
        fontFamily: 'Segoe UI, Arial, sans-serif'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#1976d2',
          fontWeight: 700,
          letterSpacing: 1,
          marginBottom: 32
        }}>
          HealthMate Edge
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <label style={{
            marginRight: 16,
            fontWeight: role === 'doctor' ? 600 : 400,
            color: role === 'doctor' ? '#1976d2' : '#333'
          }}>
            <input
              type="radio"
              value="doctor"
              checked={role === 'doctor'}
              onChange={handleRoleChange}
              style={{ marginRight: 6 }}
            />
            Doctor
          </label>
          <label style={{
            fontWeight: role === 'patient' ? 600 : 400,
            color: role === 'patient' ? '#1976d2' : '#333'
          }}>
            <input
              type="radio"
              value="patient"
              checked={role === 'patient'}
              onChange={handleRoleChange}
              style={{ marginRight: 6 }}
            />
            Patient
          </label>
        </div>

        {role === 'patient' && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Select Report Detail:</div>
            <label style={{ display: 'block', marginBottom: 6 }}>
              <input
                type="radio"
                name="detail"
                value="minimal"
                checked={detail === 'minimal'}
                onChange={handleDetailChange}
                style={{ marginRight: 6 }}
              />
              Minimal (Quick summary)
            </label>
            <label style={{ display: 'block', marginBottom: 6 }}>
              <input
                type="radio"
                name="detail"
                value="standard"
                checked={detail === 'standard'}
                onChange={handleDetailChange}
                style={{ marginRight: 6 }}
              />
              Standard (Balanced detail)
            </label>
            <label style={{ display: 'block', marginBottom: 12 }}>
              <input
                type="radio"
                name="detail"
                value="comprehensive"
                checked={detail === 'comprehensive'}
                onChange={handleDetailChange}
                style={{ marginRight: 6 }}
              />
              Comprehensive (Most detailed)
            </label>
          </div>
        )}

        {/* Drag-and-drop PDF upload */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '2px solid #1976d2' : '2px dashed #b0b8c1',
            borderRadius: 10,
            padding: 24,
            textAlign: 'center',
            background: dragActive ? '#e3f0ff' : '#f7fafd',
            marginBottom: 24,
            transition: 'border 0.2s, background 0.2s',
            cursor: 'pointer'
          }}
          onClick={handleCustomFileClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div style={{ fontWeight: 500, color: '#1976d2', marginBottom: 8 }}>
            {pdf ? 'PDF Selected:' : 'Drop your PDF here or'}
          </div>
          {pdf ? (
            <div style={{ color: '#1976d2', wordBreak: 'break-all', marginBottom: 8 }}>{pdf.name}</div>
          ) : (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); handleCustomFileClick(); }}
              style={{
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '7px 18px',
                fontWeight: 500,
                fontSize: 15,
                cursor: 'pointer',
                marginBottom: 0
              }}
            >
              Browse
            </button>
          )}
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '12px 0',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            marginBottom: 12
          }}
        >
          Submit
        </button>
        {error && <div style={{ color: 'red', textAlign: 'center', marginTop: 4 }}>{error}</div>}
      </div>
    </div>
  );
}

export default Page1;