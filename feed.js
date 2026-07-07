document.addEventListener('DOMContentLoaded', function() {
    const avatar = localStorage.getItem('avatar');
    if (avatar) {
        document.getElementById('feedAvatar').innerHTML = `<img src="${avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }

    loadPosts();

    document.getElementById('postImageInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('postImageInput').dataset.imageData = e.target.result;
                document.querySelector('.post-img-btn').textContent = '✅ Photo added';
            }
            reader.readAsDataURL(file);
        }
    });
});

function createPost() {
    const text = document.getElementById('postText').value.trim();
    const imageData = document.getElementById('postImageInput').dataset.imageData || '';
    const name = localStorage.getItem('name') || 'User';
    const avatar = localStorage.getItem('avatar') || '';
    const role = localStorage.getItem('role') || 'student';

    if (text === '' && imageData === '') {
        alert('Write something to post!');
        return;
    }

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const newPost = {
        id: Date.now(),
        name: name,
        role: role,
        avatar: avatar,
        text: text,
        image: imageData,
        time: new Date().toLocaleString(),
        likes: 0,
        liked: false
    };

    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    document.getElementById('postText').value = '';
    document.getElementById('postImageInput').dataset.imageData = '';
    document.querySelector('.post-img-btn').textContent = '📷 Photo';

    loadPosts();
}

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const container = document.getElementById('feedPosts');

    if (posts.length === 0) {
        container.innerHTML = '<div class="empty-state" style="min-height:200px;"><p>No posts yet. Be the first to post!</p></div>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <div class="post-user-avatar">
                    ${post.avatar ? `<img src="${post.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : '👤'}
                </div>
                <div class="post-user-info">
                    <p class="post-user-name">${post.name}</p>
                    <p class="post-user-role">${post.role} · ${post.time}</p>
                </div>
            </div>
            ${post.text ? `<p class="post-text">${post.text}</p>` : ''}
            ${post.image ? `<img src="${post.image}" class="post-image" />` : ''}
            <div class="post-footer">
                <button class="post-action-btn" onclick="likePost(${post.id})">
                    ${post.liked ? '❤️' : '🤍'} ${post.likes}
                </button>
                <button class="post-action-btn">💬 Comment</button>
                <button class="post-action-btn">↗️ Share</button>
            </div>
        </div>
    `).join('');
}

function likePost(id) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id === id);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        localStorage.setItem('posts', JSON.stringify(posts));
        loadPosts();
    }
}