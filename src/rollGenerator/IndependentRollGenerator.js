import RollGenerator from "./RollGenerator";

class IndependentRollGenerator extends RollGenerator {
    constructor(dice) {
        super(dice);
    }

    rollValues() {
        return this.dice.map((die) => {
            return RollGenerator.getRandomInt(1, die.sides);
        })
    }
}

export default IndependentRollGenerator;