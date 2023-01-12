# Dice Simulator
## Quick Start
In the project directory, ruun `npm start` which runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Overview
This application is designed to be used for any board games that require dice. The simulator will allow the user to create up to 4 dice, with the number of sides on each ranging from 2 to 99 inclusive. Each die is independent which allows for configurations that require die with differnt number of faces, or differnt colours (to identify one die among a group).

The primary inspiration for the simulator was the board game [Catan](https://www.catan.com/), where players try to optimise play in a game with random resource distribution. This application has 3 different dice-roller options which allow users to vary the level of randomness.

### Configuration Page
Set-up for the simulator, you are able to specify the number of sides on each die, the colour of the face, and the colour of the number on each die. You will then select the *Rolling Mode* to determine the level of randomness.

#### Independent Rolling Mode
*Real-life Randomness*
This works like real life dice rolling, each roll has no memory or dependence on any of the rolls that came before it. Each die has the same probability of landing on a given face every roll.

#### Die Dependent Rolling Mode
*Less Randomness*
Each die has its own memomy and knows how many times each face has occured, meaning if a 6-sided die shows a face value of 1, the chance of it showing 1 again decreases, relative to all of the other face values that could have occured.

#### Full Dependent Rolling Mode
*Least Randomness*
This mode remembers the exact face value of all of the dice for each roll, and will make sure that all of the face combinations are seen once before any combination can be repeated. For example, In a configuration with 2 6-sided die, there are 36 possible face combinations, 1 of which results in a total of 2, and 4 resulting in a total of 5. This means in each group of 36 rolls, the total value 2 will occur exactly once, while 5 will occur exactly 4 times. On the 37th roll, the probabilities all reset and the cycle starts again.

### Dice Rolling Page
The actual simulation. The page is very simple, allowing users to roll the dice all together, displaying the total and a histogram of all of the past rolls. Note that moving back to the configuration page will remember the die configurations (numbers of sides and colours) but not the roll history.

# Getting Started with the React App

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
