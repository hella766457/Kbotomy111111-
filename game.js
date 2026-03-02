const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 🔥 화면 크기에 맞게 자동 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 32,
  speed: 4
};

let target = null;

// 🔥 PC + 모바일 완전 통합 입력
canvas.addEventListener("pointerdown", (e) => {
  const rect = canvas.getBoundingClientRect();

  target = {
    x: (e.clientX - rect.left),
    y: (e.clientY - rect.top)
  };
});

function update() {
  if (target) {
    let dx = target.x - player.x;
    let dy = target.y - player.y;
    let distance = Math.hypot(dx, dy);

    if (distance > 3) {
      player.x += (dx / distance) * player.speed;
      player.y += (dy / distance) * player.speed;
    } else {
      target = null;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
