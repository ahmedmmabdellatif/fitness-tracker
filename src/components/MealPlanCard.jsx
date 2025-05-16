import React, { useState } from 'react';

export default function MealPlanCard({ meals }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Meal Plan</h2>
      {meals.map((meal, idx) => {
        const [choice, setChoice] = useState(0);
        return (
          <div key={idx} className="mb-4">
            <div className="font-bold">{meal.label}</div>
            <div className="flex gap-2 mb-2">
              {meal.choices.map((_, i) => (
                <button
                  key={i}
                  className={`px-2 py-1 rounded border ${choice === i ? 'bg-blue-500 text-white' : ''}`}
                  onClick={() => setChoice(i)}
                >
                  Choice {i + 1}
                </button>
              ))}
            </div>
            <ul className="list-disc pl-5">
              {meal.choices[choice].map((item, i) => (
                <li key={i}>
                  <label><input type="checkbox" className="mr-2" />{item}</label>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
