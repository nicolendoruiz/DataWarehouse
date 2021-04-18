import peticion from './Servicios.js';

const inUsuario = document.getElementById('inUsuario');
const inContrasenia = document.getElementById('inContrasenia');
const inIniciar = document.getElementById('inIniciar');

/*EVENTOS*/
inIniciar.addEventListener('click', (evt) => {
    evt.preventDefault();
    if (inUsuario.value && inContrasenia.value) {
        iniciarSesion();
    } else {
        swal(`Campos de formulario`, `Por favor complete los campos para iniciar sesión.`, 'warning');
    }
})

/*FUNCIONES*/
const iniciarSesion = () => {
    let datosUsuario = {
        "correo": inUsuario.value,
        "contrasenia": inContrasenia.value
    };
    peticion.iniciar('http://localhost:3000/usuarios/login', datosUsuario).then((response) => {
        if (response.ok || response.token) {
            localStorage.removeItem('Usuario');
            localStorage.setItem('Usuario', JSON.stringify(response.token));
            window.location.replace('/FRONTEND/Contactos.html');
        } else {
            swal(`Inicio de sesión`, `Datos incorrectos, verifique los datos ingresados`, 'warning')
        }
    }).catch((error) => swal(`${'Inicio de sesión'}`, `${error}`, 'warning'));
};