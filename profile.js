document.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('name') || '';
    const role = localStorage.getItem('role') || '';
    const bio = localStorage.getItem('bio') || 'Add a bio...';
    const skill = localStorage.getItem('skill') || 'Add skills...';
    const institution = localStorage.getItem('institution') || 'Add your institution';
    const avatar = localStorage.getItem('avatar');

    const profileName = document.getElementById('profile-name');
    const profileRole = document.getElementById('profile-role');
    const profileInstitution = document.getElementById('profile-institution-display');
    const profileBio = document.getElementById('profile-bio-display');
    const profileSkills = document.getElementById('profile-skills-display');

    if (profileName) profileName.textContent = name;
    if (profileRole) profileRole.textContent = role;
    if (profileInstitution) profileInstitution.textContent = institution;
    if (profileBio) profileBio.textContent = bio;
    if (profileSkills) profileSkills.textContent = skill;

    if (avatar) {
        const avatarEl = document.querySelector('.profile-avtar');
        if (avatarEl) avatarEl.innerHTML = `<img src="${avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }

    loadProfilePosts();
});

function loadProfilePosts() {
    const name = localStorage.getItem('name') || '';
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const myPosts = posts.filter(p => p.name === name);
    const container = document.querySelector('.profile-posts');
    if (!container) return;

    if (myPosts.length === 0) {
        container.innerHTML = `<h3>Posts</h3><div class="empty-state"><p>Make your first post</p></div>`;
        return;
    }

    container.innerHTML = `<h3>Posts</h3>` + myPosts.map(post => `
        <div class="post-card" style="margin-bottom:16px;">
            <p class="post-text">${post.text}</p>
            ${post.image ? `<img src="${post.image}" class="post-image" />` : ''}
            <p style="font-size:11px;color:#444;margin-top:8px;">${post.time}</p>
        </div>
    `).join('');
}