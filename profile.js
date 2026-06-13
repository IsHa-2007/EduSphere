document.addEventListener('DOMContentLoaded', function() {
    const bio = localStorage.getItem('bio');
    const skill = localStorage.getItem('skill');
    const institution = localStorage.getItem('institution');

    if (bio) document.getElementById('profile-bio-display').textContent = bio;
    if (skill) document.getElementById('profile-skills-display').textContent = skill;
    if (institution) document.getElementById('profile-institution-display').textContent = institution;
});

function enableEdit() {
    document.getElementById('edit-form').style.display = 'block';
    
    document.getElementById('bio-input').value = localStorage.getItem('bio') || '';
    document.getElementById('skill-input').value = localStorage.getItem('skill') || '';
    document.getElementById('institution-input').value = localStorage.getItem('institution') || '';
}

function saveProfile() {
    const bio = document.getElementById('bio-input').value;
    const skill = document.getElementById('skill-input').value;
    const institution = document.getElementById('institution-input').value;

    localStorage.setItem('bio', bio);
    localStorage.setItem('skill', skill);
    localStorage.setItem('institution', institution);

    document.getElementById('profile-bio-display').textContent = bio;
    document.getElementById('profile-skills-display').textContent = skill;
    document.getElementById('profile-institution-display').textContent = institution;

    document.getElementById('edit-form').style.display = 'none';
    alert('Profile updated!');
}