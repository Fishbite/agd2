export function curvedText(context, str, centerX, centerY, radius, angle) {
  context.save();
  context.translate(centerX, centerY);
  context.rotate((-1 * angle) / 2);
  context.rotate((-1 * (angle / str.length)) / 2);
  for (var n = 0; n < str.length; n++) {
    context.rotate(angle / str.length);
    context.save();
    context.translate(0, -1 * radius);
    var char = str[n];
    context.fillText(char, 0, 0);
    context.restore();
  }
  context.restore();
}
/*
window.onload = function () {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  context.font = "30pt Arial";
  context.textAlign = "center";

  var centerX = canvas.width / 2;
  var centerY = canvas.height - 30;
  var angle = Math.PI * 0.5; // radians
  var radius = 100;
  curvedText(context, "Your Text Here", centerX, centerY, radius, angle);
};
*/
