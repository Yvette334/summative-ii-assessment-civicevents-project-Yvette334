const auth = {
    getToken() {
        return sessionStorage.getItem('token') || localStorage.getItem('token');
    },

    getUser() {
        const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    },

    logout(msg) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        if (msg) alert(msg);
        window.location.href = 'login.html';
    },

    /**
     * Call this at the top of protected pages.
     * @param {Array<string>} allowedRoles 
     */
    enforceRole(allowedRoles) {
        if (!this.getToken()) {
            window.location.href = 'login.html';
            return;
        }
        const user = this.getUser();
        if (!user) {
            this.logout('Your session is invalid. Please login again.');
            return;
        }
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            alert('Access Denied. You do not have the required permissions.');
            window.location.href = 'event.html'; // redirect to safe default
        }
    },

    /**
     * Helper to set up UI navigation based on role. Call this on page load.
     */
    setupNavigation() {
        const user = this.getUser();
        if (user && user.role === 'admin') {
            $('.admin-only').removeClass('hidden'); // Show any element with class admin-only
        } else {
            $('.admin-only').remove(); // Completely remove admin links for normal users
        }

        // Show user avatar dropdown logic if exists
        $('#pro-menu').on('click', function (e) {
            e.stopPropagation();
            $('#user-dropdown').toggleClass('hidden');
        });

        // Hide dropdown when clicking outside
        $(document).on('click', function () {
            $('#user-dropdown').addClass('hidden');
        });

        $('#user-dropdown').on('click', function (e) {
            e.stopPropagation();
        });
    }
};