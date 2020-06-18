import React from 'react';
import Pokemon from './pokemon'
import { render, getDefaultNormalizer } from '@testing-library/react';

class Arena extends React.Component {
    constructor (props){
        super(props)
        this.pokeArena = []  //emptyArray for (pokemon.name?)
        this.state = {}
        // functions
        this.battle = this.battle.bind(this)
        this.render = this.render.bind(this)
    }
    async battle(){
        let arena = JSON.parse(window.localStorage.getItem('gladiators'))
        for (let pokemon of arena) {
            let pokeData = new Pokemon({name: pokemon})
            await pokeData.getInfo()
            this.pokeArena.push(pokeData.render())
            }
        if (arena.length >= 2){ //removes the top 2 arena fighters from the array
            arena.shift()
            arena.shift()
            arena = JSON.stringify(arena)    //Strings out the data required for cookization
            window.localStorage.setItem('gladiators', arena) // cookization
        }
        
    }
    render(){  //Render (must contain return statement) executes the DOM elements
        let fighters = []
        if (!(this.pokeArena[0])){
            fighters.push(<h1>No Fighter</h1>)
        }
        else {
            fighters.push(this.pokeArena[0])
        }
        if (!(this.pokeArena[1])){
            fighters.push(<h1>No Fighter</h1>)
        }
        else {
            fighters.push(this.pokeArena[1])
        }
        // Arena currently is just determined randomly 
        const pokemon1Str = Math.random();   //0.234134
        const pokemon2Str = Math.random();   //0.234134
        let winner = ''
        if (pokemon1Str >= pokemon2Str){
        winner = fighters[0]
        }
        else {
        winner = fighters[1]
        }
        this.pokeArena = []
        return(
            <div>
                {fighters[0]} VS. {fighters[1]}<br />
                <p>Winner is {winner}</p>

            </div>
        )
    }
}

export default Arena