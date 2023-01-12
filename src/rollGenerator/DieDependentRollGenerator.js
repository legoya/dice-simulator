import RollGenerator from "./RollGenerator";

class DieDependentRollGenerator extends RollGenerator {
    constructor(dice) {
        super(dice);
        this.numberOfFacePermutations = dice.reduce((total, die) => total * parseInt(die.sides), 1);
        this.diceFaceFrequencies = this._initDiceFaceFrequencies();
        this.numberOfRemaingRollsUntilReset = this.numberOfFacePermutations - 1;
    }

    rollValues()  {
        const rollValues = this.diceFaceFrequencies.map((dieFrequencies) => {
            return this._sampleRollFromDiceFrequencies(dieFrequencies);
        });

        if (this.numberOfRemaingRollsUntilReset === 0) {
            // if the stack is complete, the count needs to go back to numberOfFacePermutations.
            this.diceFaceFrequencies = this._initDiceFaceFrequencies();
            this.numberOfRemaingRollsUntilReset = this.numberOfFacePermutations - 1;
            return rollValues;
        }

        this.numberOfRemaingRollsUntilReset--;
        return rollValues;

    }

    _sampleRollFromDiceFrequencies(dieFrequencies) {
        let sample = RollGenerator.getRandomInt(0, this.numberOfRemaingRollsUntilReset)

        for (let faceIndex = 0; faceIndex < dieFrequencies.length; faceIndex++) {
            if (dieFrequencies[faceIndex] === 0) {
                // this face value has already occured the maximum allowable times since reset.
                continue;
            }
            
            if (sample - dieFrequencies[faceIndex] < 0) {
                dieFrequencies[faceIndex] = dieFrequencies[faceIndex] - 1;
                // the face value for the input die on this roll is faceIndex+1.
                return faceIndex+1;
            }
            
            // haven't yet determined the face value for the die, decrement sample and loop to next face value.
            sample -= dieFrequencies[faceIndex];
        }
    }

    _initDiceFaceFrequencies() {
        return this.dice.map((die) => {
            return Array(die.sides).fill(this.numberOfFacePermutations / die.sides);
        });
    }
}

export default DieDependentRollGenerator;