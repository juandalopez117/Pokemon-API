const {Pokemon, Type} = require('../db.js')
const { Op } = require("sequelize");
const axios = require('axios');
const URL_POKEMON = "https://pokeapi.co/api/v2/pokemon?limit=40"
const URL_TYPE = "https://pokeapi.co/api/v2/type";
//!------------------- Pokemons of the database -------------------

const PokemonsFromDB = async function(){
    try {
        const PokemonsDB =  await Pokemon.findAll({
            include: { // que atributo del modelo Type se quiere traer
                model: Type, 
                attributes: ['type'], 
                through: {
                    attributes: [], // se trae los atrbutos mediante el nombre
                },
            },
        })
        
        const Info = await PokemonsDB.map( el => {
            return {
                id: el.id,
                name: el.Name,
                types: el.Types.map((t) => t.type),
                life: el.Health_Points,
                attack: el.Attack,
                defense: el.Defense,
                speed: el.Speed,
                height: el.Height,
                weight: el.weight,
                created: el.Created
            }
        })

        return Info
    } 
    catch (error) {
        console.log(error)
    }
}

//!------------------- Call to API -------------------

const PokemonsFromAPI = async() => {
    try {
        const API = await axios.get(URL_POKEMON);
        const pokemonURL = API.data.results.map(obj => axios.get(obj.url));
        const infoPokemon = await axios.all(pokemonURL)
        
        let data = infoPokemon.map(obj => obj.data)
        let infoPokemons = data.map(el => {
            return {
                id: el.id,
                name: el.name,
                types: el.types.map((t) => t.type.name),
                image: el.sprites.front_default,
                life: el.stats[0].base_stat,
                attack: el.stats[1].base_stat,
                defense: el.stats[2].base_stat,
                speed: el.stats[3].base_stat,
                height: el.height,
                weight: el.weight,
            }
        })
        // console.log(infoPokemons)
        return infoPokemons
    } catch (error) {
        console.log(error)
    }

} 

//!------------------- Join the info -------------------

const GetAllPokemons = async () => {
    const ApiPokeInfo = await PokemonsFromAPI()
    const dbPokeInfo = await PokemonsFromDB()
    const TotalPokemons = dbPokeInfo.concat(ApiPokeInfo)
    return TotalPokemons
}

//! ------------------- Detail of a particular Pokemon in API -------------------


const GetPokemonInfoApi = async (id) => {
    const Info = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const Data = Info.data
    return {
        id: Data.id,
        name: Data.name,
        life: Data.stats[0].base_stat,
        attack: Data.stats[1].base_stat,
        defense: Data.stats[2].base_stat,
        speed: Data.stats[3].base_stat,
        height: Data.height,
        weight: Data.weight,
        types: Data.types.map((t) => t.type.name),
        img: Data.sprites.front_default,
    }
}

//! ------------------- Detail of Pokemon in DB -------------------

const GetPokemonInfoDb = async function(id){

    const Poke = await Pokemon.findAll({
        include: { // que atributo del modelo Type se quiere traer
            model: Type, 
            attributes: ['type'], 
            through: {
                attributes: [], // se trae los atrbutos mediante el nombre
            },
        },
        where: { id: id}
    })

    const pokemon = await Poke.map(poke => {
        return {
            id: poke.id,
            name: poke.Name,
            types: poke.Types.map((t) => t.type),
            life: poke.Health_Points,
            attack: poke.Attack,
            defense: poke.Defense,
            speed: poke.Speed,
            height: poke.Height,
            weight: poke.weight,
            created: poke.Created, 
        }
    })

    return pokemon
}

//! ------------------- Types of Pokemon and save in a Database -------------------

const PokemonTypes = async function(){

    const typesAPI = await axios.get(URL_TYPE)
    const typesInfo = typesAPI.data.results.map(type => type.name)
    const types = [...new Set(typesInfo.flat())]
    types.forEach(type => {
        Type.findOrCreate({
            where: {
                type: type
            }
        })
    })
    //const alltypes = await Type.findAll()
    return types

}

module.exports = {
    PokemonsFromAPI,
    PokemonsFromDB,
    GetAllPokemons,
    GetPokemonInfoApi,
    GetPokemonInfoDb,
    PokemonTypes, 
}