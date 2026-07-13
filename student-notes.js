document.addEventListener('DOMContentLoaded', function() {
    loadStudentNotes();
});

function loadStudentNotes() {
    const notes = JSON.parse(localStorage.getItem('teacherNotes') || '[]');
    const container = document.getElementById('studentNotesList');
    const searchVal = document.getElementById('noteSearch')?.value.toLowerCase() || '';

    const filtered = notes.filter(n =>
        n.title.toLowerCase().includes(searchVal) ||
        n.subject.toLowerCase().includes(searchVal)
    );

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No notes available yet.</p></div>';
        return;
    }

    container.innerHTML = filtered.map(note => `
        <div class="note-card">
            <div class="note-info">
                <h3>${note.title}</h3>
                <p>${note.subject} · ${note.teacher} · ${note.time}</p>
                ${note.content ? `<p class="note-content">${note.content}</p>` : ''}
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;">
                ${note.fileData ? `
                    <a href="${note.fileData}" download="${note.fileName}" class="btn-outline" 
                    style="padding:6px 14px;font-size:12px;text-decoration:none;white-space:nowrap;">
                        ⬇️ Download
                    </a>` : ''}
            </div>
        </div>
    `).join('');
}