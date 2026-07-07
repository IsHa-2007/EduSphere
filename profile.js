document.addEventListener('DOMContentLoaded', function() {
    const bio = localStorage.getItem('bio');
    const skill = localStorage.getItem('skill');
    const institution = localStorage.getItem('institution');
    const avatar = localStorage.getItem('avatar');

    if (bio) document.getElementById('profile-bio-display').textContent = bio;
    if (skill) document.getElementById('profile-skills-display').textContent = skill;
    if (institution) document.getElementById('profile-institution-display').textContent = institution;
    if (avatar) {
        document.querySelector('.profile-avtar').innerHTML = `<img src="${avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }
});