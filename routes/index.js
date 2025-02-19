import express from "express";
import axios from "axios";

const router = express.Router();

const API_URL = "https://pokeapi.co/api/v2/";

router.get("/", (req, res) => {
  res.render("index");
});

//fetch pokemon list
router.get("/api/pokemon", async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 20;

  if (isNaN(limit) || limit <= 0 || isNaN(offset) || offset < 0) {
    return res.status(400).json({ error: "Invalid limit or offset value" });
  }

  try {
    const response = await axios.get(`${API_URL}pokemon`, {
      params: { limit, offset },
    });
    const pokemonList = response.data.results;

    // console.log(pokemonList);

    const pokemonDetails = await Promise.all(
      pokemonList.map(async (pokemon) => {
        try {
          const response = await axios.get(pokemon.url);

          const {
            id,
            sprites: { front_default },
            types,
          } = response.data;

          return {
            id,
            name: pokemon.name,
            image: front_default,
            types: types.map((t) => t.type.name),
          };
        } catch (error) {
          console.error(
            `Failed to fetch details for ${pokemon.name}:`,
            error.message
          );
          return { name: pokemon.name, error: "Failed to fetch details" };
        }
      })
    );
    // console.log(pokemonDetails);

    res.json(pokemonDetails);
  } catch (error) {
    console.error("Failed to make request: ", error.message);
    res.status(500).json({ error: "Error fetching Pokémon data" });
  }
});

//search pokemon
router.get("/search/:pokemon", async (req, res) => {
  const pokemonName = req.params.pokemon.toLowerCase();

  if (!pokemonName) {
    return res.status(400).json({ error: "Please enter a Pokémon name" });
  }

  try {
    const response = await axios.get(`${API_URL}pokemon/${pokemonName}`);
    const data = response.data;

    const pokemonDetails = {
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
      types: data.types.map((typeInfo) => typeInfo.type.name),
    };

    // console.log(pokemonDetails);

    res.json(pokemonDetails);
  } catch (error) {
    console.error("Failed to fetch Pokémon: ", error.message);
    res.status(404).json({ error: "Pokémon not found" });
  }
});

router.get("/pokemon/:id", async (req, res) => {
  const pokemonId = req.params.id;

  try {
    const response = await axios.get(`${API_URL}pokemon/${pokemonId}`);
    const data = response.data;

    const pokemonDetails = {
      name: data.name,
      height: data.height,
      weight: data.weight,
      abilities: data.abilities,
      stats: data.stats,
      image: data.sprites.front_default,
      types: data.types.map((typeInfo) => typeInfo.type.name),
    };

    res.render("pokemon", { pokemonDetails });
  } catch (error) {
    console.error("Failed to fetch Pokémon: ", error.message);
    res.status(404).json({ error: "Pokémon not found" });
  }
});

export default router;
