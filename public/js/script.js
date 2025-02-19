const pokemonContainer = document.querySelector(".pokemon-container");
const loadMoreButton = document.getElementById("load-more");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("pokemon-search");

let offset = 0;
const limit = 20;
const defaultPokemonList = [];

//fetch pokemon list
async function fetchPokemon() {
  try {
    const response = await fetch(
      `/api/pokemon?offset=${offset}&limit=${limit}`
    );
    const pokemonDetails = await response.json();

    if (offset === 0) {
      defaultPokemonList.push(pokemonDetails);
    }

    displayPokemon(pokemonDetails, true);
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
}

//fetch a single pokemon through search
async function fetchPokemonByName(name) {
  try {
    const response = await fetch(`/search/${name}`);
    if (!response.ok) throw new Error("Pokémon not found");

    const pokemon = await response.json();

    pokemonContainer.innerHTML = "";

    loadMoreButton.classList.add("d-none");

    const li = document.createElement("li");
    li.classList.add("col");
    li.innerHTML = `
      <div class="card p-3 shadow-sm"> 
        <a href="/pokemon/${pokemon.id}">
          <img src="${pokemon.image}" alt="${
      pokemon.name
    }" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${pokemon.name}</h5>
            <p class="card-text">Type: ${pokemon.types.join(", ")}</p>
          </div>
        </a>
      </div>
    `;

    pokemonContainer.appendChild(li);
  } catch (error) {
    console.error("Error:", error.message);
    pokemonContainer.innerHTML = `<li class="text-danger">Pokémon not found</li>`;

    loadMoreButton.classList.add("d-none");
  }
}

//display pokemon list
function displayPokemon(pokemonList, appendMode = false) {
  if (!appendMode) {
    pokemonContainer.innerHTML = "";
  }

  pokemonList.forEach((pokemon) => {
    const li = document.createElement("li");
    li.classList.add("col");
    li.innerHTML = `
      <div class="card p-3 shadow-sm"> 
        <a href="/pokemon/${pokemon.id}">
          <img src="${pokemon.image}" alt="${
      pokemon.name
    }" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${pokemon.name}</h5>
            <p class="card-text">Type: ${pokemon.types.join(", ")}</p>
          </div>
        </a>
      </div>
    `;
    pokemonContainer.appendChild(li);
  });

  if (appendMode) {
    loadMoreButton.classList.remove("d-none");
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (!searchTerm) return;

  fetchPokemonByName(searchTerm);
});

// Restore default list when clearing input
searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    displayPokemon(defaultPokemonList, true);

    loadMoreButton.classList.add("d-none");
  }
});

fetchPokemon();

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  fetchPokemon();
});
