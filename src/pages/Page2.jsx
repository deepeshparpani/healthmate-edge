import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';

function Page2() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Page 2</h1>
      <Button onClick={() => navigate('/')}>Back to Page 1</Button>
    </div>
  );
}

export default Page2;
