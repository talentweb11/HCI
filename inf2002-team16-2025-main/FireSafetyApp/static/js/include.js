function wireIncludedUI(root) {
  // header title and subtitle
  // Prefer reading attributes directly from the include host element (root).
  // Fall back to searching ancestors only if the attribute is not present on the host.
  const titleAttr = root.getAttribute('data-title') || (root.closest('[data-title]') ? root.closest('[data-title]').getAttribute('data-title') : null);
  const subtitleAttr = root.getAttribute('data-subtitle') || (root.closest('[data-subtitle]') ? root.closest('[data-subtitle]').getAttribute('data-subtitle') : null);

  if (titleAttr) {
    const hdr = root.querySelector('#header-title');
    if (hdr) hdr.textContent = titleAttr;
  }

  // subtitle OR progress bar
  const sub = root.querySelector('#header-subtitle');
  if (sub) {
    const stepAttr = root.getAttribute('data-step');  // "1", "2", "3", or "4"
    const totalAttr = root.getAttribute('data-total'); // optional (default auto)
    const subtitleAttr = root.getAttribute('data-subtitle');

    if (stepAttr) {
      const current = parseInt(stepAttr, 10);
      const total = totalAttr ? parseInt(totalAttr, 10) : current < 4 ? 3 : 4;

      let segments = '';
      for (let i = 1; i <= total; i++) {
        segments += `<div class="step-segment ${i <= current ? 'active' : ''}"></div>`;
      }

      sub.innerHTML = `<div class="step-progress">${segments}</div>`;
      sub.style.display = '';
    }
    else if (subtitleAttr) {
      sub.textContent = subtitleAttr;
      sub.style.display = '';
    }
    else {
      sub.style.display = 'none';
    }
  }


  // back button
  const backBtn = root.querySelector('#back-btn');
  if (backBtn && !backBtn.dataset.wired) {
    backBtn.dataset.wired = '1';
    backBtn.onclick = () => window.history.back();
  }

  // footer buttons
  const homeBtn = root.querySelector('#home-btn');
  if (homeBtn && !homeBtn.dataset.wired) {
    homeBtn.dataset.wired = '1';
    homeBtn.onclick = () => { window.location.href = 'home.html'; };
  }

  // --- Session button ---
  const sessionBtn = root.querySelector('#session-btn');
  if (sessionBtn && !sessionBtn.dataset.wired) {
    sessionBtn.dataset.wired = '1';

    const updateSessionBtn = () => {
      const hasSession = sessionStorage.getItem('SessionInfo');
      const img = sessionBtn.querySelector('img');
      if (img) {

        img.alt = hasSession ? 'Leave Session' : 'Join Session';

      }

      sessionBtn.setAttribute('title', hasSession ? 'Leave Session' : 'Join Session');
      sessionBtn.setAttribute('aria-label', hasSession ? 'Leave Session' : 'Join Session');
    };

    updateSessionBtn(); // initial state

    sessionBtn.onclick = () => {
      if (sessionStorage.getItem('SessionInfo')) {
        // redirect to leave session page
        window.location.href = 'leavesession.html';
      } else {
        // redirect to join page
        window.location.href = 'entersession.html';
      }
    };
  }

  // --- TTS button ---
  const ttsBtn = root.querySelector('#tts-btn');
  if (ttsBtn && !ttsBtn.dataset.wired) {
    ttsBtn.dataset.wired = '1';

    ttsBtn.onclick = () => {
      if (!('speechSynthesis' in window)) {
        alert('Sorry, your browser does not support text-to-speech.');
        return;
      }
      const speakableElements = document.querySelectorAll('[data-speakable]');

      if (speakableElements.length > 0) {
        const textParts = Array.from(speakableElements).map(el => el.textContent);
        const textToSpeak = textParts.join('. ');
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);

      } else {
        alert('No speakable text found on this page.');
      }
    };
  }
}

function includeHTML() {
  const elements = document.querySelectorAll('[data-include]');
  elements.forEach(el => {
    const file = el.getAttribute('data-include');
    if (!file) return;

    fetch(file)
      .then(resp => {
        if (!resp.ok) throw new Error('Include not found: ' + file);
        return resp.text();
      })
      .then(html => {
        el.innerHTML = html;
        el.removeAttribute('data-include');

        // wire this include’s UI
        wireIncludedUI(el);

        // process any nested includes inside this include
        includeHTML();
      })
      .catch(err => {
        console.error(err);
        el.innerHTML = `<p style="color:red;">Include failed: ${file}</p>`;
      });
  });
}

document.addEventListener('DOMContentLoaded', includeHTML);
