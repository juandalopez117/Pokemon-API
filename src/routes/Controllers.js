const {Pokemon, Type} = require('../db.js')
const axios = require('axios')

//!------------------- Pokemons of the database -------------------

const PokemonsFromDB = async function(){
    try {
        const PokemonsDB = await Pokemon.findAll({
            include: { // que atributo del modelo Type se quiere traer
                model: Type, 
                attributes: ['type'], 
                through: {
                    attributes: [], // se trae los atrbutos mediante el nombre
                },
            },
        })

        const info = await PokemonsDB.map( e => {
            return {
                id: e.id,
                name: e.name, 
            }
        })
        return info
    } catch (error) {
        console.log(error)
    }
}

//!------------------- Call to API -------------------

const PokemonsFromAPI = async() => {
    const getPokemonsAPI = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=1154')
    const PokemonsAPI = getPokemonsAPI.data.results.map(dat => {
        return {
            id: dat.url.substring(34, dat.url.length-1),
            name: dat.name
        }
    })
    /* console.log(PokemonsAPI) */
    return PokemonsAPI
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
        id: id,
        Name: Data.name,
        Health_Points: Data.stats[0].base_stat,
        Attack: Data.stats[1].base_stat,
        Defense: Data.stats[2].base_stat,
        Speed: Data.stats[5].base_stat,
        Height: Data.height,
        Weigth: Data.weight,
        Types: Data.types.map(t => t.type.name)
    }
}

//! ------------------- Detail of Pokemon in DB -------------------

const GetPokemonInfoDb = async function(id){
    const poke = await Pokemon.findByPk( id )
    return poke

}

//! ------------------- Types of Pokemon and save in a Database -------------------

const PokemonTypes = async function(){

    const typesAPI = await axios.get('https://pokeapi.co/api/v2/type')
    const types = typesAPI.data.results.map(type => type.name)
    types.forEach(type => {
        Type.findOrCreate({
            where: {
                type: type
            }
        })
    })
    const alltypes = await Type.findAll()
    return alltypes

}

module.exports = {
    PokemonsFromAPI,
    PokemonsFromDB,
    GetAllPokemons,
    GetPokemonInfoApi,
    GetPokemonInfoDb,
    PokemonTypes
}