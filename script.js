pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.js';

let fullPlan = {};

const output = document.getElementById('output');
const input = document.getElementById('pdfInput');

input.addEventListener('change', async function (e) {
  const file = e.target.files[0];
  if (!file) return;

  output.innerHTML = `<div class="text-center text-gray-700 animate-pulse">⏳ Analyzing PDF: <strong>${file.name}</strong>...</div>`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str).join(' ');
      fullText += strings + '\n';
    }

    fullPlan = structurePlan(fullText);
    renderCalendar(fullPlan, fullText);
  } catch (err) {
    output.innerHTML = `<div class="text-red-600 font-bold text-center mt-4">❌ Error processing PDF: ${err.message}</div>`;
  }
});

function structurePlan(text) {
  const plan = {};
  const dayRegex = /DAY\s*(\d+)/gi;
  const blocks = text.split(/DAY\s*\d+/gi);
  let matches = [...text.matchAll(dayRegex)];

  matches.forEach((match, i) => {
    const day = `Day ${match[1]}`;
    plan[day] = extractSections(blocks[i + 1] || '');
  });

  return plan;
}

function extractSections(text) {
  const sections = {
    workout: [],
    meals: [],
    supplements: [],
    cardio: [],
    rehab: []
  };

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (
      /EXCERSISE\s+SETS\s+REPS/i.test(line) ||
      /REST TIME/i.test(line) ||
      /^Day\s+\w+/i.test(line) ||
      /CLICK THE NAME|YOU ALREADY KNOW|OFF\s+–\s+OR/i.test(line)
    ) continue;

    if (/meal|snack/i.test(line)) {
      sections.meals.push(line);
      continue;
    }
    if (/supplement|creatine|omega|vitamin|protein/i.test(line)) {
      sections.supplements.push(line);
      continue;
    }
    if (/cardio|bike|treadmill|post workout/i.test(line)) {
      sections.cardio.push(line);
      continue;
    }
    if (/rehab|stretch|plank|bridge|rotation|band|foam roller|bird dog/i.test(line)) {
      sections.rehab.push(line);
      continue;
    }

    const workoutPattern = /([a-z\s]+)\s+(\d)\s+TEMPO\s+(\d{1,2}\s*[-–]?\s*\d{1,2})\s+(\d{1,2}\s*[-–]?\s*\d{1,2})\s*Secs?/i;
    const match = line.match(workoutPattern);

    if (match) {
      const [_, name, sets, reps, rest] = match;
      const cleaned = `${name.trim()} | ${sets} | ${reps} | ${rest} Secs`;
      sections.workout.push(cleaned);
    }
  }

  return sections;
}

function renderCalendar(plan, rawText = '') {
  output.innerHTML = '';
  const dayTabs = document.createElement('div');
  dayTabs.className = 'flex flex-wrap gap-2 mb-4';

  const contentArea = document.createElement('div');

  Object.keys(plan).forEach((day, idx) => {
    const tab = document.createElement('button');
    tab.textContent = day;
    tab.className = 'px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700';
    tab.addEventListener('click', () => renderDayContent(day, plan[day], contentArea));
    dayTabs.appendChild(tab);
    if (idx === 0) renderDayContent(day, plan[day], contentArea);
  });

  output.appendChild(dayTabs);
  output.appendChild(contentArea);

  // Debug dump
  const debug = document.createElement('pre');
  debug.className = 'mt-6 bg-gray-100 p-4 text-xs overflow-auto';
  debug.innerText = `\n--- RAW TEXT ---\n\n${rawText}\n\n--- STRUCTURED PLAN ---\n\n${JSON.stringify(plan, null, 2)}`;
  output.appendChild(debug);
}

function renderDayContent(day, data, container) {
  container.innerHTML = `<h2 class='text-xl font-bold mb-2'>${day}</h2>`;

  ['workout', 'meals', 'supplements', 'cardio', 'rehab'].forEach(section => {
    if (!data[section] || !data[section].length) return;

    const sec = document.createElement('div');
    sec.className = 'mb-4';
    sec.innerHTML = `<h3 class='text-lg font-semibold mb-1 capitalize'>${section}</h3>`;

    data[section].forEach(line => {
      const div = document.createElement('div');
      div.className = 'border rounded p-2 my-1 bg-gray-50';
      div.textContent = line;
      sec.appendChild(div);
    });

    container.appendChild(sec);
  });
}
