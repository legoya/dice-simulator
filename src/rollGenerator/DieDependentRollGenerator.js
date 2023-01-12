import RollGenerator from "./RollGenerator";

class DieDependentRollGenerator extends RollGenerator {
    constructor(dice) {
        super(dice);
        this.nPermutations = dice.reduce((total, die) => total * parseInt(die.sides), 1);
        this.diceRollFrequencies = this._makeDiceFrequencyTable();
        this.nRemainingRollsInStack = this.nPermutations;
    }

    rollValues()  {
        const rollValues = this.diceRollFrequencies.map((dieFreq) => {
            return this._getStackedRoll(dieFreq);
        });


        if (this.nRemainingRollsInStack === 1) {
            // if the stack is complete, the count needs to go back to nPermutations
            this.diceRollFrequencies = this._makeDiceFrequencyTable();
            this.nRemainingRollsInStack = this.nPermutations;
            return rollValues;
        }

        this.nRemainingRollsInStack--;
        return rollValues;

    }

    _getStackedRoll(dieFreq) {
        let sample = RollGenerator.getRandomInt(0, this.nRemainingRollsInStack-1)
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

    _makeDiceFrequencyTable() {
        return this.dice.map((die) => {
            return Array(die.sides).fill(this.nPermutations / die.sides);
        });
    }
}

export default DieDependentRollGenerator;