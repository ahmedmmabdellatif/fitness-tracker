import React, { useState } from 'react';

export default function WorkoutTracker({ workouts }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Workout - Day 1</h2>
      {workouts.map((w, idx) => {
        const [weight, setWeight] = useState('');
        return (
          <div key={idx} className="mb-4 border-b pb-2">
            <div className="font-bold">{w.name}</div>
            <div>Sets: {w.sets}, Reps: {w.reps}, Tempo: {w.tempo}, Rest: {w.rest}</div>
            {w.video && (
              <iframe
                className="my-2"
                width="100%"
                height="200"
                src={`https://drive.google.com/file/d/${w.video.split('/d/')[1].split('/')[0]}/preview`}
                allow="autoplay"
              ></iframe>
            )}
            <input
              type="text"
              placeholder="Weight used (kg)"
              className="border p-1 w-full"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
