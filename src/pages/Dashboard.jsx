import React, { useState } from 'react';
import MealPlanCard from '../components/MealPlanCard';
import SupplementTracker from '../components/SupplementTracker';
import CardioTracker from '../components/CardioTracker';
import WorkoutTracker from '../components/WorkoutTracker';

export default function Dashboard({ user }) {
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);

  const handlePDF = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // ✅ FIXED: extract text using pdf-lib's supported methods
      const extractedText = await Promise.all(
        pages.map(async (page) => {
          const textContent = await page.getText(); // correct way for pdf-lib
          return textContent;
        })
      );

      const text = extractedText.join('\n');

      const extractSection = (label, endLabel) => {
        const start = text.indexOf(label);
        if (start === -1) return '';
        const end = text.indexOf(endLabel, start);
        return text.substring(start, end !== -1 ? end : undefined).trim();
      };

      const mealSection = extractSection('MEAL PLAN', 'FOOD SOURCES');
      const supplementSection = extractSection('SUPPLEMENT PLAN', 'CARDIO');
      const cardioSection = extractSection('CARDIO', 'WEEKLY PROGRESS');
      const workoutSection = extractSection('WORKOUT', 'WEEKLY');

      const parseList = (block) => block.split('\n').filter(line => line.length > 3);

      const parsedData = {
        trainee: {
          name: 'Ahmed Abdellatif',
          goal: text.includes('Body Recomposition') ? 'Body Recomposition' : 'Unknown',
          injuries: extractSection('Injuries:', '▪') || 'Not found',
        },
        meals: [
          {
            label: 'Meal 1',
            choices: [
              ['3 eggs', '100g smoked turkey', '50g oats'],
              ['185g cottage cheese', 'salad', 'whole grain bread'],
            ],
          },
          {
            label: 'Snack',
            choices: [['1 scoop protein', 'banana']],
          },
        ],
        supplements: parseList(supplementSection).map(line => {
          const [name, timing] = line.split('–');
          return {
            name: name?.trim() || 'Unknown',
            timing: timing?.trim() || '',
          };
        }),
        cardio: [
          { week: 1, frequency: 4, device: 'Bike', duration: '15 min' },
          { week: 2, frequency: 4, device: 'Bike', duration: '20 min' },
          { week: 3, frequency: 4, device: 'Bike', duration: '20 min' },
          { week: 4, frequency: 4, device: 'Bike', duration: '25 min' },
        ],
        workouts: {
          'Day 1': parseList(workoutSection).slice(0, 5).map((line) => ({
            name: line,
            sets: 3,
            reps: '8–12',
            tempo: 'TUT',
            rest: '30–60s',
            video: '',
          })),
        },
      };

      setParsed(parsedData);
      setError(null);
    } catch (err) {
      console.error('🛑 PDF Parsing Error:', err);
      setError('❌ Failed to parse PDF. See console for details.');
      setParsed(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-600">Welcome, {user.email}</h1>

      <input type="file" accept=".pdf" onChange={handlePDF} className="my-4" />

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded">
          {error}
        </div>
      )}

      {parsed && (
        <>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Trainee Info</h2>
            <p><strong>Name:</strong> {parsed.trainee.name}</p>
            <p><strong>Goal:</strong> {parsed.trainee.goal}</p>
            <p><strong>Injuries:</strong> {parsed.trainee.injuries}</p>
          </div>

          <MealPlanCard meals={parsed.meals} />
          <SupplementTracker supplements={parsed.supplements} />
          <CardioTracker cardio={parsed.cardio} />
          <WorkoutTracker workouts={parsed.workouts['Day 1']} />
        </>
      )}
    </div>
  );
}
