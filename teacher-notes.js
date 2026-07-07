document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
});

function uploadNote() {
    const title = document.getElementById('note-title').value.trim();
    const subject = document.getElementById('note-subject').value.trim();
    const content = document.getElementById('note-content').value.trim();

    if (title === '' || subject === '' || content === '') {
        alert('Please fill all fields!');
        return;
    }

    const notes = JSON.parse(localStorage.getItem('teacherNotes') || '[]');
    const newNote = {
        id: Date.now(),
        title: title,
        subject: subject,
        content: content,
        teacher: localStorage.getItem('name') || 'Teacher',
        time: new Date().toLocaleString()
    };

    notes.unshift(newNote);
    localStorage.setItem('teacherNotes', JSON.stringify(notes));

    document.getElementById('note-title').value = '';
    document.getElementById('note-subject').value = '';
    document.getElementById('note-content').value = '';

    loadNotes();
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('teacherNotes') || '[]');
    const container = document.getElementById('notesList');

    if (notes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No notes uploaded yet.</p></div>';
        return;
    }

    container.innerHTML = notes.map(note => `
        <div class="note-card">
            <div class="note-info">
                <h3>${note.title}</h3>
                <p>${note.subject} · ${note.teacher} · ${note.time}</p>
                <p class="note-content">${note.content}</p>
            </div>
            <button class="post-action-btn" onclick="deleteNote(${note.id})">🗑️</button>
        </div>
    `).join('');
}

function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem('teacherNotes') || '[]');
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem('teacherNotes', JSON.stringify(notes));
    loadNotes();
}