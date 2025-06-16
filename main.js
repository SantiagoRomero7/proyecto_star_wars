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
