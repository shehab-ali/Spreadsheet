import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedView: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Dashboard');
  };

  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this SpreadSheet.</p>
      <button onClick={handleClick}>Return</button>
    </div>
  );
};

export default UnauthorizedView;
