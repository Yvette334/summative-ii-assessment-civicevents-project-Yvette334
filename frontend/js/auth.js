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
            $('.admin-only').removeClass('hidden');
            $('.user-only').remove();
        } else {
            $('.admin-only').remove();
        }

        // Toggle User Dropdown
        $('#pro-menu').on('click', function (e) {
            e.stopPropagation();
            $('#user-dropdown').toggleClass('hidden');
            $('#notif-dropdown').addClass('hidden'); // Close other dropdown
        });

        // Toggle Notifications Dropdown
        $('#bell').on('click', function (e) {
            e.stopPropagation();
            $('#notif-dropdown').toggleClass('hidden');
            $('#user-dropdown').addClass('hidden'); // Close other dropdown
            
            // If the page has a loadNotifications function, call it
            if (typeof window.loadNotifications === 'function') {
                window.loadNotifications();
            }
        });

        // Hide dropdowns when clicking outside
        $(document).on('click', function () {
            $('#user-dropdown, #notif-dropdown').addClass('hidden');
        });

        // Prevent closing when clicking inside dropdowns
        $('#user-dropdown, #notif-dropdown').on('click', function (e) {
            e.stopPropagation();
        });

        // Mobile Menu Toggle
        $('#mob-menu').on('click', function() {
            $('#mobile-menu').toggleClass('hidden');
        });
    }
};