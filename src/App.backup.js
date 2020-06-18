import React from 'react';
//import logo from './logo.svg';
import './pokedex';
import './App.css';

var pokedex = require("./pokedex")
//var SearchContext = React.createContext('')

// XXX ** Search field ** As a user, I want to be able to search for a specific Pokemon so that I can see all of the important/relevant information about them.
// XXX As a user (who is new to Pokemon and doesn’t know any names to search!), I want to click on a “View All” (or similar) button and look at page with pictures of all the pokemon so that I can click on the picture and learn more about them! 
// XXX ** Button ** As a user I want to click on a “View similar types” button for a specific pokemon and I will see a list of other pokemon with the same type.
// XXX *** Cart like feature *** As a user, I want each Pokemon to have a  “collect” feature so that I can add it to my collection if I like it.
// XXX *** View Cart *** As a user, I want to have a “view collection” feature so that I can view my whole collection at any time 
// *** *** As a user, I want there to be a “battle” feature where I can see who would win between two Pokemon  (here, you can select two Pokemon and have them battle, and based on some criteria, you determine the winner)
// As a user, I want there to be a “stats” feature where I can see the stats on a specific Pokemon (open to interpretation how you want to handle this/what you want to feature!) 


// Import pokeApi to quickly pull data

////////////////////////////////////////////////
// Pokemons favorite food is determined by "Nature"
// Nature is randomly assigned on "Capture"
// Below is a table of the 25 natures - 
//  No direct reference to favorite food exists on pokeApi
//////////////////////////////////

/////////////////////////////////////////
// Nature - Liked - Hated
// Bashful	N/A	N/A
// Docile	N/A	N/A
// Hardy	N/A	N/A
// Quirky	N/A	N/A
// Serious	N/A	N/A
// Adamant	Spicy	Dry
// Brave	Spicy	Sweet
// Lonely	Spicy	Sour
// Naughty	Spicy	Bitter
// Bold	Sour	Spicy
// Impish	Sour	Dry
// Lax	Sour	Bitter
// Relaxed	Sour	Sweet
// Modest	Dry	Spicy
// Mild	Dry	Sour
// Quiet	Dry	Sweet
// Rash	Dry	Bitter
// Calm	Bitter	Spicy
// Careful	Bitter	Dry
// Gentle	Bitter	Sour
// Sassy	Bitter	Sweet
// Hasty	Sweet	Sour
// Jolly	Sweet	Dry
// Naive	Sweet	Bitter
// Timid	Sweet	Spicy
///////////////////////////////////////////////

////
// On capture...randomly assign a nature
// add favorite / hated food 
// Create Grocery list adding favorite food from all captured pokemon
////

class Pokemon extends React.Component {
  constructor(props){
    super()
    this.state = {parent: props.parent}
    pokedex.get(props.name).then(data => {
      for (let key in data) {
        if (key === 'types') {
          continue
        }
        let tmp = {}
        tmp[key] = data[key]
        this.setState(tmp)
      }
      let type2 = 'None'
      if (data.types[1]) {
        type2 = data.types[1].type.name
      }
      this.type1 = data.types[0].type.name
      this.type2 = type2
      this.hp = data.stats[0].base_stat 
      this.attack = data.stats[1].base_stat
      this.defense = data.stats[2].base_stat
      this.specialAttack = data.stats[3].base_stat
      this.specialDefense = data.stats[4].base_stat
      this.speed = data.stats[5].base_stat
      this.setState({
        pic: data.sprites.front_default,
        type1: data.types[0].type.name,
        type2: type2,
        hp: this.hp,
        attack: this.attack,
        defense: this.defense,
        specialAttack: this.specialAttack,
        specialDefense: this.specialDefense,
        speed: this.speed
      })
    }).catch(err => console.log(err))
    this.handleTypeButton = this.handleTypeButton.bind(this)
    this.save = this.save.bind(this)
    this.battle = this.battle.bind(this)
  }
  handleTypeButton(event) {
    let type = event.target.value
    this.state.parent.setState({displayedPokemon: []}, () => {
      this.state.parent.handleTypeButton(type)
      event.preventDefault()
    })
  }
  /// Randomizer functino to be used for save & battle events
  randomizer() {
    const min = 1;
    const max = 25;
    const rand = min + Math.random() * (max - min);
    this.setState({ random: this.state.random + rand });
  }

  // Used to save pokemon details to cookie when user clicks capture
  save(event){
    let currentPokemon = window.localStorage.getItem('savePokemon')
    console.log(currentPokemon)
    currentPokemon = JSON.parse(currentPokemon)
    if (!currentPokemon){
      currentPokemon = []
    }
    currentPokemon.push(this.state.name)
    window.localStorage.setItem('savePokemon', JSON.stringify(currentPokemon))
    event.preventDefault()
  }

