const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 640;
canvas.height = 480;

let player = {
  x: 300,
  y: 220,
  size: 32,
  speed: 2
};

let target = null;

// PC 클릭
canvas.addEventListener("click", function(e) {
  const rect = canvas.getBoundingClientRect();
  target = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
});

// 모바일 터치
canvas.addEventListener("touchstart", function(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  target = {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top
  };
});

function update() {
  if (target) {
    let dx = target.x - player.x;
    let dy = target.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      player.x += (dx / distance) * player.speed;
      player.y += (dy / distance) * player.speed;
    } else {
      target = null; // 도착하면 멈춤
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
