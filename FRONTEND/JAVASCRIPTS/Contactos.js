import peticion from './Servicios.js';

/*ELEMENTOS*/
const inNombre = document.getElementById('inNombre');
const inApellido = document.getElementById('inApellido');
const inCargo = document.getElementById('inCargo');
const inCorreo = document.getElementById('inCorreo');
const inCompania = document.getElementById('inCompania');
const inRegion = document.getElementById('inRegion');
const inPais = document.getElementById('inPais');
const inCiudad = document.getElementById('inCiudad');
const inDireccion = document.getElementById('inDireccion');
const dvInteres = document.getElementById('dvInteres');
const inInteres = document.getElementById('inInteres');
const inCuenta = document.getElementById('inCuenta');
const inBusqueda = document.getElementById('inBusqueda');
const spContacto = document.getElementById('spContacto');

const btnRegistrar = document.getElementById('btnRegistrarContacto');
const btnCancelar = document.getElementById('btnCancelarRegistro');
const btnEditar = document.getElementById('btnEditarContacto');
const btnAgregar = document.getElementById('btnAgregarCanal');
const btnEliminarSeleccion = document.getElementById('btnEliminarSeleccion');
const btnConsultar = document.getElementById('btnConsultar');
const btnRefrescar = document.getElementById('btnRefrescar');

const tblContactos = document.getElementById('tblContactos');
const tblCanales = document.getElementById('tblCanales');
const tbCanal = document.getElementById('tbCanal');
const tbodyContactos = document.getElementById('tbodyContactos');

const dvCanales = document.getElementById('dvCanales');

/*EVENTOS*/
btnRegistrar.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (inNombre.value && inApellido.value && inCargo.value && inCorreo.value && inCompania.value) {
        crearContacto();
    } else {
        swal(`Campos de formulario`, `Por favor complete los campos obligatorios (*) del formulario.`, 'warning');
    }
});
btnCancelar.addEventListener("click", (evt) => {
    evt.preventDefault();
    $("#modalRegistro").modal("show");
    limpiarFormulario();
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
                if (inNombre.value && inApellido.value && inCargo.value && inCorreo.value && inCompania.value) {
                    modificarContacto();
                } else {
                    swal(`Campos de formulario`, `Por favor complete los campos del formulario.`, 'warning');
                }
            }
        });
});
inInteres.addEventListener('change', (event) => {
    switch (inInteres.value) {
        case "1": dvInteres.style.width = '0%'; break;
        case "2": dvInteres.style.width = '25%'; break;
        case "3": dvInteres.style.width = '50%'; break;
        case "4": dvInteres.style.width = '75%'; break;
        case "5": dvInteres.style.width = '100%'; break;
        default: dvInteres.style.width = '0%'; break;
    }
});
inRegion.addEventListener('change', (event) => {
    event.preventDefault();
    let dataPais = JSON.parse(localStorage.getItem('Regiones'));
    inPais.innerHTML = "";
    if (dataPais) {
        visualizarPais(dataPais);
    }
});
inPais.addEventListener('change', (event) => {
    event.preventDefault();
    let dataCiudad = JSON.parse(localStorage.getItem('Regiones'));
    inCiudad.innerHTML = "";
    if (dataCiudad) {
        visualizarCiudad(dataCiudad);
    }
});
inCanal.addEventListener('change', (event) => {
    event.preventDefault();
    inCuenta.disabled = inCanal.value != 1 ? false : true;
});
inCuenta.addEventListener('onmouseout', () => {
    alert('Foco');
});
btnAgregar.addEventListener('click', (evt) => {
    if (inCanal.value != 1 && inCuenta.value && inPreferencia.value) {
        tblCanales.classList.remove('invisible');
        let dataCanales = JSON.parse(localStorage.getItem('Canales'));
        let id = 0;
        if (dataCanales.length > 0) {
            id = dataCanales.reduce((maxId, item) => Math.max(maxId, item.Id), 0);
        }
        dataCanales.push({ "Id": (id + 1), "CANA_Id": inCanal.value, "CONCA_Cuentausuario": inCuenta.value, "PREFE_Id": inPreferencia.value, "CANA_Nombre": inCanal.options[(parseInt(inCanal.value) - 1)].text, "PREF_Descripcion": inPreferencia.options[(parseInt(inPreferencia.value) - 1)].text })
        localStorage.setItem('Canales', JSON.stringify(dataCanales));
        inCanal.value = 1;
        inCuenta.value = "";
        inPreferencia.value = 1;
        visualizarCanales(dataCanales);
    } else {
        swal(`Campos de formulario`, `Por favor complete los campos para agregar el canal`, 'warning');
    }
});
btnEliminarSeleccion.addEventListener('click', () => {
    let dataSeleccionados = JSON.parse(localStorage.getItem('ContactosSeleccionados'));
    if (dataSeleccionados.length > 0) {
        swal({
            title: "¿Está seguro de eliminar los contactos seleccionados?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((eliminar) => {
                if (eliminar) {
                    dataSeleccionados.forEach((contacto) => {
                        eliminarContacto(contacto.CONT_Id);
                    });
                    setTimeout(function () { location.reload(); }, 2000);
                }
            });
    } else {
        swal(`Validación`, `Debe seleccionar al menos un contacto para eliminar`, 'warning');
    }
});
btnConsultar.addEventListener('click', () => {
    if (inBusqueda.value != null || inBusqueda.value != "") {
        busquedaContactos(inBusqueda.value);
    }
});
btnRefrescar.addEventListener('click', () => {
    consultarContactos();
})
inBusqueda.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (inBusqueda.value != null || inBusqueda.value != "") {
            busquedaContactos(inBusqueda.value);
        }
    }
})

