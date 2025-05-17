import * as pdfjsLib from './pdfjs/pdf.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = './pdfjs/pdf.worker.js';

const output = document.getElementById('output');
const input = document.getElementById('pdfInput');

input.addEventListener('change', async function (e) {
  const file = e.target.files[0];
  if (!file) return;

  output.innerHTML = `<div class="text-center text-gray-700 animate-pulse">⏳ Processing PDF: <strong>${file.name}</strong>...</div>`;

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

    if (!fullText.trim()) throw new Error('No text content found in PDF.');

    parseWorkoutPlan(fullText, file.name);
  } catch (err) {
    output.innerHTML = `<div class="text-red-600 font-bold text-center mt-4">❌ Error processing PDF: ${err.message}</div>`;
  }
});

function parseWorkoutPlan(text, fileName) {
  output.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'text-center font-semibold text-green-700 mb-4';
  header.textContent = `✅ Successfully parsed: ${fileName}`;
  output.appendChild(header);

  const dayBlocks = text.split(/Day\s*\d+/i).filter(Boolean);

  if (dayBlocks.length === 0) {
    output.innerHTML += `<div class="text-yellow-700 text-center font-medium">⚠️ No 'Day X' blocks found in this file. Please check format.</div>`;
    return;
  }

  dayBlocks.forEach((block, index) => {
    const day = document.createElement('div');
    day.className = 'bg-white p-4 rounded-lg shadow border';

    const title = document.createElement('h2');
    title.className = 'text-xl font-bold mb-2';
    title.textContent = `Day ${index + 1}`;
    day.appendChild(title);

    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
    lines.forEach((line) => {
      const card = document.createElement('div');
      card.className = 'border rounded p-2 my-1 bg-gray-50';

      const label = document.createElement('label');
      label.className = 'flex items-center space-x-2';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';

      const span = document.createElement('span');
      span.textContent = line;

      label.appendChild(checkbox);
      label.appendChild(span);
      card.appendChild(label);

      if (line.includes('http')) {
        const linkMatch = line.match(/(https?:\/\/[^\s]+)/);
        if (linkMatch) {
          const iframe = document.createElement('iframe');
          iframe.src = linkMatch[1];
          iframe.className = 'mt-2 w-full h-48';
          iframe.allow = 'autoplay; encrypted-media';
          card.appendChild(iframe);
        }
      }

      day.appendChild(card);
    });

    output.appendChild(day);
  });
}
