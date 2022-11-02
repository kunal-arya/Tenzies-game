import './App.css'
import { useState , useEffect } from 'react'
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'

export default function App() {

  const [dice , SetDice] = useState(allNewDice())
  const [tenzies , setTenzies] = useState(false)

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
