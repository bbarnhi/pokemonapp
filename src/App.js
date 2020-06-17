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
// As a user, I want there to be a “Grocery List” feature that tells me all the foods I need to buy when I go to the store so that I can feed my Pokemon! 

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
      this.setState({
        pic: data.sprites.front_default,
        type1: data.types[0].type.name,
        type2: type2
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
  battle(event){
    let currentPokemon = window.localStorage.getItem('battleRoster')
    currentPokemon = JSON.parse(currentPokemon)
    if (!currentPokemon){
      currentPokemon = []
    }
    else {
      currentPokemon.push(this.state.name)
      this.state.parent.battle(currentPokemon)
      window.localStorage.setItem('battleRoster', '')
    }
    currentPokemon.push(this.state.name)
    window.localStorage.setItem('battleRoster', JSON.stringify(currentPokemon))
    event.preventDefault()
  }
  render (){
    return (
      <div>
        <div className="pokeCard">
          <h1>{this.state.name}</h1>
          <a href={`https://bulbapedia.bulbagarden.net/wiki/${this.state.name}_(Pok%C3%A9mon)`}><img class="profile-img" src={this.state.pic} /></a>
          <p class="heading">Pokemon Deets</p><p class="description">Add more details</p>
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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAll = this.handleAll.bind(this);
    this.load = this.load.bind(this)
    }
  handleChange(event) {
    this.setState({searchValue: event.target.value});
  }
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
  battle(battleRoster){
    this.setState({displayedPokemon: []}, () => {
      let battleScene = (<div><Pokemon name={battleRoster[0]} parent={this}/> <h1>VS</h1> <Pokemon name={battleRoster[1]} parent={this}/></div>)
      this.setState({displayedPokemon: battleScene})
    })
  }
     
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
