# Connect Four (with gravity!)

No source to link to for this one – came up with this one myself.

## Prompt

Create a version of the hit game Connect Four! For those who need a refresher, here are the rules:

1. Both players alternate dropping pieces into a 7x6 vertical grid/"game board". Pieces can only be dropped from the very top of the board, and they will keep falling until they either hit the bottom of the board, or another piece.
2. The red player always goes first.
3. The first to get a line of four connected pieces on their board wins. Lines can be made vertically, horizontally, or diagonally.
4. Pieces do not fall instantly. The user should be able to see their piece fall to the bottom over time.
5. For simplicity, while a piece is falling, the board should completely lock up, preventing users from placing any further pieces. The board will only allow more pieces to fall again once the latest piece has fallen as far as possible.
6. If the board completely fills with pieces without a winner being found, the game ends in a draw.
7. Once the game is over, a message should display to indicate whether a player won, or a tie happened.

You are free to use any tools and libraries you want, but a dedicated state management library would likely be overkill for this. Consider solving this with React's built-in state management tools.

Bonus: keep an eye on HTML semantics and accessibility.

## Extra specifications

### "Dropper" Button

These are the buttons that a player can click to drop a piece into the game board.

- When the mouse hovers over this button, the color of the button should change to indicate the current player.
- When a column is completely full, the button should indicate that it can't be interacted with in any way (such as by hiding the button altogether)

## Extensions

Each of these can be done independently.

Note: To be clear, I did not do any of these. I just thought they'd be interesting wrinkles on the original prompt.

1. If you haven't already, try to rebuild the React application so that the pieces fall via CSS transformations. Doing so would not only allow the animations to be GPU-accelerated (drastically improving frame rate), but also minimize re-renders on React's end.
2. Try to build the app so that it can preemptively figure out when a game is impossible to win, without forcing players to do the busy work of filling the board completely.
3. Program the game so that users are free to keep dropping pieces while other pieces are already falling.
4. For even greater accessibility, make sure that the app is fully playable with a keyboard, and even use a screen reader to see what the experience of playing the game would be like for someone who has a sight disability.
5. Make the board fully responsive.
   - Hint 1: Because the width of the game will be fluid, you will want to set up something for React to "subscribe" to changes in the width of the pieces, so that it can automatically update their height to match. You don't need an external library for this – the browser API provides a really nice tool.
   - Hint 2: `useEffect` will be too slow for an update like this, because React will always render the UI incorrectly, run the effect asynchronously to update the state, then update the state to be correct. This will cause a brief UI flicker, which makes things feel janky. Even `useLayoutEffect` might be too slow, if you're not careful about when you call things. Be very careful about **when** you change the height of your elements.

## Hints

Highly recommend that you solve as much of this exercise on your own as you can, but here are some hints:

1. There's nothing stopping you from using as many types of hooks as you want, but the Minimum Viable Product (MVP) version of this challenge should be solvable with just `useState` and `useEffect`.
2. It can be helpful to identify what "game events" (not browser events) can happen, and how your app's state needs to update itself in response to them. There can be "active" events triggered by the user (e.g., when they click something), but there can also be "passive" events that happen with no user input. What events trigger as a result of another event happening?
3. On a similar note, it can be helpful to identify what kinds of "statuses" the game can be in at any given time. What statuses can the game be in while a game is ongoing, and what statuses can it have when a game finally ends?
4. If you are making the pieces fall entirely through JavaScript/React logic (no CSS transforms), ask yourself: what has to change each time a piece falls by a single space? It might be more state than you think.
5. If you're running into weird behavior when hovering your mouse over the dropper buttons, you might want to research if you're using the right mouse events. There are some mouse events that have very similar names, but different overall behavior.
6. When making the logic for detecting whether someone has won, it can help to break down the logic for scanning the game board down into discrete "phases". You can start by scanning things horizontally, then vertically, and then eventually build up to scanning things diagonally.
7. If you do decide to make multiple components for your solution, ask yourself: "what is the bare minimum that this new component cares about?" For example, if you decide to a make a component for the drop button, does it actually care about the game state, or does it just care about things like what fill color it should use, and whether it's disabled? Thinking through the "API contracts" of all your components is something you should be doing in general as a React developer.

## What I used for my solution

### Hooks

- `useReducer` - For helping me organize the logic for the core game state better than `useState` would be able to
- `useState` - For handling simpler UI state that doesn't directly pertain to game state
- `useEffect` - For handling timeout logic to make "passive" state changes happen over time
- `useId` - Not required; just helps with accessibility
- `useCallback` - Not really necessary; I use it out of habit for custom hooks, just to ensure that exported functions maintain stable references

### Libraries

- Tailwind
- Class Variance Authority (to simplify mapping state to Tailwind styles)
- Radix UI's VisuallyHidden component (strictly for accessibility)
