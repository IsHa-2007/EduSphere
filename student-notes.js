document.addEventListener('DOMContentLoaded', function() {
    loadStudentNotes();
});

function loadStudentNotes() {
    const notes = JSON.parse(localStorage.getItem('teacherNotes') || '[]');
    const container = document.getElementById('studentNotesList');

    if (notes.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No notes available yet.</p></div>';
        return;
    }

    container.innerHTML = notes.map(note => `
        <div class="note-card">
            <div class="note-info">
                <h3>${note.title}</h3>
                <p>${note.subject} · ${note.teacher} · ${note.time}</p>
                <p class="note-content">${note.content}</p>
            </div>
        </div>
    `).join('');
}