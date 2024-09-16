let SCREEN_WIDTH = 800;
let SCREEN_HEIGHT = 800;
let FPS = 13;
let snake, apple, grid_size = 40;
let TitleScreen, TitleScreen2, bgImage, startBtn, exitBtn, easyBtn, normalBtn, hardBtn;
let mainscreen = true, titlescreen = true, running = false;

let UP = [0, -1], DOWN = [0, 1], LEFT = [-1, 0], RIGHT = [1, 0];

function preload() {
  TitleScreen = loadImage('images/TitleScreen.png');
  TitleScreen2 = loadImage('images/TitleScreen2.png');
  bgImage = loadImage('images/background.png');
  startImg = loadImage('images/play.png');
  exitImg = loadImage('images/exit.png');
  easyImg = loadImage('images/easy.png');
  normalImg = loadImage('images/normal.png');
  hardImg = loadImage('images/hard.png');
}

function setup() {
  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  frameRate(10);

//   startBtn = new Button(249, 100, startImg, 1.5);
//   exitBtn = new Button(250, 500, exitImg, 1.5);
//   easyBtn = new Button(50, 300, easyImg);
//   normalBtn = new Button(300, 300, normalImg);
//   hardBtn = new Button(550, 300, hardImg);
  
  snake = new Snake();
  apple = new Apple(grid_size);
}

function draw() {
  if (titlescreen) {
    handleTitleScreen();
  }
//    else if (mainscreen) {
//     handleMainScreen();
    
//   }
   else if (running) {
    runGame();
  }
}

function handleTitleScreen() {
  image(TitleScreen, 0, 0);
  if (frameCount % 10 < 5) {
    image(TitleScreen2, 0, 0);
  }

  if (keyIsPressed && key === ' ') {
    titlescreen = false;
    running = true;
  }
}

// function handleMainScreen() {
//   image(bgImage, 0, 0);
//   startBtn.draw();
//   exitBtn.draw();
//   easyBtn.draw();
//   normalBtn.draw();
//   hardBtn.draw();

//   console.log('Main screen');
  
//   if (startBtn.clicked()) {
//     mainscreen = false;
//     running = true;
//   }
  
//   if (exitBtn.clicked()) {
//     exit();
//   }

//   if (easyBtn.clicked()) {
//     grid_size = 50;
//     snake.change_size(grid_size);
//     apple = new Apple(grid_size);
//     FPS = 8;
//   }
  
//   if (normalBtn.clicked()) {
//     grid_size = 40;
//     snake.change_size(grid_size);
//     apple = new Apple(grid_size);
//     FPS = 13;
//   }

//   if (hardBtn.clicked()) {
//     grid_size = 20;
//     snake.change_size(grid_size);
//     apple = new Apple(grid_size);
//     FPS = 20;
//   }
// }

function runGame() {
  background(255);
  image(bgImage, 0, 0);

  if (snake.update()) {
    resetGame();
  }

  snake.draw();
  apple.draw();
  
  fill(0);
  textSize(40);
  textAlign(CENTER);
  text(`SCORE: ${snake.size - 1}`, 682, 50);
}

function keyPressed() {
  if (keyCode === UP_ARROW && snake.direction !== DOWN) {
    snake.direction = UP;
  } else if (keyCode === DOWN_ARROW && snake.direction !== UP) {
    snake.direction = DOWN;
  } else if (keyCode === LEFT_ARROW && snake.direction !== RIGHT) {
    snake.direction = LEFT;
  } else if (keyCode === RIGHT_ARROW && snake.direction !== LEFT) {
    snake.direction = RIGHT;
  }
}

class Button {
  constructor(x, y, img, scale = 1) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.width = img.width * scale;
    this.height = img.height * scale;
  }

  draw() {
    image(this.img, this.x, this.y, this.width, this.height);
  }

  clicked() {
   if (mouseIsPressed &&
        mouseX >= this.x && mouseX <= this.x + this.width &&
        mouseY >= this.y && mouseY <= this.y + this.height) {
        // console.log('Button clicked');
      return true;
    }
    return false;
  }
}


class Snake {
  constructor() {
    this.size = 1;
    this.GRID_SIZE = grid_size;
    this.position = [[floor(width / 2), floor(height / 2)]];
    this.direction = random([UP, DOWN, LEFT, RIGHT]);
  }

  change_size(size) {
    this.GRID_SIZE = size;
  }

  update() {
    let head = this.position[0];
    let dirX = this.direction[0];
    let dirY = this.direction[1];
    let newHead = [(head[0] + dirX * this.GRID_SIZE) % width, (head[1] + dirY * this.GRID_SIZE) % height];

    if (this.position.some(p => p[0] === newHead[0] && p[1] === newHead[1]) && this.position.length > 4) {
      console.log('Game Over');
      return true;
    }
    this.position.unshift(newHead);
    if (this.position.length > this.size) {
      this.position.pop();
    }
    // console.log(this.position[0], this.position[1]);
    
    if (head[0] === apple.position[0] && head[1] === apple.position[1]) {
      this.size++;
      apple.position = apple.randomPosition();
    }

    if (this.position[0][0] < 0) {
      this.position[0][0] = width;
    }
    if (this.position[0][1] < 0) {
      this.position[0][1] = height;
    }


}



  draw() {
    for (let i = 0; i < this.position.length; i++) {
      let pos = this.position[i];
      fill(i === 0 ? 'green' : 'darkgreen');
      rect(pos[0], pos[1], this.GRID_SIZE, this.GRID_SIZE);
    }
  }
}

class Apple {
  constructor(GRID_SIZE = 40) {
    this.GRID_SIZE = GRID_SIZE;
    this.position = this.randomPosition();
  }

  randomPosition() {
    let posX = floor(random(0, width / this.GRID_SIZE)) * this.GRID_SIZE;
    let posY = floor(random(0, height / this.GRID_SIZE)) * this.GRID_SIZE;
    // console.log(posX, posY);
    return [posX, posY];
  }

  draw() {
    fill('red');
    rect(this.position[0], this.position[1], this.GRID_SIZE, this.GRID_SIZE);
  }
}

function resetGame() {
  titlescreen = true;
  mainscreen = false;
  running = false;
  snake = new Snake();
  apple = new Apple(grid_size);
}
