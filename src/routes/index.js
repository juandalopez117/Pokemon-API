const { Router } = require('express');
const axios = require('axios')
const {Pokemon, Type} = require('../db.js')
const {GetAllPokemons, PokemonsFromAPI, GetPokemonInfoApi, GetPokemonInfoDb,
PokemonTypes, PokemonsIndex} = require('./Controllers.js')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router()

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get('/pokemons', async function(req, res){
    const {name} = req.query
    let result = await GetAllPokemons()
    try {
        if(name){
            let PokemonName = await result.filter(poke => 
                poke.name.toLowerCase().includes(name.toLowerCase()))
                PokemonName.length ? 
                res.status(200).send(PokemonName) :
                res.status(404).send('Pokemon not founded!!!!')
        }
        else{
            res.status(200).send(result)
        }
    } catch (error) {
        console.log(error)
    }
})


//! Pokemons by id
router.get('/pokemons/:id', async function (req, res){
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
    const {Name, Health_Points, Attack, Defense, Speed, Height, 
        Weight, Types, createdInDB} = req.body
    try {
        const Pokenew = await Pokemon.create({
            Name,
            Health_Points,
            Attack,
            Defense,
            Speed,
            Height,
            Weight,
            createdInDB
    })
    if(Types.length > 0 ){
        for(let i = 0; i < Types.length; i++){
            const pokemonDB = await Type.findOrCreate({
                where: { type: Types[i]}
            })
            Pokenew.setTypes(pokemonDB[0])
            console.log(pokemonDB[0])
        }
        res.json(Pokenew)
    }

    } 
    catch (error) {
        console.log(error)
    }
})
router.get('/types', async function(req, res){
    const AllTypes = await PokemonTypes()
    try {
        res.status(200).send(AllTypes)
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;
