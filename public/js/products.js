let cart = prompt("Ingrese el id de su carrito")

let buttons = document.querySelectorAll("button")

buttons.forEach((button) => {
    button.addEventListener('click', (addToCart))
})

function addToCart(e) {
    const pid = e.target.id
    fetch(`/carrito/${cart}/product/${pid}`, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Producto agregado correctamente',
                showConfirmButton: false,
                timer: 1500
            })
        })
        .catch(error => {
            console.log('Error:', error);
        });
}