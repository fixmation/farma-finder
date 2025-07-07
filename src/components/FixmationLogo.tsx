
import React from 'react';

const FixmationLogo: React.FC = () => {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <circle cx="50" cy="50" r="45" fill="#3B82F6"/>
      <path 
        d="M30 35h40v8H45v12h20v8H45v15h-15V35z" 
        fill="white"
      />
      <circle cx="75" cy="25" r="8" fill="#10B981"/>
    </svg>
  );
};

export default FixmationLogo;
