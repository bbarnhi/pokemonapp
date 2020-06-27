import React from 'react';
import Pokedex from './pokedex' //Primary call to pull data from pokeapi.co
import Team from './team' //Saved Team data
import Arena from './arena' //Arena setup with 2 pokemon at a time
import './App.css'; // CSS

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchValue: ''
    } //binding is required to carry 'this' to functions
    this.pokedex = new Pokedex({searchValue: ''})
    this.team = new Team()
    this.arena = new Arena()
    this.handleAll = this.handleAll.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleMouseUp = this.handleMouseUp(this)
    this.load = this.load.bind(this)
    this.battle = this.battle.bind(this)
  }

  battle(event) {  //Arena
    this.arena.battle()
    this.setState({f: 'no'}) //f: no == forced refresh no real purpose
    event.preventDefault()   // Prevents early abort / timing issues
  }
  load(event){ //loads saved team
    this.team.loadTeam()
    this.setState({f: 'no'})
    event.preventDefault()
  }
  handleAll(event) { //same as Blank search...returns all pokemon
    this.pokedex.search('allPokemon')
    this.setState({searchValue: event.target.value})
    event.preventDefault()
  }
  handleChange(event) { //updates search for every key click
    this.setState({searchValue: event.target.value})
    this.pokedex.search(event.target.value)
    event.preventDefault()
  }
//still working on this -- loosely related to the Sort by Type functionality
  handleMouseUp(event) { //force updates screen anytime you release the mouse 
    console.log('im mouse up', event.target)
    this.forceUpdate()
  }

  //DIV to hold all divs
  render() {
    return (
    <div className="App">
      <form>
        <input type="text" value={this.state.searchValue} onChange={this.handleChange} placeholder="Pokemon Name"/>
        <button type="submit" onClick={this.battle}>To Arena</button>
        <button type="submit" onClick={this.handleAll}>View All</button>
        <button type="Submit" onClick={this.load}>Load Team</button>
      </form>
      <div class="arenaDiv">
        {this.arena.render()}       
      </div>
      <div class="mainDiv">
        {this.pokedex.render()}       
      </div>
      <div class="collectionDiv"> 
        {this.team.render()}
      </div>
    </div>
    )
    }
}

export default App;
