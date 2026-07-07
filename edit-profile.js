document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('edit-name').value = localStorage.getItem('name') || '';
    document.getElementById('edit-bio').value = localStorage.getItem('bio') || '';
    document.getElementById('edit-skills').value = localStorage.getItem('skill') || '';
    document.getElementById('edit-institution').value = localStorage.getItem('institution') || '';
    document.getElementById('edit-prev-institution').value = localStorage.getItem('prevInstitution') || '';

    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
        document.getElementById('avatarPreview').innerHTML = `<img src="${savedAvatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }

    document.getElementById('avatarInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgData = e.target.result;
                localStorage.setItem('avatar', imgData);
                document.getElementById('avatarPreview').innerHTML = `<img src="${imgData}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            }
            reader.readAsDataURL(file);
        }
    });
});

function saveProfile() {
    localStorage.setItem('name', document.getElementById('edit-name').value);
    localStorage.setItem('bio', document.getElementById('edit-bio').value);
    localStorage.setItem('skill', document.getElementById('edit-skills').value);
    localStorage.setItem('institution', document.getElementById('edit-institution').value);
    localStorage.setItem('prevInstitution', document.getElementById('edit-prev-institution').value);
    alert('Profile updated!');
    window.location.href = 'profile.html';
}