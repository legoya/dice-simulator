import React, { useState } from 'react';
import DieFace from './DieFace';
import {
    DEFAULT_DICE_FACES,
    MIN_DICE_FACES,
    MAX_DICE_FACES,
    MAX_DICE,
    DEFAULT_DIE_FACE_COLOUR,
    DEFAULT_DIE_NUMBER_COLOUR
} from '.././constants';
import { RollMode } from '.././models';

function Config( { dice, setDice, rollMode, setMode, setIsConfigPage } ) {
    const [selectedSides, setSides] = useState(DEFAULT_DICE_FACES);
    const [selectedDieColor, setDieColor] = useState(DEFAULT_DIE_FACE_COLOUR);
    const [selectedDieNumColor, setDieNumColor] = useState(DEFAULT_DIE_NUMBER_COLOUR);
  
    return (
        <div>
            <h2>Dice Simulator Configuration</h2>
            <p>Configure up to {MAX_DICE} Dice</p>
  
            <form>
              <DiceSidesConfig selectedSides={selectedSides} setSides={setSides}/>
              <DiceColourConfig selectedDieColor={selectedDieColor} setDieColor={setDieColor} selectedDieNumColor={selectedDieNumColor} setDieNumColor={setDieNumColor}/> 
            </form>
  
            <AddDiceButton setDice={setDice} dice={dice} selectedSides={selectedSides} selectedDieColor={selectedDieColor} selectedDieNumColor={selectedDieNumColor}/>
  
            <DiceConfigDisplay dice={dice} setDice={setDice}/>
  
            <div class="tab">
              <button class="tablinks" onClick={() => setMode(RollMode.INDEPENDENT)}>{RollMode.INDEPENDENT}</button>
              <button class="tablinks" onClick={() => setMode(RollMode.DIE_DEPENDENT)}>{RollMode.DIE_DEPENDENT}</button>
              <button class="tablinks" onClick={() => setMode(RollMode.FULLY_DEPENDENT)}>{RollMode.FULLY_DEPENDENT}</button>
            </div>
            <p>{rollMode}</p>
  
            <button
                disabled={dice.length === 0}
                onClick={() => setIsConfigPage(false)}
            > Start
            </button>
        </div>
    );
}

function DiceSidesConfig( { selectedSides, setSides } ) {
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

    return (
        <>
            <input type="number" id="dieSides" name="dieSides" min={MIN_DICE_FACES} max={MAX_DICE_FACES}
                value={selectedSides} onChange={handleSelectedSidesChange}/>
            <label htmlFor="dieSides">{" Number of Sides (2-99)"}</label><br/>
        </>
    );
}

function DiceColourConfig( { selectedDieColor, setDieColor, selectedDieNumColor, setDieNumColor } ) {
    function handleDieColorChange(event) {
        setDieColor(event.target.value);
    }

    function handleDieNumColorChange(event) {
        setDieNumColor(event.target.value);
    }

    return (
        <>
            <input type="color" id="dieColor" name="dieColor" value={selectedDieColor}
                    onChange={handleDieColorChange}/>
            <label htmlFor="dieColor"> {" Dice Color"}</label><br/>

            <input type="color" id="dieNumberColor" name="dieNumberColor" value={selectedDieNumColor}
                    onChange={handleDieNumColorChange}/>
            <label htmlFor="dieNumberColor"> {" Dice Number Color"}</label><br/>
        </>
    );
}

function AddDiceButton( { setDice, dice, selectedSides, selectedDieColor, selectedDieNumColor } ) {
    function addDice() {
        setDice([
          ...dice,
          {sides: selectedSides, dieColor: selectedDieColor, dieNumColor: selectedDieNumColor}
        ])
    }

    return (
        <button
            disabled={dice.length >= MAX_DICE}
            onClick={addDice}
        > Add Dice
        </button>
    );
}

function DiceConfigDisplay( { dice, setDice }) {
    function DieXButton(props) {
        return (<p className={"die-x"} onClick={() => removeDie(props.index)}>X</p>);
    }

    function removeDie(i) {
        setDice(dice.slice(0,i).concat(dice.slice(i+1)))
    }

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

export default Config;