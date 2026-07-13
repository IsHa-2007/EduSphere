document.addEventListener('DOMContentLoaded', function() {
    loadClasses();
});

function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createClass() {
    const className = document.getElementById('class-name').value.trim();
    const subject = document.getElementById('class-subject').value.trim();

    if (className === '' || subject === '') {
        alert('Please fill in all fields!');
        return;
    }

    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const newClass = {
        id: Date.now(),
        name: className,
        subject: subject,
        code: generateCode(),
        teacher: localStorage.getItem('name') || 'Teacher',
        students: [],
        time: new Date().toLocaleString()
    };

    classes.push(newClass);
    localStorage.setItem('teacherClasses', JSON.stringify(classes));

    document.getElementById('class-name').value = '';
    document.getElementById('class-subject').value = '';
    loadClasses();
}

function loadClasses() {
    const classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    const container = document.getElementById('classList');

    if (classes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No classes created yet.</p></div>';
        return;
    }

    container.innerHTML = classes.map(cls => `
        <div class="class-card" style="position:relative;">
            <div class="class-info">
                <h3>${cls.name}</h3>
                <p>${cls.subject} · ${cls.students.length} students</p>
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
                <div class="class-code">
                    <span>Join Code:</span>
                    <strong>${cls.code}</strong>
                </div>
                <div style="position:relative;">
                    <button class="post-action-btn" onclick="toggleClassMenu('menu-${cls.code}')" 
                    style="font-size:18px;padding:4px 8px;">⋮</button>
                    <div id="menu-${cls.code}" class="class-menu" style="display:none;">
                        <button onclick="manageClassStudents('${cls.code}', '${cls.name}')">👥 Manage Students</button>
                        <button onclick="deleteClass('${cls.code}')" style="color:#ff4444;">🗑️ Delete Class</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- manage students section -->
        <div id="manage-${cls.code}" class="dash-card" style="display:none;margin-top:8px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h3>Students in ${cls.name}</h3>
                <button class="btn-outline" onclick="closeManage('${cls.code}')" style="padding:4px 12px;font-size:12px;">✕ Close</button>
            </div>
            <div id="studentList-${cls.code}">
                ${cls.students.length === 0 ? 
                    '<div class="empty-state"><p>No students joined yet.</p></div>' :
                    [...cls.students].sort().map(student => `
                        <div class="class-card" style="margin-bottom:8px;">
                            <div class="class-info"><h3>${student}</h3></div>
                            <button class="attendance-btn absent-active" onclick="removeStudent('${cls.code}', '${student}')" style="font-size:12px;">Remove</button>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `).join('');
}

function toggleClassMenu(id) {
    document.querySelectorAll('.class-menu').forEach(m => {
        if (m.id !== id) m.style.display = 'none';
    });
    const menu = document.getElementById(id);
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function manageClassStudents(code, name) {
    toggleClassMenu(`menu-${code}`);
    const manageDiv = document.getElementById(`manage-${code}`);
    if (manageDiv) manageDiv.style.display = manageDiv.style.display === 'none' ? 'block' : 'none';
}

function closeManage(code) {
    const manageDiv = document.getElementById(`manage-${code}`);
    if (manageDiv) manageDiv.style.display = 'none';
}

function removeStudent(code, studentName) {
    if (!confirm(`Remove ${studentName} from this class?`)) return;

    let classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    classes = classes.map(cls => {
        if (cls.code === code) {
            cls.students = cls.students.filter(s => s !== studentName);
        }
        return cls;
    });
    localStorage.setItem('teacherClasses', JSON.stringify(classes));

    // also remove from student myClasses
    let myClasses = JSON.parse(localStorage.getItem('myClasses') || '[]');
    myClasses = myClasses.filter(c => !(c.code === code));
    localStorage.setItem('myClasses', JSON.stringify(myClasses));

    loadClasses();
}

function deleteClass(code) {
    if (!confirm('Delete this class? All data will be lost!')) return;
    let classes = JSON.parse(localStorage.getItem('teacherClasses') || '[]');
    classes = classes.filter(c => c.code !== code);
    localStorage.setItem('teacherClasses', JSON.stringify(classes));
    loadClasses();
}

// close menu when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.class-menu') && !e.target.closest('.post-action-btn')) {
        document.querySelectorAll('.class-menu').forEach(m => m.style.display = 'none');
    }
});