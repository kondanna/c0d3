window.Auth = {
    signup = signupData => {
        fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData),
        }).then(r => r.json()).then(data => {
            sessionStorage.setItem('usersession', JSON.stringify(data))
        })
    },

    login = loginData => {
        fetch('http://localhost:3000/api/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
        }).then(r => r.json()).then(data => {
            sessionStorage.setItem('usersession', JSON.stringify(data))
        })
    },

    getSession = () => {
        const session = JSON.parse(sessionStorage.getItem('usersession') || '{}')

        fetch('http://localhost:3000/api/sessions', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${session.jwt}`,
                'Content-Type': 'application/json'
            },
        }).then(r => r.json()).then(console.log)
    },

    logout = () => {
        sessionStorage.setItem('usersession', '{}')
    }
}