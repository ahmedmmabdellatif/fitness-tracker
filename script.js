// Enhanced parser with autoplay media rendering
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

    parseWorkoutPlan(fullText);
  } catch (err) {
    output.innerHTML = `<div class="text-red-600 font-bold text-center mt-4">❌ Error processing PDF: ${err.message}</div>`;
  }
});

function parseWorkoutPlan(text) {
  output.innerHTML = '';

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const exercisePattern = /^(.+)\s*\|\s*(\d+)\s*\|\s*([\d\-]+)\s*\|\s*([\d\-]+\s*Secs?)\s*\|?\s*(.*)?$/i;

  lines.forEach((line, index) => {
    const match = line.match(exercisePattern);
    if (match) {
      const [, name, sets, reps, rest, media] = match;

      const card = document.createElement('div');
      card.className = 'border rounded p-4 mb-4 shadow bg-white';

      const header = document.createElement('div');
      header.className = 'text-lg font-bold text-blue-700 mb-2';
      header.textContent = name;
      card.appendChild(header);

      const inputs = document.createElement('div');
      inputs.className = 'grid grid-cols-3 gap-4 mb-2';
      inputs.innerHTML = `
        <div><label>Sets: <input type="number" value="${sets}" class="border p-1 w-full rounded"></label></div>
        <div><label>Reps: <input type="text" value="${reps}" class="border p-1 w-full rounded"></label></div>
        <div><label>Rest: <input type="text" value="${rest}" class="border p-1 w-full rounded"></label></div>
      `;
      card.appendChild(inputs);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'mr-2';
      const label = document.createElement('label');
      label.className = 'flex items-center mb-2';
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' Mark as done'));
      card.appendChild(label);

      if (media) {
        const mediaElement = detectAndRenderMedia(media);
        if (mediaElement) card.appendChild(mediaElement);
      }

      output.appendChild(card);
    }
  });
}

function detectAndRenderMedia(url) {
  url = url.trim();
  if (!url) return null;

  const wrapper = document.createElement('div');
  wrapper.className = 'mt-2';

  if (url.match(/\.(jpeg|jpg|png|gif)$/i)) {
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
