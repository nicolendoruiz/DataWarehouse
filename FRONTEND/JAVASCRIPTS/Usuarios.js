import peticion from './Servicios.js';

/*ELEMENTOS*/
const inNombre = document.getElementById('inNombre');
const inApellido = document.getElementById('inApellido');
const inCorreo = document.getElementById('inCorreo');
const inContrasenia = document.getElementById('inContrasenia');
const inRepetirContrasenia = document.getElementById('inRepetirContrasenia');
const inPerfil = document.getElementById('inPerfil');
const spUsuario = document.getElementById('spUsuario');
const btnRegistrar = document.getElementById('btnRegistrarUsuario');
const btnCancelar = document.getElementById('btnCancelarRegistro');
const btnEditar = document.getElementById('btnEditarUsuario');
const tblUsuarios = document.getElementById('tblUsuarios');

const navConsulta = document.getElementById('nav-home');
const navRegistro = document.getElementById('nav-profile');

const alerta = document.getElementById('alerta');

/*EVENTOS*/
btnRegistrar.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (inNombre.value && inApellido.value && inCorreo.value && inContrasenia.value
        && inRepetirContrasenia.value && inPerfil.value) {
        if (inContrasenia.value == inRepetirContrasenia.value) {
            alerta.classList.add("invisible");
            alerta.classList.remove("visible");
            crearUsuario();
        } else {
            alerta.classList.remove("invisible");
            alerta.classList.add("visible");
            alerta.innerHTML = 'Las contraseñas no coinciden. Verifique la información.'
        }
    } else {
        alerta.classList.remove("invisible");
        alerta.classList.add("visible");
        alerta.innerHTML = 'Por favor complete los campos del formulario.'
    }
});
btnCancelar.addEventListener("click", () => {
    navConsulta.classList.add('active', 'show');
    navRegistro.classList.remove('active', 'show');
});
btnEditar.addEventListener("click", (evt) => {
    evt.preventDefault();
    swal({
        title: "¿Está seguro de editar la información?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((eliminar) => {
            if (eliminar) {
                if (inNombre.value && inApellido.value && inCorreo.value && inContrasenia.value
                    && inRepetirContrasenia.value && inPerfil.value) {
                    if (inContrasenia.value == inRepetirContrasenia.value) {
                        modificarUsuario();
                        alerta.classList.add("invisible");
                        alerta.classList.remove("visible");
                    } else {
                        alerta.classList.remove("invisible");
                        alerta.classList.add("visible");
                        alerta.innerHTML = 'Las contraseñas no coinciden. Verifique la información.'
                    }
                } else {
                    alerta.classList.remove("invisible");
                    alerta.classList.add("visible");
                    alerta.innerHTML = 'Por favor complete los campos del formulario.'
                }
            }
        });
})

/*FUNCIONES*/
const consultarUsuarios = () => {
    peticion.obtener('http://localhost:3000/usuarios').then((data) => {
        visualizarUsuarios(data);
    }).catch((error) => {
        console.log(error)
    });
}

const consultarPerfiles = () => {
    peticion.obtener('http://localhost:3000/perfil').then((data) => {
        visualizarPerfiles(data);
    }).catch((error) => {
        console.log(error)
    });
}

const crearUsuario = () => {
    let datosUsuario = {
        "USUA_Nombres": inNombre.value,
        "USUA_Apellidos": inApellido.value,
        "USUA_Correo": inCorreo.value,
        "USUA_Contrasenia": inContrasenia.value,
        "USUA_Estado": 1,
        "PERF_Id": inPerfil.value
    };
    peticion.registrar('http://localhost:3000/usuarios/', datosUsuario).then((response) => {
        swal(`${'Registro exitoso'}`, `${response}`, 'success');
        limpiarFormulario();
    }).catch((error) => console.log({
        error: error
    }));
}

const modificarUsuario = () => {
    let datosUsuario = {
        "USUA_Id": spUsuario.value,
        "USUA_Nombres": inNombre.value,
        "USUA_Apellidos": inApellido.value,
        "USUA_Correo": inCorreo.value,
        "USUA_Contrasenia": inContrasenia.value,
        "USUA_Estado": 1,
        "PERF_Id": parseInt(inPerfil.value)
    };
    peticion.modificar(`http://localhost:3000/usuarios/${spUsuario.value}`, datosUsuario).then((response) => {
        swal(`${response}`, {
            icon: "success",
        });
        limpiarFormulario();
    }).catch((error) => console.log({
        error: error
    }));
}

const visualizarUsuarios = (data) => {
    if (data) {
        const tbody = document.createElement('tbody');
        data.forEach((usuario) => {
            const row = document.createElement('tr');
            row.innerHTML = ` <td>${usuario.USUA_Id}</td>
                              <td>${usuario.USUA_Nombres} ${usuario.USUA_Apellidos}</td>
                              <td>${usuario.PERF_Descripcion}</td>
                              <td>${usuario.USUA_DescripcionEstado}</td>
                              <td>
                                <button type="button" class="btn btn-primary" id="btnEditar"><i class="fa fa-pencil fa-fw"></i></button>
                                <button type="button" class="btn btn-danger" id="btnEliminar"><i class="fa fa-trash fa-fw"></i></button>
                              </td>`;
            row.querySelector('#btnEditar').addEventListener('click', () => {
                editarUsuario(usuario.USUA_Id);
            });
            row.querySelector('#btnEliminar').addEventListener('click', () => {
                eliminarUsuario(usuario.USUA_Id);
            });
            tbody.appendChild(row);
        });
        tblUsuarios.appendChild(tbody);
    }
}

const visualizarPerfiles = (data) => {
    if (data) {
        data.forEach((perfil) => {
            let opPerfil = document.createElement('option');
            opPerfil.innerHTML = perfil.PERF_Descripcion;
            opPerfil.value = perfil.PERF_Id;
            inPerfil.appendChild(opPerfil);
        });
    }
}

const limpiarFormulario = () => {
    inNombre.value = '';
    inApellido.value = '';
    inCorreo.value = '';
    inContrasenia.value = '';
    inRepetirContrasenia.value = '';
    inPerfil.value = '';
    navConsulta.classList.add('active', 'show');
    navRegistro.classList.remove('active', 'show');
    setTimeout(function () { location.reload(); }, 2000);
}

const editarUsuario = (idUsuario) => {
    peticion.obtener(`http://localhost:3000/usuarios/${idUsuario}`).then((data) => {
        navConsulta.classList.remove('active', 'show');
        navRegistro.classList.add('active', 'show');
        btnEditar.classList.remove('invisible');
        btnRegistrar.classList.add('invisible');
        spUsuario.value = data[0].USUA_Id;
        inNombre.value = data[0].USUA_Nombres;
        inApellido.value = data[0].USUA_Apellidos;
        inCorreo.value = data[0].USUA_Correo;
        inContrasenia.value = data[0].USUA_Contrasenia;
        inPerfil.value = data[0].PERF_Id;
        inRepetirContrasenia.value = data[0].USUA_Contrasenia;
    }).catch((error) => {
        console.log(error)
    });
}

const eliminarUsuario = (idUsuario) => {
    swal({
        title: "¿Está seguro de eliminar el usuario?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((eliminar) => {
            if (eliminar) {
                peticion.eliminar(`http://localhost:3000/usuarios/${idUsuario}`).then((response) => {
                    swal(`${response}`, {
                        icon: "success",
                    });
                    setTimeout(function () { location.reload(); }, 2000);
                }).catch((error) => {
                    console.log(error)
                });
            }
        });
}

consultarUsuarios();
consultarPerfiles();