import React from 'react';

const Loading = ({ text }) => {
  return (
    <div className="h-full w-full flex flex-col bg-gray-900  justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-8 border-cyan-600"></div>
      {text && (
        <h2 className="text-4xl text-gray-300 mt-4 font-bold">{text}...</h2>
      )}
    </div>
  );
};
export default Loading;
