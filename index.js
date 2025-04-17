/**
 * Yamaha Extension - Authentication and configuration manager
 */
class YamahaExtensionAuth {
    constructor() {
        this.urlSyncInput = document.getElementById('yamaha-ex-url-sync');
        this.usernameInput = document.getElementById('yamaha-ex-username');
        this.passwordInput = document.getElementById('yamaha-ex-password');
        this.loginBtn = document.getElementById('yamaha-ex-login-btn');
        this.clearBtn = document.getElementById('yamaha-ex-clear-btn');
        this.loginForm = document.getElementById('yamaha-ex-login-form');
        this.userInfoContainer = document.getElementById('yamaha-ex-user-info');
        this.urlSyncDisplay = document.getElementById('yamaha-ex-display-url-sync');
        this.usernameDisplay = document.getElementById('yamaha-ex-display-username');

        this.initialize();
    }

    initialize() {
        this.loadExistingCredentials();
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => this.saveCredentials());
        }

        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearCredentials());
        }
    }

    loadExistingCredentials() {
        chrome.storage.local.get(['urlSync', 'username'], (items) => {
            if (items.urlSync && items.username) {
                this.displayUserInfo(items.urlSync, items.username);
            }
        });
    }

    saveCredentials() {
        const urlSync = this.normalizeUrlSync(this.urlSyncInput.value);
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        if (!urlSync || !username || !password) {
            console.error('Missing required fields');
            return;
        }

        chrome.storage.local.set({
            'urlSync': urlSync,
            'username': username,
            'password': password
        }, () => {
            console.log('Thông tin đã được lưu thành công');
            this.displayUserInfo(urlSync, username);
        });
    }

    normalizeUrlSync(url) {
        if (!url) return '';

        url = url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        if (!url.endsWith('/')) {
            url = url + '/';
        }

        return url;
    }

    displayUserInfo(urlSync, username) {
        if (this.urlSyncDisplay) {
            this.urlSyncDisplay.textContent = 'URL Sync: ' + urlSync;
        }

        if (this.usernameDisplay) {
            this.usernameDisplay.textContent = 'Username: ' + username;
        }

        if (this.loginForm) {
            this.loginForm.className = 'hidden';
        }

        if (this.userInfoContainer) {
            this.userInfoContainer.className = 'bg-white rounded-lg shadow-md p-4 mb-4';
        }
    }

    clearCredentials() {
        chrome.storage.local.clear(() => {
            console.log('Thông tin đã được xóa');

            if (this.urlSyncDisplay) this.urlSyncDisplay.textContent = '';
            if (this.usernameDisplay) this.usernameDisplay.textContent = '';
            if (this.urlSyncInput) this.urlSyncInput.value = '';
            if (this.usernameInput) this.usernameInput.value = '';
            if (this.passwordInput) this.passwordInput.value = '';

            if (this.loginForm) {
                this.loginForm.className = 'bg-white rounded-lg shadow-md p-4';
            }

            if (this.userInfoContainer) {
                this.userInfoContainer.className = 'hidden';
            }
        });
    }
}

// Initialize the extension when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const yamahaAuth = new YamahaExtensionAuth();
});