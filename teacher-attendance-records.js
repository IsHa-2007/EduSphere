document.addEventListener('DOMContentLoaded', function() {
    loadAttendanceRecordClasses();
});

function loadAttendanceRecordClasses() {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const container = document.getElementById('recordClassList');

    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes yet.</p></div>';
        return;
    }

    container.innerHTML = classes.map(cls => `
        <div class="class-card" onclick="openAttendanceRecords('${cls.code}', '${cls.name}')">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${cls.students.length} students</p>
            </div>
        </div>
    `).join('');
}

function openAttendanceRecords(code, name) {
    document.getElementById('recordClassList').style.display = 'none';
    document.getElementById('recordSection').style.display = 'block';
    document.getElementById('recordClassName').textContent = name;
    document.getElementById('recordClassCode').value = code;
    loadAttendanceRecords(code);
}

function loadAttendanceRecords(code) {
    const attendance = JSON.parse(localStorage.getItem('attendance') || '{}');
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const cls = classes.find(c => c.code === code);
    const container = document.getElementById('attendanceRecords');

    const dateKeys = Object.keys(attendance).filter(k => k.startsWith(code));

    if (dateKeys.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No attendance records yet.</p></div>';
        return;
    }

    const dates = dateKeys.map(k => k.replace(`${code}_`, '')).sort().reverse();

    container.innerHTML = dates.map(date => {
        const dateKey = `${code}_${date}`;
        const dayAttendance = attendance[dateKey] || {};
        const students = cls ? [...cls.students].sort() : [];
        const presentCount = Object.values(dayAttendance).filter(s => s === 'present').length;
        const total = students.length;

        return `
        <div class="dash-card" style="margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h3 style="color:white;">${date}</h3>
                <div style="text-align:right;">
                    <p style="font-size:18px;font-weight:700;color:#0095ff;">${presentCount}/${total}</p>
                    <p style="font-size:11px;color:#aaaaaa;">Present</p>
                </div>
            </div>
            <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;margin-bottom:16px;">
                <div style="width:${total > 0 ? Math.round((presentCount/total)*100) : 0}%;height:100%;background:#0095ff;border-radius:99px;"></div>
            </div>
            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
                        <th style="text-align:left;padding:8px;font-size:12px;color:#aaaaaa;">Student</th>
                        <th style="text-align:right;padding:8px;font-size:12px;color:#aaaaaa;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.map(student => {
                        const status = dayAttendance[student] || 'absent';
                        return `
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                            <td style="padding:8px;font-size:13px;color:white;">${student}</td>
                            <td style="padding:8px;text-align:right;">
                                <span style="font-size:12px;padding:2px 10px;border-radius:99px;${status === 'present' ? 'background:rgba(0,204,102,0.1);color:#00cc66;' : 'background:rgba(255,68,68,0.1);color:#ff4444;'}">
                                    ${status === 'present' ? '✅ Present' : '❌ Absent'}
                                </span>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    }).join('');
}

function backToRecordClasses() {
    document.getElementById('recordClassList').style.display = 'block';
    document.getElementById('recordSection').style.display = 'none';
    loadAttendanceRecordClasses();
}