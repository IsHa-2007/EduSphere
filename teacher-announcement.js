document.addEventListener('DOMContentLoaded', function() {
    loadAnnouncements();
});

function postAnnouncement() {
    const title = document.getElementById('ann-title').value.trim();
    const content = document.getElementById('ann-content').value.trim();
    const type = document.getElementById('ann-type').value;

    if (title === '' || content === '') {
        alert('Please fill all fields!');
        return;
    }

    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    announcements.unshift({
        id: Date.now(),
        title: title,
        content: content,
        type: type,
        teacher: localStorage.getItem('name') || 'Teacher',
        time: new Date().toLocaleString()
    });

    localStorage.setItem('announcements', JSON.stringify(announcements));
    document.getElementById('ann-title').value = '';
    document.getElementById('ann-content').value = '';
    loadAnnouncements();
}

function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    const container = document.getElementById('announcementsList');

    if (announcements.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No announcements yet.</p></div>';
        return;
    }

    container.innerHTML = announcements.map(a => `
        <div class="note-card">
            <div class="note-info">
                <h3>${a.title} <span class="ann-badge ${a.type}">${a.type}</span></h3>
                <p>${a.teacher} · ${a.time}</p>
                <p class="note-content">${a.content}</p>
            </div>
            <button class="post-action-btn" onclick="deleteAnnouncement(${a.id})">🗑️</button>
        </div>
    `).join('');
}

function deleteAnnouncement(id) {
    let announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    announcements = announcements.filter(a => a.id !== id);
    localStorage.setItem('announcements', JSON.stringify(announcements));
    loadAnnouncements();
}