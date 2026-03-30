const base_url = "http://localhost:4000";

const Api = {
    call: function(endpoint, method = 'GET', data = null, isFile = false){
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        let settings = {
            url: `${base_url}${endpoint}`,
            method: method,
            headers: {}
        };

        if (token) {
            settings.headers['Authorization'] = `Bearer ${token}`;
        }

        if(data){
            if(isFile){
                settings.data = data;
                settings.processData = false;
                settings.contentType = false;
            } else {
                settings.data = JSON.stringify(data);
                settings.contentType = 'application/json';
            }
        }

        return $.ajax(settings).fail(function(jqXHR, textStatus, errorThrown) {
            // Handle global auth errors (Expired token or Unauthorized)
            if (jqXHR.status === 401 && endpoint !== '/api/auth/login') {
                auth.logout('Your session has expired. Please login again.');
            }
            if (jqXHR.status === 403) {
                alert('Forbidden: You do not have permission to perform this action.');
            }
        });
    },
    isAuthenticated: function(){
        return (localStorage.getItem('token') || sessionStorage.getItem('token')) !== null;
    },
    /**
     * Resovles a media path to a full URL using the dynamic base_url.
     * Handles: full URLs, relative paths starting with /, and filenames.
     */
    resolveMediaUrl: function(path, type = 'events') {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        
        // If it starts with /uploads, just prepend base_url
        if (path.startsWith('/uploads')) return `${base_url}${path}`;
        
        // Otherwise, assume it's just a filename and needs the full path
        return `${base_url}/uploads/${type}/${path}`;
    },

    /**
     * Safely parses metadata if Postgres returns it as a string instead of an object.
     */
    parseMetadata: function(metadata) {
        if (!metadata) return {};
        if (typeof metadata === 'object') return metadata;
        try {
            return JSON.parse(metadata);
        } catch (e) {
            console.error('Failed to parse metadata:', e);
            return {};
        }
    },
    getUserRole: function(){
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (!userStr) return null;
        try {
            const user = JSON.parse(userStr);
            return user ? user.role : null;
        } catch (e) {
            return null;
        }
    }
};