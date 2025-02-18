const pokemonContainer = document.querySelector(".pokemon-container");
const loadMoreButton = document.getElementById("load-more");

let offset = 0;
const limit = 20;

async function fetchPokemon() {
  try {
    const response = await fetch(
      `/api/pokemon?offset=${offset}&limit=${limit}`
    );
    const pokemonDetails = await response.json();

    displayPokemon(pokemonDetails);
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
}

function displayPokemon(pokemonDetails) {
  pokemonDetails.forEach((pokemon) => {
    const li = document.createElement("li");
    li.classList.add("col");
    li.innerHTML = `
      <div class="card p-3 shadow-sm"> 
        <img src="${pokemon.image}" alt="${pokemon.name}" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">${pokemon.name}</h5>
          <p class="card-text">Type: ${pokemon.types.join(", ")}</p>
        </div>
      </div>
    `;
    pokemonContainer.appendChild(li);
  });
}

// Load initial Pokémon
fetchPokemon();

// Load More Button Click Event
loadMoreButton.addEventListener("click", () => {
  offset += limit;
  fetchPokemon();
});