/*FUNCIONES*/
const consultarContactos = () => {
    peticion.obtener('http://localhost:3000/contactos').then((data) => {
        visualizarContactos(data);
    }).catch((error) => { console.log(error) });
}

const consultarRegiones = () => {
    peticion.obtener('http://localhost:3000/regiones').then((data) => {
        visualizarRegion(data);
    }).catch((error) => { console.log(error) });
}

const consultarCompania = () => {
    peticion.obtener('http://localhost:3000/companias').then((data) => {
        visualizarCompania(data);
    }).catch((error) => { console.log(error) });
}

const consultarCargo = () => {
    peticion.obtener('http://localhost:3000/cargo').then((data) => {
        visualizarCargo(data);
    }).catch((error) => { console.log(error) });
}

const consultarInteres = () => {
    peticion.obtener('http://localhost:3000/Interes').then((data) => {
        visualizarInteres(data);
    }).catch((error) => { console.log(error) });
}

const consultarCanal = () => {
    peticion.obtener('http://localhost:3000/Canal').then((data) => {
        visualizarCanal(data);
    }).catch((error) => { console.log(error) });
}

const consultarPreferencia = () => {
    peticion.obtener('http://localhost:3000/Preferencia').then((data) => {
        visualizarPreferencia(data);
    }).catch((error) => { console.log(error) });
}

const crearContacto = () => {
    let datosContacto = {
        "CONT_Nombre": inNombre.value,
        "CONT_Apellido": inApellido.value,
        "CONT_Correo": inCorreo.value,
        "CONT_Direccion": inDireccion.value,
        "CONT_Estado": 1,
        "CIUD_Id": inCiudad.value,
        "COMP_Id": inCompania.value,
        "INTE_Id": inInteres.value,
        "CARG_Id": inCargo.value,
        "CANALES": JSON.parse(localStorage.getItem('Canales'))
    };
    peticion.registrar('http://localhost:3000/Contactos/', datosContacto).then((response) => {
        swal(`${'Registro exitoso'}`, `${response}`, 'success');
        limpiarFormulario();
    }).catch((error) => console.log({
        error: error
    }));
}

const modificarContacto = () => {
    let datosContacto = {
        "CONT_Id": spContacto.value,
        "CONT_Nombre": inNombre.value,
        "CONT_Apellido": inApellido.value,
        "CONT_Correo": inCorreo.value,
        "CONT_Direccion": inDireccion.value,
        "CONT_Estado": 1,
        "CIUD_Id": parseInt(inCiudad.value),
        "COMP_Id": parseInt(inCompania.value),
        "INTE_Id": parseInt(inInteres.value),
        "CARG_Id": parseInt(inCargo.value),
    };
    peticion.modificar(`http://localhost:3000/Contactos/${spContacto.value}`, datosContacto).then((response) => {
        swal(`${response}`, {
            icon: "success",
        });
        limpiarFormulario();
    }).catch((error) => console.log({
        error: error
    }));
}

