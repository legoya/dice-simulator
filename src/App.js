import './App.css';
import React, { useState } from 'react';

import DieFace from './components/DieFace';
import {
    DEFAULT_DICE_FACES,
    MIN_DICE_FACES,
    MAX_DICE_FACES,
    MAX_DICE
} from './constants';

import { RollMode } from './models';

// const RollMode = {
// 	INDEPENDENT: "Independent",
// 	DIE_DEPENDENT: "Die Dependent",
// 	FULLY_DEPENDENT: "Fully Dependent",
// }

function Config({dice, setDice, rollMode, setMode, setPageToConfig}) {
  function addDice() {
    setDice([
      ...dice,
      {sides: selectedSides, dieColor: selectedDieColor, dieNumColor: selectedDieNumColor}
    ])
  }

  function AddDiceButton() {
    return (
        <button
            disabled={dice.length >= MAX_DICE}
            onClick={addDice}
        > Add Dice </button>
    );
  }

  const [selectedSides, setSides] = useState(DEFAULT_DICE_FACES);

  function handleSelectedSidesChange(event) {
    if (event.target.value <= MIN_DICE_FACES) {
      setSides(MIN_DICE_FACES);
      return;
    }
    else if (event.target.value >= MAX_DICE_FACES) {
      setSides(MAX_DICE_FACES);
      return;
    }

    setSides(event.target.value);
  }

  const [selectedDieColor, setDieColor] = useState("#000000");
  function handleDieColorChange(event) {
    setDieColor(event.target.value);
  }

  const [selectedDieNumColor, setDieNumColor] = useState("#ffffff");
  function handleDieNumColorChange(event) {
    setDieNumColor(event.target.value);
  }

  function DieXButton(props) {
      return (<p className={"die-x"} onClick={() => removeDie(props.index)}>X</p>);
  }

  function removeDie(i) {
      setDice(dice.slice(0,i).concat(dice.slice(i+1)))
  }

  function DiceDisplay() {
    const dieFaces = dice.map((die) => {
      return (<DieFace displayNumber={die.sides} color={die.dieColor} numColor={die.dieNumColor}/>);
    });

    const dieXs = dice.map((_, index) => <DieXButton index={index}/>);

    return (
        <div className={"dice-display-table"}>
            <div className={"die-face-row"}>{dieFaces}</div>
            <div className={"die-x-row"}>{dieXs}</div>
        </div>
    );
  }

  return (
      <div>
          <h2>Dice Simulator Configuration</h2>
          <p>Configure up to {MAX_DICE} Dice</p>

          <form>
              <input type="number" id="dieSides" name="dieSides" min={MIN_DICE_FACES} max={MAX_DICE_FACES}
                     value={selectedSides} onChange={handleSelectedSidesChange}/>
              <label htmlFor="dieSides">{" Number of Sides (2-99)"}</label><br/>

              <input type="color" id="dieColor" name="dieColor" value={selectedDieColor}
                     onChange={handleDieColorChange}/>
              <label htmlFor="dieColor"> {" Dice Color"}</label><br/>

              <input type="color" id="dieNumberColor" name="dieNumberColor" value={selectedDieNumColor}
                     onChange={handleDieNumColorChange}/>
              <label htmlFor="dieNumberColor"> {" Dice Number Color"}</label><br/>

          </form>
          <AddDiceButton/>

          <DiceDisplay/>

          <div class="tab">
            <button class="tablinks" onClick={() => setMode(RollMode.INDEPENDENT)}>{RollMode.INDEPENDENT}</button>
            <button class="tablinks" onClick={() => setMode(RollMode.DIE_DEPENDENT)}>{RollMode.DIE_DEPENDENT}</button>
            <button class="tablinks" onClick={() => setMode(RollMode.FULLY_DEPENDENT)}>{RollMode.FULLY_DEPENDENT}</button>
          </div>
          <p>{rollMode}</p>

          <button
              disabled={dice.length === 0}
              onClick={() => setPageToConfig(false)}
          > Start
          </button>
      </div>
  );
}

