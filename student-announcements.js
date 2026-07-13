document.addEventListener('DOMContentLoaded', function() {
    loadAllAnnouncements();
});

function loadAllAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const myCodes = myClasses.map(c => c.code);
    const container = document.getElementById('allAnnouncements');

    const myAnnouncements = announcements.filter(a =>
        !a.classCode || myCodes.includes(a.classCode)
    );

    if (myAnnouncements.length === 0) {
        container.innerHTML = '<div class="dash-card"><div class="empty-state"><p>No announcements yet.</p></div></div>';
        return;
    }

    container.innerHTML = myAnnouncements.map(a => `
        <div class="dash-card" style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                    <h3 style="font-size:15px;color:white;margin-bottom:6px;">${a.title} <span class="ann-badge ${a.type}">${a.type}</span></h3>
                    <p style="font-size:13px;color:#cccccc;line-height:1.6;margin-bottom:8px;">${a.content || ''}</p>
                    <p style="font-size:11px;color:#aaaaaa;">${a.teacher} · ${a.time}</p>
                </div>
            </div>
        </div>
    `).join('');
}