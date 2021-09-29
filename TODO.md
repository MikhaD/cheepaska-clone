## To Do
- [x] Stop balls from thinking they're being colided with the back of the cue
- [x] Give balls shadows
- [x] Create a game class that can be initialized with all the variable data such as radius, line width, debug mode etc
- [x] Add power levels (35 levels)
- [x] Add power level indicator
- [ ] Add cue instead of line behind ball
- [ ] Add next trajectory line for the ball after collision
- [ ] Add trajectory to hit ball
- [ ] Recursively add trajectories to all balls assuing no other balls move
- [ ] Implement shooting
- [ ] Implement friction
- [ ] Take velocities of other balls into account when calculating trajectories

## Technical debt
- [x] Add the event listeners to a larger main element or to body to allow releasing from off the board
- [x] Seperate javascript into semantic classes
- [x] Use squared values instead of the sqrt function wherever possible to improve speed
- [x] Make balls array into a static variable of the Ball class
- [ ] Make ball array into a property of the game class