import random
from typing import List
from Configuration import Configuration


class DiceSim:
    """
    Dice Rolling Simulator, used to create a pseudo-random draw from a defined set of dice.

    With physical dice each roll is independent and can result in a very uneven distributions of rolls during a board game or other
    dice game. DiceSim is a program that initialises all of the possible dice roll values, and then draws from these values without
    replacement, creating an even distribution of results. 
    """

    def __init__(self):
        """
        Initialises the information needed to simulate dice rolls.

        The configuration defines the variables required to set up the dice simulator while the possible_rolls is the list of all
        permutations of rolls from the dice.
        """

        DiceSim.__print_help()
        self.configuration = Configuration()
        self.possible_rolls = self.__gen_possible_rolls()

    def run(self):
        while True:
            self.__get_rolls()
            print("The sample limit has been reached on this dice stack, a new stack will be generated...")

    @staticmethod
    def __print_help():
        help_msg = ('This is a dice simulator, designed for use as dice when playing board games. \n'

                    'There are 3 configuration variables you will need to provide to describe the dice you need for your game.\n'
                    '    Dice: List of the number of faces on each dice: e.g. 6 6 is two dice with 6 faces.\n'
                    '    Copy: How many copies the rolls should be generated (normally set this at 1).\n'
                    '    Sample: How many number you want to simulate before the game resets the dice numbers (normally set this between 0.8 and 1).\n'

                    'After the config is defined, the game will start and print numbers to the screen - these numbers are dice rolls.\n'

                    'Once the game has been configured, other available commands are:\n'
                        "'e' - Exit: stop the game,\n"
                        "'r' - Reset: reset the current dice simulator with the same config,\n"
                        "'c' - Config: to go back to the config setup,\n"
                        "'h' - Help: see this message again.\n"
                    )

        print(help_msg)

    @staticmethod
    def __user_prompt() -> str:
        return "Press ENTER to get the next number, or another command: e (Exit), r (Reset), c (Config) or h (Help))."

    def __gen_possible_rolls(self) -> List[int]:
        """
        Interprets the configurations to create a list of all possible dice rolls with the provided configuration.
        """

        dice_faces = [list(range(1, d + 1)) for d in self.configuration.dice]
        return DiceSim.__calc_rolls(dice_faces[0], dice_faces[1:]) * self.configuration.copy

    @staticmethod
    def __calc_rolls(result, rest) -> List[int]:
        """
        Produces the list of all possible dice values, including how often the dice value will occur.

        Parameters
        ----------
        result: List[int]
            Accumulating list of dice roll values that is finally returned when all dice are processed.
        rest: List[List[int]]
            All remaining dice that have not yet been processed.

        Returns
        -------
        List[int]
            All unique dice values possible in the game given the dice provided in the configuration.
        """

        if len(rest) == 0:
            return result
        return DiceSim.__calc_rolls(DiceSim.__add_dice(result, rest[0]), rest[1:])

    @staticmethod
    def __add_dice(dice_1, dice_2) -> List[int]:
        """
        Creates a list of all the roll totals between two dice.

        Totals appear once per each unique combinations of the dice faces.

        Parameters
        ----------
        dice_1: List[int]
            The first dice face needed when calculating the total value of the roll.
        dice_2: List[int]
            The second dice face needed when calculating the total value of the roll.
        Returns
        -------
        List[int]
            All of the combinations of rolls between dice_1 and dice_2.
        """

        return [i + j for i in dice_1 for j in dice_2]

    def __get_rolls(self):
        """
        Prints the value of a dice roll, and then asks the user for an input to determine what to do next.

        Continuously takes samples without replacement from the set of dice values, until either, i. the user prompts
        the game to stop doing so or, ii. the sample threshold (as defined in the configuration is reached) and the program
        re-creates the set of dice rolls and begins resampling again.
        """

        random.shuffle(self.possible_rolls)  # randomises the rolls for this run of the dice sim
        roll_num = 0

        while roll_num < len(self.possible_rolls) * self.configuration.sample:  # have not yet completed the sample set
            print("DICE ROLL:", self.possible_rolls[roll_num])
            roll_num += 1
            print(DiceSim.__user_prompt())
            self.__user_action(input())

    def __user_action(self, command):
        """
        Takes user command and progresses the program, or resets the dice or configuration.

        Parameters
        ----------
        command: str
            User provided instruction.

        Returns
        -------
        None
        """

        clean_cmd = command.strip()

        # TODO: improve comparisons to handle full words and capital letter inputs.
        if clean_cmd == 'e':
            exit()
        elif clean_cmd == 'r':
            self.run()  # creates a new possible_rolls and keeps playing with the same configuration
        elif clean_cmd == 'c':
            self.__init__()  # re-creates the game instance
        elif clean_cmd == 'h':
            DiceSim.__print_help()
            print(DiceSim.__user_prompt())
            self.__user_action(input())
        elif clean_cmd == '':
            return  # input was return/enter or spaces, keep generating rolls
        else:
            print("Command not understood or available, try again with one of 'e', 'r', 'c', 'h', or <return>.")
            print(DiceSim.__user_prompt())
            self.__user_action(input())


if __name__ == '__main__':
    game = DiceSim()
    game.run()
