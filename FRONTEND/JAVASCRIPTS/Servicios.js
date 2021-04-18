
let peticion = {
  obtener: (function (URL_GET) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', `bearer ${JSON.parse(localStorage.getItem('Usuario'))}`);
    return new Promise((resolve, reject) => {
      fetch(URL_GET, {
        method: 'GET',
        headers: header
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  }),
  registrar: ((URL_CREATE, data) => {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', `bearer ${JSON.parse(localStorage.getItem('Usuario'))}`);
    return new Promise((resolve, reject) => {
      fetch(URL_CREATE, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: header,
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  }),
  modificar: ((URL_PUT, data) => {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', `bearer ${JSON.parse(localStorage.getItem('Usuario'))}`);
    return new Promise((resolve, reject) => {
      fetch(URL_PUT, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: header,
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  }),
  eliminar: ((URL_DELETE) => {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', `bearer ${JSON.parse(localStorage.getItem('Usuario'))}`);
    return new Promise((resolve, reject) => {
      fetch(URL_DELETE, {
        method: 'DELETE',
        headers: header,
      })
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    })
  }),
  iniciar: ((URL, data) => {
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    return new Promise((resolve, reject) => {
      fetch(URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: header,
      })
        .then((response) => resolve((response.ok) ? response.json() : response))
        .catch((error) => reject(error))
    })
  }),
};

export default peticion;