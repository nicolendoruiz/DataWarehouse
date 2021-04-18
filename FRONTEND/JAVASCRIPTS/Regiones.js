import peticion from './Servicios.js';

const jstree = document.getElementById('jstree');
const inNombre = document.getElementById('inNombre');
const btnCancelar = document.getElementById('btnCancelar');
const btnRegistrar = document.getElementById('btnRegistrar');

/*EVENTOS*/
btnCancelar.addEventListener('click', (evt) => {
  evt.preventDefault();
  $("#modalRegistro").modal("show");
});

let json;
const consultarDataRegiones = () => {
  json = JSON.parse(localStorage.getItem('Regiones'));
  consultarRegiones();
}

const consultarRegiones = () => {
  peticion.obtener('http://localhost:3000/regiones').then((data) => {
    JSON.parse(localStorage.setItem('Regiones', JSON.stringify(data)));
    visualizarRegiones(data);
  }).catch((error) => { console.log(error) });
}

const agrupar = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
};


function cargarDatos() {
  const { id, name, type } = getKeys('');
  return getObjects(id, name, type, agrupar(json, name));
}


function getObjects(catId, catName, catType, keys) {
  const objects = [];
  if (catName !== undefined) {
    const { id, name, type } = getKeys(catType);
    Object.keys(keys).forEach(k => {
      let temp = getValue(catName, k);
      if (temp) {
        objects.push({
          id: temp[catId],
          nombre: temp[catName],
          tipo: catType,
          children: getObjects(id, name, type, agrupar(json.filter(e => e[catName] === k), name))
        });
      }
    });
  }
  return objects;
}

function getKeys(parent) {
  switch (parent) {
    case '':
      return { id: 'REGI_Id', name: 'REGI_Nombre', type: 'Region' };
    case 'Region':
      return { id: 'PAIS_Id', name: 'PAIS_Nombre', type: 'Pais' };
    case 'Pais':
      return { id: 'CIUD_Id', name: 'CIUD_Nombre', type: 'Ciudad' };
    default:
      return {};
  }
}

function getValue(key, value) {
  return json.find(e => e[key] === value);
}

const visualizarRegiones = (data) => {
  console.log(data);
  const ulRegion = document.createElement('ul');
  data.forEach((region) => {
    let liRegion = document.createElement('li');
    liRegion.classList.add('liRegion');
    liRegion.innerHTML = `<i class="fa fa-globe" ></i> ${region.nombre}
    <button type="button" class="btn btn-success btn-sm btnAgregar" id="btnAgregar" data-toggle="modal" data-target="#modalRegistro">Agregar país</button>`;
    liRegion.querySelector('#btnAgregar').addEventListener('click', () => {
      gestionRegiones(region);
    });
    ulRegion.appendChild(liRegion);
    region.children.forEach((pais) => {
      let liPais = document.createElement('li');
      liPais.classList.add('liPais');
      liPais.innerHTML = `<i class="fa fa-map-marker" aria-hidden="true"></i> ${pais.nombre}
      <button type="button" class="btn btn-primary btn-sm btnEditar" id="btnEditar">Editar país</button>
      <button type="button" class="btn btn-danger btn-sm btnEliminar" id="btnEliminar">Eliminar país</button>
      <button type="button" class="btn btn-success btn-sm btnAgregar" id="btnAgregar" data-toggle="modal" data-target="#modalRegistro">Agregar ciudad</button>`;
      liPais.querySelector('#btnAgregar').addEventListener('click', () => {
        gestionRegiones(pais, 'agregar');
      });
      liPais.querySelector('#btnEditar').addEventListener('click', () => {
        gestionRegiones(pais, 'editar');
      });
      liPais.querySelector('#btnEliminar').addEventListener('click', () => {
        gestionRegiones(pais, 'eliminar');
      });
      ulRegion.appendChild(liPais);
      pais.children.forEach((ciudad) => {
        let liCiudad = document.createElement('li');
        liCiudad.classList.add('liCiudad');
        liCiudad.innerHTML = `<i class="fa fa-building" aria-hidden="true"></i> ${ciudad.nombre}
        <button type="button" class="btn btn-primary btn-sm btnEditar" id="btnEditar">Editar ciudad</button>
        <button type="button" class="btn btn-danger btn-sm btnEliminar" id="btnEliminar">Eliminar ciudad</button>`;
        liCiudad.querySelector('#btnEditar').addEventListener('click', () => {
          gestionRegiones(ciudad, 'editar');
        });
        liCiudad.querySelector('#btnEliminar').addEventListener('click', () => {
          gestionRegiones(ciudad, 'eliminar');
        });
        ulRegion.appendChild(liCiudad);
      })
    })
  })
  jstree.appendChild(ulRegion);
}

const gestionRegiones = (data, accion) => {
  console.log(data);
  switch (data.tipo) {
    case "Region":
      agregarPais(data.id);
      break;
    case "Pais":
      if (accion == 'eliminar') {
        eliminarPais(data);
      } else if (accion == 'editar') {

      } else if (accion == 'agregar') {

      }
      break;
    case "Ciudad":
      break;
  }
}

const agregarPais = (idRegion) => {
  btnRegistrar.addEventListener('click', () => {
    if (inNombre.value != null && inNombre.value != "") {
      let datosPais = {
        "PAIS_Nombre": inNombre.value,
        "REGI_Id": idRegion
      };
      peticion.registrar('http://localhost:3000/paises/', datosPais).then((response) => {
        swal(`${'Registro exitoso'}`, `${response}`, 'success');
        consultarRegiones();
      }).catch((error) => console.log({
        error: error
      }));
    }
  });
}

const eliminarPais = (data) => {
  console.log(data);
  // swal({
  //   title: `¿Está seguro de eliminar el país ${data.nombre}?`,
  //   icon: "warning",
  //   buttons: true,
  //   dangerMode: true,
  // })
  //   .then((eliminar) => {
  //     if (eliminar) {
  //       peticion.eliminar(`http://localhost:3000/paises/${data.id}`).then((response) => {
  //         swal(`${response}`, {
  //           icon: "success",
  //         });
  //         setTimeout(function () { location.reload(); }, 2000);
  //       }).catch((error) => { console.log(error) });
  //     }
  //   });
}

consultarDataRegiones();
let data = cargarDatos();
visualizarRegiones(data);
