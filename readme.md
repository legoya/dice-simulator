# Dice Roll Simulation 
V1.0.0: 7-Feb-2021

This repo contains a program used to simulate dice rolls for dice and boardgames.

DiceSim replicates the rolling of physical dice, and is useful for boardgames such as Settlers of Catan where the distribution
(randomness) of Dice Rolls directly impact game outcomes. When using physical dice, each roll is independent, meaning the value of one roll
has no impact on the next. DiceSim is a pseudo-random dice rolling program where all possible dice rolls are pre-calculated (based on the 
user configuration) and then drawn to match the level of randomness the user desires. Pseudo-randomness is achieved by sampling from all
of the dice rolls without replacement.

V1.x.x of the program only produces the sum of the two rolled dice for each roll.

### Quick Start
Setting up for a game with 2 6-sided dice (Monopoly, Settlers of Catan, etc.)
```text
  python3 Game.py
  <introduction message>

  CONFIG DICE: Enter the number of faces of each dice, separated by spaces (e.g. '6 6' for 2 6-sided dice):
  6 6
  CONFIG COPY: Enter how many copies of each dice should be added (input an integer of 1 or more):
  1
  CONFIG SAMPLE: Enter a number equal to or between 0 and 1 to represent the % of numbers to use:
  1

  <the program will start printing dice rolls to the screen with instructions to continue or stop>
```

### Example
With the configuration described in the quick start: 2 6-sided dice and copy and sample set to 1, DiceSim will produce rolls in the
following way:
1. Create all roll values: [2, 3, 3, 4, 4, 4, ... 11, 11, 12]. Note that a roll of 2 can only occur with 1 combination with 2 dice
while 4 can occur 3 times, these frequencies are reflected when creating the roll values.
2. The program randomises the list of roll values, and moves along the randomised list, printing the roll to the screen, and because the
program moves along the list, each roll can only occur a fitite number of times before the end of the list is reached.
3. Once at the end of the list, the program goes back to step 2, re-randomising the list and begins producing rolls.


### Configuration
The program will start by asking the user for configuration inputs. The inputs specify how many dice need to be simulated, and then ask for two paramaters, copy and sample.

- Copy: The number of times each permutation of each roll is allowed to occur before all possible roll values are reset. It will be normal
to use a value of 1, higher copy settings will mean it is possible for dice rolls to occur together (e.g. it is possible to roll 12
twice-in-a-row with 2 6-sided dice if the copy value is 2 or more.)
- Sample: What % of the roll values need to be used before the possible dice rolls are reset. This number ranges from 0 to 1 and determines
how much independence there is between each dice roll. A value of 0 will mean that each dice roll is completely independent. A value of 1 
will mean the DiceSim will produce all of the rolls, before any given roll can occur again (complete dependence).


### Future Development Ideas
1. Add a User interface.
2. Add test cases.
3. Improve handling of user inputs, including handing different errors.
4. Add different dice roll outcomes, instead of just producing the sum of the dice faces.
5. Allow users to provide a name and a list of values for dice faces (e.g. set the faces to be words).
6. Allow users to get dice rolls from different distributions (e.g. uniform).

### Known bugs
1. User inputs are only striped for spaces, so if a user inputs a new line command and then an input the program will crash.