  // Takes in 2 Pokemon and randomly determines a winner
  battle(event){
    let currentPokemon = window.localStorage.getItem('battleRoster')
    currentPokemon = JSON.parse(currentPokemon)
    if (!currentPokemon || currentPokemon.length === 0){
      currentPokemon = []
      currentPokemon.push(this.state.name)
      window.localStorage.setItem('battleRoster', JSON.stringify(currentPokemon))
    }
    else {    
      const pokemon1Str = Math.random();   //0.234134
      const pokemon2Str = Math.random();   //0.234134
      currentPokemon.push(this.state.name)
      // let winner = (pokemon1Str >= pokemon2Str) ? currentPokemon[0] : currentPokemon[1]
      let winner = ''
      if (pokemon1Str >= pokemon2Str){
        winner = currentPokemon[0]
      }
      else {
        winner = currentPokemon[1]
      }
      this.state.parent.battle(currentPokemon, winner)
      window.localStorage.setItem('battleRoster', JSON.stringify([]))

    }
    event.preventDefault()
  }
  //Primary HTML block
  render (){
    return (
      <div>
        <div className="pokeCard">
          <h1>{this.state.name}</h1>
          <a href={`https://bulbapedia.bulbagarden.net/wiki/${this.state.name}_(Pok%C3%A9mon)`}><img class="profile-img" src={this.state.pic} /></a>
            <p class="heading">Pokemon Deets</p>
            <p class="description">
              hp: {this.state.hp} 
              attack: {this.state.attack} 
              defense: {this.state.defense} 
              specialAttack: {this.state.specialAttack}
              specialDefense: {this.state.specialDefense} 
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

class App extends React.Component {
  constructor(props) {
    super()
    this.state = {
      displayedPokemon: []
    }
    pokedex.getAll().then(allPoke => {
      for (let pokemon of allPoke) {
        let tmp = {}
        tmp[pokemon] = new Pokemon({name: pokemon, parent: this})
        this.setState(tmp)
      }
    })
    // Bind is required to use "this.state" functionality elsewhere
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAll = this.handleAll.bind(this);
    this.load = this.load.bind(this)
    }
  handleChange(event) {
    this.setState({searchValue: event.target.value});
  }
  // Main search function
  handleSubmit(event) {
    let foundPokemon = []
    for (let pokemon in this.state){
      let found = pokemon.indexOf(this.state.searchValue)
      if (found !== -1){
        foundPokemon.push(<Pokemon name={pokemon} parent={this} />)
      }
    }
    this.setState({displayedPokemon: []}, () => {
      this.setState({displayedPokemon: foundPokemon})
    })
    event.preventDefault()
  }
  //Displays all pokemon very very slow
  handleAll(event) {
    let allPoke = []
    for (let pokemon in this.state) {
      if (pokemon !== 'searchValue') {
        allPoke.push(<Pokemon name={pokemon} parent={this} />)
      }
    }
    alert("You shouldn't have clicked me!") 
    this.setState({displayedPokemon: []}, () => {
      this.setState({displayedPokemon: allPoke})
    })  
    //this.setState({displayedPokemon: allPoke})
    event.preventDefault()
  }
  handleTypeButton(type) {
    let typePoke = []
    for (let pokemon in this.state) {
      if (this.state[pokemon].type1 === type || this.state[pokemon].type2 === type)
        typePoke.push(<Pokemon name={pokemon} parent={this} />)
      }
    this.setState({displayedPokemon: typePoke})
  }
  // Loads a list of pokemon from a cookie (saved by user)
  load(event) {
    let pokeTeam = []
    let team = JSON.parse(window.localStorage.getItem('savePokemon'))
    for (let pokemon of team) {
      pokeTeam.push(<Pokemon name={pokemon} parent={this} />)
    }
    this.setState({displayedPokemon: []}, () => {
      this.setState({displayedPokemon: pokeTeam})
    })
    event.preventDefault()
  }
  battle(battleRoster, winner){
    this.setState({displayedPokemon: []}, () => {
      let battleScene = (
      <div>
        <Pokemon name={battleRoster[0]} parent={this}/> 
        <h1>VS</h1> 
        <Pokemon name={battleRoster[1]} parent={this}/>
        <h1>Winner is {winner}</h1>
      </div>)
      this.setState({displayedPokemon: battleScene})
    })
  }
  //Primary on-screen buttons per poke card   
  render() {
    return (
    <div className="App">
      <form>
        <input type="text" value={this.state.searchValue} onChange={this.handleChange} placeholder="Pokemon Name"/>
        <button type="submit" onClick={this.handleSubmit}>Submit</button>
        <button type="submit" onClick={this.handleAll}>View All</button>
        <button type="Submit" onClick={this.load}>Load Team</button>
      </form>
      {this.state.displayedPokemon}
    </div>
    )
    }
}

export default App;
