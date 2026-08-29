// ============================================================
// 기본 설정
// ============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 64;


// ============================================================
// 맵
// ============================================================

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


// ============================================================
// 플레이어
// ============================================================

const player = {

  x: 200,
  y: 200,

  size: 32,

  speed: 4

};


// ============================================================
// 이벤트 / NPC
// ============================================================

const events = [

  {
    x: 5,
    y: 3,

    type: "npc",

    name: "???",

    // NPC와 대화했을 때 나오는 대사
    dialogue: [

      "돌아온 걸 환영해."

      // ↓↓↓
      // 여기에 대사를 추가하면
      // 화면을 클릭할 때마다 다음 대사가 나옴.

      // "두 번째 대사.",
      // "세 번째 대사.",
      // "네 번째 대사."

    ]
  }

];


// ============================================================
// 이동 목표
// ============================================================

let target = null;


// ============================================================
// 대화 버튼
// ============================================================

const talkButton = document.createElement("button");

talkButton.innerText = "대화";

talkButton.style.position = "fixed";

talkButton.style.left = "20px";
talkButton.style.bottom = "20px";

talkButton.style.width = "100px";
talkButton.style.height = "55px";

talkButton.style.fontSize = "20px";

talkButton.style.zIndex = "10";

talkButton.style.display = "none";

document.body.appendChild(talkButton);


// ============================================================
// 대화 시스템
// ============================================================

const Dialogue = {

  // 현재 대화 중인지
  active: false,

  // 현재 대화하고 있는 NPC
  npc: null,

  // 현재 몇 번째 대사인지
  index: 0,

  // 대화창
  box: document.createElement("div"),

  // 선택지 버튼
  choices: [
    document.createElement("button"),
    document.createElement("button")
  ],


  // ----------------------------------------------------------
  // 대화 시스템 초기화
  // ----------------------------------------------------------

  init() {


    // ========================================================
    // 대화창 설정
    // ========================================================

    this.box.style.position = "fixed";

    this.box.style.left = "50%";
    this.box.style.bottom = "40px";

    this.box.style.transform = "translateX(-50%)";

    this.box.style.width = "80%";
    this.box.style.maxWidth = "600px";

    this.box.style.minHeight = "100px";

    this.box.style.boxSizing = "border-box";

    this.box.style.background = "rgba(0, 0, 0, 0.9)";

    this.box.style.border = "2px solid white";

    this.box.style.borderRadius = "8px";

    this.box.style.color = "white";

    this.box.style.padding = "20px";

    this.box.style.fontSize = "20px";

    this.box.style.zIndex = "20";

    this.box.style.display = "none";

    this.box.style.userSelect = "none";


    document.body.appendChild(this.box);


    // ========================================================
    // 선택지 설정
    // ========================================================

    this.choices[0].innerText = "너가 누구야?";
    this.choices[1].innerText = "나도.";


    for (let i = 0; i < this.choices.length; i++) {

      const button = this.choices[i];


      button.style.position = "fixed";

      button.style.right = "30px";

      button.style.bottom =
        (160 - i * 60) + "px";

      button.style.width = "180px";

      button.style.height = "45px";

      button.style.fontSize = "16px";

      button.style.zIndex = "30";

      button.style.display = "none";


      // 선택지를 눌렀을 때
      button.addEventListener("pointerdown", (e) => {

        e.stopPropagation();

        this.select(i);

      });


      document.body.appendChild(button);

    }


    // ========================================================
    // 대화창을 클릭하면 다음 대사
    // ========================================================

    this.box.addEventListener("pointerdown", (e) => {

      e.stopPropagation();

      // 선택지가 떠 있으면 아무것도 하지 않음
      if (this.choicesVisible()) return;

      this.next();

    });

  },


  // ----------------------------------------------------------
  // 대화 시작
  // ----------------------------------------------------------

  start(npc) {

    this.active = true;

    this.npc = npc;

    this.index = 0;

    target = null;

    talkButton.style.display = "none";

    this.box.style.display = "block";

    this.show();

  },


  // ----------------------------------------------------------
  // 현재 대사 표시
  // ----------------------------------------------------------

  show() {

    this.box.innerText =
      this.npc.dialogue[this.index];

  },


  // ----------------------------------------------------------
  // 다음 대사
  // ----------------------------------------------------------

  next() {

    if (!this.active) return;


    // 다음 대사로 이동
    this.index++;


    // 아직 대사가 남아 있다면
    if (this.index < this.npc.dialogue.length) {

      this.show();

      return;

    }


    // 모든 대사가 끝났다면
    // 선택지를 보여줌

    this.showChoices();

  },


  // ----------------------------------------------------------
  // 선택지 보여주기
  // ----------------------------------------------------------

  showChoices() {

    for (const button of this.choices) {

      button.style.display = "block";

    }

  },


  // ----------------------------------------------------------
  // 선택지 선택
  // ----------------------------------------------------------

  select(choice) {


    // 선택지를 숨김

    for (const button of this.choices) {

      button.style.display = "none";

    }


    // ========================================================
    // 선택지 1
    // "너가 누구야?"
    // ========================================================

    if (choice === 0) {

      // ⭐ [선택지 1]
      // "너가 누구야?"를 골랐을 때 나오는 내용
      //
      // ↓↓↓ 원하는 대사를 여기에 넣으면 됨.

      this.box.innerText =
        "아, 안타깝네. 유감이지만 넌 알아야만 했거든.";

    }


    // ========================================================
    // 선택지 2
    // "나도."
    // ========================================================

    else if (choice === 1) {

      // ⭐ [선택지 2]
      // "나도."를 골랐을 때 나오는 내용
      //
      // ↓↓↓ 원하는 대사를 여기에 넣으면 됨.

      this.box.innerText =
        "응, 좋은 시간 보내.";

    }


    // 선택 결과를 보여주는 상태
    this.index = -1;

  },


  // ----------------------------------------------------------
  // 선택지가 현재 보이는지 확인
  // ----------------------------------------------------------

  choicesVisible() {

    return this.choices.some(button => {

      return button.style.display === "block";

    });

  },


  // ----------------------------------------------------------
  // 대화 종료
  // ----------------------------------------------------------

  end() {

    this.active = false;

    this.npc = null;

    this.index = 0;

    this.box.style.display = "none";


    for (const button of this.choices) {

      button.style.display = "none";

    }

  }

};


