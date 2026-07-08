document.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('name');
    if (name) {
        const username = document.getElementById('username');
        if (username) username.textContent = name;
        const profileName = document.getElementById('profile-name');
        if (profileName) profileName.textContent = name;
    }

    loadDashboardAnnouncements();
    loadUpcomingQuizzes();
    loadAttendanceSummary();
    loadJoinedClasses();
});

function loadAttendanceSummary() {
    const container = document.getElementById('attendance-section');
    if (!container) return;

    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const studentName = localStorage.getItem('name') || '';
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');

    if (myClasses.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes joined yet.</p></div>';
        return;
    }

    container.innerHTML = myClasses.map(cls => {
        const dateKeys = Object.keys(attendance).filter(k => k.startsWith(cls.code));
        let present = 0;
        let total = dateKeys.length;

        dateKeys.forEach(key => {
            if (attendance[key][studentName] === 'present') present++;
        });

        const pct = total === 0 ? 0 : Math.round((present / total) * 100);
        let color = '#00cc66';
        if (pct < 75) color = '#ff4444';
        else if (pct < 80) color = '#ffcc00';

        return `
        <div class="subject-row" style="margin-bottom:10px;">
            <span style="font-size:13px;color:white;min-width:120px;">${cls.name}</span>
            <div style="flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;margin:0 12px;">
                <div style="width:${pct}%;height:100%;background:${color};border-radius:99px;"></div>
            </div>
            <span style="font-size:12px;color:${color};min-width:40px;text-align:right;">${pct}%</span>
        </div>`;
    }).join('');
}