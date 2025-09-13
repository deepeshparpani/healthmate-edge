import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';

function Page1() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Page 1</h1>
      <Button onClick={() => navigate('/page2')}>Go to Page 2</Button>
    </div>
  );
}

export default Page1;
