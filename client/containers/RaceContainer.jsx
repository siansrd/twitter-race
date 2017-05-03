import React from 'react'
import io from 'socket.io-client'
import RacerCharts from '../components/RacerCharts'
import RacerForm from '../components/RacerForm'

class RaceContainer extends React.Component {

  constructor(props) {
    super(props)
    this.socket = io()
    this.state ={
      racerCounts: {} 
    }
  }


  startRace(racers){
    console.log(racers)
    this.socket.emit('racers', racers)
    const racerCounts = {}

    racers.forEach( (racer) => {
      racerCounts[racer] = 0
    }) 

    this.setState({ racerCounts: racerCounts });

    this.socket.on('racers', (racer) => {
      console.log(racer)

      const newRacerCounts = this.state.racerCounts
      newRacerCounts[racer] = newRacerCounts[racer] + 1

      this.setState((prevState) => ({
        racerCounts: newRacerCounts
      }));

      if(newRacerCounts[racer] === 20){
        this.socket.emit('stop')
        this.socket.close()
      }

    })
  }

  render() {
    return (
      <div>
        <RacerForm startRace={this.startRace.bind(this)}/>
        <RacerCharts racerCounts={this.state.racerCounts}/>
      </div>
    )
  }
}

export default RaceContainer