const authLink = document.getElementById('auth-link')
const logout = document.getElementById('logout')
const user = JSON.parse(localStorage.getItem('user') || '{}')

console.log('user: ', user);


if (Object.keys(user).length <= 0) {
    authLink.innerHTML = '<a id="auth-link" href="login.html"><i class="fas fa-user"></i>Đăng nhập</a>'
} else {
    authLink.innerHTML += `<i class="fas fa-user"></i>${user.username}`
    logout.innerHTML += '<i class="fa-solid fa-arrow-right-from-bracket" style="margin-left: 20px; "></i>Đăng xuất'
}

function logoutBtn() {
    localStorage.setItem('user', '')
    console.log('user: ', localStorage.getItem('user'));
    localStorage.setItem('cart', '')
    console.log('cart: ', localStorage.getItem('cart'));
    window.location.href = '/';
}

console.log('ngu');
const BE_URL = "http://localhost:5000"
const formRegister = document.getElementById('register-form');

formRegister.addEventListener('submit', (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang

    const username = formRegister.username.value.trim();
    const password = formRegister.password.value;
    const rePassword = formRegister.rePassword.value;

    if (rePassword != password) {
      alert('Nhập lại mật khẩu không đúng')
      return
    }

    // In ra console (hoặc bạn có thể gửi lên server tại đây)
    console.log("Username:", username);
    // console.log("Password:", password);



    // Sau này: gửi request login lên server ở đây
    fetch(`${BE_URL}/user/register`, {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({ username, password })
    }).then(res => {
        if (!res.ok) {
            // Throw an error if HTTP status is not OK (200–299)
            return res.json().then(err => {
                throw new Error(err.message || `HTTP error ${res.status}`);
            });
        }
        return res.json();
    }).then(data => {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('user', data.user);
        alert("Đăng ký thành công")
        window.location.href = '/';
    }).catch(e => {
        alert(e)
        console.log(e);
        throw new Error(e)
    })
});


