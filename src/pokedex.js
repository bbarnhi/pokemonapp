import React from 'react';
import Pokemon from './pokemon'

var fetch = require('node-fetch')

class Pokedex extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        displayedPokemon: [],
        searchValue: props.searchValue
      }
    this.pokemon = {}
    this.displayedPokemon = []
    this.loadAllPokemon = this.loadAllPokemon.bind(this)
    this.loadAllPokemon()
    this.search = this.search.bind(this)
    this.render = this.render.bind(this)
    this.filterType = this.filterType.bind(this)
  }

  async loadAllPokemon(){
    let url = `https://pokeapi.co/api/v2/pokemon?limit=1000`   //sets the pokemon.co API URL for later 
    let response = await fetch(url) //its later - calling the API
    let data = await response.json() // dumps the json data (via response) to the variable data
    for (let pokemon of data.results){ //for each pokemon dataset within data results
      let name = pokemon.name
      let pokeData = new Pokemon({name: name, pokedex: this}) //builds a pokey object for each entry in API call
      await pokeData.getInfo() // associates pokemon.name to various pokemon data
      this.pokemon[name] = pokeData //way to call the class
    }
  }

  search(target){
    let toDisplay = []
    for (let pokeName in this.pokemon){
      let found = pokeName.indexOf(target) //typed search value is found in the pokemon array
      if (found !== -1 || target === 'allPokemon'){  //if searchbar is blank
        toDisplay.push(this.pokemon[pokeName].render())  ///add each pokemon card to be rendered
      }
    }
    this.displayedPokemon = toDisplay  //??  pushes local varibale to class vairable?
    this.setState({displayedPokemon: toDisplay}) ///force refresh
  }
// still being worked on 
  filterType(type) {  
    let toDisplay = []
    for (let pokemon in this.pokemon){
      let pokeData= this.pokemon[pokemon]  //abstraction of pokemon data
      if (pokeData.type1 === type || pokeData.type2 === type){ //pokemon have 0,1, or 2 types.  filter by this value
        toDisplay.push(pokeData.render()) // push data to the render function
      }      
    }
    this.displayedPokemon = toDisplay
    this.setState({displayedPokemon: toDisplay}) //force screen update
  }

  render(){
    return(
      <div>
        {this.displayedPokemon}
      </div>
    )
  }
}

export default Pokedex;