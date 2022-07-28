const { Router } = require('express');
const axios = require('axios')
const {Pokemon, Type} = require('../db.js')
const {GetAllPokemons, PokemonsFromAPI, GetPokemonInfoApi, GetPokemonInfoDb,
PokemonTypes} = require('./Controllers.js')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router()

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

router.get('/:id', async function (req, res){
    const {id} = req.params
    try {
        if(!/^[0-9]+$/.test(id)){
            let Pokebase = await GetPokemonInfoDb(id)
            res.status(200).send(Pokebase)
        }
        else
        {
            let Pokebase = await GetPokemonInfoApi(id)
            res.status(200).send(Pokebase)
        }
    } catch (error) {
        console.log(error)
    }
})

//! Append new pokemons into a database
router.post('/pokemons', async function (req, res) {
    const {id, name, life, attack, defense, speed, height, weight, created} = req.body
    try {
        const Pokenew = await Pokemon.findOrCreate({
            where: {
                id: id,
                name: name,
                life: life,
                attack: attack,
                defense: defense,
                speed: speed,
                height: height,
                weight: weight,
                created: true
            }
        })
        res.status(201).send('Pokemon Created')
    } catch (error) {
        console.log(error)
        
    }
})


module.exports = router;
//! organizar el indice y separar por casos. La forma del indice de la base de datos y del indice 
//! de la api, y lo de que los indices están desordenados.