// 대화 시스템 시작

Dialogue.init();


// ============================================================
// NPC와 가까운지 확인
// ============================================================

function getNearbyNPC() {

  for (const event of events) {

    // NPC가 아니면 무시
    if (event.type !== "npc") continue;


    // NPC의 중심 좌표

    const npcX =
      event.x * tileSize + tileSize / 2;

    const npcY =
      event.y * tileSize + tileSize / 2;


    // 플레이어의 중심 좌표

    const playerX =
      player.x + player.size / 2;

    const playerY =
      player.y + player.size / 2;


    // 두 점 사이의 거리

    const distance = Math.hypot(

      npcX - playerX,

      npcY - playerY

    );


    // NPC와 충분히 가까우면
    // 해당 NPC를 반환

    if (distance < 90) {

      return event;

    }

  }


  // 근처에 NPC가 없음

  return null;

}


// ============================================================
// 벽 판정
// ============================================================

function isWall(x, y) {

  const tileX =
    Math.floor(x / tileSize);

  const tileY =
    Math.floor(y / tileSize);


  // 맵 밖은 벽으로 취급

  if (
    !map[tileY] ||
    map[tileY][tileX] === undefined
  ) {

    return true;

  }


  // 1이면 벽

  return map[tileY][tileX] === 1;

}


// ============================================================
// 터치 이동
// ============================================================

canvas.addEventListener("pointerdown", (e) => {

  e.preventDefault();


  // 대화 중이라면
  // 이동하지 않고 다음 대사로 넘어감

  if (Dialogue.active) {

    Dialogue.next();

    return;

  }


  // 터치한 위치 계산

  const rect =
    canvas.getBoundingClientRect();


  target = {

    x: e.clientX - rect.left,

    y: e.clientY - rect.top

  };

}, { passive: false });


// ============================================================
// 대화 버튼
// ============================================================

talkButton.addEventListener("pointerdown", (e) => {

  e.preventDefault();

  e.stopPropagation();


  const npc = getNearbyNPC();


  // NPC가 근처에 없다면 아무것도 안 함

  if (!npc) return;


  // 대화 시작

  Dialogue.start(npc);

});


// ============================================================
// 업데이트
// ============================================================

function update() {


  // ==========================================================
  // 대화 중이라면 이동하지 않음
  // ==========================================================

  if (Dialogue.active) {

    return;

  }


  // ==========================================================
  // 플레이어 이동
  // ==========================================================

  if (target) {

    const dx =
      target.x - player.x;

    const dy =
      target.y - player.y;

    const dist =
      Math.hypot(dx, dy);


    // 목적지에 도착

    if (dist < 3) {

      target = null;

    }


    else {

      const nextX =
        player.x +
        (dx / dist) *
        player.speed;


      const nextY =
        player.y +
        (dy / dist) *
        player.speed;


      // 플레이어의 네 귀퉁이 충돌 검사

      if (

        !isWall(nextX, nextY) &&

        !isWall(
          nextX + player.size,
          nextY
        ) &&

        !isWall(
          nextX,
          nextY + player.size
        ) &&

        !isWall(
          nextX + player.size,
          nextY + player.size
        )

      ) {

        player.x = nextX;

        player.y = nextY;

      }

    }

  }


  // ==========================================================
  // NPC 근처 확인
  // ==========================================================

  const nearbyNPC =
    getNearbyNPC();


  if (nearbyNPC) {

    // NPC가 가까우면 대화 버튼 표시

    talkButton.style.display = "block";

  }

  else {

    // 멀어지면 대화 버튼 숨김

    talkButton.style.display = "none";

  }

}


// ============================================================
// 그리기
// ============================================================

function draw() {


  // ==========================================================
  // 화면 초기화
  // ==========================================================

  ctx.clearRect(

    0,
    0,
    canvas.width,
    canvas.height

  );


  // ==========================================================
  // 맵 그리기
  // ==========================================================

  for (
    let y = 0;
    y < map.length;
    y++
  ) {

    for (
      let x = 0;
      x < map[y].length;
      x++
    ) {


      // 벽

      if (map[y][x] === 1) {

        ctx.fillStyle = "#555";

      }


      // 바닥

      else if (map[y][x] === 0) {

        ctx.fillStyle = "#222";

      }


      // 문

      else if (map[y][x] === 2) {

        ctx.fillStyle = "brown";

      }


      ctx.fillRect(

        x * tileSize,

        y * tileSize,

        tileSize,

        tileSize

      );

    }

  }


  // ==========================================================
  // NPC 그리기
  // ==========================================================

  for (const event of events) {

    if (event.type !== "npc") continue;


    ctx.fillStyle = "red";


    ctx.fillRect(

      event.x * tileSize + 16,

      event.y * tileSize + 16,

      32,

      32

    );

  }


  // ==========================================================
  // 플레이어 그리기
  // ==========================================================

  ctx.fillStyle = "white";


  ctx.fillRect(

    player.x,

    player.y,

    player.size,

    player.size

  );

}


// ============================================================
// 게임 루프
// ============================================================

function loop() {

  update();

  draw();

  requestAnimationFrame(loop);

}


// 게임 시작

loop();
