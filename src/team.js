import React from 'react';
import Pokemon from './pokemon'
import { render, getDefaultNormalizer } from '@testing-library/react';

class Team extends React.Component {
    constructor (props){
        super(props)
        this.pokeTeam = []
        // functions
        this.loadTeam = this.loadTeam.bind(this)
        this.render = this.render.bind(this)
    }
    async loadTeam(){
        let team = JSON.parse(window.localStorage.getItem('pokeTeam')) //pulls team data from local storage
        for (let pokemon of team) {
            let pokeData = new Pokemon({name: pokemon}) //creates new class element
            await pokeData.getInfo() //gathers data for the stored pokemon
            this.pokeTeam.push(pokeData.render()) //renders the stored team
            }
    }
    render(){ //pushes data to exisiting card?
        return(
            <div>
                {this.pokeTeam}
            </div>
        )
    }
}

export default Team