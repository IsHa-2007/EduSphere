document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
});

function uploadNote() {
    const title = document.getElementById('note-title').value.trim();
    const subject = document.getElementById('note-subject').value.trim();
    const content = document.getElementById('note-content').value.trim();
    const fileInput = document.getElementById('note-file');
    const file = fileInput.files[0];

    if (title === '' || subject === '') {
        alert('Please fill title and subject!');
        return;
    }

    if (!content && !file) {
        alert('Please add content or upload a file!');
        return;
    }

    const processNote = (fileData, fileName, fileType) => {
        const notes = JSON.parse(localStorage.getItem('teacherNotes') || '[]');
        const newNote = {
            id: Date.now(),
            title, subject, content,
            fileData: fileData || null,
            fileName: fileName || null,
            fileType: fileType || null,
            teacher: localStorage.getItem('name') || 'Teacher',
            time: new Date().toLocaleString()
        };
        notes.unshift(newNote);
        localStorage.setItem('teacherNotes', JSON.stringify(notes));
        document.getElementById('note-title').value = '';
        document.getElementById('note-subject').value = '';
        document.getElementById('note-content').value = '';
        fileInput.value = '';
        document.getElementById('fileLabel').textContent = '📎 Upload File';
        loadNotes();
        alert('Note uploaded!');
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            processNote(e.target.result, file.name, file.type);
        };
        reader.readAsDataURL(file);
    } else {
        processNote(null, null, null);
    }
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
                ${note.content ? `<p class="note-content">${note.content}</p>` : ''}
                ${note.fileName ? `<p style="font-size:12px;color:#0095ff;margin-top:6px;">📎 ${note.fileName}</p>` : ''}
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