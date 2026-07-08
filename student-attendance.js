document.addEventListener('DOMContentLoaded', function() {
    loadStudentAttendance();
});

function loadStudentAttendance() {
    const myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    const container = document.getElementById('studentAttendanceView');
    const studentName = localStorage.getItem('name') || '';

    if (myClasses.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes joined yet.</p></div>';
        return;
    }

    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');

    container.innerHTML = myClasses.map(cls => {
        const classKeys = Object.keys(attendance).filter(k => k.startsWith(cls.code));
        let present = 0;
        let total = classKeys.length;

        classKeys.forEach(key => {
            if (attendance[key][studentName] === 'present') present++;
        });

        const percentage = total === 0 ? 0 : Math.round((present / total) * 100);
        let dotColor = '#00cc66';
        if (percentage < 75) dotColor = '#ff4444';
        else if (percentage < 80) dotColor = '#ffcc00';

        return `
        <div class="dash-card" style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <div>
                    <h3 style="color:white;font-size:15px;">${cls.name}</h3>
                    <p style="color:#aaaaaa;font-size:12px;">${cls.subject}</p>
                </div>
                <div style="text-align:right;">
                    <h2 style="color:${dotColor};font-size:28px;font-weight:700;">${percentage}%</h2>
                    <p style="color:#aaaaaa;font-size:11px;">${present}/${total} classes</p>
                </div>
            </div>
            <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;">
                <div style="width:${percentage}%;height:100%;background:${dotColor};border-radius:99px;transition:width 0.5s ease;"></div>
            </div>
            ${percentage < 75 ? '<p style="color:#ff4444;font-size:12px;margin-top:8px;">⚠️ Attendance below 75%! Please attend more classes.</p>' : ''}
        </div>`;
    }).join('');
}