function Roller({dice, rollMode, setPageToConfig}) {
    const nUniqueRollValues = dice.reduce((tot, d) => tot + parseInt(d.sides), 1) - dice.length;
    const nPermutations = dice.reduce((tot, d) => tot * parseInt(d.sides), 1);

    const [lastRoll, setLastRoll] = useState(Array(dice.length).fill("?"));
    const [lastRollValue, setLastRollValue] = useState("?");
    const [rollCount, setRollCount] = useState(0);
    const [rollHistogram, setRollHistogram] = useState(Array(nUniqueRollValues).fill(0));

    const [diceRollFrequencies, setDiceRollFrequencies] = useState(makeDiceFrequencyTable());

    const [nRemainingRollsInStack, setNRemainingRollsInStack] = useState(nPermutations);

    const [rollStack, setRollStack] = useState(initRollStack());

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initRollStack() {
        return shuffle(Array.from(Array(nPermutations).keys()));
    }

    function newRoll(nOption) {
        let [rollIndex, ...rest] = rollStack;

        const rolls = dice.map(die => {
            const nextNOptions = Math.floor(nOption / die.sides);
            const roll = Math.floor(rollIndex / nextNOptions) + 1;
            rollIndex %= nextNOptions;
            nOption = nextNOptions;
            return roll;
        });

        setRollStack(rest.length === 0 ? initRollStack() : rest);        
        
        return rolls;
    }



    function makeDiceFrequencyTable() {
        return dice.map((die) => {
            return Array(die.sides).fill(nPermutations / die.sides);
        });
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        // max and min values are inclusive
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function stackedRoll() {
        const rollValues = diceRollFrequencies.map((dieFreq) => {
            return getStackedRoll(dieFreq, nRemainingRollsInStack);
        });


        if (nRemainingRollsInStack === 1) {
            // if the stack is complete, the count needs to go back to nPermutations
            setDiceRollFrequencies(makeDiceFrequencyTable());
            setNRemainingRollsInStack(nPermutations);
            return rollValues;
        }

        setNRemainingRollsInStack(nRemainingRollsInStack-1);
        return rollValues;
    }

    function getStackedRoll(dieFreq, nRemainingRollsInStack) {
        let sample = getRandomInt(0, nRemainingRollsInStack-1)
        for (let i = 0; i < dieFreq.length; i++) {
            if (dieFreq[i] === 0) {
                continue;
            }
            if (sample - dieFreq[i] < 0) {
                dieFreq[i] = dieFreq[i] - 1;
                return i+1;
            }
            sample -= dieFreq[i];
        }
    }


    function RollDisplay() {
        const rollFaces = dice.map((die, index) => {
            return (<DieFace displayNumber={lastRoll[index]} color={die.dieColor} numColor={die.dieNumColor}/>);
        });

        return (
            <div className={"dice-display-table"}>
                <div className={"die-face-row"}>{rollFaces}</div>
            </div>
        );
    }


    function realisticRoll() {
        return dice.map((die) => {
            return getRandomInt(1, die.sides);
        })
    }

    function calcRollTotal() {
        if (lastRoll.length > 0 && lastRoll[0] === "?") {
            return "?";
        }

        return lastRoll.reduce((tot, n) => tot + n, 0)
    }


    function rollDice() {
        const rollValues = rollMode === RollMode.INDEPENDENT ? realisticRoll() : newRoll(nPermutations);
        const rollTotal = calcRollTotal();
        setLastRoll(rollValues);
        setRollCount(rollCount+1);
        setLastRollValue(rollTotal);

        const newRollHistogram = [...rollHistogram];
        newRollHistogram[rollTotal-dice.length]++;
        setRollHistogram(newRollHistogram);
    }


    function DataBar(props) {
        return <div className={"data-bar"} style={{width: props.size}}>{props.number}</div>
    }

    function Histogram() {
        const mostFreq = Math.max(...rollHistogram);
        const histogram = rollHistogram.map((freq, index) => {
           return <DataBar size={`${(freq/mostFreq)*100}%`} number={index + dice.length}/>
        });

        return (
            <div className={"histogram"}>
                {histogram}
            </div>)
    }

    return (
        <div>
            <button id="rollButton" name="rollButton" onClick={() => rollDice()}>Roll Dice</button>
            <label htmlFor="rollButton"> {` ${rollCount} roll(s)`}</label><br/>
            <RollDisplay/>
            <p>{`The last roll value was: ${lastRollValue}`}</p>
            <Histogram/>

            <button onClick={() => setPageToConfig(true)} >Back to Configuration</button>
        </div>
    );
}

function App() {
    const [dice, setDice] = useState([]);
    const [rollMode, setMode] = useState(RollMode.INDEPENDENT);
    const [isConfigPage, setPageToConfig] = useState(true);

    if (isConfigPage) {
        return <Config {...{dice, setDice, rollMode, setMode, setPageToConfig}}/>;
    }

    return <Roller {...{dice, rollMode, setPageToConfig}}/>;

}

export default App;
