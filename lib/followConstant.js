// ****** Follow At Constant Speed ****** \\
// note: the speed value shoud be the number of pixels you want the
// follower to move at i.e. 3 = 3 pixels per frame
export function followConstant(follwer, leader, speed) {
  // figure out the distance between sprites:
  let vx = leader.centerX - follower.centerX;
  let vy = leader.centerY - follower.centerY;
  distance = Math.sqrt(vx * vx + vy * vy);

  // move the follower if it is more than one move away from the leader:
  if (distance > speed) {
    follower.x += (vx / distance) * speed;
    follower.y += (vy / distance) * speed;
  }
}
