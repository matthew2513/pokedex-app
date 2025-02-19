import express from "express";
import axios from "axios";

const router = express.Router();

const API_URL = "https://pokeapi.co/api/v2/";

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

export default router;
