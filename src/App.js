import './App.css';
import React, { useState } from 'react';

const DEFAULT_DICE_FACES = 6;
const MIN_DICE_FACES = 2;
const MAX_DICE_FACES = 32;

const MAX_DICE = 4;

function DieFace(props) {
    return <div
        className={"die-face"}
        style={{
            background: props.color,
            color: props.numColor
        }}
    >
        {props.displayNumber}
    </div>
}

function Config({dice, setDice, isRealisticMode, setMode, setPageToConfig}) {
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
          <input type="radio" id="isRealisticMode" checked={isRealisticMode} onClick={() => setMode(!isRealisticMode)}/>
          <label htmlFor="isRealisticMode"> {" Realistic Roll Mode"}</label><br/>

          <button
              disabled={dice.length === 0}
              onClick={() => setPageToConfig(false)}
          > Start
          </button>
      </div>
  );
}

function Roller({dice, isRealisticMode, setPageToConfig}) {
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

    function newRoll(n) {
        let [v, ...rest] = rollStack;

        let rolls = [];
        dice.forEach(die => {
            const a = Math.floor(n / die.sides);
            const b = Math.floor(v / a);
            rolls.push(b + 1);
            v %= a;
            n = a;
        });

        if (rest.length === 0) {
            setRollStack(initRollStack());
        } else {
            setRollStack(rest);
        }

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
        const rollValues = isRealisticMode ? realisticRoll() : newRoll(nPermutations);
        const rollTotal = calcRollTotal();
        setLastRoll(rollValues);
        setRollCount(rollCount+1);
        setLastRollValue(rollTotal);

        const newRollHistogram = [...rollHistogram];
        newRollHistogram[rollTotal-dice.length]++;
        setRollHistogram(newRollHistogram);
    }


    function HBar(props) {
        return <div className={"h-bar"} style={{width: props.size}}>{props.number}</div>
    }

    function H() {
        const mostFreq = Math.max(...rollHistogram);
        const histogram = rollHistogram.map((freq, index) => {
           return <HBar size={`${(freq/mostFreq)*100}%`} number={index + dice.length}/>
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
            <H/>

            <button onClick={() => setPageToConfig(true)} >Back to Configuration</button>
        </div>
    );
}

function App() {
    const [dice, setDice] = useState([]);
    const [isRealisticMode, setMode] = useState(false);
    const [isConfigPage, setPageToConfig] = useState(true);

    if (isConfigPage) {
        return <Config {...{dice, setDice, isRealisticMode, setMode, setPageToConfig}}/>;
    }

    return <Roller {...{dice, isRealisticMode, setPageToConfig}}/>;

}

export default App;
