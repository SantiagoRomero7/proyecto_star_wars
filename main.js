const API_URL = "https://swapi.py4e.com/api/";

const characterImages = {
  "Luke Skywalker": "./skywalker.jpg",
  "Darth Vader": "./darthvader.jpg",
  "Leia Organa": "./leiaorgana.jpg",
  "Obi-Wan Kenobi": "./obiwan.jpg",
  "C-3PO": "./c3po.jpg",
  "R2-D2": "./r2d2.jpg",
  "R5-D4": "./r5d4.jpg",
  "Owen Lars": "./owenlars.jpg",
  "Beru Whitesun lars": "./beru.jpg",
  "Biggs Darklighter": "./biggs.jpg",

};


async function loadSection(section) {
  const content = document.getElementById("content");
  content.innerHTML = `<div class="spinner-border text-warning" role="status"><span class="visually-hidden">Cargando...</span></div>`;
  
  try {
    const response = await fetch(`${API_URL}${section}/`);
    if (!response.ok) {
      throw new Error(`Error al cargar datos: ${response.status}`);
    }
    const data = await response.json();
    console.log(data); 
    if (data.results) {
      displayData(data.results, section);
    } else {
      content.innerHTML = `<p class="text-danger">No se encontraron resultados</p>`;
    }
  } catch (error) {
    console.error(error);
    content.innerHTML = `<p class="text-danger">Error al cargar datos: ${error.message}</p>`;
  }
}

function displayData(items, section) {
  const content = document.getElementById("content");
  if (!items || items.length === 0) {
    content.innerHTML = `<p class="text-warning">No hay datos disponibles para esta sección.</p>`;
    return;
  }
  content.innerHTML = items.map(item => {
    const imageUrl = characterImages[item.name] || "./images/default.jpg"; // Usa una imagen por defecto si no hay coincidencia
    return `
      <div class="col-md-4">
        <div class="card bg-dark text-light" onclick="showDetails('${section}', '${item.url}')">
          <img src="${imageUrl}" class="card-img-top img-fluid" alt="${item.name}">
          <div class="card-body">
            <h5 class="card-title">${item.name || item.title}</h5>
            <p class="card-text">${getDetails(item, section)}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getDetails(item, section) {
  switch (section) {
    case 'people':
      return `Altura: ${item.height} cm<br>Género: ${item.gender}<br>Color de ojos: ${item.eye_color}`;
    case 'films':
      return `Director: ${item.director}<br>Fecha de lanzamiento: ${item.release_date}<br>Productor: ${item.producer}`;
    case 'planets':
      return `Clima: ${item.climate}<br>Terreno: ${item.terrain}<br>Población: ${item.population}`;
    case 'starships':
      return `Modelo: ${item.model}<br>Capacidad: ${item.passengers}<br>Fabricante: ${item.manufacturer}`;
    case 'vehicles':
      return `Modelo: ${item.model}<br>Capacidad: ${item.passengers}<br>Clase: ${item.vehicle_class}`;
    case 'species':
      return `Clasificación: ${item.classification}<br>Idioma: ${item.language}<br>Esperanza de vida: ${item.average_lifespan}`;
    default:
      return 'Detalles no disponibles';
  }
}

async function showDetails(section, url) {
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `<div class="spinner-border text-warning" role="status"><span class="visually-hidden">Cargando...</span></div>`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al cargar detalles: ${response.status}`);
    }
    const item = await response.json();
    modalContent.innerHTML = `
      <h5>${item.name || item.title}</h5>
      <p>${getDetails(item, section)}</p>
    `;
    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
  } catch (error) {
    console.error(error);
    modalContent.innerHTML = `<p class="text-danger">Error al cargar detalles: ${error.message}</p>`;
  }
}
