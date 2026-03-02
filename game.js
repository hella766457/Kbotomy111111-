const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 🔥 먼저 캔버스 크기 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 64;

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

canvas.addEventListener("pointerdown", (e) => {
  const rect = canvas.getBoundingClientRect();
  target = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}, { passive: false });

function isWall(x, y) {
  let tileX = Math.floor(x / tileSize);
  let tileY = Math.floor(y / tileSize);

  if (!map[tileY] || map[tileY][tileX] === undefined) return true;
  return map[tileY][tileX] === 1;
}

function update() {
  if (target) {
    let dx = target.x - player.x;
    let dy = target.y - player.y;
    let dist = Math.hypot(dx, dy);

    if (dist > 3) {
      let nextX = player.x + (dx / dist) * player.speed;
      let nextY = player.y + (dy / dist) * player.speed;

      // 🔥 충돌 체크 (네 귀퉁이)
      if (
        !isWall(nextX, nextY) &&
        !isWall(nextX + player.size, nextY) &&
        !isWall(nextX, nextY + player.size) &&
        !isWall(nextX + player.size, nextY + player.size)
      ) {
        player.x = nextX;
        player.y = nextY;
      }
    } else {
      target = null;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🔥 맵 그리기 (여기서!)
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {

      if (map[y][x] === 1) ctx.fillStyle = "#555";
      else if (map[y][x] === 0) ctx.fillStyle = "#222";
      else if (map[y][x] === 2) ctx.fillStyle = "brown";

      ctx.fillRect(
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
    }
  }

  // 🔥 플레이어
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

let target = null;

canvas.addEventListener("pointerdown", (e) => {
  e.preventDefault();   // 🔥 기본 터치 동작 차단

  const rect = canvas.getBoundingClientRect();

  target = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };

  console.log("터치 인식됨", target); // 디버그용
}, { passive: false });

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
    let nextX = player.x + (dx / distance) * player.speed;
let nextY = player.y + (dy / distance) * player.speed;

// 플레이어 네 귀퉁이 검사
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
function isWall(x, y) {
  let tileX = Math.floor(x / tileSize);
  let tileY = Math.floor(y / tileSize);

  if (!map[tileY] || map[tileY][tileX] === undefined) return true;

  return map[tileY][tileX] === 1;
}

loop();
