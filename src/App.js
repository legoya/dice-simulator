import './App.css';
import React, { useState } from 'react';

import Config from './components/Config';
import Roller from './components/Roller';

import { DEFAULT_ROLL_MODE } from './constants';

import { RollMode } from "./models";

import IndependentRollGenerator from './rollGenerator/IndependentRollGenerator';
import FullyDependentRollGenerator from './rollGenerator/FullyDependentRollGenerator';
import DieDependentRollGenerator from './rollGenerator/DieDependentRollGenerator';

function App() {
    const [dice, setDice] = useState([]);
    const [rollMode, setMode] = useState(DEFAULT_ROLL_MODE);
    const [isConfigPage, setIsConfigPage] = useState(true);

    const rollGenerator = getRollGenerator(rollMode, dice);

    if (isConfigPage) {
        return <Config {...{dice, setDice, rollMode, setMode, setIsConfigPage}}/>;
    }

    return <Roller {...{dice, rollMode, setIsConfigPage, rollGenerator}}/>;

}

function getRollGenerator(rollMode, dice) {
    switch(rollMode) {
        case RollMode.INDEPENDENT:
            return new IndependentRollGenerator(dice);
        case RollMode.FULLY_DEPENDENT:
            return new FullyDependentRollGenerator(dice);
        case RollMode.DIE_DEPENDENT:
            return new DieDependentRollGenerator(dice);
        default:
            return getRollGenerator(DEFAULT_ROLL_MODE, dice);
    }
}

export default App;
