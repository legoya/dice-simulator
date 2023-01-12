import RollGenerator from "./RollGenerator";

class FullyDependentRollGenerator extends RollGenerator {
    constructor(dice) {
        super(dice);
        this.nPermutations = dice.reduce((total, die) => total * parseInt(die.sides), 1);;
        this.rollStack = this._initRollStack();
    }

    rollValues()  {
        let nOptions = this.nPermutations;
        let [rollIndex, ...rest] = this.rollStack;

        const rolls = this.dice.map(die => {
            const nextNOptions = Math.floor(nOptions / die.sides);
            const roll = Math.floor(rollIndex / nextNOptions) + 1;
            rollIndex %= nextNOptions;
            nOptions = nextNOptions;
            return roll;
        });


        this.rollStack = rest.length === 0 ? this._initRollStack() : rest;        

        return rolls;
    }

    _initRollStack() {
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        return shuffle(Array.from(Array(this.nPermutations).keys()));
    }
}

export default FullyDependentRollGenerator;