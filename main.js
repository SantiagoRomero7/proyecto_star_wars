const API_URL = "https://swapi.py4e.com/api/";

const characterImages = {
  "Luke Skywalker": "./img/skywalker.jpg",
  "Darth Vader": "./img/darthvader.jpg",
  "Leia Organa": "./img/leiaorgana.jpg",
  "Obi-Wan Kenobi": "./img/obiwan.jpg",
  "C-3PO": "./img/c3po.jpg",
  "R2-D2": "./img/r2d2.jpg",
  "R5-D4": "./img/r5d4.jpg",
  "Owen Lars": "./img/owenlars.jpg",
  "Beru Whitesun lars": "./img/beru.jpg",
  "Biggs Darklighter": "./img/biggs.jpg",

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

function enterSite() {
  document.getElementById('welcomeScreen').classList.add('d-none');
  document.getElementById('mainContent').classList.remove('d-none');
}


async function search(event) {
  event.preventDefault(); 


  const query = document.getElementById('searchInput').value.toLowerCase();
  console.log(`Buscando: ${query}`);

  const content = document.getElementById("content");
  content.innerHTML = `<div class="spinner-border text-warning" role="status"><span class="visually-hidden">Cargando...</span></div>`;

  try {
   
    const categories = ['people', 'films', 'planets', 'starships', 'vehicles', 'species'];
    let results = [];

    for (const category of categories) {
      const response = await fetch(`${API_URL}${category}/`);
      if (!response.ok) {
        throw new Error(`Error al cargar datos de la categoría ${category}: ${response.status}`);
      }
      const data = await response.json();

     
      const filteredResults = data.results.filter(item => {
        const nameOrTitle = item.name || item.title || '';
        return nameOrTitle.toLowerCase().includes(query);
      });

      results = results.concat(filteredResults.map(item => ({ ...item, category })));
    }

 
    if (results.length > 0) {
      displaySearchResults(results);
    } else {
      content.innerHTML = `<p class="text-warning">No se encontraron resultados para "${query}".</p>`;
    }
  } catch (error) {
    console.error(error);
    content.innerHTML = `<p class="text-danger">Error al realizar la búsqueda: ${error.message}</p>`;
  }
}

function displaySearchResults(results) {
  const content = document.getElementById("content");
  content.innerHTML = results.map(item => {
    const category = item.category;
    const nameOrTitle = item.name || item.title;
    return `
      <div class="col-md-4">
        <div class="card bg-dark text-light">
          <div class="card-body">
            <h5 class="card-title">${nameOrTitle}</h5>
            <p class="card-text">Categoría: ${category}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

const filmImages = {
  "A New Hope": "./img/a_new_hope.jpg",
  "The Empire Strikes Back": "./img/the_empire_strikes_back.jpg",
  "Return of the Jedi": "./img/return_of_the_jedi.jpg",
  "The Phantom Menace": "./img/the_phantom_menace.jpg",
  "Attack of the Clones": "./img/attack_of_the_clones.jpg",
  "Revenge of the Sith": "./img/evenge_of_the_sith.jpg",
  "The Force Awakens": "./img/the_force_awakens.jpg",
};

function displayData(items, section) {
  const content = document.getElementById("content");
  if (!items || items.length === 0) {
    content.innerHTML = `<p class="text-warning">No hay datos disponibles para esta sección.</p>`;
    return;
  }
  content.innerHTML = items.map(item => {
    let imageUrl;

    if (section === 'films') {
      imageUrl = filmImages[item.title] || "./images/default.jpg"; 
    } else {
      imageUrl = characterImages[item.name] || "./images/default.jpg"; 
    }

    return `
      <div class="col-md-4">
        <div class="card bg-dark text-light" onclick="showDetails('${section}', '${item.url}')">
          <img src="${imageUrl}" class="card-img-top img-fluid" alt="${item.title || item.name}">
          <div class="card-body">
            <h5 class="card-title">${item.name || item.title}</h5>
            <p class="card-text">${getDetails(item, section)}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}