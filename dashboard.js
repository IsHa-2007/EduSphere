document.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');

    if (name) {
        const username = document.getElementById('username');
        if (username) username.textContent = name;

        const profileName = document.getElementById('profile-name');
        if (profileName) profileName.textContent = name;
    }

    if (role) {
        const profileRole = document.getElementById('profile-role');
        if (profileRole) profileRole.textContent = role;
    }
});

function toggleChat() {
    const chat = document.getElementById('aiChat');
    chat.classList.toggle('open');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const text = input.value.trim();

    if (text === '') return;

    messages.innerHTML += `
        <div class="msg user-msg">
            <p>${text}</p>
        </div>
    `;

    input.value = '';

    setTimeout(() => {
        messages.innerHTML += `
            <div class="msg ai-msg">
                <p>I'm EduSphere AI! Full functionality coming soon. Stay tuned! 🚀</p>
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
    }, 800);

    messages.scrollTop = messages.scrollHeight;
}
function loadDashboardAnnouncements() {
    const container = document.getElementById('announcements-section');
    if (!container) return;

    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');

    if (announcements.length === 0) {
        container.innerHTML = '<p style="color:#444;font-size:13px;">No announcements yet.</p>';
        return;
    }

    container.innerHTML = announcements.slice(0, 3).map(a => `
        <div class="announcement-item">
            <p class="ann-item-title">${a.title} <span class="ann-badge ${a.type}">${a.type}</span></p>
            <p class="ann-item-meta">${a.teacher} · ${a.time}</p>
        </div>
    `).join('');
}