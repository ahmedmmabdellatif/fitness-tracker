import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { getDocument } from "pdfjs-dist";
import WorkoutCard from "./components/WorkoutCard";

import "./App.css";

function App() {
  const [parsedPlan, setParsedPlan] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;

    const textChunks = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      textChunks.push(pageText);
    }

    const rawText = textChunks.join("\n");
    const structuredPlan = parseWorkoutPlan(rawText);
    setParsedPlan(structuredPlan);
  };

  const parseWorkoutPlan = (text) => {
    const dayRegex = /Day\s+\d+[:\-]?\s*(.*?)\n/g;
    const exerciseRegex = /([A-Za-z].*?)\s+(\d+)\s+sets?\s+(\d+-?\d*)\s+reps?\s+(\d+-?\d*)\s*sec?\s+rest/gi;

    const plan = [];
    let days = text.split(/(?=Day\s+\d+)/i);
    for (let day of days) {
      const titleMatch = day.match(/^Day\s+\d+[:\-]?\s*(.*?)\n/);
      const title = titleMatch ? titleMatch[1] : "Unnamed Day";
      const exercises = [];
      let match;
      while ((match = exerciseRegex.exec(day)) !== null) {
        exercises.push({
          name: match[1].trim(),
          sets: match[2],
          reps: match[3],
          rest: match[4],
          videoUrl: null,
        });
      }
      if (exercises.length) plan.push({ title, exercises });
    }
    return plan;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Fitness Plan PDF</h1>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      {parsedPlan.map((day, index) => (
        <div key={index} className="my-6">
          <h2 className="text-xl font-semibold mb-2">{day.title}</h2>
          {day.exercises.map((ex, idx) => (
            <WorkoutCard key={idx} exercise={ex} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
