## To Do
- [ ] Stop balls from thinking they're being colided with the back of the cue
- [ ] Give balls shadows
- [ ] Add power levels (35 levels)
- [ ] Add power level indicator
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