const visualizarContactos = (data) => {
    tbodyContactos.innerHTML = '';
    if (data) {
        data.forEach((Contacto) => {
            const row = document.createElement('tr');
            row.innerHTML = ` <td><input type="checkbox" id="cb${Contacto.CONT_Id}" value="${Contacto.CONT_Id}"></td>
                              <td>${Contacto.CONT_Id}</td>
                              <td>${Contacto.CONT_Nombre} </br><span id="spCorreo">${Contacto.CONT_Correo}</span></td>
                              <td>${Contacto.PAIS_Nombre} </br><span id="spCorreo">${Contacto.REGI_Nombre}</span></td>
                              <td>${Contacto.COMP_Nombre}</td>
                              <td>${Contacto.CARG_Nombre}</td>
                              <td> <div class="progress">
                                      <div class="progress-bar progress-bar-striped" role="progressbar" style="width: ${parseInt(Contacto.INTE_Nombre)}%"
                                        aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" id="dvInteres"></div>
                                    </div></td>
                              <td>
                                <button type="button" class="btn btn-primary" id="btnEditar"><i class="fa fa-pencil fa-fw"></i></button>
                                <button type="button" class="btn btn-danger" id="btnEliminar"><i class="fa fa-trash fa-fw"></i></button>
                              </td>`;
            row.querySelector('#btnEditar').addEventListener('click', () => {
                editarContacto(Contacto.CONT_Id);
            });
            row.querySelector('#btnEliminar').addEventListener('click', () => {
                eliminarContacto(Contacto.CONT_Id);
            });
            row.querySelector(`#cb${Contacto.CONT_Id}`).addEventListener('click', () => {
                var checkbox = document.getElementById(`cb${Contacto.CONT_Id}`);
                if (checkbox.checked) {
                    seleccionarContacto(Contacto.CONT_Id, 1);
                } else {
                    seleccionarContacto(Contacto.CONT_Id, 2);
                }
            });
            tbodyContactos.appendChild(row);
        });
        tblContactos.appendChild(tbodyContactos);
    }
}

const visualizarRegion = (data) => {
    if (data) {
        localStorage.setItem('Regiones', JSON.stringify(data));
        let region = Enumerable.From(data)
            .GroupBy(null, null,
                "{ REGI_Id: $.REGI_Id, REGI_Nombre: $.REGI_Nombre}",
                "'' + $.REGI_Id + '-' + $.REGI_Nombre")
            .ToArray();
        region.forEach((Region) => {
            let opRegion = document.createElement('option');
            opRegion.innerHTML = Region.REGI_Nombre;
            opRegion.value = Region.REGI_Id;
            inRegion.appendChild(opRegion);
        });
        if (inRegion.value) {
            visualizarPais(data)
        }
    }
}

const visualizarPais = (data) => {
    let region = parseInt(inRegion.value)
    let pais = Enumerable.From(data)
        .GroupBy(null, null,
            "{ REGI_Id: $.REGI_Id,PAIS_Id: $.PAIS_Id, PAIS_Nombre: $.PAIS_Nombre}",
            "'' + $.PAIS_Id + '-' + $.PAIS_Nombre")
        .Where(function (x) { return x['REGI_Id'] === region })
        .ToArray();
    inPais.innerHTML = "";
    pais.forEach((Pais) => {
        let opPais = document.createElement('option');
        opPais.innerHTML = Pais.PAIS_Nombre;
        opPais.value = Pais.PAIS_Id;
        inPais.appendChild(opPais);
    });
    if (inPais.value) {
        visualizarCiudad(data)
    }
}

const visualizarCiudad = (data) => {
    let pais = parseInt(inPais.value)
    let ciudad = Enumerable.From(data)
        .GroupBy(null, null,
            "{ PAIS_Id: $.PAIS_Id,CIUD_Id: $.CIUD_Id, CIUD_Nombre: $.CIUD_Nombre}",
            "'' + $.CIUD_Id + '-' + $.CIUD_Nombre")
        .Where(function (x) { return x['PAIS_Id'] === pais })
        .ToArray();
    inCiudad.innerHTML = "";
    ciudad.forEach((Ciudad) => {
        let opCiudad = document.createElement('option');
        opCiudad.innerHTML = Ciudad.CIUD_Nombre;
        opCiudad.value = Ciudad.CIUD_Id;
        inCiudad.appendChild(opCiudad);
    });
}

const visualizarCompania = (data) => {
    if (data) {
        data.forEach((Compania) => {
            let opCompania = document.createElement('option');
            opCompania.innerHTML = Compania.COMP_Nombre;
            opCompania.value = Compania.COMP_Id;
            inCompania.appendChild(opCompania);
        });
    }
}

const visualizarCargo = (data) => {
    if (data) {
        data.forEach((Cargo) => {
            let opCargo = document.createElement('option');
            opCargo.innerHTML = Cargo.CARG_Nombre;
            opCargo.value = Cargo.CARG_Id;
            inCargo.appendChild(opCargo);
        });
    }
}

const visualizarInteres = (data) => {
    if (data) {
        data.forEach((Interes) => {
            let opInteres = document.createElement('option');
            opInteres.innerHTML = Interes.INTE_Nombre;
            opInteres.value = Interes.INTE_Id;
            inInteres.appendChild(opInteres);
        });
    }
}

