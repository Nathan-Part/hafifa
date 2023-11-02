var canvas = document.getElementById("snake");
var canvas2d = canvas.getContext("2d");
var boardGame = document.getElementById('game')
var gameEnded = false;
document.getElementById('bestscore').innerText = localStorage.getItem('bestScore');

// size
canvas.width = 600;
canvas.height = 600;

// length of the snake
var snakeSegments = [];
var snakeLength = 1;
var score = 0;

// food
var dots = [];
var maxNumberOfDots = 10;

// equipment
var money = localStorage.getItem('money');
var displayMoney = document.getElementById('money');
displayMoney.innerText = money;

// localStorage.setItem('skins', null);
var skins = JSON.parse(localStorage.getItem('skins')) || ['skin0'];
var skin = localStorage.getItem('currentSkin') || 'skin0';

var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');

function checkButton()
{

  if(skins.includes('skin0'))
  {
    if(skin == "skin0")
    {
      button1.style.backgroundColor = "inherit";
      button1.style.color = "green";
      button1.style.border = "inherit";
      button1.style.fontWeight = "inherit";
      button1.innerText = "Selected";
    }
    else
    {
      button1.style.backgroundColor = "#007bff";
      button1.style.color = "#fff";
      button1.style.border = "1px solid #007bff";
      button1.style.fontWeight = "bold";
      button1.innerText = "Select";
    }
  }
  
  if(skins.includes('skin1'))
  {
    if(skin == "skin1")
    {
      button2.style.backgroundColor = "inherit";
      button2.style.color = "green";
      button2.style.border = "inherit";
      button2.style.fontWeight = "inherit";
      button2.innerText = "Selected";
    }
    else
    {
      button2.style.backgroundColor = "#007bff";
      button2.style.color = "#fff";
      button2.style.border = "1px solid #007bff";
      button2.style.fontWeight = "bold";
      button2.innerText = "Select";
    }
  } 
}

checkButton();

// position X and Y
var snakeX = 0;
var snakeY = 0;

// direction
var directionX = 10;
var directionY = 0;

// menu
var widthSelected = document.getElementById('width');
widthSelected.addEventListener('input', function() {
    var value = widthSelected.value;
    canvas.width = value;
    boardGame.style.width = value + "px";
});

var heightSelected = document.getElementById('height');
heightSelected.addEventListener('input', function() {
    var value = heightSelected.value;
    canvas.height = value;
    boardGame.style.height = value + "px";
});

var numberDots = document.getElementById('dots');
numberDots.addEventListener('input', function() {
    var value = numberDots.value;
    maxNumberOfDots = value;
});

var label = document.getElementById('title-difficulty');
var smiley = document.getElementById('smiley');
var difficulty = document.getElementById('difficulty');
difficulty.addEventListener('change', function() {
  var value = difficulty.value;
  switch (value) {
    case "1":
      // size
      canvas.width = 600;
      canvas.height = 600;
      
      // value on the input
      widthSelected.value = 600;
      heightSelected.value = 600;

      //set the with of board game 
      boardGame.style.width = "600px";
      boardGame.style.height = "600px";

      //number of dots
      maxNumberOfDots = 10;
      numberDots.value = 10;

      //smiley 
      smiley.innerText = "Easy 😄";
      label.appendChild(smiley);

    break;
    case "2":
       // size
       canvas.width = 400;
       canvas.height = 400;
       
       // value on the input
       widthSelected.value = 400;
       heightSelected.value = 400;
    
      //set the with of board game 
      boardGame.style.width = "400px";
      boardGame.style.height = "400px";
 
       //number of dots
       maxNumberOfDots = 5;
       numberDots.value = 5;
 
       //smiley 
       smiley.innerText = "Medium 😅";
       label.appendChild(smiley);
    break;
    case "3":
      // size
      canvas.width = 300;
      canvas.height = 300;
      
      // value on the input
      widthSelected.value = 300;
      heightSelected.value = 300;

      //set the with of board game 
      boardGame.style.width = "300px";
      boardGame.style.height = "300px";

      //number of dots
      maxNumberOfDots = 3;
      numberDots.value = 3;

      //smiley 
      smiley.innerText = "Hard 😭";
      label.appendChild(smiley);
    break;
    case "4":
      // size
      canvas.width = 200;
      canvas.height = 200;
      
      // value on the input
      widthSelected.value = 200;
      heightSelected.value = 200;
      
      //set the with of board game 
      boardGame.style.width = "200px";
      boardGame.style.height = "200px";

      //number of dots
      maxNumberOfDots = 1;
      numberDots.value = 1;

      //smiley 
      smiley.innerText = "Je peux pas 🥵";
      label.appendChild(smiley);
    break;
  }
});

// control the snake
document.onkeydown = function(event) {
  switch (event.keyCode) {
    case 37: // Left arrow
    case 81: // Q
      if (directionX !== 10) {
        directionX = -10;
        directionY = 0;
      }
      break;
    case 38: // Up arrow
    case 90: // Z
      if (directionY !== 10) {
        directionX = 0;
        directionY = -10;
      }
      break;
    case 39: // Right arrow
    case 68: // D
      if (directionX !== -10) {
        directionX = 10;
        directionY = 0;
      }
      break;
    case 40: // Down arrow
    case 83: // S
      if (directionY !== -10) {
        directionX = 0;
        directionY = 10;
      }
      break;
  }
};

function moveSnake() {
  snakeSegments.unshift({ x: snakeX, y: snakeY }); // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
  snakeX += directionX;
  snakeY += directionY;
}

