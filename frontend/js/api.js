const base_url = "http://localhost:4000";
 const Api = {
    call: function(endpoint, method = 'GET', data = null, isFile = false){
        const token = localStorage.getItem('token');

        let settings = {
            url: `${base_url}${endpoint}`,
            method: method,
            headers:{
                'Authorization': token ? `Bearer ${token}` : ''
            }
        };
        if(data){
            if(isFile){
                settings.data = data;
                settings.processData = false;
                settings.contentType = false;
            }
            else{
                settings.data = JSON.stringify(data);
                settings.contentType = 'application/json';
            }
        }
        return $.ajax(settings);
    },
    isAuthenticated: function(){
        return localStorage.getItem('token') !== null;
    },
    getUserRole: function(){
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? user.role : null;
    }
 };