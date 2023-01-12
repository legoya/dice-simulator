import React, { useState } from 'react';

import DieFace from './DieFace';

// import { DEFAULT_ROLL_MODE } from './constants';
import { RollMode } from "../models";

import RollGenerator from '../rollGenerator/RollGenerator'; 
import IndependentRollGenerator from '../rollGenerator/IndependentRollGenerator';
import FullyDependentRollGenerator from '../rollGenerator/FullyDependentRollGenerator';

function Histogram( { rollHistogram, dice} ) {
    function DataBar(props) {
        return <div className={"data-bar"} style={{width: props.size}}>{props.number}</div>
    }

    const mostFreq = Math.max(...rollHistogram);
    const histogram = rollHistogram.map((freq, index) => {
       return <DataBar size={`${(freq/mostFreq)*100}%`} number={index + dice.length}/>
    });

    return (
        <div className={"histogram"}>
            {histogram}
        </div>)
}

function RollDisplay( { dice, lastRoll } ) {
    const rollFaces = dice.map((die, index) => {
        return (<DieFace displayNumber={lastRoll[index]} color={die.dieColor} numColor={die.dieNumColor}/>);
    });

    return (
        <div className={"dice-display-table"}>
            <div className={"die-face-row"}>{rollFaces}</div>
        </div>
    );
}

function getRollGenerator(rollMode, dice) {
    switch(rollMode) {
        case RollMode.INDEPENDENT:
            return new IndependentRollGenerator(dice);
        case RollMode.FULLY_DEPENDENT:

            const [rollStack, setRollStack] = useState(initRollStack(nPermutations)); // fully dependent

            return new FullyDependentRollGenerator(dice);
        default:
            return new RollGenerator(dice);
    }
}

function Roller({dice, rollMode, setPageToConfig}) {
    const nUniqueRollValues = dice.reduce((tot, d) => tot + parseInt(d.sides), 1) - dice.length;

    const [lastRoll, setLastRoll] = useState(Array(dice.length).fill("?"));
    const [lastRollValue, setLastRollValue] = useState("?");
    const [rollCount, setRollCount] = useState(0);
    const [rollHistogram, setRollHistogram] = useState(Array(nUniqueRollValues).fill(0));

    const nPermutations = dice.reduce((tot, d) => tot * parseInt(d.sides), 1); // die dependent or // fully dependent

    const [diceRollFrequencies, setDiceRollFrequencies] = useState(makeDiceFrequencyTable(nPermutations, dice)); // die dependent
    const [nRemainingRollsInStack, setNRemainingRollsInStack] = useState(nPermutations); // die dependent

    const rollGen = getRollGenerator(rollMode, dice);

    // function independentRollValues(dice) {
    //     return dice.map((die) => {
    //         return RollGenerator.getRandomInt(1, die.sides);
    //     })
    // }
    
    function dieDependentRollValues() {
        function getStackedRoll(dieFreq, nRemainingRollsInStack) {
            let sample = RollGenerator.getRandomInt(0, nRemainingRollsInStack-1)
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

    function makeDiceFrequencyTable(nPermutations, dice) {
        return dice.map((die) => {
            return Array(die.sides).fill(nPermutations / die.sides);
        });
    }

    function fullyDependentRollValues(nPermutations, setRollStack) {
        let [rollIndex, ...rest] = rollStack;

        const rolls = dice.map(die => {
            const nextNOptions = Math.floor(nPermutations / die.sides);
            const roll = Math.floor(rollIndex / nextNOptions) + 1;
            rollIndex %= nextNOptions;
            nOption = nextNOptions;
            return roll;
        });

        setRollStack(rest.length === 0 ? initRollStack() : rest);        
        
        return rolls;
    }

    function initRollStack(nPermutations) {
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        return shuffle(Array.from(Array(nPermutations).keys()));
    }

    function rollDice() {
        function calcRollTotal() {
            if (lastRoll.length > 0 && lastRoll[0] === "?") {
                return "?";
            }
    
            return lastRoll.reduce((tot, n) => tot + n, 0)
        }

        const rollValues = rollGen.rollValues();
        const rollTotal = calcRollTotal();
        setLastRoll(rollValues);
        setRollCount(rollCount+1);
        setLastRollValue(rollTotal);

        const newRollHistogram = [...rollHistogram];
        newRollHistogram[rollTotal-dice.length]++;
        setRollHistogram(newRollHistogram);
    }

    return (
        <div>
            <button id="rollButton" name="rollButton" onClick={() => rollDice()}>Roll Dice</button>
            <label htmlFor="rollButton"> {` ${rollCount} roll(s)`}</label><br/>
            <RollDisplay dice={dice} lastRoll={lastRoll} />
            <p>{`The last roll value was: ${lastRollValue}`}</p>
            <Histogram rollHistogram={rollHistogram} dice={dice}/>

            <button onClick={() => setPageToConfig(true)} >Back to Configuration</button>
        </div>
    );
}

export default Roller;