function drawSnake() {
    canvas2d.clearRect(0, 0, canvas.width, canvas.height); // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/clearRect
    if(score <= 5)
    {
      if(skin == "skin0")
      {
        canvas2d.fillStyle = "black";
      }
      else if(skin == "skin1")
      {
        canvas2d.strokeStyle = "black";
      }
    }
    else if(score <= 10)
    {
      if(skin == "skin0")
      {
        canvas2d.fillStyle = "blue";
      }
      else if(skin == "skin1")
      {
        canvas2d.strokeStyle = "blue";
      }
    }
    else if(score <= 15)
    {
      if(skin == "skin0")
      {
        canvas2d.fillStyle = "green";
      }
      else if(skin == "skin1")
      {
        canvas2d.strokeStyle = "green";
      }
    }
    else if(score <= 20)
    {
      if(skin == "skin0")
      {
        canvas2d.fillStyle = "white";
      }
      else if(skin == "skin1")
      {
        canvas2d.strokeStyle = "white";
      }
    }
    else if(score <= 25)
    {
      if(skin == "skin0")
      {
        canvas2d.fillStyle = "yellow";
      }
      else if(skin == "skin1")
      {
        canvas2d.strokeStyle = "yellow";
      }
    }
    else if(score <= 30)
    {
      if(skin == "skin0")
      {
        canvas2d.fillStyle = "purple";
      }
      else if(skin == "skin1")
      {
        canvas2d.strokeStyle = "purple";
      }
    }
    else if(score <= 35)
    {
      if(skin == "skin0")
      {
        canvas2d.fillStyle = "red";
      }
      else if(skin == "skin1")
      {
        canvas2d.strokeStyle = "red";
      }
      canvas2d.fillStyle = "red";
    }
    else
    {
      var gradient = canvas2d.createLinearGradient(0, 0, canvas.width, canvas.height); // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/createLinearGradient
      gradient.addColorStop(0, "red");
      gradient.addColorStop(1, "blue");
      canvas2d.fillStyle = gradient;
    }

    for (var i = 0; i < snakeSegments.length; i++) {
      if(skin == "skin0")
      {
        canvas2d.fillRect(snakeSegments[i].x, snakeSegments[i].y, 10, 10); // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/fillRect
      }
      else if(skin == "skin1")
      {
        canvas2d.lineWidth = 2; // Épaisseur de la ligne
        canvas2d.strokeRect(snakeSegments[i].x, snakeSegments[i].y, 10, 10);  
      }

    }
    while (snakeSegments.length > snakeLength) {
      snakeSegments.pop();
    }
    for (var i = 0; i < dots.length; i++) {
      canvas2d.fillStyle = "red";
      canvas2d.beginPath();
      canvas2d.arc(dots[i].x + 5, dots[i].y + 5, 5, 0, 2 * Math.PI);
      canvas2d.fill();
    }
}


function spawnDots() {
  if (dots.length < maxNumberOfDots) {
    var dotX = Math.floor(Math.random() * canvas.width); // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
    var dotY = Math.floor(Math.random() * canvas.height);
    dots.push({ x: dotX, y: dotY });
    canvas2d.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < dots.length; i++) {
      canvas2d.fillStyle = "red";
      canvas2d.beginPath();
      canvas2d.arc(dots[i].x + 5, dots[i].y + 5, 5, 0, 2 * Math.PI); // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/arc
      canvas2d.fill();
    }
  }
  if(dots.length > maxNumberOfDots)
  {
    dots.pop();
  }
}

function checkCollision() {
  for (var i = 0; i < dots.length; i++) {
    if (
      snakeX < dots[i].x + 10 &&
      snakeX + 10 > dots[i].x &&
      snakeY < dots[i].y + 10 &&
      snakeY + 10 > dots[i].y
    ) {
      snakeLength++;
      score++;
      money++;
      localStorage.setItem('money', money);
      displayMoney.innerText = money;
      document.getElementById('score').innerText = score;
      dots.splice(i, 1);
    }
  }

  if (
    snakeX < -10 ||
    snakeY < -10 ||
    snakeX > canvas.width + 10 ||
    snakeY > canvas.height + 10
  ) {
    gameOver();
  }

  for (var i = 1; i < snakeSegments.length; i++) {
    if (snakeX === snakeSegments[i].x && snakeY === snakeSegments[i].y) {
      gameOver();
    }
  }
}
function gameOver() {
  gameEnded = true;
  document.getElementById('endgame').style.display = "block";
  var button = document.getElementById('play');
  button.innerText = "Replay";
  button.onclick = function() {
    window.location.href = window.location.href;
  }
  var bestScore = localStorage.getItem('bestScore');
  if(bestScore < score)
  {
    localStorage.setItem('bestScore', score);
  }
}

function gameLoop() {
    spawnDots();
    moveSnake();
    drawSnake();
    checkCollision();
    if(!gameEnded)
    {
        setTimeout(gameLoop, 100);
    }
}

function toBuy(product, price)
{
  if(skins.includes(product))
  {
    localStorage.setItem('currentSkin', product);
    skin = localStorage.getItem('currentSkin');
    checkButton();
  }
  else
  {
    if(money >= price)
    {
      document.querySelector('.error').innerText = "";
      money = money - price;
      localStorage.setItem('money', money);
      displayMoney.innerText = money; // update of the amount in the screen
      skins.push(product);
      localStorage.setItem('skins', JSON.stringify(skins));
      localStorage.setItem('currentSkin', product);
      skin = localStorage.getItem('currentSkin');
      checkButton();
    }
    else
    {
      document.querySelector('.error').innerText = "You don't have enough money";
    }
  }
}

function addMoney()
{
  money = parseInt(money);
  money += 50;
  localStorage.setItem('money', money);
  displayMoney.innerText = money;
}
