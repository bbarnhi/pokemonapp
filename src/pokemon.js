import React from 'react';
import './App.css';

var fetch = require('node-fetch')

class Pokemon extends React.Component{
    constructor(props){
        super(props)
        this.state = {name: props.name}
        this.name = props.name
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
        // fetch them
        this.getInfo()
    }
    getInfo() {
        let url = `https://pokeapi.co/api/v2/pokemon/${this.name}` //passed in when Pokemon class is called
        fetch (url)
        .then(
            response => {
                data = response.json() // fills all props this.etc when this.getInfo is called
                // typings
                let type2 = 'None'
                if (data.types[1]) {
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
                this.setState ({
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
        )
    }
    render (){
        return (
          <div>
            <div className="pokeCard">
              <h1>{this.state.name}</h1>
              <a href={`https://bulbapedia.bulbagarden.net/wiki/${this.state.name}_(Pok%C3%A9mon)`}><img class="profile-img" src={this.state.pic} /></a>
                <p class="heading">Pokemon Deets</p>
                <p class="description">
                  hp: {this.state.hp} <br />
                  attack: {this.state.attack}<br /> 
                  defense: {this.state.defense} <br />
                  specialAttack: {this.state.specialAttack}<br />
                  specialDefense: {this.state.specialDefense} <br />
                  speed: {this.state.speed}
                </p>
              <label>Poke Type</label>
              <button class="cardButton" onClick={this.handleTypeButton} value={this.state.type1}>{this.state.type1}</button>  
              <button class="cardButton" onClick={this.handleTypeButton} value={this.state.type2}>{this.state.type2}</button>
            <footer><button class="cardButton" onClick={this.save}>Capture</button><button class="cardButton" onClick={this.battle}>Battle!!!</button></footer>
            </div>
          </div>
        )
    }
}