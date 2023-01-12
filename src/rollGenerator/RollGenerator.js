class RollGenerator {
    constructor(dice) {
        this.dice = dice;
    }

    rollValues(){
        throw new Error("Abstract method rollValues has no implementation in RollGenerator class");
    }

    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        // max and min values are inclusive
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export default RollGenerator;