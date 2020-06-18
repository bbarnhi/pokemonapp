import React from 'react';
import './App.css';

var fetch = require('node-fetch')

class Pokemon extends React.Component{
    constructor(props){
        super(props)
        this.state = {name: props.name}
        this.name = props.name
        this.pokedex = props.pokedex
        // things to fetch
        this.type1 = null
        this.type2 = null
        this.hp = null
        this.attack = null
        this.defense = null
        this.specialAttack = null
        this.specialDefense = null
        this.speed = null
        this.pic = null
        // functions
        this.getInfo = this.getInfo.bind(this)
        this.render = this.render.bind(this)
        this.save = this.save.bind(this)
        this.addToArena = this.addToArena.bind(this)
        this.handleTypeButton = this.handleTypeButton.bind(this)
    }
    async getInfo() {
        let url = `https://pokeapi.co/api/v2/pokemon/${this.name}` //passed in when Pokemon class is called
        let response = await fetch(url)
        let data = await response.json()
        // typings
        let type2 = 'None'
        if (data.types[1]) { //check if a second type exists for a given pokemon
            type2 = data.types[1].type.name
        }
        this.type1 = data.types[0].type.name
        this.type2 = type2
        // stats
        this.hp = data.stats[0].base_stat 
        this.attack = data.stats[1].base_stat
        this.defense = data.stats[2].base_stat
        this.specialAttack = data.stats[3].base_stat
        this.specialDefense = data.stats[4].base_stat
        this.speed = data.stats[5].base_stat
        // pic
        this.pic = data.sprites.front_default
        this.setState ({  //abstraction of these stats for easier referencing
            type1: this.type1,
            type2: this.type2,
            hp: this.hp,
            attack: this.attack,
            defense: this.defense,
            specialAttack: this.specialAttack,
            specialDefense: this.specialDefense,
            speed: this.speed,
            pic: this.pic
        })
    }
    save(event) {  //adds pokemon to user cookie for Collection
      let currentPokemon = window.localStorage.getItem('pokeTeam')
      currentPokemon = JSON.parse(currentPokemon)
      if (!currentPokemon){
        currentPokemon = []
      }
      currentPokemon.push(this.name)
      window.localStorage.setItem('pokeTeam', JSON.stringify(currentPokemon))
      event.preventDefault()
    }
    addToArena(event){ //adds this pokemon to user cookie to Battles
        let currentPokemon = window.localStorage.getItem('gladiators') //establishes local storage called "gladiators"
        currentPokemon = JSON.parse(currentPokemon)
        if (!currentPokemon){
          currentPokemon = []
        }
        currentPokemon.push(this.name)
        window.localStorage.setItem('gladiators', JSON.stringify(currentPokemon)) //adds the pokemon to the local storage
        event.preventDefault()
    }
    handleTypeButton(event){
        if(!(this.pokedex)){
            alert("You can only search for Types in a pokedex")
        }
        else {
            this.pokedex.filterType(event.target.value)
        }
        event.preventDefault()
    }
    // primary poke card --- all the details with the pokemon specific buttons
    render (){
        return (
          <div>
            <div className="pokeCard">  
              <h1>{this.name}</h1>
              <a href={`https://bulbapedia.bulbagarden.net/wiki/${this.name}_(Pok%C3%A9mon)`}><img className="profile-img" src={this.pic} /></a>
                <p className="heading">Pokemon Deets</p>
                <p className="description">
                  hp: {this.hp} <br />
                  attack: {this.attack}<br /> 
                  defense: {this.defense} <br />
                  specialAttack: {this.specialAttack}<br />
                  specialDefense: {this.specialDefense} <br />
                  speed: {this.speed}
                </p>
              <label>Poke Type</label>
              <button class="cardButton" onClick={this.handleTypeButton} value={this.type1}>{this.type1}</button>  
              <button class="cardButton" onClick={this.handleTypeButton} value={this.type2}>{this.type2}</button>
            <footer>
                <button class="cardButton" onClick={this.save}>Capture</button>
                <button class="cardButton" onClick={this.addToArena}>Add to Arena</button>
            </footer>
            </div>
          </div>
        )
    }
}

export default Pokemon