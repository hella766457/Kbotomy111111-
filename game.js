const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 캔버스 크기
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 64;

// 0 = 바닥
// 1 = 벽
// 2 = 문
const map = [
  [1,1,2,2,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1],
];

let player = {
  x: 200,
  y: 200,
  size: 32,
  speed: 4
};

let target = null;

// 터치 이동
canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  target = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}, { passive: false });

// 벽 판정
function isWall(x, y) {
  let tileX = Math.floor(x / tileSize);
  let tileY = Math.floor(y / tileSize);

  if (!map[tileY] || map[tileY][tileX] === undefined) return true;

  return map[tileY][tileX] === 1;
}

function update() {
  if (!target) return;

  let dx = target.x - player.x;
  let dy = target.y - player.y;
  let dist = Math.hypot(dx, dy);

  if (dist < 3) {
    target = null;
    return;
  }

  let nextX = player.x + (dx / dist) * player.speed;
  let nextY = player.y + (dy / dist) * player.speed;

  // 네 귀퉁이 충돌 체크
  if (
    !isWall(nextX, nextY) &&
    !isWall(nextX + player.size, nextY) &&
    !isWall(nextX, nextY + player.size) &&
    !isWall(nextX + player.size, nextY + player.size)
  ) {
    player.x = nextX;
    player.y = nextY;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 맵 그리기
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {

      if (map[y][x] === 1) ctx.fillStyle = "#555";      // 벽
      else if (map[y][x] === 0) ctx.fillStyle = "#222"; // 바닥
      else if (map[y][x] === 2) ctx.fillStyle = "brown"; // 문

      ctx.fillRect(
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
    }
  }

  // 플레이어
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
