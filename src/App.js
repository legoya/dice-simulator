import './App.css';
import React, { useState } from 'react';

// import DieFace from './components/DieFace';
import Config from './components/Config';
import Roller from './components/Roller';

// import { RollMode } from './models';
import { DEFAULT_ROLL_MODE } from './constants';


// function Roller({dice, rollMode, setPageToConfig}) {
//     const nUniqueRollValues = dice.reduce((tot, d) => tot + parseInt(d.sides), 1) - dice.length;
//     const nPermutations = dice.reduce((tot, d) => tot * parseInt(d.sides), 1);

//     const [lastRoll, setLastRoll] = useState(Array(dice.length).fill("?"));
//     const [lastRollValue, setLastRollValue] = useState("?");
//     const [rollCount, setRollCount] = useState(0);
//     const [rollHistogram, setRollHistogram] = useState(Array(nUniqueRollValues).fill(0));

//     const [diceRollFrequencies, setDiceRollFrequencies] = useState(makeDiceFrequencyTable());

//     const [nRemainingRollsInStack, setNRemainingRollsInStack] = useState(nPermutations);

//     const [rollStack, setRollStack] = useState(initRollStack());

//     function initRollStack() {
//         function shuffle(array) {
//             for (let i = array.length - 1; i > 0; i--) {
//                 let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
//                 [array[i], array[j]] = [array[j], array[i]];
//             }
//             return array;
//         }

//         return shuffle(Array.from(Array(nPermutations).keys()));
//     }

//     function makeDiceFrequencyTable() {
//         return dice.map((die) => {
//             return Array(die.sides).fill(nPermutations / die.sides);
//         });
//     }

//     function getRandomInt(min, max) {
//         min = Math.ceil(min);
//         max = Math.floor(max);
//         // max and min values are inclusive
//         return Math.floor(Math.random() * (max - min + 1) + min);
//     }




//     function RollDisplay() {
//         const rollFaces = dice.map((die, index) => {
//             return (<DieFace displayNumber={lastRoll[index]} color={die.dieColor} numColor={die.dieNumColor}/>);
//         });

//         return (
//             <div className={"dice-display-table"}>
//                 <div className={"die-face-row"}>{rollFaces}</div>
//             </div>
//         );
//     }


//     function independentRollValues() {
//         return dice.map((die) => {
//             return getRandomInt(1, die.sides);
//         })
//     }
    
//     function dieDependentRollValues() {
//         function getStackedRoll(dieFreq, nRemainingRollsInStack) {
//             let sample = getRandomInt(0, nRemainingRollsInStack-1)
//             for (let i = 0; i < dieFreq.length; i++) {
//                 if (dieFreq[i] === 0) {
//                     continue;
//                 }
//                 if (sample - dieFreq[i] < 0) {
//                     dieFreq[i] = dieFreq[i] - 1;
//                     return i+1;
//                 }
//                 sample -= dieFreq[i];
//             }
//         }

//         const rollValues = diceRollFrequencies.map((dieFreq) => {
//             return getStackedRoll(dieFreq, nRemainingRollsInStack);
//         });


//         if (nRemainingRollsInStack === 1) {
//             // if the stack is complete, the count needs to go back to nPermutations
//             setDiceRollFrequencies(makeDiceFrequencyTable());
//             setNRemainingRollsInStack(nPermutations);
//             return rollValues;
//         }

//         setNRemainingRollsInStack(nRemainingRollsInStack-1);
//         return rollValues;
//     }

//     function fullyDependentRollValues(nOption, setRollStack) {
//         let [rollIndex, ...rest] = rollStack;

//         const rolls = dice.map(die => {
//             const nextNOptions = Math.floor(nOption / die.sides);
//             const roll = Math.floor(rollIndex / nextNOptions) + 1;
//             rollIndex %= nextNOptions;
//             nOption = nextNOptions;
//             return roll;
//         });

//         setRollStack(rest.length === 0 ? initRollStack() : rest);        
        
//         return rolls;
//     }

//     function calcRollTotal() {
//         if (lastRoll.length > 0 && lastRoll[0] === "?") {
//             return "?";
//         }

//         return lastRoll.reduce((tot, n) => tot + n, 0)
//     }

//     function rollDice() {
//         const rollValues = rollMode === RollMode.INDEPENDENT ? independentRollValues() : dieDependentRollValues(nPermutations, setRollStack);
//         const rollTotal = calcRollTotal();
//         setLastRoll(rollValues);
//         setRollCount(rollCount+1);
//         setLastRollValue(rollTotal);

//         const newRollHistogram = [...rollHistogram];
//         newRollHistogram[rollTotal-dice.length]++;
//         setRollHistogram(newRollHistogram);
//     }


//     function DataBar(props) {
//         return <div className={"data-bar"} style={{width: props.size}}>{props.number}</div>
//     }

//     function Histogram() {
//         const mostFreq = Math.max(...rollHistogram);
//         const histogram = rollHistogram.map((freq, index) => {
//            return <DataBar size={`${(freq/mostFreq)*100}%`} number={index + dice.length}/>
//         });

//         return (
//             <div className={"histogram"}>
//                 {histogram}
//             </div>)
//     }

//     return (
//         <div>
//             <button id="rollButton" name="rollButton" onClick={() => rollDice()}>Roll Dice</button>
//             <label htmlFor="rollButton"> {` ${rollCount} roll(s)`}</label><br/>
//             <RollDisplay/>
//             <p>{`The last roll value was: ${lastRollValue}`}</p>
//             <Histogram/>

//             <button onClick={() => setPageToConfig(true)} >Back to Configuration</button>
//         </div>
//     );
// }

function App() {
    const [dice, setDice] = useState([]);
    const [rollMode, setMode] = useState(DEFAULT_ROLL_MODE);
    const [isConfigPage, setPageToConfig] = useState(true);

    if (isConfigPage) {
        return <Config {...{dice, setDice, rollMode, setMode, setPageToConfig}}/>;
    }

    return <Roller {...{dice, rollMode, setPageToConfig}}/>;

}

export default App;