const visualizarCanal = (data) => {
    if (data) {
        data.forEach((Canal) => {
            let opCanal = document.createElement('option');
            opCanal.innerHTML = Canal.CANA_Nombre;
            opCanal.value = Canal.CANA_Id;
            inCanal.appendChild(opCanal);
        });
    }
}

const visualizarPreferencia = (data) => {
    if (data) {
        data.forEach((Preferencia) => {
            let opPreferencia = document.createElement('option');
            opPreferencia.innerHTML = Preferencia.PREF_Descripcion;
            opPreferencia.value = Preferencia.PREF_Id;
            inPreferencia.appendChild(opPreferencia);
        });
    }
}

const limpiarFormulario = () => {
    inNombre.value = '';
    inApellido.value = '';
    inCorreo.value = '';
    inDireccion.value = '';
    inCiudad.value = '';
    inCompania.value = '';
    inInteres.value = '';
    inCargo.value = '';
    tbCanal.innerHTML = '';
    tblCanales.classList.add('invisible');
    localStorage.setItem('Canales', JSON.stringify([]));
    setTimeout(function () { location.reload(); }, 2000);
}

const editarContacto = (idContacto) => {
    peticion.obtener(`http://localhost:3000/Contactos/${idContacto}`).then((data) => {
        btnEditar.classList.remove('invisible');
        btnRegistrar.classList.add('invisible');
        $("#modalRegistro").modal("show");
        spContacto.value = data[0].CONT_Id;
        inNombre.value = data[0].CONT_Nombre;
        inApellido.value = data[0].CONT_Apellido;
        inDireccion.value = data[0].CONT_Direccion;
        inCorreo.value = data[0].CONT_Correo;
        inCiudad.value = data[0].CIUD_Id;
        inCompania.value = data[0].COMP_Id;
        inInteres.value = data[0].INTE_Id;
        inCargo.value = data[0].CARG_Id;
        peticion.obtener(`http://localhost:3000/Canal/${idContacto}`).then((data) => {
            localStorage.setItem('Canales', JSON.stringify(data));
            tblCanales.classList.remove('invisible');
            visualizarCanales(data);
        }).catch((error) => { console.log(error) });
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
                }).catch((error) => { console.log(error) });
            }
        });
}

const visualizarCanales = (data) => {
    if (data) {
        tbCanal.innerHTML = '';
        data.forEach((Canal) => {
            const row = document.createElement('tr');
            row.innerHTML = ` <td>${Canal.CANA_Nombre}</td>
                              <td>${Canal.CONCA_Cuentausuario}</td>
                              <td>${Canal.PREF_Descripcion}</td>
                              <td>
                                <button type="button" class="btn btn-danger" id="btnEliminar"><i class="fa fa-trash fa-fw"></i>Eliminar canal</button>
                              </td>`;
            row.querySelector('#btnEliminar').addEventListener('click', () => {
                eliminarCanal(Canal.Id);
            });
            tbCanal.appendChild(row);
        });
        tblCanales.appendChild(tbCanal);
    }
}

function eliminarCanal(idCanal) {
    let dataCanales = JSON.parse(localStorage.getItem('Canales'));
    let indiceCanal = dataCanales.indexOf(idCanal);
    dataCanales.splice(indiceCanal, 1);
    localStorage.setItem('Canales', JSON.stringify(dataCanales));
    visualizarCanales(dataCanales);
}

const eliminarContacto = (idContacto) => {
    swal({
        title: "¿Está seguro de eliminar el contacto?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((eliminar) => {
            if (eliminar) {
                peticion.eliminar(`http://localhost:3000/contactos/${idContacto}`).then((response) => {
                    swal(`${response}`, {
                        icon: "success",
                    });
                }).catch((error) => {
                    console.log(error)
                });
            }
        });
}

const seleccionarContacto = (idContacto, accion) => {
    let contactos = JSON.parse(localStorage.getItem('ContactosSeleccionados'));
    switch (accion) {
        case 1:
            contactos.push({ "CONT_Id": idContacto })
            break;
        case 2:
            let indiceContacto = contactos.indexOf(idContacto);
            contactos.splice(indiceContacto, 1);
            break;
    }
    localStorage.setItem('ContactosSeleccionados', JSON.stringify(contactos));
}

const busquedaContactos = (valor) => {
    let parametro = {
        "parametro": valor
    }
    peticion.registrar('http://localhost:3000/obtenercontactos/', parametro).then((response) => {
        visualizarContactos(response);
    }).catch((error) => console.log({
        error: error
    }));
}


localStorage.setItem('Canales', JSON.stringify([]));
localStorage.setItem('ContactosSeleccionados', JSON.stringify([]));
consultarCompania();
consultarContactos();
consultarCargo();
consultarInteres();
consultarRegiones();
consultarCanal();
consultarPreferencia();