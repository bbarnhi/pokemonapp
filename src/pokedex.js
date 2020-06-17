var fetch = require('node-fetch')

async function get(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`
    let body = await getResponse(url)
    return body
  }
  
async function getAll(){
    let output = []
    let url = `https://pokeapi.co/api/v2/pokemon?limit=1000`
    await getResponse(url).then(response => {
        for (let pokemon of response.results){
            output.push(pokemon.name)
        }
    })
    return output
}

async function getResponse(url) {
    return await fetch(url).then(response => response.json())
  }
export {get, getAll};