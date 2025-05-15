import React, { useState } from 'react';
export default function Dashboard({ user }) {
  const [fileName, setFileName] = useState('');
  const [planContent, setPlanContent] = useState('');
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setPlanContent('✅ Sample Plan Extracted:\n- Workout A\n- Meal Plan B\n- Supplement C');
    }
  };
  return (
    <div className='min-h-screen bg-white p-8'>
      <h1 className='text-3xl font-bold text-blue-600 mb-6'>Welcome, {user.email}</h1>
      <div className='bg-gray-100 p-6 rounded shadow'>
        <h2 className='text-xl font-semibold mb-4'>Upload Your PDF Plan</h2>
        <input type='file' onChange={handleFileChange} className='mb-4' />
        {fileName && <p className='text-gray-700'>Uploaded: {fileName}</p>}
        {planContent && <pre className='mt-4 p-4 bg-white border rounded text-sm whitespace-pre-wrap'>{planContent}</pre>}
      </div>
    </div>
  );
}