import './App.css'
import { useState , useEffect } from 'react'
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'

export default function App() {

  const [dice , SetDice] = useState(allNewDice())
  const [tenzies , setTenzies] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [bestTime, setBestTime] = useState(() => JSON.parse(localStorage.getItem("bestTime")) || 0)
  let timer // timer for the clock 

  // setting the timer for the game
  useEffect(() => {
    timer = setInterval(() => {
      setSeconds(seconds => seconds + 1)

      if(seconds === 59) {
        setMinutes(minutes => minutes + 1)
        setSeconds(0)
      }
    },1000)

    return () => {
      clearInterval(timer)
    }
  })

  // if game is won, updating the bestTime
  useEffect(() => {
    if(tenzies) {
      let totalTime = seconds + 60 * minutes
      if(bestTime == 0 || totalTime < bestTime) {
        localStorage.setItem("bestTime",JSON.stringify(totalTime))
        setBestTime(totalTime)
      }
    }
  },[tenzies])

  // stoping the timer 
  useEffect(() => {
    if(tenzies) {
      clearInterval(timer)
    }
  })

  function generateDie() {
    return { value : Math.ceil(Math.random() * 6) ,
            isHeld : false,
            id : nanoid() 
          }
  }

  useEffect(() => {
    let diceHeld = dice.every(die => die.isHeld)
    let firstDice = dice[0].value
    let diceValue = dice.every(die => die.value === firstDice)

    if(diceHeld && diceValue) {
      setTenzies(true)
    }

  }, [dice])

  function allNewDice() {
    let diceArr = []

    for (let i = 0; i < 10 ; i++) {
      diceArr.push(generateDie())
    }

    return diceArr
  }

  function diceClickHandler(id) {
    
    SetDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
        {...die, isHeld : !die.isHeld} :
        die
    }))

  }

  function diceRollBtn() {
    if(tenzies) {
      setTenzies(false)
      SetDice(allNewDice())
      setMinutes(0)
      setSeconds(0)
    } else {
      SetDice(oldDice => oldDice.map(die => {
        return die.isHeld ? 
          die : 
          generateDie()
      }))
    }
  }

  const diceElements = dice.map(die => <Die 
      key = {die.id} 
      value = {die.value} 
      isHeld = {die.isHeld} 
      clickHandler = {() => diceClickHandler(die.id)} 
    />)

  return (
    <main className="main">
      {tenzies && <Confetti />}
      <h1 className='main--heading'>Tenzies</h1>
      <p className='main--para'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="score-container">
        {bestTime != 0 && <h3>Best Time: {bestTime < 10 ? `0${bestTime}` : bestTime} Sec</h3>}
        <h3>Timer: {minutes < 10 ? `0${minutes}` : minutes} : {seconds < 10 ? `0${seconds}` : seconds}</h3>
      </div>
      <div className="allDices">
        {diceElements}
      </div>
      <button 
        className='btn-primary'
        onClick={diceRollBtn}
      >{tenzies ? "New Game" : "Roll"}</button>
    </main>
  )
}
