import React from 'react';
import FileUpload from '../components/FileUpload';

export default function App() {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Fitness Tracker</h1>
      <FileUpload />
    </div>
  );
}