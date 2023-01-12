import React, { useState } from 'react';

import DieFace from './DieFace';


function Roller({dice, setIsConfigPage, rollGenerator}) {
    const nUniqueRollValues = dice.reduce((total, die) => total + parseInt(die.sides), 1) - dice.length;

    const [lastRoll, setLastRoll] = useState(Array(dice.length).fill("?"));
    const [lastRollTotal, setLastRollTotal] = useState("?");
    const [rollCount, setRollCount] = useState(0);
    const [rollHistogram, setRollHistogram] = useState(Array(nUniqueRollValues).fill(0));

    function rollDice() {
        const rollValues = rollGenerator.rollValues();
        setLastRoll(rollValues);
        setRollCount(rollCount+1);

        const rollTotal = rollValues.reduce((total, face) => total + face, 0);
        setLastRollTotal(rollTotal);

        const newRollHistogram = [...rollHistogram];
        newRollHistogram[rollTotal-dice.length]++;
        setRollHistogram(newRollHistogram);
    }

    return (
        <div>
            <button id="rollButton" name="rollButton" onClick={() => rollDice()}>Roll Dice</button>
            <label htmlFor="rollButton"> {` ${rollCount} roll(s)`}</label><br/>
            <RollDisplay dice={dice} lastRoll={lastRoll} />
            <p>{`The last roll value was: ${lastRollTotal}`}</p>
            <RollHistogram rollHistogram={rollHistogram} dice={dice}/>

            <button onClick={() => setIsConfigPage(true)} >Back to Configuration</button>
        </div>
    );
}

function RollHistogram( { rollHistogram, dice} ) {
    const mostFreq = Math.max(...rollHistogram);

    const histogram = rollHistogram.map((freq, index) => {
       return <DataBar size={`${(freq/mostFreq)*100}%`} number={index + dice.length}/>
    });

    return (
        <div className={"histogram"}>
            {histogram}
        </div>
    );
}

function DataBar( { size, number } ) {
    return <div className={"data-bar"} style={{width: size}}>{number}</div>
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

export default Roller;