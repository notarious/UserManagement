document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('token', data.token);
                return fetch('/api/auth/getUserRole', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => { throw new Error(error.error); });
                }
                return response.json();
            })
            .then(roleData => {
                localStorage.setItem('role', roleData.role);
                document.getElementById('login-form').style.display = 'none';
                loadUserList();
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('login-error').textContent = error.message;
            });
    });
});

function loadUserList() {
    fetch('/api/users', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.error); });
            }
            return response.json();
        })
        .then(data => {
            const userList = document.getElementById('users');
            userList.innerHTML = '';
            document.getElementById('user-list').style.display = 'block';
            data.forEach(user => {
                const userItem = document.createElement('div');
                userItem.textContent = `${user.userName} - ${user.phoneNumber}`;
                const detailsButton = document.createElement('button');
                detailsButton.textContent = 'Details';
                if (localStorage.getItem('role') !== 'Administrator') {
                    detailsButton.disabled = true; // Отключить кнопку, если у пользователя нет роли "Administrator"
                }
                detailsButton.addEventListener('click', () => {
                    loadUserDetails(user.id);
                });
                userItem.appendChild(detailsButton);
                userList.appendChild(userItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function loadUserDetails(userId) {
    fetch(`/api/users/${userId}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    alert("Unauthorized access. Please login again.");
                    localStorage.removeItem('token');
                    document.getElementById('login-form').style.display = 'block';
                }
                return response.json().then(error => { throw new Error(error.error); });
            }
            return response.json();
        })
        .then(userDetails => {
            document.getElementById('username-detail').textContent = userDetails.userName;
            document.getElementById('phone-number').textContent = userDetails.phoneNumber;
            document.getElementById('passport-number').textContent = userDetails.passportNumber;
            document.getElementById('salary').textContent = userDetails.salary;
            document.getElementById('user-details').style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
