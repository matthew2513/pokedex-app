import express from "express";
import axios from "axios";
import searchRoute from "./search.js";
import pokemonRoute from "./pokemon.js";

const router = express.Router();

const API_URL = "https://pokeapi.co/api/v2/";

router.use(searchRoute);
router.use(pokemonRoute);

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

export default router;
