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
    renderCalendar(fullPlan);
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

  lines.forEach(line => {
    if (line.match(/meal|snack/i)) sections.meals.push(line);
    else if (line.match(/supplement|creatine|omega|vitamin|protein/i)) sections.supplements.push(line);
    else if (line.match(/bike|cardio|post workout/i)) sections.cardio.push(line);
    else if (line.match(/rehab|bridge|plank|rotation|bird dog|stretch/i)) sections.rehab.push(line);
    else if (line.match(/\|.*\|.*\|/)) sections.workout.push(line);
  });

  return sections;
}

function renderCalendar(plan) {
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
      div.className = 'border rounded p-4 my-2 bg-gray-50 shadow';

      // Workout line format: name | sets | reps | rest | media
      const parts = line.split('|').map(p => p.trim());
      const hasMedia = parts.length >= 5;

      if (parts.length >= 4) {
        div.innerHTML = `
          <div class="flex justify-between items-center mb-2">
            <span class="text-blue-700 font-bold">${parts[0]}</span>
            <label class="inline-flex items-center">
              <input type="checkbox" class="mr-2"> Done
            </label>
          </div>
          <div class="grid grid-cols-3 gap-2 text-sm mb-2">
            <label>Sets: <input type="text" value="${parts[1]}" class="border rounded px-1 py-0.5 w-full"></label>
            <label>Reps: <input type="text" value="${parts[2]}" class="border rounded px-1 py-0.5 w-full"></label>
            <label>Rest: <input type="text" value="${parts[3]}" class="border rounded px-1 py-0.5 w-full"></label>
          </div>
        `;
        if (hasMedia && parts[4]) {
          const media = detectAndRenderMedia(parts[4]);
          if (media) div.appendChild(media);
        }
      } else {
        div.textContent = line; // fallback for non-structured lines
      }

      sec.appendChild(div);
    });

    container.appendChild(sec);
  });
}

function detectAndRenderMedia(url) {
  url = url.trim();
  const wrapper = document.createElement('div');
  wrapper.className = 'mt-2';

  if (!url) return null;

  if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
    const img = document.createElement('img');
    img.src = url;
    img.className = 'w-full max-h-64 object-contain rounded border';
    wrapper.appendChild(img);
  } else if (url.includes('youtube.com/watch')) {
    const embedUrl = url.replace('watch?v=', 'embed/') + '?autoplay=1';
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.className = 'w-full h-64 rounded';
    iframe.allow = 'autoplay; encrypted-media';
    wrapper.appendChild(iframe);
  } else if (url.includes('drive.google.com')) {
    const previewUrl = url.replace('/view', '/preview') + '?autoplay=1';
    const iframe = document.createElement('iframe');
    iframe.src = previewUrl;
    iframe.className = 'w-full h-64 rounded';
    iframe.allow = 'autoplay';
    wrapper.appendChild(iframe);
  } else {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = 'Open Media';
    link.target = '_blank';
    link.className = 'text-blue-600 underline';
    wrapper.appendChild(link);
  }

  return wrapper;
}
