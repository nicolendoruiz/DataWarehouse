import peticion from './Servicios.js';

/*ELEMENTOS*/ 
const inNombre = document.getElementById('inNombre');
const inCorreo = document.getElementById('inCorreo');
const inDireccion = document.getElementById('inDireccion');
const inTelefono = document.getElementById('inTelefono');
const inCiudad = document.getElementById('inCiudad');
const spCompania = document.getElementById('spCompania');
const btnRegistrar = document.getElementById('btnRegistrarCompania');
const btnCancelar = document.getElementById('btnCancelarRegistro');
const btnEditar = document.getElementById('btnEditarCompania');
const tblCompanias = document.getElementById('tblCompanias');

const navConsulta = document.getElementById('nav-home');
const navRegistro = document.getElementById('nav-profile');

const alerta = document.getElementById('alerta');

/*EVENTOS*/
btnRegistrar.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (inNombre.value && inCorreo.value && inDireccion.value && inTelefono.value
        && inCiudad.value) {
            alerta.classList.add("invisible");
            alerta.classList.remove("visible");
            crearCompania();
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
                if (inNombre.value && inCorreo.value && inDireccion.value && inTelefono.value
                    && inCiudad.value) {
                    modificarCompania();
                    alerta.classList.add("invisible");
                    alerta.classList.remove("visible");
                } else {
                    alerta.classList.remove("invisible");
                    alerta.classList.add("visible");
                    alerta.innerHTML = 'Por favor complete los campos del formulario.'
                }
            }
        });
})

/*FUNCIONES*/
const consultarCompanias = () => {
    peticion.obtener('http://localhost:3000/Companias').then((data) => {
        visualizarCompanias(data);
    }).catch((error) => {
        console.log(error)
    });
}

const consultarCiudades = () => {
    peticion.obtener('http://localhost:3000/ciudades').then((data) => {
        visualizarCiudad(data);
    }).catch((error) => {
        console.log(error)
    });
}

const crearCompania = () => {
    let datosCompania = {
        "COMP_Nombre": inNombre.value,
        "COMP_Direccion": inDireccion.value,
        "COMP_Correo": inCorreo.value,
        "COMP_Telefono": inTelefono.value,
        "COMP_Estado": 1,
        "CIUD_Id": inCiudad.value
    };
    peticion.registrar('http://localhost:3000/Companias/', datosCompania).then((response) => {
        swal(`${'Registro exitoso'}`, `${response}`, 'success');
        limpiarFormulario();
    }).catch((error) => console.log({
        error: error
    }));
}

const modificarCompania = () => {
    let datosCompania = {
        "COMP_Id": spCompania.value,
        "COMP_Nombre": inNombre.value,
        "COMP_Direccion": inDireccion.value,
        "COMP_Correo": inCorreo.value,
        "COMP_Telefono": inTelefono.value,
        "COMP_Estado": 1,
        "CIUD_Id": parseInt(inCiudad.value)
    };
    peticion.modificar(`http://localhost:3000/Companias/${spCompania.value}`, datosCompania).then((response) => {
        swal(`${response}`, {
            icon: "success",
        });
        limpiarFormulario();
    }).catch((error) => console.log({
        error: error
    }));
}

const visualizarCompanias = (data) => {
    if (data) {
        const tbody = document.createElement('tbody');
        data.forEach((Compania) => {
            const row = document.createElement('tr');
            row.innerHTML = ` <td>${Compania.COMP_Id}</td>
                              <td>${Compania.COMP_Nombre}</td>
                              <td>${Compania.COMP_Correo}</td>
                              <td>${Compania.COMP_Direccion}</td>
                              <td>${Compania.PAIS_Nombre}</td>
                              <td>${Compania.COMP_Telefono}</td>
                              <td>
                                <button type="button" class="btn btn-primary" id="btnEditar"><i class="fa fa-pencil fa-fw"></i></button>
                                <button type="button" class="btn btn-danger" id="btnEliminar"><i class="fa fa-trash fa-fw"></i></button>
                              </td>`;
            row.querySelector('#btnEditar').addEventListener('click', () => {
                editarCompania(Compania.COMP_Id);
            });
            row.querySelector('#btnEliminar').addEventListener('click', () => {
                eliminarCompania(Compania.COMP_Id);
            });
            tbody.appendChild(row);
        });
        tblCompanias.appendChild(tbody);
    }
}

const visualizarCiudad = (data) => {
    if (data) {
        data.forEach((Ciudad) => {
            let opCiudad = document.createElement('option');
            opCiudad.innerHTML = Ciudad.CIUD_Nombre;
            opCiudad.value = Ciudad.CIUD_Id;
            inCiudad.appendChild(opCiudad);
        });
    }
}

const limpiarFormulario = () => {
    inNombre.value = '';
    inCorreo.value = '';
    inDireccion.value = '';
    inTelefono.value = '';
    inCiudad.value = '';
    navConsulta.classList.add('active', 'show');
    navRegistro.classList.remove('active', 'show');
    setTimeout(function () { location.reload(); }, 2000);
}

const editarCompania = (idCompania) => {
    peticion.obtener(`http://localhost:3000/Companias/${idCompania}`).then((data) => {
        navConsulta.classList.remove('active', 'show');
        navRegistro.classList.add('active', 'show');
        btnEditar.classList.remove('invisible');
        btnRegistrar.classList.add('invisible');
        spCompania.value = data[0].COMP_Id;
        inNombre.value = data[0].COMP_Nombre;
        inDireccion.value = data[0].COMP_Direccion;
        inCorreo.value = data[0].COMP_Correo;
        inTelefono.value = data[0].COMP_Telefono;
        inCiudad.value = data[0].CIUD_Id;
    }).catch((error) => {
        console.log(error)
    });
}

const eliminarCompania = (idCompania) => {
    swal({
        title: "¿Está seguro de eliminar la compania?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((eliminar) => {
            if (eliminar) {
                peticion.eliminar(`http://localhost:3000/Companias/${idCompania}`).then((response) => {
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

consultarCompanias();
consultarCiudades();