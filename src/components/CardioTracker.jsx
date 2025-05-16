import React from 'react';

export default function CardioTracker({ cardio }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Cardio Routine</h2>
      {cardio.map((entry, idx) => (
        <div key={idx} className="mb-2">
          <label>
            <input type="checkbox" className="mr-2" />
            <strong>Week {entry.week}</strong>: {entry.frequency}x/week — {entry.device}, {entry.duration}
          </label>
        </div>
      ))}
    </div>
  );
}
