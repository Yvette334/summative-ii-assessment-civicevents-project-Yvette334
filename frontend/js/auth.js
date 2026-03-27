const auth = {
    getToken(){
        return sessionStorage.getItem('token') || localStorage.getItem('token');
    },

    getUser(){
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    logout(){
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'login.html';
    }
}