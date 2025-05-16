import React from 'react';

export default function SupplementTracker({ supplements }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Supplements</h2>
      <ul className="list-disc pl-5">
        {supplements.map((supp, idx) => (
          <li key={idx}>
            <label><input type="checkbox" className="mr-2" />{supp.name} — <em>{supp.timing}</em></label>
          </li>
        ))}
      </ul>
    </div>
  );
}
