import express from "express";
import axios from "axios";

const router = express.Router();

const API_URL = "https://pokeapi.co/api/v2/";

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  if (isNaN(limit) || limit <= 0) {
    return res.status(400).json({ error: "Invalid limit value" });
  }

  try {
    const response = await axios.get(`${API_URL}pokemon`, {
      params: { limit },
    });
    const pokemonList = response.data.results;

    const pokemonDetails = await Promise.all(
      pokemonList.map(async (pokemon) => {
        try {
          const response = await axios.get(pokemon.url);

          const {
            sprites: { front_default },
            types,
          } = response.data;

          return {
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

    res.json({ pokemonDetails }); //send to frontend
  } catch (error) {
    console.error("Failed to make request: ", error.message);
    res.status(500).json({ error: "Error fetching Pokémon data" });
  }
});

export default router;
