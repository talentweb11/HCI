// Saving session information
function joinSession() {
    const sessionIdInput = document.getElementById('sessionIdInput');
    const nameInput = document.getElementById('nameInput');

    // Check if elements exist
    if (!sessionIdInput || !nameInput) {
        console.error('Input elements not found');
        alert('Error: Form elements not found. Please refresh the page.');
        return;
    }

    const sessionId = sessionIdInput.value.trim();
    const name = nameInput.value.trim();

    console.log('sessionId:', sessionId, 'name:', name);

    if (!sessionId || !name) {
        alert('Please enter both session ID and your name.');
        return;
    }

    const SessionInfo = { id: sessionId, name: name };
    sessionStorage.setItem('SessionInfo', JSON.stringify(SessionInfo));
    console.log('SessionInfo stored:', sessionStorage.getItem('SessionInfo'));

    window.location.href = 'sessionjoined.html';
}


// Show session info
function showSessionInfo() {
    const data = sessionStorage.getItem('SessionInfo');
    if (!data) return;

    const SessionInfo = JSON.parse(data);
    const details = document.getElementById('sessionInfo');
    if (details) {

        if (details.tagName === 'PRE') {

            details.innerText = `Name: ${SessionInfo.name}\nSession ID: ${SessionInfo.id}`;
        } else {

            details.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>Name:</strong> ${SessionInfo.name}
                </div>
                <div>
                    <strong>Session ID:</strong> ${SessionInfo.id}
                </div>
            `;
        }
    }
}

// Exit session
function leaveSession() {
    sessionStorage.removeItem('SessionInfo');
    const currentPath = window.location.pathname;
    if (!currentPath.includes('sessionleft.html')) {
        window.location.href = 'sessionleft.html';
    }
}