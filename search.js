const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
let data = [];

// Load your resources.json
fetch('resources.json') // Make sure this path is correct
  .then(res => res.json())
  .then(json => data = json)
  .catch(err => console.error('Error loading JSON:', err));

// Escape HTML to prevent breaking links
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

searchInput.addEventListener('input', function() {
  const query = this.value.trim().toLowerCase();
  resultsDiv.innerHTML = '';
  if (!query) return;

  const filtered = data.filter(item =>
    (item.subject || '').toLowerCase().includes(query) ||
    (Array.isArray(item.topics) && item.topics.some(t => t.toLowerCase().includes(query)))
  );

  filtered.forEach(item => {
    const div = document.createElement('div');
    div.style.borderBottom = '1px solid #ccc';
    div.style.padding = '5px 0';

    // Build HTML for links
    const linksHtml = Array.isArray(item.links) && item.links.length
      ? `<ul>${item.links.map(link => `<li><a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.name)}</a></li>`).join('')}</ul>`
      : '';

    // Show subject and subtopics
    div.innerHTML = `<strong>${escapeHtml(item.subject)}</strong><br>
                     <small>${(item.topics || []).join(', ')}</small>
                     ${linksHtml}`;

    // Optional: click to fill input
    div.addEventListener('click', () => {
      searchInput.value = item.subject;
      resultsDiv.innerHTML = '';
    });

    resultsDiv.appendChild(div);
  });

  if (filtered.length === 0) {
    resultsDiv.innerHTML = '<p>No results found.</p>';
  }
});
