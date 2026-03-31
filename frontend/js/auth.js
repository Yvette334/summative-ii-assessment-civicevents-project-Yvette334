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
        if (msg) showGlobalToast(msg, true);
        setTimeout(() => window.location.href = 'login.html', 1500);
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
            showGlobalToast('Access Denied. You do not have the required permissions.', true);
            setTimeout(() => window.location.href = 'event.html', 1500);
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

        $('#pro-menu').on('click', function (e) {
            e.stopPropagation();
            $('#user-dropdown').toggleClass('hidden');
            $('#notif-dropdown').addClass('hidden');
        });

        $('#bell').on('click', function (e) {
            e.stopPropagation();
            $('#notif-dropdown').toggleClass('hidden');
            $('#user-dropdown').addClass('hidden');
            if (typeof window.loadNotifications === 'function') {
                window.loadNotifications();
            }
        });

        $(document).on('click', function () {
            $('#user-dropdown, #notif-dropdown').addClass('hidden');
        });

        $('#user-dropdown, #notif-dropdown').on('click', function (e) {
            e.stopPropagation();
        });

        $('#mob-menu').on('click', function() {
            $('#mobile-menu').toggleClass('hidden');
        });
    },

    renderNotifications(nots, isAdmin) {
        const unread = nots.filter(n => !n.is_read).length;
        if (unread > 0) {
            $('#unread-badge').removeClass('hidden').text(unread > 9 ? '9+' : unread)
                .css({'display':'flex','align-items':'center','justify-content':'center',
                      'min-width':'18px','height':'18px','font-size':'10px','font-weight':'700',
                      'background':'#ef4444','color':'#fff','border-radius':'9999px',
                      'position':'absolute','top':'-4px','right':'-4px','padding':'0 3px'});
        } else {
            $('#unread-badge').addClass('hidden').text('');
        }

        if (nots.length === 0) {
            $('#notif-list').html('<p class="p-4 text-gray-500 text-center">No notifications</p>');
            return;
        }

        let html = '';
        nots.slice(0, 15).forEach(n => {
            const meta = n.metadata || {};
            let link = '#';
            if (meta.event_id) link = 'event-detail.html?id=' + meta.event_id;
            else if (meta.promo_id) link = 'promo.html';
            else if (meta.announcement_id) link = 'announcement.html';

            const deleteBtn = isAdmin
                ? `<button onclick="window.deleteNotif('${n.id}', this)" class="text-red-400 hover:text-red-600 text-xs ml-2 shrink-0" title="Delete">&times;</button>`
                : '';

            html += `<div class="p-3 hover:bg-slate-50 border-b border-gray-50 flex items-start gap-2">
                <a href="${link}" class="flex-1 min-w-0">
                    <p class="font-bold text-teal-800 text-sm">${n.title}</p>
                    <p class="text-xs text-gray-600 mt-1">${n.message}</p>
                    <p class="text-xs text-slate-400 mt-1">${new Date(n.created_at).toLocaleString()}</p>
                </a>
                ${deleteBtn}
            </div>`;
        });
        $('#notif-list').html(html);

        window.deleteNotif = function(id, btn) {
            Api.call('/api/notifications/' + id, 'DELETE').done(function() {
                $(btn).closest('div.p-3').remove();
                if ($('#notif-list').children().length === 0) {
                    $('#notif-list').html('<p class="p-4 text-gray-500 text-center">No notifications</p>');
                }
            }).fail(function() {
                showGlobalToast('Could not delete notification.', true);
            });
        };
    }
};