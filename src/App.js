import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    // States for dice, tenzies (game won or not) and roll count
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [count, setCount] = React.useState(1)
    // colour of button depending on game won or not
    const styles = {
        backgroundColor: tenzies ? "#f38b17" : "#ed4880"
    }
    
    // If all dice held and all same value then game won (tenzies true)
    // (If every die has isHeld true, then allHeld true)
    // Checks every time dice state changes
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    // generate die with value between 1 and 6 inclusive, and unique id
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    // generate 10 new dice at start of game
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    // if game not won, roll new dice for those not held
    // if game won, reset tenzies and count, roll 10 new dice
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setCount(oldCount => oldCount+1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setCount(1)
        }
    }
    
    // for id of clicked die, set isHeld to opposite of current state
    // (by spreading in die object but changing just isHeld key)
    // set all other die as themselves
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    // Render each die, passing props to die.js
    // pass holdDice function with parameter to onClick event handler
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    // If tenzies is true then render confetti
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
                style={styles}
            >
                {tenzies ? "New Game" : "Roll Dice"}
            </button>
            <p>Roll count: {count}</p>
        </main>
    )
}
