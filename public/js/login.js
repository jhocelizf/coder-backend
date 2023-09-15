async function postLogin( email, password) {
    const response = await fetch("/api/session/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    console.log(result);
    return result;
}


const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    postLogin(username, password).then((data) => {
        if (data.status == "success") {
            const welcomeMessage = `¡Bienvenido de nuevo, ${username}!`;
            Swal.fire({
                title: welcomeMessage,
                icon: 'success',
                text: 'Esperamos que tengas una excelente experiencia.',
            });
            setTimeout(() => {
                window.location.href = "/home";
            }, 2000); 
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
});