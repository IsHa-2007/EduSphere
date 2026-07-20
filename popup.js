function showAlert(message, title = 'EduSphere') {
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.innerHTML = `
            <div class="popup-box">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="popup-buttons">
                    <button class="popup-btn-confirm" onclick="this.closest('.popup-overlay').remove(); resolve()">OK</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('.popup-btn-confirm').addEventListener('click', () => resolve());
    });
}

function showConfirm(message, title = 'Are you sure?') {
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.innerHTML = `
            <div class="popup-box">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="popup-buttons">
                    <button class="popup-btn-cancel" id="cancelBtn">Cancel</button>
                    <button class="popup-btn-danger" id="confirmBtn">Confirm</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('#confirmBtn').addEventListener('click', () => {
            overlay.remove();
            resolve(true);
        });
        overlay.querySelector('#cancelBtn').addEventListener('click', () => {
            overlay.remove();
            resolve(false);
        });
    });
}