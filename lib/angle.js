// ****** Find The Angle Of Rotation Between Two Sprites ****** \\
// it returns the angle of rotation in radiians.
// You can apply it to a sprite's rotation property to make the sprite rotate

// towards another sprite or the pointer like this:
// let box;
// box.rotation = angle(box, pointer);

export function angle(s1, s2) {
  return Math.atan2(s2.centerY - s1.centerY, s2.centerx - s1.centerX);
}
