import RollGenerator from "./RollGenerator";

class FullyDependentRollGenerator extends RollGenerator {
    constructor(dice) {
        super(dice);
        this.numberOfFacePermutations = dice.reduce((total, die) => total * parseInt(die.sides), 1);;
        this.remainingRollKeys = this._initRemainingRollKeys();
    }

    rollValues()  {
        let numberOfRemainingFacePerms = this.numberOfFacePermutations;
        let [rollKey, ...rest] = this.remainingRollKeys;

        // maps the rollKey in to a list of die face values.
        const rolls = this.dice.map(die => {
            const numberOfRemainingFacePermsExcludingThisDie = Math.floor(numberOfRemainingFacePerms / die.sides);
            const roll = Math.floor(rollKey / numberOfRemainingFacePermsExcludingThisDie) + 1;
            rollKey %= numberOfRemainingFacePermsExcludingThisDie;
            numberOfRemainingFacePerms = numberOfRemainingFacePermsExcludingThisDie;
            return roll;
        });

        // if ALL rolls have occured once since last reset, then reset.
        this.remainingRollKeys = rest.length === 0 ? this._initRemainingRollKeys() : rest;        

        return rolls;
    }

    _initRemainingRollKeys() {
        return this._shuffleRollKeysArray(Array.from(Array(this.numberOfFacePermutations).keys()));
    }

    _shuffleRollKeysArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

export default FullyDependentRollGenerator;