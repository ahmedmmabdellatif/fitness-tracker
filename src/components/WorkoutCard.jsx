import React, { useState } from "react";

function WorkoutCard({ exercise }) {
  const [completed, setCompleted] = useState(false);
  const [inputWeight, setInputWeight] = useState(0);
  const [inputReps, setInputReps] = useState(0);

  return (
    <div className="border p-4 mb-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{exercise.name}</h3>
          <p>
            Sets: {exercise.sets} | Reps: {exercise.reps} | Rest: {exercise.rest} sec
          </p>
        </div>
        <input
          type="checkbox"
          checked={completed}
          onChange={() => setCompleted(!completed)}
          className="w-6 h-6"
        />
      </div>
      <div className="mt-2">
        <label className="block">Weight (kg):</label>
        <input
          type="number"
          value={inputWeight}
          onChange={(e) => setInputWeight(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        <label className="block mt-2">Reps Done:</label>
        <input
          type="number"
          value={inputReps}
          onChange={(e) => setInputReps(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      {exercise.videoUrl && (
        <div className="mt-4">
          <iframe
            src={exercise.videoUrl}
            title="Exercise Video"
            className="w-full h-64"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default WorkoutCard;
