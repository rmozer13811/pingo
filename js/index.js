const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const barksound = new Audio();
barksound.src = "./sounds/bark.mp3.mp3";
barksound.volume = 0.4;

class GameObject {
  constructor(x, y, width, height, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
    this.speedX = 0;
    this.speedY = 0;
  }

  updatePosition() {
    this.x += this.speedX;

    this.y += this.speedY;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  crashWith(obstacle) {
    return !(
      this.bottom() - 5 < obstacle.top() ||
      this.top() + 25 > obstacle.bottom() ||
      this.right() - 50 < obstacle.left() ||
      this.left() + 25 > obstacle.right()
    );
  }
}

class Player extends GameObject {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }
  updatePosition() {
    if (this.x <= 0) {
      this.x = 0;
    }
    if (this.y <= 0) {
      this.y = 0;
    }
    if (this.x >= canvas.width - this.width) {
      this.x = canvas.width - this.width;
    }

    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
    }

    this.x += this.speedX;

    this.y += this.speedY;
  }
}

class BackgroundImage extends GameObject {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
    this.speedX = -3;
  }

  updatePosition() {
    this.x += this.speedX;
    this.x %= canvas.width;
  }

  draw() {
    console.log(this.img);
    ctx.drawImage(this.img, this.x, 0, this.width, this.height);
    ctx.drawImage(this.img, this.x + canvas.width, 0, this.width, this.height);
  }
}

const shampoo = new Image();
shampoo.src = "../images/pngwing.com.png";

class Obstacle extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.x = 1200;
    this.y = Math.floor(Math.random() * 600 - 100 - height) + height;
    this.speedX = -7;
    this.speedY = 0;
    this.img = shampoo;
    this.width = 100;
  }
}

class Game {
  constructor(background, player) {
    this.background = background;
    this.player = player;
    this.obstacles = [];
    this.frames = 0;
    this.score = 0;
    this.animationId;
  }

  start = () => {
    this.updateGame();
  };

  updateGame = () => {
    this.clear();

    this.background.updatePosition();
    this.background.draw();

    this.player.updatePosition();
    this.player.draw();

    this.updateObstacles();

    this.updateScore();

    this.animationId = requestAnimationFrame(this.updateGame);

    this.checkGameOver();
  };

  updateObstacles = () => {
    this.frames++;

    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].updatePosition();
      this.obstacles[i].draw();
    }

    if (this.frames % 40 === 0) {
      const obstacle = new Obstacle(this.x, this.y, 75, 150);

      this.obstacles.push(obstacle);

      this.score++;
    }
  };

  checkGameOver = () => {
    const crashed = this.obstacles.some((obstacle) => {
      return this.player.crashWith(obstacle);
    });

    if (crashed) {
      barksound.play();

      cancelAnimationFrame(this.animationId);

      this.gameOver();
    }
  };

  updateScore() {
    ctx.font = "30px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText(`Score: ${this.score}`, 80, 40);
  }

  gameOver() {
    ctx.fillStyle = "black";
    ctx.font = "60px Verdana";
    ctx.fillText("Game Over!", 400, 100);

    ctx.font = "30px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText(`Your Final Score: ${this.score}`, 435, 150);
  }

  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

function startGame() {
  const bgImg = new Image();
  bgImg.src = "../images/background.png";

  const playerImg = new Image();
  playerImg.src = "../images/Caxorro-salsixa-1.png.png";

  const backgroundImage = new BackgroundImage(
    0,
    0,
    canvas.width,
    canvas.height,
    bgImg
  );
  const player = new Player(50, 300, 100, 100, playerImg);

  const game = new Game(backgroundImage, player);

  game.start();

  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
      game.player.speedX = -10;
    } else if (event.code === "ArrowRight") {
      game.player.speedX = 10;
    } else if (event.code === "ArrowUp") {
      game.player.speedY = -10;
    } else if (event.code === "ArrowDown") {
      game.player.speedY = 10;
    }
  });

  document.addEventListener("keyup", () => {
    game.player.speedX = 0;
    game.player.speedY = 0;
  });
}

window.onload = () => {
  const startbtn = document.getElementById("start-button");
  startbtn.onclick = () => {
    startbtn.blur();
    startGame();
  };
};
