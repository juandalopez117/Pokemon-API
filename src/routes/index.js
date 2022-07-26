const { Router } = require('express');
const axios = require('axios')
const {Pokemon, Type} = require('../db.js')
const {GetAllPokemons, PokemonsFromAPI, GetPokemonInfoApi} = require('./Controllers.js')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get('/pokemons', async function(req, res){
    const {name} = req.query
    try {
        let result = await GetAllPokemons()
        if(name){
            let PokemonName = await result.filter(poke => 
                poke.name.toLowerCase().includes(name.toLowerCase()))
                PokemonName.length ? 
                res.status(200).send(PokemonName) :
                res.status(404).send('Pokemon not founded!')
        }
        else{
            res.status(200).send(result)
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/pokemons/:id', async function(req, res){
    const {id} = req.params
    const Pokemon = await GetPokemonInfoApi(id)

    try {
        res.status(200).send(Pokemon)
    } catch (error) {
        console.log(error)
    }

})

module.exports = router;
