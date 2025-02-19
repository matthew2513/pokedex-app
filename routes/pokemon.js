import express from "express";
import axios from "axios";

const router = express.Router();

const API_URL = "https://pokeapi.co/api/v2/";

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
