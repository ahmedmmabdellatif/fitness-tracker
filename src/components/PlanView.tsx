import React, { useEffect, useState } from 'react';

const PlanView = () => {
  const [plan, setPlan] = useState(null);
  const [workoutProgress, setWorkoutProgress] = useState({});

  useEffect(() => {
    fetch('/full_structured_fitness_plan.json')
      .then(res => res.json())
      .then(data => setPlan(data));
  }, []);

  const handleCheckboxChange = (day, exercise) => {
    setWorkoutProgress(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [exercise]: !prev[day]?.[exercise]
      }
    }));
  };

  const handleInputChange = (day, exercise, field, value) => {
    setWorkoutProgress(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [exercise]: {
          ...prev[day]?.[exercise],
          [field]: value
        }
      }
    }));
  };

  if (!plan) return <div className="p-4 text-lg">Loading plan...</div>;

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <section>
        <h1 className="text-2xl font-bold mb-2">Trainee Info</h1>
        <ul className="grid grid-cols-2 gap-4 text-sm">
          {Object.entries(plan.trainee_info).map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {value}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Injuries</h2>
        <ul className="list-disc list-inside text-sm mt-1">
          {plan.injuries.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Macros</h2>
        <ul className="grid grid-cols-2 gap-4 text-sm">
          {Object.entries(plan.macros).map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {value}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Meal Plan</h2>
        {Object.entries(plan.meal_plan).map(([meal, options]) => (
          <div key={meal} className="mt-4">
            <h3 className="font-medium capitalize">{meal.replace('_', ' ')}</h3>
            {typeof options === 'object' && !Array.isArray(options) ? (
              Object.entries(options).map(([choice, items]) => (
                <div key={choice} className="ml-4 mt-2">
                  <strong>{choice}:</strong>
                  <ul className="list-disc list-inside text-sm">
                    {items.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
              ))
            ) : (
              <ul className="list-disc list-inside text-sm ml-4">
                {options.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Supplements</h2>
        <ul className="list-disc list-inside text-sm">
          {Object.entries(plan.supplements).map(([supplement, dosage]) => (
            <li key={supplement}><strong>{supplement}:</strong> {dosage}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Cardio Plan</h2>
        <ul className="list-disc list-inside text-sm">
          {Object.entries(plan.cardio_plan).map(([week, routine]) => (
            <li key={week}><strong>{week}:</strong> {routine}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Food Sources</h2>
        {Object.entries(plan.food_sources).map(([category, items]) => (
          <div key={category} className="mt-3">
            <strong className="capitalize">{category}:</strong>
            <ul className="list-disc list-inside text-sm ml-4">
              {items.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        ))}
      </section>

      {plan.workout_schedule && (
        <section>
          <h2 className="text-xl font-semibold">Workout Plan</h2>
          {Object.entries(plan.workout_schedule).map(([day, exercises]) => (
            <div key={day} className="mt-4 border-t pt-4">
              <h3 className="text-lg font-bold mb-2">{day}</h3>
              {exercises.map((ex, idx) => (
                <div key={idx} className="border p-3 mb-2 rounded bg-white shadow">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={workoutProgress[day]?.[ex.name] === true}
                      onChange={() => handleCheckboxChange(day, ex.name)}
                    />
                    <span className="font-medium">{ex.name}</span>
                  </label>
                  <div className="ml-6 text-sm space-y-1">
                    <div>Sets: {ex.sets}</div>
                    <div>Reps: {ex.reps}</div>
                    <div>Rest: {ex.rest}</div>
                    <div className="flex gap-2 items-center">
                      <label>Weight:</label>
                      <input
                        type="number"
                        className="border rounded px-2 py-1 text-sm w-24"
                        value={workoutProgress[day]?.[ex.name]?.weight || ''}
                        onChange={e => handleInputChange(day, ex.name, 'weight', e.target.value)}
                      />
                      <span>kg</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <label>Reps Done:</label>
                      <input
                        type="number"
                        className="border rounded px-2 py-1 text-sm w-24"
                        value={workoutProgress[day]?.[ex.name]?.doneReps || ''}
                        onChange={e => handleInputChange(day, ex.name, 'doneReps', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default PlanView;
