from typing import List


class Configuration:
    """
    Defines variables required for simulating dice rolls.

    The program configuration enables users to set how much randomness is in the program, ranging from completely independent to
    completely dependent rolls.
    """

    def __init__(self):
        """
        Defines the configuration for use in a Dice Simulator.

        Variables define the dice used in the simulator and provide user with controls to impact the randomness of dice rolls during the
        simulation.

        dice: List of integers that represents the number of faces on each dice.

        copy: Number of times each individual roll should occur. Higher numbers allow the simulator to deviate from the regular
        distribution.

        sample: The % of unique dice rolls that should be sampled before the possible rolls list is reset. Lower values decrease
        determinism of the rolls.
        """

        self.dice = Configuration.__init_dice()
        self.copy = Configuration.__init_copy()
        self.sample = Configuration.__init_sample()

    @staticmethod
    def __init_dice() -> List[int]:
        print("CONFIG DICE: Enter the number of faces of each dice, separated by spaces (e.g. '6 6' for 2 6-sided dice):")
        return Configuration.__check_dice_input(input())

    @staticmethod
    def __check_dice_input(dice: str) -> List[int]:
        """
        Processes the user input to specify the dice.

        Parameters
        ----------
        dice: str
            Raw user input to be converted in to a usable configuration variable.

        Returns
        -------
        List[int]
            Dice value that will be set in the configuration.
        """

        if dice.replace(' ', '') == '':
            print("ERROR: No dice have been entered, please try again...")
            Configuration.__init_dice()
        else:
            try:
                return [int(d) for d in dice.split(' ')]
            except ValueError:
                print("ERROR: All values entered for dice must be numbers, try again...")
                Configuration.__init_dice()

    @staticmethod
    def __init_copy() -> int:
        print("CONFIG COPY: Enter how many copies of each dice should be added (input an integer of 1 or more):")
        return Configuration.__check_copy_input(input())

    @staticmethod
    def __check_copy_input(copy: str) -> int:
        """
        Processes user input when specifying the copy configuration variables

        Parameters
        ----------
        copy: str
            Raw user input to be converted in to a usable configuration variable.

        Returns
        -------
        int
            Number of copies of each dice roll that can occur per iteration of the dice sim.
        """

        try:
            copy = float(copy.replace(' ', ''))
        except ValueError:
            print("ERROR: Input copy must be a number, try again...")
            Configuration.__init_copy()

        if copy < 1:
            print("ERROR: Copy must be a number greater than or equal to 1, try again...")
            Configuration.__init_copy()

        if int(copy) / copy != 1:
            # TODO: improve this checking as it has a precision limit.
            print(f"WARNING: Input value was a decimal, only integer component is usable, copy value will be set as {int(copy)},")
            return int(copy)

        return int(copy)

    @staticmethod
    def __init_sample() -> float:
        print("CONFIG SAMPLE: Enter a number equal to or between 0 and 1 to represent the % of numbers to use:")
        return Configuration.__check_sample_input(input())

    @staticmethod
    def __check_sample_input(sample: str) -> float:
        """
        Processes user input when specifying the sample configuration variables

        Parameters
        ----------
        sample: str
            Raw user input to be converted in to a usable configuration variable.

        Returns
        -------
        float
            % of rolls that will be used in each iteration of the dice simulator.
        """
        
        try:
            sample = float(sample.replace(' ', ''))
        except ValueError:
            print("ERROR: Sample must be a number input (integer or a float), try again...")
            Configuration.__init_sample()

        if not 0 <= sample <= 1:
            print("ERROR: Sample must be a number equal to or between 0 and 1, try again...")
            Configuration.__init_sample()

        return sample
