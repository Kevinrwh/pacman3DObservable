import define1 from "./1b675294aba5f9ea@583.js";
import define2 from "./9d0fa713ea129540@422.js";
import define3 from "./10023e7d8ddc32bc@90.js";
import define4 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Pacman 3D Game`
)}

function _2(md){return(
md`** Camera Adjustments **`
)}

function _fov_Y(Inputs){return(
Inputs.range([1, 75], {
  value: 51,
  label: "Vertical Field of View",
  step: 1
})
)}

function _lightParameters(columns,Inputs){return(
columns({
  orientation: Inputs.range([-180, 180], {
    value: 132,
    label: "Light Y-Angle",
    step: 1
  }),
  distanceFactor: Inputs.range([1, 5], {
    value: 0,
    label: "Light Distance",
    step: 0.1
  }),
  lightType: Inputs.radio(["point", "directional"], {
    value: "point",
    label: "Light Type"
  })
})
)}

function _wallHeight(Inputs){return(
Inputs.range([0, 2], {
    value: 1.0,
    label: "Wall height",
    step: 0.1
})
)}

function _ambientLightIntensity(Inputs){return(
Inputs.range([0, 50], {
    value: 10,
    step: 5,
    label: "Ambient Light Intensity Percent"
})
)}

function _cameraAngles(columns,Inputs){return(
columns({
  y_angle: Inputs.range([-180, 180], {
    value: 0,
    label: "Camera Y Angle",
    step: 1
  }),
  x_angle: Inputs.range([-88, 89], {
    value: -70,
    label: "Camera X Angle",
    step: 1
  })
})
)}

function _8(md){return(
md`** Click here to start the game! **`
)}

function _start(html)
{
  //const audio = document.getElementById("audio");
  const button = html`<button> START </button>`;
  button.style.background = "yellow";
  button.style.font = "40px monospace";
  button.value = false;
  button.addEventListener('click', (e) => {
    button.value = true;
   // FileAttachment("PacManMusic.mp3").play()
 //audio.play();
  //audio.loop = true;
  });
return button;
}


function _b2(html,gameDivC,gl,gameOverlayEl,defaultWidth,defaultHeight,start)
{
  const btn = html`<button>Fullscreen Mode</button>`;
  btn.addEventListener("click", () => {
    const _width = window.screen.width;
    const _height = window.screen.height;
    
    
    const handler = (() => {
      console.log("canvas Fullscreen", document.fullscreenElement);
      if (document.fullscreenElement === gameDivC.gameDiv) {
          gl.canvas.width = _width;
          gl.canvas.height = _height;
          gameOverlayEl.style.width =  gl.canvas.width+"px";
          gameOverlayEl.style.height = gl.canvas.height+"px";
          console.log("Set canvas dimensions to", gl.canvas.width, gl.canvas.height, window.screen)
      }
      else {
        gl.canvas.width = defaultWidth;
        gl.canvas.height = defaultHeight;
        gameOverlayEl.style.width = defaultWidth+"px";
        gameOverlayEl.style.height = defaultHeight+"px";
        console.log("Exiting fullscreen");
        gameDivC.gameDiv.removeEventListener('fullscreenchange', handler)
      }
    });
    gameDivC.gameDiv.addEventListener('fullscreenchange', handler);
    gameDivC.gameDiv.requestFullscreen() 
  });
   btn.disabled = start !== 'true';
  return btn;
}


function _gameEl(start,gameDivC,html)
{
  if (start === 'true') {
    return gameDivC.gameDiv;
  }
  return html`<strong>Press the start button to load the game</strong>`
}


function _12(md){return(
md`To move use WASD, the arrow keys, or the joystick below.`
)}

function _joystick(d3,width,height,joystickRadius,drag)
{

  // Create the SVG viewbox
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("color", "black")
      .attr("stroke-width", 2);

  // Add a rectangular object to fit the viewbox and change it's color to black
  svg.append("rect")
    .attr("width","100%")
    .attr("height","100%")
    .attr("fill","black");

  // Designated travel area for the drag
  svg.append("rect")
    .attr("x",22.5) // center
    .attr("y", 3)
    .attr("width", "10%") // 10% of 50 is 5
    .attr("height","40%") // 40% of 5 is 2
    .attr("fill","gray");

  // The box the joystick stands on
  svg.append("rect")
    .attr("x",23.25)
    .attr("y", 1)
    .attr("width","7%")
    .attr("height","60%") // 60
    .attr("fill", "pink")
    .attr("opacity","0.3");
  

  // Create the joystick circle and draw at the center of the viewbox
  const circles = d3.range(1).map(i => ({
    x: width/2,
    y: height/2,
    dx: 0,
    dy: 0,
    index: i
  }));

  // for each circle, update the position by updating centers
  // FOR NOW: Issue is that when dragged it starts from the last ending position for your drag
  svg.selectAll("circle")
    .data(circles)
    .join("circle")
      .attr("cx", d => d.x) // place the circle at the correct location 
      .attr("cy", d => d.y)
      .attr("r", joystickRadius)
      .attr("fill", "red")
      .call(drag) // when clicked, call the drag function -- map this to wasd movement?

  return svg.node();
}


function _game(mazeDataTemplate,createKeyManager,joyStickInput,gameOverlayEl,resetVal,gl,hex2rgb,colors,renderer,renderSoreScene,scoreSceneProgramInfo,invalidation,start)
{
  // Initial positioning coordinates
  let pacmanPos = {x: 13, y:23};

  // x is left->right, y is up->down
  let blinkyPos = {x: 12, y: 14}; // red ghost
  let pinkyPos = {x: 13, y: 14}; // pink
  let inkyPos = {x: 14, y: 14}; // cyan -- in box
  let clydePos = {x: 15, y:14}; // orange -- in box

  let cherryPos = {x:100, y: 18.5};
  let cherryDisjointPos = {x:100, y: 23};
  
  let bananaPos = {x: 100, y:13};
  
  let pinkyTarget = {x: 1, y:5};
  let inkyVecRef = {x: 1, y:3};

  let frightened = 0;

  function randomDirection(up, left, down, right)
  { 
      let directionArray = ['up', 'up', 'up', 'up'];
      let n = 0;
      if(up !== Infinity) {
          // If up is a viable move, add it to the array
          directionArray[n] = 'up';
          n = n + 1;
      }
  
      if(left !== Infinity)
      {
          // If left is a viable move, add it to the array
          directionArray[n] = 'left';
          n = n + 1;
      }
  
      if(down !== Infinity)
      {
          // If down is a viable move, add it to the array
          directionArray[n] = 'down';
          n = n + 1;
      }
  
      if(right !== Infinity)
      {
          // If right is a viable move, add it to the array
          directionArray[n] = 'right';
          n = n + 1;
      }
  
      return directionArray[Math.floor(Math.random() * n)];
  }
  
  const requestFrame = () => {
    return new Promise((resolve, reject) => {
    window.requestAnimationFrame((timestamp) => {
      try {
      resolve(timestamp)
      }catch (e) {
        console.error("frame", e)
      }
    });
  })};


  const speed = 8;
  const firghtenedSpeed = speed/2;
  const gridClone = [];
  for (let i = 0; i < mazeDataTemplate.width; i++) {
    gridClone[i] = [];
    for (let j = 0; j < mazeDataTemplate.height; j++) {
      gridClone[i].push(mazeDataTemplate.grid[i][j]);
    }
  }
  const mazeDataClone = {width: mazeDataTemplate.width, height: mazeDataTemplate.height, grid: gridClone}
  const gameState = {mazeData: mazeDataClone, direction: 'down', blinkyDirection: 'up', inkyDirection: 'up', clydeDirection: 'up', pinkyDirection: 'up',  score: 0,live :3, pacmanSpeed: speed};
  const keyState = {};
  const unregisterKeys = createKeyManager(keyState);
  let lastTimestamp = -1;
  let timestamp = -1;

  // Game state
  let running = true;
  //REMOVEME - let direction = "down";
  let score = 0;
  //let live = 3;

  const startGameLoop = (async function() { 
  //blinky ai  
  // let blinkyDirection = 'up';

    // key input for pacman movement
    function updatePacman(gameState, time) {
      const {mazeData} = gameState;
      const speed = gameState.pacmanSpeed;
      loop:
      for (let i = 0; i < 20; i++) {
        if (i >= 19)
          debugger;
       // console.log(direction, pacmanPos.x, pacmanPos.y, time);
        if (gameState.direction === 'down') {
          let oldY = pacmanPos.y;
          let newY = oldY + speed * time / 1000;
          let y;
          for (y = Math.floor(oldY); y <= Math.ceil(newY); y++) {
            const timeNeeded = (y - oldY) / speed * 1000;
            if (timeNeeded >= 0 && timeNeeded <= time) {
              const split = visitCell(gameState, pacmanPos.x,y);
              if (split === 'death') {
                return 'death';
              }
              if (split) {
                const og = time;
                time -= timeNeeded;
                console.log('split time1', og, time, Math.abs(y - oldY), y, oldY, Math.abs(y - oldY) / speed * 1000);
                pacmanPos.y = y;

                continue loop;
              }
            }
            
            if (mazeData.grid[pacmanPos.x][y] === 'wall') {
              pacmanPos.y = y - 1;
              return; 
            }
          }
          pacmanPos.y=newY;
         
          
       }

        
        
        if (gameState.direction === 'right') {
          let oldX = pacmanPos.x;
          let newX = oldX + speed * time / 1000;
          let x;
          for (x = Math.floor(oldX); x <= Math.ceil(newX); x++) {
            const timeNeeded = (x - oldX) / speed * 1000;
            if (timeNeeded >= 0 && timeNeeded <= time) {
              if (x === mazeData.width - 1) {
                time -= timeNeeded;
                pacmanPos.x = 0;
                gameState.direction = 'right';
                continue loop;
              }
              const split = visitCell(gameState, x,pacmanPos.y);
              if (split === 'death') {
                return 'death';
              }
              if (split) {
                
                time -= timeNeeded;
                console.log('split time', time);
                pacmanPos.x = x;
                continue loop;
              }
            }
            
            if (mazeData.grid[x][pacmanPos.y] === 'wall') {
              pacmanPos.x = x - 1;
              return; 
            }
          }
          
          pacmanPos.x=newX;
          
       }
        
        if (gameState.direction === 'up') {
          let oldY = pacmanPos.y;
          let newY = oldY - speed * time / 1000;
          let y;
          for (y = Math.ceil(oldY); y >= Math.floor(newY); y--) {
            const timeNeeded = (oldY - y) / speed * 1000;
            if (timeNeeded >= 0 && timeNeeded <= time) {
              const split = visitCell(gameState, pacmanPos.x,y);
              if (split === 'death') {
                return 'death';
              }
              if (split) {
                
                time -= timeNeeded;
                pacmanPos.y = y;
                continue loop;
              }
            }
            
            if (mazeData.grid[pacmanPos.x][y] === 'wall') {
              pacmanPos.y = y + 1;
              return; 
            }
          }
          
          pacmanPos.y=newY;
          
       }
         if (gameState.direction === 'left') {
          let oldX = pacmanPos.x;
          let newX = oldX - speed * time / 1000;
          let x;
          for (x = Math.ceil(oldX); x >= Math.floor(newX); x--) {
            const timeNeeded = (oldX - x) / speed * 1000;
            if (timeNeeded >= 0 && timeNeeded <= time) {
              if (x === 0) {
                time -= timeNeeded;
                pacmanPos.x = mazeData.width - 1;
                gameState.direction = 'left';
                continue loop;
              }
              const split = visitCell(gameState, x,pacmanPos.y);
              if (split === 'death') {
                return 'death';
              }
              if (split) {
                
                time -= timeNeeded;
                pacmanPos.x = x;
                continue loop;
              }
            }
            
            if (mazeData.grid[x][pacmanPos.y] === 'wall') {
              pacmanPos.x = x + 1;
              return; 
            }
          }
          
          pacmanPos.x=newX;
          
       }
      break;
    }
    }

    // ghost eaten score modifier
    let scoreMod = 0;
    let blinkyEatenTime = 0;
    let pinkyEatenTime = 0;
    let inkyEatenTime = 0;
    let clydeEatenTime = 0;
function visitCell(gameState, x, y) {
      function isLegalPacmanTile(cellValue) {
        return cellValue === 'big' || cellValue === 'normal' || cellValue === 'no_pellet' || cellValue === 'warp_tunnel';
      }
      const {mazeData} = gameState;
      const cellValue = mazeData.grid[x]?.[y]
      if (cellValue === 'normal' || cellValue === 'big'){
        if (cellValue === 'normal') {
          gameState.score += 10;
        }
        else if (cellValue === 'big') {
          gameState.score +=50;
          scoreMod = 0;
          powerPelletEatenTime = timestamp;
          enterFrightenedMode();
        }
        mazeData.grid[x][y]='no_pellet';
      }
        if (gameState.direction !== 'right' && gameState.keys.KeyD) {
          const exact = mazeData.grid[x+1]?.[y];
          if (isLegalPacmanTile(exact)) {
            gameState.direction='right';
            return true;
          }
          
        }
      if (gameState.direction !== 'up' && gameState.keys.KeyW) {
        const exact = mazeData.grid[x][y-1];
          if (isLegalPacmanTile(exact)) {
            gameState.direction='up';
            return true;
          }
      }
       if (gameState.direction !== 'down' && gameState.keys.KeyS) {
        const exact = mazeData.grid[x][y+1];
          if (isLegalPacmanTile(exact)) {
            gameState.direction='down';
            return true;
          }
      }
      if (gameState.direction !== 'left' && gameState.keys.KeyA) {
        const exact = mazeData.grid[x-1]?.[y];
          if (isLegalPacmanTile(exact)) {
            gameState.direction='left';
            return true;
          }
      }
      return false;
      }

    function blinkyVisitCell(x, y) {
      const {mazeData} = gameState;
      const canTurn = !(blinkyLastTurnPos.x === x && blinkyLastTurnPos.y === y)
      if (!canTurn) {
        return false;
      }
      const cellValue = mazeData.grid[x]?.[y]
      function isLegalMove(newX, newY){
        const tileData = mazeData.grid[newX]?.[newY];
        return tileData === 'big' || tileData === 'normal' || tileData === 'no_pellet'
      }
      function dist(x2, y2) {
        const dx = x2 - pacmanPos.x;
        const dy = y2 - pacmanPos.y;
        return dx * dx + dy * dy;
      }
      let leftDistance = dist(x - 1, y);
      if (!isLegalMove(x - 1, y) || gameState.blinkyDirection === 'right')
        leftDistance = Infinity;
      let rightDistance = dist(x + 1, y);
      if (!isLegalMove(x + 1, y) || gameState.blinkyDirection === 'left')
        rightDistance = Infinity;
      let upDistance = dist(x, y - 1);
      if (!isLegalMove(x, y - 1) || gameState.blinkyDirection === 'down')
        upDistance = Infinity;
      let downDistance = dist(x, y + 1);
      if (!isLegalMove(x, y + 1) || gameState.blinkyDirection === 'up')
        downDistance = Infinity;


      if(ghostFrightened.blinky)
      {
        gameState.blinkyDirection = randomDirection(upDistance, leftDistance, downDistance, rightDistance);
        blinkyLastTurnPos = {x, y};
        return true;
      }
      else
      {
        // Should we go up?
        if (gameState.blinkyDirection !== 'up' && gameState.blinkyDirection !== 'down') {
          if (upDistance <= rightDistance && upDistance <= leftDistance && upDistance <= downDistance && upDistance !== Infinity) {
            // If up is better than all the other directions, we should go up
            gameState.blinkyDirection = 'up';
            blinkyLastTurnPos = {x, y};
            return true;
          }
        }
        
        // Should we turn left?
        if (gameState.blinkyDirection !== 'right' && gameState.blinkyDirection !== 'left') {
          if (leftDistance <= rightDistance && leftDistance <= upDistance && leftDistance <= downDistance && leftDistance !== Infinity) {
            // If left is better than all the other directions, we should go left
            gameState.blinkyDirection = 'left';
            blinkyLastTurnPos = {x, y};
            return true;
          }
        }
  
        // Should we go down?
        if (gameState.blinkyDirection !== 'up' && gameState.blinkyDirection !== 'down') {
          if (downDistance <= rightDistance && downDistance <= leftDistance && downDistance <= upDistance && downDistance !== Infinity) {
            // If down is better than all the other directions, we should go down
            gameState.blinkyDirection = 'down';
            blinkyLastTurnPos = {x, y};
            return true;
          }
        }
        
        // Should we go right?
        if (gameState.blinkyDirection !== 'right' && gameState.blinkyDirection !== 'left') {
          if (rightDistance <= leftDistance && rightDistance <= upDistance && rightDistance <= downDistance && rightDistance !== Infinity) {
            // If right is better than all the other directions, we should go right
            gameState.blinkyDirection = 'right';
            blinkyLastTurnPos = {x, y};
            return true;
          }
        }
      }
      return false;
      }

    let blinkyLastTurnPos = {x: -10, y: -10}
  function updateBlinky(time) {
      //blinkyVector = pacmanPos - blinkyPos;
      const {mazeData} = gameState;
      loop:
      for (let i = 0; i < 20; i++) {
        if (i >= 19)
          debugger;
       // console.log(blinkyDirection, blinkyPos.x, blinkyPos.y, time);
        let mod = 1;
        if(ghostFrightened.blinky)
        {
          mod = 2;
        }

        if (gameState.blinkyDirection === 'down') {
          let oldY = blinkyPos.y;
          let newY = oldY + (speed / mod) * time / 1000;
          let y;
          for (y = Math.floor(oldY); y <= Math.ceil(newY); y++) {
            const timeNeeded = (y - oldY) / (speed / mod) * 1000;
            if (timeNeeded >= 0 && timeNeeded <= time) {
              const split = blinkyVisitCell(blinkyPos.x,y);
              if (split) {
                const og = time;
                time -= timeNeeded;
                //console.log('split time1', og, time, Math.abs(y - oldY), y, oldY, Math.abs(y - oldY) / (speed / mod) * 1000);
                blinkyPos.y = y;
                continue loop;
              }
            }
            
            if (mazeData.grid[blinkyPos.x][y] === 'wall') {
              blinkyPos.y = y - 1;
              return; 
            }
          }
          
         blinkyPos.y=newY;          
       }

        
      if (gameState.blinkyDirection === 'right') {
          let oldX = blinkyPos.x;
          let newX = oldX + (speed / mod) * time / 1000;
          let x;
          for (x = Math.floor(oldX); x <= Math.ceil(newX); x++) {
            const timeNeeded = (x - oldX) / (speed / mod) * 1000;
            if (timeNeeded >= 0 && timeNeeded <= time) {
              const split = blinkyVisitCell(x, blinkyPos.y);
              if (split) {
                time -= timeNeeded;
                console.log('split time', time);
                blinkyPos.x = x;
                continue loop;
              }
            }
            
            if (mazeData.grid[x][blinkyPos.y] === 'wall') {
              blinkyPos.x = x - 1;
              return; 
            }
          }
          
         blinkyPos.x=newX;          
       }

        
        if (gameState.blinkyDirection === 'up') {
          let oldY = blinkyPos.y;
          let newY = oldY - (speed / mod) * time / 1000;
          let y;
          for (y = Math.ceil(oldY); y >= Math.floor(newY); y--) {
            const timeNeeded = (oldY - y) / (speed / mod) * 1000;
            if (timeNeeded >= 0 && timeNeeded <= time) {
              const split = blinkyVisitCell(blinkyPos.x,y);
              if (split) {
                
                time -= timeNeeded;
                blinkyPos.y = y;
                continue loop;
              }
            }
            
            if (mazeData.grid[blinkyPos.x][y] === 'wall') {
              blinkyPos.y = y + 1;
              return; 
            }
          }
          
          blinkyPos.y=newY;
          
       }

       if (gameState.blinkyDirection === 'left') {
          let oldX = blinkyPos.x;
          let newX = oldX - (speed / mod) * time / 1000;
          let x;
          for (x = Math.ceil(oldX); x >= Math.floor(newX); x--) {
            const timeNeeded = (oldX - x) / (speed / mod) * 1000;
            if (timeNeeded >= 0 && timeNeeded <= time) {
              const split = blinkyVisitCell(x,blinkyPos.y);
              if (split) {
                
                time -= timeNeeded;
                blinkyPos.x = x;
                continue loop;
              }
            }
            
            if (mazeData.grid[x][blinkyPos.y] === 'wall') {
              blinkyPos.x = x + 1;
              return; 
            }
          }
          
          blinkyPos.x=newX;
          
       }
      break;
    }
  }

  //pinky ai
  // let pinkyDirection = 'up';
  let pinkyLastTurnPos= {x: -10, y: -10};
  function pinkyVisitCell(x, y) {
      const {mazeData} = gameState;
      const canTurn = !(pinkyLastTurnPos.x === x && pinkyLastTurnPos.y === y)
      if (!canTurn) {
        console.log("can't turn");
        return false;
      }
      const cellValue = mazeData.grid[x]?.[y]
      function isLegalMove(newX, newY){
        const tileData = mazeData.grid[newX]?.[newY];
        return tileData === 'big' || tileData === 'normal' || tileData === 'no_pellet'
      }

      if(gameState.direction === 'up')
      {
        pinkyTarget = {x: pacmanPos.x, y: pacmanPos.y};
        pinkyTarget.x = pinkyTarget.x - 4;
        pinkyTarget.y = pinkyTarget.y - 4;
      }
      else if(gameState.direction === 'left')
      {
        pinkyTarget = {x: pacmanPos.x, y: pacmanPos.y};
        pinkyTarget.x = pinkyTarget.x - 4;
      }
      else if(gameState.direction === 'down')
      {
        pinkyTarget = {x: pacmanPos.x, y: pacmanPos.y};
        pinkyTarget.y = pinkyTarget.y + 4;
      }
      else
      {
        pinkyTarget = {x: pacmanPos.x, y: pacmanPos.y};
        pinkyTarget.x = pinkyTarget.x + 4;
      }
    
      function dist(x2, y2) {
        const dx = x2 - pinkyTarget.x;
        const dy = y2 - pinkyTarget.y;
        return dx * dx + dy * dy;
      }
      let leftDistance = dist(x - 1, y);
      if (!isLegalMove(x - 1, y) || gameState.pinkyDirection === 'right')
        leftDistance = Infinity;
      let rightDistance = dist(x + 1, y);
      if (!isLegalMove(x + 1, y) || gameState.pinkyDirection === 'left')
        rightDistance = Infinity;
      let upDistance = dist(x, y - 1);
      if (!isLegalMove(x, y - 1) || gameState.pinkyDirection === 'down')
        upDistance = Infinity;
      let downDistance = dist(x, y + 1);
      if (!isLegalMove(x, y + 1) || gameState.pinkyDirection === 'up')
        downDistance = Infinity;

      if(ghostFrightened.pinky)
      {
        gameState.pinkyDirection = randomDirection(upDistance, leftDistance, downDistance, rightDistance);
        pinkyLastTurnPos = {x, y};
        return true;
      }
      else
      {
        // Should we go up?
        if (gameState.pinkyDirection !== 'up' && gameState.pinkyDirection !== 'down') {
          if (upDistance <= rightDistance && upDistance <= leftDistance && upDistance <= downDistance && upDistance !== Infinity) {
            // If up is better than all the other directions, we should go up
            gameState.pinkyDirection = 'up';
            pinkyLastTurnPos = {x, y};
            return true;
          }
        }
        
        // Should we turn left?
        if (gameState.pinkyDirection !== 'right' && gameState.pinkyDirection !== 'left') {
          if (leftDistance <= rightDistance && leftDistance <= upDistance && leftDistance <= downDistance && leftDistance !== Infinity) {
            // If left is better than all the other directions, we should go left
            gameState.pinkyDirection = 'left';
            pinkyLastTurnPos = {x, y};
            return true;
          }
        }
  
        // Should we go down?
        if (gameState.pinkyDirection !== 'up' && gameState.pinkyDirection !== 'down') {
          if (downDistance <= rightDistance && downDistance <= leftDistance && downDistance <= upDistance && downDistance !== Infinity) {
            // If down is better than all the other directions, we should go down
            gameState.pinkyDirection = 'down';
            pinkyLastTurnPos = {x, y};
            return true;
          }
        }
        
        // Should we go right?
        if (gameState.pinkyDirection !== 'right' && gameState.pinkyDirection !== 'left') {
          if (rightDistance <= leftDistance && rightDistance <= upDistance && rightDistance <= downDistance && rightDistance !== Infinity) {
            // If right is better than all the other directions, we should go right
            gameState.pinkyDirection = 'right';
            pinkyLastTurnPos = {x, y};
            return true;
          }
        }
      }
      return false;
    }

    function updatePinky(time) {
    //pinkyVector = pacmanPos - pinkyPos;
    const {mazeData} = gameState;
    loop:
    for (let i = 0; i < 20; i++) {
      if (i >= 19)
        debugger;
     // console.log(pinkyDirection, pinkyPos.x, pinkyPos.y, time);
      let mod = 1;
      if(ghostFrightened.pinky)
      {
        mod = 2;
      }

      if (gameState.pinkyDirection === 'down') {
        let oldY = pinkyPos.y;
        let newY = oldY + (speed / mod) * time / 1000;
        let y;
        for (y = Math.floor(oldY); y <= Math.ceil(newY); y++) {
          const timeNeeded = (y - oldY) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = pinkyVisitCell(pinkyPos.x,y);
            if (split) {
              const og = time;
              time -= timeNeeded;
              //console.log('split time1', og, time, Math.abs(y - oldY), y, oldY, Math.abs(y - oldY) / (speed / mod) * 1000);
              pinkyPos.y = y;
              continue loop;
            }
          }
          
          if (mazeData.grid[pinkyPos.x][y] === 'wall') {
            pinkyPos.y = y - 1;
            return; 
          }
        }
        
       pinkyPos.y=newY;          
     }

      
    if (gameState.pinkyDirection === 'right') {
        let oldX = pinkyPos.x;
        let newX = oldX + (speed / mod) * time / 1000;
        let x;
        for (x = Math.floor(oldX); x <= Math.ceil(newX); x++) {
          const timeNeeded = (x - oldX) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = pinkyVisitCell(x, pinkyPos.y);
            if (split) {
              time -= timeNeeded;
              console.log('split time', time);
              pinkyPos.x = x;
              continue loop;
            }
          }
          
          if (mazeData.grid[x][pinkyPos.y] === 'wall') {
            pinkyPos.x = x - 1;
            return; 
          }
        }
        
       pinkyPos.x=newX;          
     }

      
      if (gameState.pinkyDirection === 'up') {
        let oldY = pinkyPos.y;
        let newY = oldY - (speed / mod) * time / 1000;
        let y;
        for (y = Math.ceil(oldY); y >= Math.floor(newY); y--) {
          const timeNeeded = (oldY - y) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = pinkyVisitCell(pinkyPos.x,y);
            if (split) {
              
              time -= timeNeeded;
              pinkyPos.y = y;
              continue loop;
            }
          }
          
          if (mazeData.grid[pinkyPos.x][y] === 'wall') {
            pinkyPos.y = y + 1;
            return; 
          }
        }
        
        pinkyPos.y=newY;
        
     }

     if (gameState.pinkyDirection === 'left') {
        let oldX = pinkyPos.x;
        let newX = oldX - (speed / mod) * time / 1000;
        let x;
        for (x = Math.ceil(oldX); x >= Math.floor(newX); x--) {
          const timeNeeded = (oldX - x) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = pinkyVisitCell(x,pinkyPos.y);
            if (split) {
              
              time -= timeNeeded;
              pinkyPos.x = x;
              continue loop;
            }
          }
          
          if (mazeData.grid[x][pinkyPos.y] === 'wall') {
            pinkyPos.x = x + 1;
            return; 
          }
        }
        
        pinkyPos.x=newX;
        
     }
    break;
  }
}

  //inky ai
  
  // let inkyDirection = 'up';
  let inkyLastTurnPos= {x: -10, y: -10};
  function inkyVisitCell(x, y) {
      let inkyVecRef = {x: 1, y:3};
      let inkyTarget = {x: 1, y:3};
      const {mazeData} = gameState;
      const canTurn = !(inkyLastTurnPos.x === x && inkyLastTurnPos.y === y)
      if (!canTurn) {
        console.log("can't turn");
        return false;
      }
      const cellValue = mazeData.grid[x]?.[y]
      function isLegalMove(newX, newY){
        const tileData = mazeData.grid[newX]?.[newY];
        return tileData === 'big' || tileData === 'normal' || tileData === 'no_pellet'
      }

      if(gameState.direction === 'up')
      {
        inkyVecRef = {x: pacmanPos.x, y: pacmanPos.y};
        inkyVecRef.x = inkyVecRef.x - 2;
        inkyVecRef.y = inkyVecRef.y - 2;
      }
      else if(gameState.direction === 'left')
      {
        inkyVecRef = {x: pacmanPos.x, y: pacmanPos.y};
        inkyVecRef.x = inkyVecRef.x - 2;
      }
      else if(gameState.direction === 'down')
      {
        inkyVecRef = {x: pacmanPos.x, y: pacmanPos.y};
        inkyVecRef.y = inkyVecRef.y + 2;
      }
      else
      {
        inkyVecRef = {x: pacmanPos.x, y: pacmanPos.y};
        inkyVecRef.x = inkyVecRef.x + 2;
      }
      inkyTarget.x = inkyVecRef.x - (blinkyPos.x - inkyVecRef.x);
      inkyTarget.y = inkyVecRef.y - (blinkyPos.y - inkyVecRef.y);


      function dist(x2, y2) {
        const dx = x2 - inkyTarget.x;
        const dy = y2 - inkyTarget.y;
        return dx * dx + dy * dy;
      }
      let leftDistance = dist(x - 1, y);
      if (!isLegalMove(x - 1, y) || gameState.inkyDirection === 'right')
        leftDistance = Infinity;
      let rightDistance = dist(x + 1, y);
      if (!isLegalMove(x + 1, y) || gameState.inkyDirection === 'left')
        rightDistance = Infinity;
      let upDistance = dist(x, y - 1);
      if (!isLegalMove(x, y - 1) || gameState.inkyDirection === 'down')
        upDistance = Infinity;
      let downDistance = dist(x, y + 1);
      if (!isLegalMove(x, y + 1) || gameState.inkyDirection === 'up')
        downDistance = Infinity;

      if(ghostFrightened.inky)
      {
        gameState.inkyDirection = randomDirection(upDistance, leftDistance, downDistance, rightDistance);
        inkyLastTurnPos = {x, y};
        return true;
      }
      else
      {
        // Should we go up?
        if (gameState.inkyDirection !== 'up' && gameState.inkyDirection !== 'down') {
          if (upDistance <= rightDistance && upDistance <= leftDistance && upDistance <= downDistance && upDistance !== Infinity) {
            // If up is better than all the other directions, we should go up
            gameState.inkyDirection = 'up';
            inkyLastTurnPos = {x, y};
            return true;
          }
        }
        
        // Should we turn left?
        if (gameState.inkyDirection !== 'right' && gameState.inkyDirection !== 'left') {
          if (leftDistance <= rightDistance && leftDistance <= upDistance && leftDistance <= downDistance && leftDistance !== Infinity) {
            // If left is better than all the other directions, we should go left
            gameState.inkyDirection = 'left';
            inkyLastTurnPos = {x, y};
            return true;
          }
        }
  
        // Should we go down?
        if (gameState.inkyDirection !== 'up' && gameState.inkyDirection !== 'down') {
          if (downDistance <= rightDistance && downDistance <= leftDistance && downDistance <= upDistance && downDistance !== Infinity) {
            // If down is better than all the other directions, we should go down
            gameState.inkyDirection = 'down';
            inkyLastTurnPos = {x, y};
            return true;
          }
        }
        
        // Should we go right?
        if (gameState.inkyDirection !== 'right' && gameState.inkyDirection !== 'left') {
          if (rightDistance <= leftDistance && rightDistance <= upDistance && rightDistance <= downDistance && rightDistance !== Infinity) {
            // If right is better than all the other directions, we should go right
            gameState.inkyDirection = 'right';
            inkyLastTurnPos = {x, y};
            return true;
          }
        }
      }
      return false;
    }

  function updateInky(time) {
    //inkyVector = pacmanPos - inkyPos;
    const {mazeData} = gameState;
    loop:
    for (let i = 0; i < 20; i++) {
      if (i >= 19)
        debugger;
     // console.log(inkyDirection, inkyPos.x, inkyPos.y, time);
      let mod = 1;
      if(ghostFrightened.inky)
      {
        mod = 2;
      }

      if (gameState.inkyDirection === 'down') {
        let oldY = inkyPos.y;
        let newY = oldY + (speed / mod) * time / 1000;
        let y;
        for (y = Math.floor(oldY); y <= Math.ceil(newY); y++) {
          const timeNeeded = (y - oldY) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = inkyVisitCell(inkyPos.x,y);
            if (split) {
              const og = time;
              time -= timeNeeded;
              //console.log('split time1', og, time, Math.abs(y - oldY), y, oldY, Math.abs(y - oldY) / (speed / mod) * 1000);
              inkyPos.y = y;
              continue loop;
            }
          }
          
          if (mazeData.grid[inkyPos.x][y] === 'wall') {
            inkyPos.y = y - 1;
            return; 
          }
        }
        
       inkyPos.y=newY;          
     }

      
    if (gameState.inkyDirection === 'right') {
        let oldX = inkyPos.x;
        let newX = oldX + (speed / mod) * time / 1000;
        let x;
        for (x = Math.floor(oldX); x <= Math.ceil(newX); x++) {
          const timeNeeded = (x - oldX) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = inkyVisitCell(x, inkyPos.y);
            if (split) {
              time -= timeNeeded;
              console.log('split time', time);
              inkyPos.x = x;
              continue loop;
            }
          }
          
          if (mazeData.grid[x][inkyPos.y] === 'wall') {
            inkyPos.x = x - 1;
            return; 
          }
        }
        
       inkyPos.x=newX;          
     }

      
      if (gameState.inkyDirection === 'up') {
        let oldY = inkyPos.y;
        let newY = oldY - (speed / mod) * time / 1000;
        let y;
        for (y = Math.ceil(oldY); y >= Math.floor(newY); y--) {
          const timeNeeded = (oldY - y) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = inkyVisitCell(inkyPos.x,y);
            if (split) {
              
              time -= timeNeeded;
              inkyPos.y = y;
              continue loop;
            }
          }
          
          if (mazeData.grid[inkyPos.x][y] === 'wall') {
            inkyPos.y = y + 1;
            return; 
          }
        }
        
        inkyPos.y=newY;
        
     }

     if (gameState.inkyDirection === 'left') {
        let oldX = inkyPos.x;
        let newX = oldX - (speed / mod) * time / 1000;
        let x;
        for (x = Math.ceil(oldX); x >= Math.floor(newX); x--) {
          const timeNeeded = (oldX - x) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = inkyVisitCell(x,inkyPos.y);
            if (split) {
              
              time -= timeNeeded;
              inkyPos.x = x;
              continue loop;
            }
          }
          
          if (mazeData.grid[x][inkyPos.y] === 'wall') {
            inkyPos.x = x + 1;
            return; 
          }
        }
        
        inkyPos.x=newX;
        
     }
    break;
  }
}

  //clyde ai  
  // let clydeDirection = 'up';
  let clydeLastTurnPos = {x: -10, y: -10}
  function clydeVisitCell(x, y) {
      const {mazeData} = gameState;
      const canTurn = !(clydeLastTurnPos.x === x && clydeLastTurnPos.y === y)
      if (!canTurn) {
        return false;
      }
      const cellValue = mazeData.grid[x]?.[y]
      function isLegalMove(newX, newY){
        const tileData = mazeData.grid[newX]?.[newY];
        return tileData === 'big' || tileData === 'normal' || tileData === 'no_pellet'
      }
      function dist(x2, y2) {
        const dx = x2 - pacmanPos.x;
        const dy = y2 - pacmanPos.y;
        return dx * dx + dy * dy;
      }
      function dist2(x2, y2) {
        const dx = x2 - 1;
        const dy = y2 - 32;
        return dx * dx + dy * dy;
      }


      let downDistance = Infinity;
      let upDistance = Infinity;
      let leftDistance = Infinity;
      let rightDistance = Infinity;
      if(dist(x,y) >= 64)
      {
        leftDistance = dist(x - 1, y);
        if (!isLegalMove(x - 1, y) || gameState.clydeDirection === 'right')
          leftDistance = Infinity;
        rightDistance = dist(x + 1, y);
        if (!isLegalMove(x + 1, y) || gameState.clydeDirection === 'left')
          rightDistance = Infinity;
        upDistance = dist(x, y - 1);
        if (!isLegalMove(x, y - 1) || gameState.clydeDirection === 'down')
          upDistance = Infinity;
        downDistance = dist(x, y + 1);
        if (!isLegalMove(x, y + 1) || gameState.clydeDirection === 'up')
          downDistance = Infinity;
      }
      else
      {
        leftDistance = dist2(x - 1, y);
        if (!isLegalMove(x - 1, y) || gameState.clydeDirection === 'right')
          leftDistance = Infinity;
        rightDistance = dist2(x + 1, y);
        if (!isLegalMove(x + 1, y) || gameState.clydeDirection === 'left')
          rightDistance = Infinity;
        upDistance = dist2(x, y - 1);
        if (!isLegalMove(x, y - 1) || gameState.clydeDirection === 'down')
          upDistance = Infinity;
        downDistance = dist2(x, y + 1);
        if (!isLegalMove(x, y + 1) || gameState.clydeDirection === 'up')
          downDistance = Infinity;
      }

      if(ghostFrightened.clyde)
      {
        gameState.clydeDirection = randomDirection(upDistance, leftDistance, downDistance, rightDistance);
        clydeLastTurnPos = {x, y};
        return true;
      }
      else
      {
        // Should we go up?
        if (gameState.clydeDirection !== 'up' && gameState.clydeDirection !== 'down') {
          if (upDistance <= rightDistance && upDistance <= leftDistance && upDistance <= downDistance && upDistance !== Infinity) {
            // If up is better than all the other directions, we should go up
            gameState.clydeDirection = 'up';
            clydeLastTurnPos = {x, y};
            return true;
          }
        }
        
        // Should we turn left?
        if (gameState.clydeDirection !== 'right' && gameState.clydeDirection !== 'left') {
          if (leftDistance <= rightDistance && leftDistance <= upDistance && leftDistance <= downDistance && leftDistance !== Infinity) {
            // If left is better than all the other directions, we should go left
            gameState.clydeDirection = 'left';
            clydeLastTurnPos = {x, y};
            return true;
          }
        }
  
        // Should we go down?
        if (gameState.clydeDirection !== 'up' && gameState.clydeDirection !== 'down') {
          if (downDistance <= rightDistance && downDistance <= leftDistance && downDistance <= upDistance && downDistance !== Infinity) {
            // If down is better than all the other directions, we should go down
            gameState.clydeDirection = 'down';
            clydeLastTurnPos = {x, y};
            return true;
          }
        }
        
        // Should we go right?
        if (gameState.clydeDirection !== 'right' && gameState.clydeDirection !== 'left') {
          if (rightDistance <= leftDistance && rightDistance <= upDistance && rightDistance <= downDistance && rightDistance !== Infinity) {
            // If right is better than all the other directions, we should go right
            gameState.clydeDirection = 'right';
            clydeLastTurnPos = {x, y};
            return true;
          }
        }
      }
      return false;
    }  

    function updateClyde(time) {
    //clydeVector = pacmanPos - clydePos;
    const {mazeData} = gameState;
    loop:
    for (let i = 0; i < 20; i++) {
      if (i >= 19)
        debugger;
     // console.log(clydeDirection, clydePos.x, clydePos.y, time);
      let mod = 1;
      if(ghostFrightened.clyde)
      {
        mod = 2;
      }

      if (gameState.clydeDirection === 'down') {
        let oldY = clydePos.y;
        let newY = oldY + (speed / mod) * time / 1000;
        let y;
        for (y = Math.floor(oldY); y <= Math.ceil(newY); y++) {
          const timeNeeded = (y - oldY) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = clydeVisitCell(clydePos.x,y);
            if (split) {
              const og = time;
              time -= timeNeeded;
              //console.log('split time1', og, time, Math.abs(y - oldY), y, oldY, Math.abs(y - oldY) / (speed / mod) * 1000);
              clydePos.y = y;
              continue loop;
            }
          }
          
          if (mazeData.grid[clydePos.x][y] === 'wall') {
            clydePos.y = y - 1;
            return; 
          }
        }
        
       clydePos.y=newY;          
     }

      
    if (gameState.clydeDirection === 'right') {
        let oldX = clydePos.x;
        let newX = oldX + (speed / mod) * time / 1000;
        let x;
        for (x = Math.floor(oldX); x <= Math.ceil(newX); x++) {
          const timeNeeded = (x - oldX) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = clydeVisitCell(x, clydePos.y);
            if (split) {
              time -= timeNeeded;
              console.log('split time', time);
              clydePos.x = x;
              continue loop;
            }
          }
          
          if (mazeData.grid[x][clydePos.y] === 'wall') {
            clydePos.x = x - 1;
            return; 
          }
        }
        
       clydePos.x=newX;          
     }

      
      if (gameState.clydeDirection === 'up') {
        let oldY = clydePos.y;
        let newY = oldY - (speed / mod) * time / 1000;
        let y;
        for (y = Math.ceil(oldY); y >= Math.floor(newY); y--) {
          const timeNeeded = (oldY - y) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = clydeVisitCell(clydePos.x,y);
            if (split) {
              
              time -= timeNeeded;
              clydePos.y = y;
              continue loop;
            }
          }
          
          if (mazeData.grid[clydePos.x][y] === 'wall') {
            clydePos.y = y + 1;
            return; 
          }
        }
        
        clydePos.y=newY;
        
     }

     if (gameState.clydeDirection === 'left') {
        let oldX = clydePos.x;
        let newX = oldX - (speed / mod) * time / 1000;
        let x;
        for (x = Math.ceil(oldX); x >= Math.floor(newX); x--) {
          const timeNeeded = (oldX - x) / (speed / mod) * 1000;
          if (timeNeeded >= 0 && timeNeeded <= time) {
            const split = clydeVisitCell(x,clydePos.y);
            if (split) {
              
              time -= timeNeeded;
              clydePos.x = x;
              continue loop;
            }
          }
          
          if (mazeData.grid[x][clydePos.y] === 'wall') {
            clydePos.x = x + 1;
            return; 
          }
        }
        
        clydePos.x=newX;
        
     }
    break;
  }
}

  //Frightened mode
  function enterFrightenedMode()
  {
    frightened = 1;

    if(!ghostFrightened.blinky)
    {
      blinkyLastTurnPos = {x: -10, y: -10}
      if(gameState.blinkyDirection === 'up')
      {
        gameState.blinkyDirection = 'down';
      }
      else if(gameState.blinkyDirection === 'left')
      {
        gameState.blinkyDirection = 'right';
      }
      else if(gameState.blinkyDirection === 'down')
      {
        gameState.blinkyDirection = 'up';
      }
      else
      {
        gameState.blinkyDirection = 'left';
      }
    }

    if(!ghostFrightened.pinky)
    {
      pinkyLastTurnPos = {x: -10, y: -10}
      if(gameState.pinkyDirection === 'up')
      {
        gameState.pinkyDirection = 'down';
      }
      else if(gameState.pinkyDirection === 'left')
      {
        gameState.pinkyDirection = 'right';
      }
      else if(gameState.pinkyDirection === 'down')
      {
        gameState.pinkyDirection = 'up';
      }
      else
      {
        gameState.pinkyDirection = 'left';
      }
    }

    if(!ghostFrightened.inky)
    {
      inkyLastTurnPos = {x: -10, y: -10}
      if(gameState.inkyDirection === 'up')
      {
        gameState.inkyDirection = 'down';
      }
      else if(gameState.inkyDirection === 'left')
      {
        gameState.inkyDirection = 'right';
      }
      else if(gameState.inkyDirection === 'down')
      {
        gameState.inkyDirection = 'up';
      }
      else
      {
        gameState.inkyDirection = 'left';
      }
    }

    if(!ghostFrightened.clyde)
    {
      clydeLastTurnPos = {x: -10, y: -10}
      if(gameState.clydeDirection === 'up')
      {
        gameState.clydeDirection = 'down';
      }
      else if(gameState.clydeDirection === 'left')
      {
        gameState.clydeDirection = 'right';
      }
      else if(gameState.clydeDirection === 'down')
      {
        gameState.clydeDirection = 'up';
      }
      else
      {
        gameState.clydeDirection = 'left';
      }
    }
    
    ghostFrightened = {pinky: true, clyde: true, inky: true, blinky: true};

    return;
  }
    
    
  let start = false;
  let startTime = -1;
  let tempTime = -20000;
  let powerPelletEatenTime = -1;
  let ghostStarted = {pinky: false}
  let ghostFrightened = {pinky: false, clyde: false, inky: false, blinky: false};
  let ghostEaten = {pinky: false, clyde: false, inky: false, blinky: false};

  let fruitEaten = {cherry: false, banana: false};
  let cherryTime = 15000; // 15 seconds
  let bananaTime = 30000; // 30 seconds

  // The actual key input
  while(running) {
    //console.log("Joystick", joyStickInput.direction, "keyboard", JSON.stringify(keyState.keys))
    
    if (joyStickInput.direction && joyStickInput.direction !== 'none') {
      if (joyStickInput.direction === 'left') {
        gameState.keys = {KeyA: true, KeyW: false, KeyS: false, KeyD: false};
      } else if (joyStickInput.direction === 'right') {
        gameState.keys = {KeyA: false, KeyW: false, KeyS: false, KeyD: true};
      } else if (joyStickInput.direction === 'up') {
        gameState.keys = {KeyA: false, KeyW: true, KeyS: false, KeyD: false};
      } else if (joyStickInput.direction === 'down') {
        gameState.keys = {KeyA: false, KeyW: false, KeyS: true, KeyD: false};
      }
    } else {
      gameState.keys = keyState.keys;
    }
    if (lastTimestamp > 0) {
      if (!start) {
        start = gameState.keys.KeyW || gameState.keys.KeyA || gameState.keys.KeyS || gameState.keys.KeyD;
        startTime = timestamp;
      }
      //console.log("FPS: "+1/(timestamp - lastTimestamp)*1000);
      if (start) {
        //Power pellet sudo code
        if (frightened === 1 && (timestamp - powerPelletEatenTime) >= 9000) {
          frightened = 0;
          ghostFrightened = {pinky: false, clyde: false, inky: false, blinky: false};
        }

        if (ghostEaten.blinky && (timestamp - blinkyEatenTime) >= 3000) {
          ghostEaten.blinky = false;
        }

        if (ghostEaten.pinky && (timestamp - pinkyEatenTime) >= 3000) {
          ghostEaten.pinky = false;
        }

        if (ghostEaten.inky && (timestamp - inkyEatenTime) >= 3000) {
          ghostEaten.inky = false;
        }

        if (ghostEaten.clyde && (timestamp - clydeEatenTime) >= 3000) {
          ghostEaten.clyde = false;
        }
        
        
        const res = updatePacman(gameState, timestamp - lastTimestamp);


        if ((timestamp - startTime) > 0 && !ghostStarted.blinky && !ghostEaten.blinky) {
          ghostStarted.blinky = true;
          blinkyPos.x = 13.5;
          blinkyPos.y = 11;
          // Must start left or right because you can't go up or down at (13.5, 11)
          gameState.blinkyDirection = 'left';
        }
        if (ghostStarted.blinky) {
          updateBlinky(timestamp - lastTimestamp);
        }
        
        // TODO: animate ghosts before they start and animate their exit
        if ((timestamp - startTime) > 5000 && !ghostStarted.pinky && !ghostEaten.pinky) {
          ghostStarted.pinky = true;
          pinkyPos.x = 13.5;
          pinkyPos.y = 11;
          // Must start left or right because you can't go up or down at (13.5, 11)
          gameState.pinkyDirection = 'left';
        }
        if (ghostStarted.pinky) {
          updatePinky(timestamp - lastTimestamp);
        }

        if ((timestamp - startTime) > 10000 && !ghostStarted.inky && !ghostEaten.inky) {
          ghostStarted.inky = true;
          inkyPos.x = 13.5;
          inkyPos.y = 11;
          // Must start left or right because you can't go up or down at (13.5, 11)
          gameState.inkyDirection = 'left';
        }
        if (ghostStarted.inky) {
          updateInky(timestamp - lastTimestamp);
        }

        if ((timestamp - startTime) > 15000 && !ghostStarted.clyde && !ghostEaten.clyde) {
          ghostStarted.clyde = true;
          clydePos.x = 13.5;
          clydePos.y = 11;
          // Must start left or right because you can't go up or down at (13.5, 11)
          gameState.clydeDirection = 'left';
        }
        if (ghostStarted.clyde) {
          updateClyde(timestamp - lastTimestamp);
        }

        if ((timestamp - startTime) > cherryTime && !fruitEaten.cherry && cherryPos.x != 13.5) 
        {
          cherryPos.x = -6;
          cherryPos.y = 18.5;
          cherryDisjointPos.x = 13.5;
          cherryDisjointPos.y = 17;
        }

        if ((timestamp - startTime) > bananaTime && !fruitEaten.banana && bananaPos.x != 13.5) 
        {
          bananaPos.x = 13.5;
          bananaPos.y = 29;
        }

        function inEnemy(pacmanPos, enemyPos) {
          return pacmanPos.x >= enemyPos.x && pacmanPos.x <= (enemyPos.x + 1) && pacmanPos.y >= enemyPos.y && pacmanPos.y <= (enemyPos.y + 1);
        }
        function testHit(ghostPos) {
          // Test corners
          return (inEnemy(pacmanPos, ghostPos)
            || inEnemy({x: pacmanPos.x + 1, y: pacmanPos.y}, ghostPos)
            || inEnemy({x: pacmanPos.x, y: pacmanPos.y + 1}, ghostPos)
            || inEnemy({x: pacmanPos.x + 1, y: pacmanPos.y + 1}, ghostPos));
        }
        function testGhostHits() {
          if (testHit(blinkyPos)) {
            if (ghostFrightened.blinky) {
              // Eat blinky
              gameState.score += 200 * Math.pow(2, scoreMod);
              scoreMod = scoreMod + 1;
              blinkyPos = {x: 12, y: 14};
              ghostEaten.blinky = true;
              ghostStarted.blinky = false;
              blinkyEatenTime = timestamp;
              ghostFrightened.blinky = false;
            } else {
              return 'death';
            }
          }
          if (testHit(pinkyPos)) {
            if (ghostFrightened.pinky) {
              // Eat pinky
              gameState.score += 200 * Math.pow(2, scoreMod);
              scoreMod = scoreMod + 1;
              pinkyPos = {x: 13, y: 14};
              ghostEaten.pinky = true;
              ghostStarted.pinky = false;
              pinkyEatenTime = timestamp;
              ghostFrightened.pinky = false;
            } else {
              return 'death';
            }
          }
          if (testHit(clydePos)) {
            if (ghostFrightened.clyde) {
              // Eat clyde
              gameState.score += 200 * Math.pow(2, scoreMod);
              scoreMod = scoreMod + 1;
              clydePos = {x: 15, y: 14};
              ghostEaten.clyde = true;
              ghostStarted.clyde = false;
              clydeEatenTime = timestamp;
              ghostFrightened.clyde = false;
            } else {
              return 'death';
            }
         }
         if (testHit(inkyPos)) {
            if (ghostFrightened.inky) {
              // Eat inky
              gameState.score += 200 * Math.pow(2, scoreMod);
              scoreMod = scoreMod + 1;
              inkyPos = {x: 14, y: 14};
              ghostEaten.inky = true;
              ghostStarted.inky = false;
              inkyEatenTime = timestamp;
              ghostFrightened.inky = false;
            } else {
              return 'death';
            }
          }
        }
        
        //Fruit eaten sudo code
        if(testHit(cherryDisjointPos))
        {
          gameState.score +=100;
          fruitEaten.cherry = true;
          cherryPos.x = 100 
          cherryDisjointPos = 119.5;
        }

        if(testHit(bananaPos))
        {
          gameState.score +=300;
          fruitEaten.banana = true;
          bananaPos.x = 100        
        }


        if (testGhostHits() === 'death') {
          gameState.live--;
          console.log("Lives updated", gameState.live)
          if (gameState.live <= 0) {
            console.log("Out of lives", gameState.live);
            running = false;
            gameOverlayEl.style.display="block";
            document.getElementById("gameOverlay_text").textContent = "Game over";
            document.getElementById("gameOverlay_text").style.color = "#ff0000";
            const doNothing = resetVal;
            const audio = document.getElementById("death");
            audio.play();
            break;
          }
          pacmanPos.x = 13;
          pacmanPos.y = 23;
          start = false;
          startTime = -1;
          frightened = 0;
          powerPelletEatenTime = -1;
          ghostStarted = {pinky: false, clyde: false, inky: false, blinky: false}
          ghostFrightened = {pinky: false, clyde: false, inky: false, blinky: false};
          blinkyPos = {x: 13.5, y: 11}; // red ghost
          pinkyPos = {x: 13.5, y: 14}; // pink
          inkyPos = {x: 12.5, y: 14}; // cyan -- in box
          clydePos = {x: 14.5, y:14}; // orange -- in box
          blinkyLastTurnPos = {x: -10, y: -10};
          inkyLastTurnPos= {x: -10, y: -10};
          pinkyLastTurnPos = {x: -10, y: -10};
          clydeLastTurnPos = {x: -10, y: -10};
          gameState.keys.KeyW = false;
          gameState.keys.KeyA = false;
          gameState.keys.KeyS = false;
          gameState.keys.KeyD = false;
          
         
          continue;
        }
        function hasRemainingPellets() {
          for (let x = 0; x < mazeDataClone.width; x++) {
            for (let y = 0; y < mazeDataClone.height; y++) {
              const data = gameState.mazeData.grid[x]?.[y];
              if (data === 'normal' || data === 'big') {
                return true;
              }
            }
          }
          return false;
        }
        if (!hasRemainingPellets()) {
            running = false;
            gameOverlayEl.style.display="block";
            document.getElementById("gameOverlay_text").textContent = "You win!";
            document.getElementById("gameOverlay_text").style.color = "#00ff00";
            const doNothing = resetVal;
            break;
        }
      }
    }
    // Hack. Fixme?
    gameState.pacmanPos = pacmanPos;
    gameState.blinkyPos = blinkyPos;
    gameState.inkyPos = inkyPos;
    gameState.pinkyPos = pinkyPos;
    gameState.clydePos = clydePos;
    gameState.cherryPos = cherryPos;
    gameState.bananaPos = bananaPos;
    // gameState.pinkyDirection = pinkyDirection;
    gameState.ghostFrightened = ghostFrightened;
    gameState.timestamp = timestamp;
    gameState.powerPelletEatenTime = powerPelletEatenTime;
    
    //const canvasWidth = gl.canvas.width / 2
    const canvasWidth = gl.canvas.width;
    const canvasHeight = gl.canvas.height;
    const aspect = canvasWidth / canvasHeight;
    /*gl.viewport(0, 0, canvasWidth, gl.canvas.height);
    gl.scissor(0, 0, canvasWidth, gl.canvas.height);
    gl.clearColor(...hex2rgb(colors.leftBackgroundColor), 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderCamera();*/

    
    
    gl.viewport(0, 0, canvasWidth, canvasHeight);
    gl.clearColor(...hex2rgb(colors.rightBackgroundColor), 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderer.renderScene(aspect, gameState, false);
    renderer.renderScene(aspect, gameState, true);
    // For rendering Lives and score, change here
    renderSoreScene(scoreSceneProgramInfo, gameState.score, gameState.live);
    //lastTimestamp = timestamp;
   // timestamp = await requestFrame();
    lastTimestamp = timestamp;
    timestamp = await requestFrame();
 }
  });
  
  startGameLoop().catch((e) => {
    console.error("Error in the game loop", e);
  })
  invalidation.then(() => {
    unregisterKeys()
    running=false;
  });
  const audio = document.getElementById("audio");
    if (start === "true")
  {
    audio.play();
    //return gameDivC.gameDiv;
    return;
  }
  else
  {
    return "Loading...Please click START";
  }
}


function _15(md){return(
md`** Joystick Implementation and Methods **`
)}

function _joyStickInput(){return(
{direction: 'none'}
)}

function _drag(d3,joyStickInput)
{
  
  let startX = 25;
  let startY = 2.5;

  
  function dragstarted() {
    d3.select(this).attr("cx",startX).attr("cy",startY);
  }

  function dragged(event, d) {
    
    let xval = event.x;
    let yval = event.y;
    
    if(event.x > 26) xval = 26;
    if(event.x < 24) xval = 24;
    if(event.y > 3.5) yval = 3.5;
    if(event.y < 1.5) yval = 1.5;

    d3.select(this)
      .attr("cx", d.x = xval)
      .attr("cy", d.y = yval);
    
    let dx = event.x-25;
    let dy = event.y-2.5;

    let absoluteDx = Math.abs(dx);
    let absoluteDy = Math.abs(dy);


    if(absoluteDx > absoluteDy){ // turning x axis
      if(dx > 0){ // right turn
        joyStickInput.direction = 'right';
      } else if(dx < 0){
        joyStickInput.direction = 'left';
      } else{
          console.log('error turning horizontally'); // error
      }
    } else if(absoluteDx < absoluteDy){ // turning y axis
      if(dy > 0){ // down turn
        joyStickInput.direction = 'down';
      } else if(dy < 0){
        joyStickInput.direction = 'up';
      } else{
          console.log('error turning horizontally'); // error
      }
    } else {
      joyStickInput.direction = 'none';
      console.log('no joystick input/movement');
    }
  }

  function dragended(event, d){ 
    joyStickInput.direction='none';

    
    d3.select(this)
      .attr("cx", d.x = event.x-(event.x-25)) // the objects x value is set x coordinates to the right/left
      .attr("cy",d.y = event.y-(event.y-2.5)); // the objects y value is set y coordinates up/down
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}


function _joystickRadius(){return(
1.5
)}

function _height(){return(
5
)}

function _width(){return(
50
)}

function _21(md){return(
md`### Variables and Functions`
)}

function _resetVal(){return(
false
)}

function _createKeyManager(){return(
function createKeyManager(gameState) {
  gameState.keys = {};
  const validKeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
  function getCode(e) {
    if (e.code === 'ArrowUp') {
      e.preventDefault();
      return 'KeyW';
    }
    else if (e.code === 'ArrowDown') {
      e.preventDefault();
      return 'KeyS';
    }
    else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      return 'KeyA';
    }
    else if (e.code === 'ArrowRight') {
      e.preventDefault();
      return 'KeyD';
    }
    return e.code;
  }
  const keydownHandler = (e) => {
    const code = getCode(e);
    if (validKeys.includes(code) && !e.repeat) {
      e.preventDefault();
      for (const key of validKeys) {
        gameState.keys[key] = false;
      }
      gameState.keys[code] = true;
      //console.log("Keydown", gameState.keys);
    }
  };
  const keyupHandler = (e) => {
    const code = getCode(e);
    if (validKeys.includes(code)) {
      gameState.keys[code]=false;
      //console.log("Keyup", gameState.keys);
    }
  };
  // https://stackoverflow.com/a/64628312
  document.addEventListener("keydown", keydownHandler, {capture: true, passive: false});
  document.addEventListener("keyup", keyupHandler);
  return () => {
    document.removeEventListener("keydown", keydownHandler);
    document.removeEventListener("keyup", keyupHandler);
  }
}
)}

function _24(md){return(
md`## Models`
)}

function _25(md){return(
md`### Pellets and power pellet (energizers)`
)}

function _pelletSphere(twgl,gl){return(
twgl.primitives.createSphereBufferInfo(gl, 0.15, 20, 20)
)}

function _bigPelletSphere(twgl,gl){return(
twgl.primitives.createSphereBufferInfo(gl, 0.2, 20, 20)
)}

function _28(md){return(
md`### Maze walls`
)}

function _makeBox(makeQuad,mergeParts,transformVertices){return(
function makeBox(x, y, z, scale=1) {
  const faces = [
    makeQuad([0,0,0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1]), // front
   makeQuad([0,0,1], [1, 0, 1], [0, 1, 1], [1, 1, 1], [0, 0, -1]), //back
    makeQuad([0,0,1],[0,0,0],[0,1,1],[0,1,0], [-1, 0, 0]), // left
   makeQuad([1,0,1],[1,0,0],[1,1,1],[1,1,0], [1, 0, 0]), // right
   makeQuad([0,1,0],[1,1,0],[0,1,1],[1, 1, 1], [0, 1, 0]), // top
   makeQuad([0,0,0],[1,0,0],[0,0,1],[1, 0, 1], [0, -1, 0]) // bottom
  ];
const model = mergeParts(faces);
    transformVertices(model.position, x, y, z, scale);
    return model;
  }
)}

function _wallBufferInfo(mazeDataTemplate,makeBox,mergeParts,twgl,gl)
{ 
  const boxes = [];
  for (let x = 0; x < mazeDataTemplate.width; x++) {
    for (let y = 0; y < mazeDataTemplate.height; y++) {
      if (mazeDataTemplate.grid[x][y] === 'wall')
        boxes.push(makeBox(x, 0, y, 1));
    }
  }
  const model = mergeParts(boxes)
  return twgl.createBufferInfoFromArrays(gl, model);
  }


function _31(md){return(
md`### Fruits`
)}

function _32(md){return(
md`Cherry`
)}

async function _cherryURL(FileAttachment){return(
await FileAttachment("cherry.obj").url()
)}

async function _cherryModel(loadModelFromURL,cherryURL){return(
await loadModelFromURL(cherryURL, "obj")
)}

function _cherryVertexAttributes(cherryModel){return(
cherryModel.map((d) => ({
  position: { numComponents: 3, data: d.sc.positions },
  normal: { numComponents: 3, data: d.sc.normals },
  uv: { numComponents: 2, data: d.sc.uvs }
}))
)}

function _cherryBuffers(cherryVertexAttributes,twgl,gl){return(
cherryVertexAttributes.map((vertexAttributes) => twgl.createBufferInfoFromArrays(gl, vertexAttributes))
)}

function _cherryExtent(computeModelExtent,cherryModel){return(
computeModelExtent(cherryModel)
)}

function _38(md){return(
md`Banana`
)}

async function _bananaURL(FileAttachment){return(
await FileAttachment("banana.obj").url()
)}

async function _bananaModel(loadModelFromURL,bananaURL){return(
await loadModelFromURL(bananaURL, "obj")
)}

function _bananaVertexAttributes(bananaModel){return(
bananaModel.map((d) => ({
  position: { numComponents: 3, data: d.sc.positions },
  normal: { numComponents: 3, data: d.sc.normals },
  uv: { numComponents: 2, data: d.sc.uvs }
}))
)}

function _bananaBuffers(bananaVertexAttributes,twgl,gl){return(
bananaVertexAttributes.map((vertexAttributes) => twgl.createBufferInfoFromArrays(gl, vertexAttributes))
)}

function _bananaExtent(computeModelExtent,bananaModel){return(
computeModelExtent(bananaModel)
)}

function _44(md){return(
md`**Adding Pac-Man Model**`
)}

async function _pacmanUrl(FileAttachment){return(
await FileAttachment("pacman-test.obj").url()
)}

async function _pacmanModel(loadModelFromURL,pacmanUrl){return(
await loadModelFromURL(pacmanUrl, "obj")
)}

function _pacmanVertexAttributes(pacmanModel){return(
pacmanModel.map((d) => ({
  position: { numComponents: 3, data: d.sc.positions },
  normal: { numComponents: 3, data: d.sc.normals },
  uv: { numComponents: 2, data: d.sc.uvs }
}))
)}

function _pacmanBuffers(pacmanVertexAttributes,twgl,gl){return(
pacmanVertexAttributes.map((vertexAttributes) => twgl.createBufferInfoFromArrays(gl, vertexAttributes))
)}

function _pacmanExtent(computeModelExtent,pacmanModel){return(
computeModelExtent(pacmanModel)
)}

function _50(md){return(
md`** Adding Clyde (Orange) **`
)}

async function _clydeURL(FileAttachment){return(
await FileAttachment("ghost.obj").url()
)}

async function _clydeModel(loadModelFromURL,clydeURL){return(
await loadModelFromURL(clydeURL, "obj")
)}

function _clydeVertexAttributes(clydeModel){return(
clydeModel.map((d) => ({
  position: { numComponents: 3, data: d.sc.positions },
  normal: { numComponents: 3, data: d.sc.normals },
  uv: { numComponents: 2, data: d.sc.uvs }
}))
)}

function _clydeBuffers(clydeVertexAttributes,twgl,gl){return(
clydeVertexAttributes.map((vertexAttributes) => twgl.createBufferInfoFromArrays(gl, vertexAttributes))
)}

function _clydeExtent(computeModelExtent,clydeModel){return(
computeModelExtent(clydeModel)
)}

function _56(md){return(
md`** Adding Inky (Blue) **`
)}

async function _inkyURL(FileAttachment){return(
await FileAttachment("ghost.obj").url()
)}

async function _inkyModel(loadModelFromURL,inkyURL){return(
await loadModelFromURL(inkyURL, "obj")
)}

function _inkyVertexAttributes(inkyModel){return(
inkyModel.map((d) => ({
  position: { numComponents: 3, data: d.sc.positions },
  normal: { numComponents: 3, data: d.sc.normals },
  uv: { numComponents: 2, data: d.sc.uvs }
}))
)}

function _inkyBuffers(inkyVertexAttributes,twgl,gl){return(
inkyVertexAttributes.map((vertexAttributes) => twgl.createBufferInfoFromArrays(gl, vertexAttributes))
)}

function _inkyExtent(computeModelExtent,inkyModel){return(
computeModelExtent(inkyModel)
)}

function _62(md){return(
md`** Adding Blinky (Red) **`
)}

async function _blinkyURL(FileAttachment){return(
await FileAttachment("ghost.obj").url()
)}

async function _blinkyModel(loadModelFromURL,blinkyURL){return(
await loadModelFromURL(blinkyURL, "obj")
)}

function _blinkyVertexAttributes(blinkyModel){return(
blinkyModel.map((d) => ({
  position: { numComponents: 3, data: d.sc.positions },
  normal: { numComponents: 3, data: d.sc.normals },
  uv: { numComponents: 2, data: d.sc.uvs }
}))
)}

function _blinkyBuffers(blinkyVertexAttributes,twgl,gl){return(
blinkyVertexAttributes.map((vertexAttributes) => twgl.createBufferInfoFromArrays(gl, vertexAttributes))
)}

function _blinkyExtent(computeModelExtent,blinkyModel){return(
computeModelExtent(blinkyModel)
)}

function _68(md){return(
md`** Adding Pinky (Pink, probably) **`
)}

async function _pinkyURL(FileAttachment){return(
await FileAttachment("ghost.obj").url()
)}

async function _pinkyModel(loadModelFromURL,pinkyURL){return(
await loadModelFromURL(pinkyURL, "obj")
)}

function _pinkyVertexAttributes(pinkyModel){return(
pinkyModel.map((d) => ({
  position: { numComponents: 3, data: d.sc.positions },
  normal: { numComponents: 3, data: d.sc.normals },
  uv: { numComponents: 2, data: d.sc.uvs }
}))
)}

function _pinkyBuffers(pinkyVertexAttributes,twgl,gl){return(
pinkyVertexAttributes.map((vertexAttributes) => twgl.createBufferInfoFromArrays(gl, vertexAttributes))
)}

function _pinkyExtent(computeModelExtent,pinkyModel){return(
computeModelExtent(pinkyModel)
)}

function _74(md){return(
md`## Audio Source`
)}

function _75(htl){return(
htl.html`<audio id="death" src="http://img.go-here.nl/pacman/Pacman Dies.mp3" preload="auto"></audio>`
)}

function _76(htl){return(
htl.html`<audio id="audio" src="http://img.go-here.nl/pacman/Pacman Opening Song.mp3" preload="auto"></audio>`
)}

function _77(md){return(
md`**Rendering the Scene**`
)}

function _renderer(){return(
{renderScene: () =>{}}
)}

function _b(renderer,renderScene)
{
  renderer.renderScene = renderScene;
}


function _renderScene(getViewMatrix,radius,deg2rad,cameraAngles,getProjectionMatrix,fov_Y,near,far,normalProgramInfo,lightParameters,lightPosition,lightDirection,m4,gl,ambientLightIntensity,twgl,makeBox,setMaskingParameters,setStencilingParameters,hex2rgb,cellTypeColors,wallHeight,wallBufferInfo,ghostBarrierBufferInfo,findCellsOfType,pelletSphere,bigPelletSphere,pacmanExtent,pacmanBuffers,inkyExtent,inkyBuffers,blinkyExtent,blinkyBuffers,clydeExtent,clydeBuffers,pinkyExtent,pinkyBuffers,cherryExtent,cherryBuffers,bananaExtent,bananaBuffers,setDefaultParameters){return(
(aspect, gameState, shadow) => { 
  
  const viewMatrix = getViewMatrix(
      radius,
      deg2rad(cameraAngles.x_angle),
      deg2rad(cameraAngles.y_angle)
    );
    const projectionMatrix = getProjectionMatrix({fov: fov_Y, near, far, aspect});
  const {pacmanPos, blinkyPos, clydePos, pinkyPos, inkyPos, cherryPos, bananaPos, mazeData, direction, blinkyDirection, inkyDirection, clydeDirection, pinkyDirection} = gameState;
  const programInfo = normalProgramInfo;
  const light = lightParameters.lightType=="point" ? [...lightPosition,1] : [...lightDirection,0];
  const eyePosition = m4.inverse(viewMatrix).slice(12, 15);
  //gl.depthFunc(gl.LEQUAL);
  gl.useProgram(programInfo.program);
  const modelMatrix = m4.identity();
  const baseUniforms = {
    modelMatrix, viewMatrix, projectionMatrix,
    light,
    eyePosition,
    ambientIntensity: ambientLightIntensity / 100,
    shadow: shadow,
    Q: [0, 0, 0],
    planeNormal: [0, 1, 0],
    //tex - TODO: add tex back when we have textures
  };
  twgl.setUniforms(programInfo, baseUniforms);
  function renderFloor() { 
    // Draw the floor
    const floor = twgl.createBufferInfoFromArrays(gl, makeBox(0, 0, 0, 1));
    twgl.setUniforms(programInfo, {modelMatrix: m4.multiply(m4.translation([0,-0.1,0]),m4.scaling([mazeData.width, 0.1, mazeData.height])), color: [0.5, 0.5, 0.5, 1]});
    twgl.setBuffersAndAttributes(gl, programInfo, floor);
    twgl.drawBufferInfo(gl, floor);
  }
  if (shadow) {
    gl.clearStencil(0);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    setMaskingParameters(1);
    twgl.setUniforms(programInfo, {shadow: false});
    renderFloor();
    twgl.setUniforms(programInfo, {shadow: true});
    setStencilingParameters(1);
    
  }

  const frightenedColor = (gameState.timestamp) % 600 < 300 ? [...hex2rgb("#0000FF"), 1] : [...hex2rgb("#FFFFFF"), 1];
  // Draw the walls
  twgl.setUniforms(programInfo, {color: cellTypeColors['wall'], modelMatrix: m4.scale(modelMatrix, [1, wallHeight, 1])});
  [wallBufferInfo].forEach((bufferInfo) => {
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo, gl['TRIANGLES']);
  });
  // End (Draw the walls)

  // Draw the gray barriers separating the ghost area from the rest of the map
  twgl.setUniforms(programInfo, {color: cellTypeColors['ghost_barrier'], modelMatrix});
  [ghostBarrierBufferInfo].forEach((bufferInfo) => {
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo, gl['TRIANGLES']);
  });
  // End (Draw ghost barriers)

  // Draw the pellets (TODO: replace this with a version that supports removing pellets)
  twgl.setUniforms(programInfo, {modelMatrix, color: cellTypeColors['normal']});
  for (const {x, y} of findCellsOfType(mazeData, 'normal')) {
   const mat = m4.translation([x + 0.5, (1 - 0.15*2)/2, y + 0.5]);
    twgl.setUniforms(programInfo, {modelMatrix: mat});
   twgl.setBuffersAndAttributes(gl, programInfo, pelletSphere, 'TRIANGLES');
   twgl.drawBufferInfo(gl, pelletSphere);
  }
  // End (Draw the pellets)

  // Draw the big pellets (TODO: replace this with a version that supports removing pellets)
  twgl.setUniforms(programInfo, {modelMatrix, color: cellTypeColors['big']});
  for (const {x, y} of findCellsOfType(mazeData, 'big')) {
    const mat = m4.translation([x + 0.5, (1 - 0.2*2)/2, y + 0.5]);
    const bpmat = m4.scale(mat, [1.5, 1.5, 1.5]);
    twgl.setUniforms(programInfo, {modelMatrix:bpmat});
    twgl.setBuffersAndAttributes(gl, programInfo, bigPelletSphere, 'TRIANGLES');
    twgl.drawBufferInfo(gl, bigPelletSphere);
  }
  // End (Draw the big pellets)

  if (!shadow) {
    renderFloor();
  }
  // End (Draw the floor)

  // Draw pacman
  // translation
  const translatedPacman = m4.translation([pacmanPos.x + 0.5, 0.1, pacmanPos.y + 0.5]); 

  var degree = directionToAngle(direction);
  var rot = m4.rotationY(deg2rad(degree));
  
  var rotatedPacman = m4.multiply(translatedPacman, rot);
  
  const scaledPacman = m4.multiply(m4.scale(rotatedPacman, [0.4,0.4,0.4]), m4.translation([0, -pacmanExtent.min[1], 0]));

  twgl.setUniforms(programInfo,{modelMatrix: scaledPacman,color:[1,1,0,1]});
  twgl.setBuffersAndAttributes(gl,programInfo,pacmanBuffers[0],'TRIANGLES');
  twgl.drawBufferInfo(gl,pacmanBuffers[0]);
  twgl.setUniforms(programInfo,{modelMatrix: scaledPacman,color:[0,0,0,1]});
  twgl.setBuffersAndAttributes(gl,programInfo,pacmanBuffers[1],'TRIANGLES');
  twgl.drawBufferInfo(gl,pacmanBuffers[1]);

  // End (Draw pacman)

  function getGhostMat(rot, extent, ghostPos) {
    const ghostScale = 1 / (extent.max[2] - extent.min[2]);
    const ghostMat = m4.multiply(m4.translation([ghostPos.x + 0.5, 0.25, ghostPos.y + 0.5]),m4.multiply(rot,m4.multiply(m4.scaling([ghostScale, ghostScale, ghostScale]), m4.translation([0, -(extent.min[1]), 0]))));
    return ghostMat;
  }
  // Draw Inky
  //const translatedInky = m4.translation([inkyPos.x + 0.5, 0.5, inkyPos.y + 0.5]);
  
  degree = directionToAngle(inkyDirection);
  // console.log('inky degree');
  // console.log(inkyDirection);
  rot = m4.rotationY(deg2rad(degree));
   
  //var rotatedInky = m4.multiply(translatedInky, rot);
  //const inkyScale = 1 / (inkyExtent.max[2] - inkyExtent.min[2]);
  //const scaledInky = m4.scale(rotatedInky, [inkyScale, inkyScale, inkyScale]);
  const scaledInky = getGhostMat(rot, inkyExtent, inkyPos)
  twgl.setUniforms(programInfo,{modelMatrix: scaledInky,color:[0, 0, 0, 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,inkyBuffers[0],'TRIANGLES');
  twgl.drawBufferInfo(gl,inkyBuffers[0]);
  twgl.setUniforms(programInfo,{modelMatrix: scaledInky,color:  gameState.ghostFrightened.inky ? frightenedColor : [...hex2rgb("#00FFFF"), 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,inkyBuffers[1],'TRIANGLES');
  twgl.drawBufferInfo(gl,inkyBuffers[1]);

  // End Draw Inky

  // Draw Blinky
  //const translatedBlinky = m4.translation([blinkyPos.x + 0.5, 0, blinkyPos.y + 0.5]);
  
  degree = directionToAngle(blinkyDirection);
  rot = m4.rotationY(deg2rad(degree));
  const blinkyScale = 1 / (blinkyExtent.max[2] - blinkyExtent.min[2]);
  const scaledBlinky = m4.multiply(m4.translation([blinkyPos.x + 0.5, 0.25, blinkyPos.y + 0.5]),m4.multiply(rot,m4.multiply(m4.scaling([blinkyScale, blinkyScale, blinkyScale]), m4.translation([0, -(blinkyExtent.min[1]), 0]))));
  twgl.setUniforms(programInfo,{modelMatrix: scaledBlinky,color:[0, 0, 0, 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,blinkyBuffers[0],'TRIANGLES');
  twgl.drawBufferInfo(gl,blinkyBuffers[0]);
  twgl.setUniforms(programInfo,{modelMatrix: scaledBlinky,color: gameState.ghostFrightened.blinky ? frightenedColor : [...hex2rgb("#ff0000"), 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,blinkyBuffers[1],'TRIANGLES');
  twgl.drawBufferInfo(gl,blinkyBuffers[1]);

  // End Draw Blinky
  
  // Draw Clyde 
  //const translatedClyde = m4.translation([clydePos.x + 0.5, 0.5, clydePos.y + 0.5]);
  
  degree = directionToAngle(clydeDirection);
  rot = m4.rotationY(deg2rad(degree));
   
  //var rotatedClyde = m4.multiply(translatedClyde, rot);
  //const clydeScale = 1 / (clydeExtent.max[2] - clydeExtent.min[2]);
  const scaledClyde = getGhostMat(rot, clydeExtent, clydePos);//m4.scale(rotatedClyde, [clydeScale, clydeScale, clydeScale]);
  
  twgl.setUniforms(programInfo,{modelMatrix: scaledClyde,color:[0, 0, 0, 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,clydeBuffers[0],'TRIANGLES');
  twgl.drawBufferInfo(gl,clydeBuffers[0]);
  twgl.setUniforms(programInfo,{modelMatrix: scaledClyde,color: gameState.ghostFrightened.clyde ? frightenedColor : [...hex2rgb("#FFA500"), 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,clydeBuffers[1],'TRIANGLES');
  twgl.drawBufferInfo(gl,clydeBuffers[1]);

  // End Draw Clyde

  // Draw Pinky
  //const translatedPinky = m4.translation([pinkyPos.x + 0.5, 0.5, pinkyPos.y + 0.5]);
  
  degree = directionToAngle(pinkyDirection);
  rot = m4.rotationY(deg2rad(degree));
   
  //var rotatedPinky = m4.multiply(translatedPinky, rot);
  //const pinkyScale = 1 / (pinkyExtent.max[2] - pinkyExtent.min[2]);
  //const scaledPinky = m4.scale(rotatedPinky, [pinkyScale, pinkyScale, pinkyScale]);
  const scaledPinky = getGhostMat(rot, pinkyExtent, pinkyPos)
  twgl.setUniforms(programInfo,{modelMatrix: scaledPinky,color:[0, 0, 0, 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,pinkyBuffers[0],'TRIANGLES');
  twgl.drawBufferInfo(gl,pinkyBuffers[0]);
  twgl.setUniforms(programInfo,{modelMatrix: scaledPinky,color:gameState.ghostFrightened.pinky ? frightenedColor : [...hex2rgb("#FFC0CB"), 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,pinkyBuffers[1],'TRIANGLES');
  twgl.drawBufferInfo(gl,pinkyBuffers[1]);
  // End Draw Pinky

  // Draw Cherry
  const cherryScale = 1 / (cherryExtent.max[2] - cherryExtent.min[2]);
  // rot = m4.rotationZ(deg2rad(90));
  const cherryMatrix = m4.multiply(m4.translation([cherryPos.x + 0.5, 0.5, cherryPos.y + 0.5]),m4.multiply(m4.scaling([cherryScale, cherryScale, cherryScale]), m4.translation([0, -cherryExtent.min[1], 0])))
  twgl.setUniforms(programInfo,{modelMatrix: cherryMatrix,color:[...hex2rgb("#AA0000"), 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,cherryBuffers[0],'TRIANGLES');
  twgl.drawBufferInfo(gl,cherryBuffers[0]);
  twgl.setUniforms(programInfo,{modelMatrix: cherryMatrix,color:[...hex2rgb("#FF0000"), 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,cherryBuffers[1],'TRIANGLES');
  twgl.drawBufferInfo(gl,cherryBuffers[1]);
  // // End Draw Cherry

  // Draw Banana -- adjust size, rotation, position
  const bananaScale = (1 / (bananaExtent.max[2] - bananaExtent.min[2]))*.2;
  //console.log('banana scale:');
  //console.log(bananaScale);
  const bananaMatrix = m4.multiply(m4.translation([bananaPos.x + 0.5, 0.5, bananaPos.y + 0.5]),m4.scaling([bananaScale, bananaScale, bananaScale]))
  twgl.setUniforms(programInfo,{modelMatrix: bananaMatrix,color:[...hex2rgb("#FFFF00"), 1]});
  twgl.setBuffersAndAttributes(gl,programInfo,bananaBuffers[0],'TRIANGLES');
  twgl.drawBufferInfo(gl,bananaBuffers[0]);

  //console.log(cherry)
  /* Rotation: Once direction is updated, choose the degree of model rotation, then rotate on Y-axis.
  */
  if (shadow) {
    setDefaultParameters()
  }
  function directionToAngle(direction) {
    if(direction == 'right'){
      return 90;
    } else if(direction == 'up'){
      return 180;
    }else if(direction == 'left'){
       return 270;
    }else{
      return 0;
    }
  }
}
)}

function _findCellsOfType(){return(
function findCellsOfType(mazeData, type) {
  function* findCellsOfType_generator(type) {
    for (let x = 0; x < mazeData.width; x++) {
      for (let y = 0; y < mazeData.height; y++) {
        if (mazeData.grid[x][y] === type) {
          yield {x, y, type: mazeData.grid[x][y]};
        }
      }
    }
}
  return [...findCellsOfType_generator(type)];
}
)}

function _defaultWidth(){return(
1150
)}

function _defaultHeight(){return(
500
)}

function _gl(DOM,defaultWidth,defaultHeight)
{
  const myCanvas = DOM.canvas(defaultWidth, defaultHeight);

  const gl = myCanvas.getContext("webgl2", { stencil: true });
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.3, 0.4, 0.5, 1);
  //gl.enable(gl.SCISSOR_TEST);
  gl.lineWidth(2);
  return gl;
}


function _reset(html,$0)
{
  console.log("Creating a new reset button");
  const button = html`<button> RESTART </button>`;
  button.style.background = "red";
  const audio = document.getElementById("audio");
  const res = {el: button}
  res.value = false;
  button.addEventListener('click', (e) => {
    console.log("test");
    try {audio.play();}catch(e){}
    document.getElementById("game_overlay").style.display='none';
    $0.value = true;
  });
return res;
}


function _gameDivC(gl,gameOverlayEl)
{
  const div = document.createElement("div");
  div.style="position: relative;";
  div.appendChild(gl.canvas);
  div.appendChild(gameOverlayEl)
  return {gameDiv: div};
}


function _gameOverlayEl(gl,reset)
{
  const div2 = document.createElement("div");
  div2.style="position:absolute; top: 0; display: none; background-color: #777777CC";
  div2.style.width=gl.canvas.width+"px";
  div2.style.height=gl.canvas.height+"px";
  div2.id = "game_overlay";
  const center = document.createElement("div");
  center.style="text-align: center; margin: 0; position: absolute; top: 50%; width: 100%; transform: translateY(-50%)"
  const span = document.createElement("div");
  span.id="gameOverlay_text";
  span.style= "font-size: 100px; color: red;";
  span.textContent="Game Over";
  center.appendChild(span);
  center.appendChild(reset.el);
  div2.appendChild(center)
  
  return div2;
}


function _88(md){return(
md`** Camera & Light**`
)}

function _near(){return(
0.1
)}

function _far(){return(
2.5
)}

function _cameraLookAt(modelDim){return(
modelDim.center
)}

function _radius(){return(
1
)}

function _getViewMatrix(m4,v3,cameraLookAt,modelDim){return(
(r, x_angle, y_angle) => {
  const gazeDirection = m4.transformDirection(
    m4.multiply(m4.rotationY(y_angle), m4.rotationX(x_angle)),
    [0, 0, 1]
  );
  const eye = v3.add(cameraLookAt, v3.mulScalar(gazeDirection, r*modelDim.dia));
  const cameraMatrix = m4.lookAt(eye, cameraLookAt, [0, 1, 0]);
  return m4.inverse(cameraMatrix);
}
)}

function _getProjectionMatrix(m4,deg2rad,modelDim){return(
({fov, near, far, aspect}) => {
  return m4.perspective(
    deg2rad(fov),
    aspect,
    near * modelDim.dia,
    far * modelDim.dia
  );
}
)}

function _lightPosition(lightParameters,modelDim,v3,lightDirection)
{
  const D = (lightParameters.distanceFactor * modelDim.dia) / 2;
  return v3.add(modelDim.center, v3.mulScalar(lightDirection, D));
}


function _lightDirection(m4,deg2rad,lightParameters){return(
m4.transformDirection(
  m4.rotationY(deg2rad(lightParameters.orientation)),
  [2, 4, 0]
)
)}

function _97(md){return(
md`*** Life and Score ***`
)}

function _livesimg(FileAttachment){return(
FileAttachment("lives.jpg").url()
)}

function _liveimg(FileAttachment){return(
FileAttachment("live.jpg").url()
)}

function _100(FileAttachment){return(
FileAttachment("score.jpg").image()
)}

function _scoresimg(FileAttachment){return(
FileAttachment("score.jpg").url()
)}

function _texturl(FileAttachment){return(
FileAttachment("text.png").url()
)}

function _livetex(twgl,gl,liveimg){return(
twgl.createTexture(gl, {
  src: liveimg,
  //    target: gl.TEXTURE_2D,
  flipY: true
  //   mag: gl.NEAREST,
  //    min: gl.LINEAR
})
)}

function _livestex(twgl,gl,livesimg){return(
twgl.createTexture(gl, {
  src: livesimg,
  //    target: gl.TEXTURE_2D,
  flipY: true
  //   mag: gl.NEAREST,
  //    min: gl.LINEAR
})
)}

function _scoretex(twgl,gl,scoresimg){return(
twgl.createTexture(gl, {
  src: scoresimg,
  //    target: gl.TEXTURE_2D,
  flipY: true
  //   mag: gl.NEAREST,
  //    min: gl.LINEAR
})
)}

function _makeText(DOM){return(
function makeText(text) {
  const ctx = DOM.context2d();

  const t = ctx.measureText(text);
  ctx.canvas.width = Math.ceil(t.width) + 150;
  ctx.canvas.height = 48;

  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.font = "48px monospace";
  ctx.fillStyle = "yellow";
  ctx.textAlign = "center";
  ctx.textBaseAlign = "middle";

  ctx.fillText(text, (ctx.canvas.width / 2) | 0, ctx.canvas.height | 0);
  return ctx.canvas;
}
)}

function _scoreSceneProgramInfo(errorBlock,twgl,gl)
{
  const vs = `#version 300 es
    precision mediump float;
    in vec3 position;
    in vec2 uv;
    out vec2 fragUV;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
   uniform mat4 projectionMatrix;
    
    void main () {
           fragUV = uv;
       gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position,1);

      
    }`;

  const fs = `#version 300 es
    precision mediump float;
    out vec4 outColor;
 
    in vec2 fragUV;
   uniform sampler2D tex;
    
    void main () {
    
      outColor = texture( tex,fragUV);
    }`;
  errorBlock.style.height = "20px";
  errorBlock.innerHTML = "Program Shader compilation successful";
  return twgl.createProgramInfo(gl, [vs, fs], (message) => {
    errorBlock.style.height = "400px";
    errorBlock.innerHTML = "Scene Program Shader compilation error\n" + message;
  });
}


function _textbufferInfoArray(textvertexAttributes,twgl,gl){return(
textvertexAttributes.map((d) =>
  twgl.createBufferInfoFromArrays(gl, d)
)
)}

function _textvertexAttributes(){return(
[
  {
    // Attribute position

    position: {
      numComponents: 3,
      data: [1, 1, 0, -1, 1, 0, -1, -1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]
    },
    uv: {
      numComponents: 2,
      //  data: [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0]
      data: [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1]
    }
  }
]
)}

function _scoretextures(makeText,twgl,gl){return(
function (msg) {
  const canvas = makeText(msg);
  const scale = 1;
  return {
    tex: twgl.createTexture(gl, { src: canvas })
    //  scale: [canvas.width * scale, canvas.height * scale, 1]
  };
}
)}

function _renderSoreScene(gl,m4,scoretex,textbufferInfoArray,twgl,scoretextures,livestex,livetex){return(
(sceneProgramInfo, score, live) => {
  gl.useProgram(sceneProgramInfo.program);

  var tmat = m4.identity();
  tmat = m4.setTranslation(tmat, [-9, -9, 0]);
  var uniforms = {
    // Add any required uniform variable name and value pair
    modelMatrix: tmat,
    projectionMatrix: m4.ortho(-10, 10, -10, 10, -30, 30),
    viewMatrix: m4.lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]),

    tex: scoretex
  };

  textbufferInfoArray.forEach((bufferInfo) => {
    twgl.setUniforms(sceneProgramInfo, uniforms);
    twgl.setBuffersAndAttributes(gl, sceneProgramInfo, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo);
  });

  tmat = m4.identity(); // .translate(-1, -1, 0);
  tmat = m4.setTranslation(tmat, [-7, -9, 0]);
  uniforms = {
    // Add any required uniform variable name and value pair
    modelMatrix: tmat,
    projectionMatrix: m4.ortho(-10, 10, -10, 10, -30, 30),
    viewMatrix: m4.lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]),
    tex: scoretextures(score).tex
  };

  textbufferInfoArray.forEach((bufferInfo) => {
    twgl.setUniforms(sceneProgramInfo, uniforms);
    twgl.setBuffersAndAttributes(gl, sceneProgramInfo, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo);
  });

  tmat = m4.identity(); // .translate(-1, -1, 0);
  tmat = m4.setTranslation(tmat, [-5 + 3, -9, 0]);
  uniforms = {
    // Add any required uniform variable name and value pair
    modelMatrix: tmat,
    projectionMatrix: m4.ortho(-10, 10, -10, 10, -30, 30),
    viewMatrix: m4.lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]),
    tex: livestex
    // tex:
  };

  textbufferInfoArray.forEach((bufferInfo) => {
    twgl.setUniforms(sceneProgramInfo, uniforms);
    twgl.setBuffersAndAttributes(gl, sceneProgramInfo, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo);
  });

  for (let index = 0; index < live; ++index) {
    tmat = m4.identity(); // .translate(-1, -1, 0);
    tmat = m4.setTranslation(tmat, [-3 + index * 2 + 3, -9, 0]);
    uniforms = {
      // Add any required uniform variable name and value pair
      modelMatrix: tmat,
      projectionMatrix: m4.ortho(-10, 10, -10, 10, -30, 30),
      viewMatrix: m4.lookAt([0, 0, 1], [0, 0, 0], [0, 1, 0]),
      tex: livetex
      // tex:
    };

    textbufferInfoArray.forEach((bufferInfo) => {
      twgl.setUniforms(sceneProgramInfo, uniforms);
      twgl.setBuffersAndAttributes(gl, sceneProgramInfo, bufferInfo);
      twgl.drawBufferInfo(gl, bufferInfo);
    });
  }
}
)}

function _112(md){return(
md`### Buffers`
)}

function _boxBufferInfo(twgl,gl)
{
  const boxAttributes = {
    position: [
      -1,
      -1,
      -1,

      1,
      -1,
      -1,

      1,
      1,
      -1,

      -1,
      1,
      -1,

      -1,
      -1,
      1,

      1,
      -1,
      1,

      1,
      1,
      1,

      -1,
      1,
      1
    ],
    indices: [
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      0,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      4,
      0,
      4,
      1,
      5,
      2,
      6,
      3,
      7
    ]
  };
  return twgl.createBufferInfoFromArrays(gl, boxAttributes);
}


function _modelDim(mazeDataTemplate)
{
  const min = [0, 0, 0]// [-1, -1, -1];
  const max = [mazeDataTemplate.width, 1, mazeDataTemplate.height];//[2,2,2]//[mazeData.width, 0, mazeData.height];
  const dx = max[0] - min[0];
  const dy = max[1] - min[1];
  const dz = max[2] - min[2];
  const dia = Math.sqrt(dx*dx + dy*dy + dz*dz);
  return {min, max, center: [(min[0] + max[0])/2, (min[1] + max[1])/2, (min[2] + max[2])/2],
          dia}
}


function _lightBufferInfo(twgl,gl)
{
  const sphereVertices = twgl.primitives.createSphereVertices(0.5, 5, 5);
  return twgl.createBufferInfoFromArrays(gl, sphereVertices);
}


function _setStencilingParameters(gl){return(
(ref) => {
  // drawMask function from https://observablehq.com/@esperanc/stencil-buffer
  gl.enable(gl.STENCIL_TEST);
  gl.stencilFunc(
    gl.EQUAL, // the test
    ref, // reference value
    0xff // mask
  );
  gl.stencilOp(
    gl.KEEP, // what to do if the stencil test fails
    gl.KEEP, // what to do if the depth test fails
    gl.KEEP // what to do if both tests pass
  );
  gl.colorMask(true, true, true, true);
  gl.depthMask(true);
}
)}

function _setMaskingParameters(gl){return(
(ref) => {
  // drawMask function from https://observablehq.com/@esperanc/stencil-buffer
  gl.enable(gl.STENCIL_TEST);
  gl.stencilFunc(
    gl.ALWAYS, // the test
    ref, // reference value
    0xff // mask
  );
  gl.stencilOp(
    gl.REPLACE, // what to do if the stencil test fails
    gl.REPLACE, // what to do if the depth test fails
    gl.REPLACE // what to do if both tests pass
  );
  gl.colorMask(false, false, false, false);
  gl.enable(gl.DEPTH_TEST);
  gl.depthMask(false);
}
)}

function _setDefaultParameters(gl){return(
() => {
  gl.disable(gl.STENCIL_TEST);
  gl.enable(gl.DEPTH_TEST);
  gl.colorMask(true, true, true, true);
  gl.depthMask(true);
}
)}

function _119(md){return(
md`## Maze Structure`
)}

async function _img(FileAttachment){return(
await FileAttachment("pacman layout@2.png").image()
)}

async function _img3(FileAttachment)
{
  const img2 = await FileAttachment("pacman layout@2.png").image()
  // const img2 = await FileAttachment("pacman layout - Copy@1.png").image()
  img2.style.height=img2.height*4+"px";
  img2.style.width=img2.width*4+"px";
  img2.style["image-rendering"]="pixelated";
  return img2;
 
}


function _cellTypeColors(cellTypes,hex2rgb)
{
  function convert(colorStr) {
    return colorStr.split(",").map((str) => parseInt(str)/255);
  }
  const entries = Object.entries(cellTypes).map(([colorStr, type]) => {
    return [type, convert(colorStr)];
  });
  const pixelColors = Object.fromEntries(entries);
  return Object.assign(pixelColors, {
    'ghost_barrier': [...hex2rgb("#d6d6d6"), 1]
    //'big': convert("255,182,150,255"),
    //'normal': convert("207,197,191,255"),
    //'wall': convert("47,49,107,255")
  });
}


function _cellTypes(){return(
{
    "57,49,223,255": "wall",
    "255,255,255,255": "white_other", //FIXME,
    "255,127,39,255": "normal",
    "237,28,36,255": "big",
    "255,174,201,255": "ghost_barrier", //FIXME
    "0,0,0,255": "no_pellet", // FIXME
    "163,73,164,255": "warp_tunnel"
  }
)}

function _mazeDataTemplate(img,cellTypes)
{
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ct = canvas.getContext('2d');
  ct.drawImage(img, 0, 0, img.width, img.height);
  const {data} = ct.getImageData(0, 0, img.width, img.height);
  const pixelGrid = [];
  for (let y = 0; y < img.height; y++) {
  for (let x = 0; x < img.width; x++) {
    
      pixelGrid[x] = pixelGrid[x] || [];
      const idx = (y * img.width + x) * 4;
      pixelGrid[x][y] = {r: data[idx], g: data[idx + 1], b: data[idx + 2], a: data[idx + 3]};
    }
  }

  //const colors = {};
                    
  const grid = pixelGrid.map((column) => {
    return column.map((data) => {
      const key =[data.r, data.g, data.b, data.a].join(',');
    /*colors[key] = colors[key] || 0;
      colors[key]++;*/
      return cellTypes[key] || `Invalid: ${key}`;
    });
  });
  return {grid, width: img.width, height: img.height};
}


function _makeQuad(){return(
function makeQuad(p1, p2, p3, p4, normal) {
    return {
      position: [
        ...p1,
        ...p2,
        ...p3,
        ...p4
      ],
      normal: [...normal, ...normal, ...normal, ...normal],
      indices: [
        0, 1, 2,
        1, 2, 3
      ]
    }
  }
)}

function _ghostBarrierBufferInfo(mazeDataTemplate,makeBox,wallHeight,mergeParts,twgl,gl)
{
  const boxes = [];
  for (let x = 0; x < mazeDataTemplate.width; x++) {
    for (let y = 0; y < mazeDataTemplate.height; y++) {
      if (mazeDataTemplate.grid[x][y] === 'ghost_barrier') {
        const box = makeBox(0, 0, 0, 1);
        const pos = box.position;
        for (let i = 0; i < pos.length; i+=3) {
          pos[i+0] = pos[i+0] + x;
          pos[i+1] = pos[i+1] * wallHeight;
          pos[i+2] = pos[i+2] * 0.5 + y + 0.25;
        }
        boxes.push(box);
      }
    }
  }
  const model = mergeParts(boxes);
  return twgl.createBufferInfoFromArrays(gl, model);
}


function _transformVertices(){return(
function transformVertices(pos, x, y, z, scale) {
    for (let i = 0; i < pos.length; i+=3) {
      pos[i+0] = pos[i+0] * scale + x;
      pos[i+1] = pos[i+1] * scale + y;
      pos[i+2] = pos[i+2] * scale + z;
    }
}
)}

function _mergeParts(){return(
(faces) => {
  let indexOffset = 0;
  const position = [];
  const normal = [];
  const indices = [];
  for (const face of faces) {
    position.push(...face.position);
    normal.push(...face.normal);
    for (const index of face.indices) {
      indices.push(index + indexOffset);
    }
    indexOffset += face.position.length / 3;
  }
 return {position, normal, indices}
}
)}

function _129(md){return(
md`** Program Information **`
)}

function _boxProgramInfo(twgl,gl)
{
  const vs = `#version 300 es
    precision highp float;
    in vec3 position;
  
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    void main () {
      gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position,1);
    }`,
    fs = `#version 300 es
    precision highp float;
    out vec4 outColor;
    uniform vec3 color;
    void main () {
      outColor = vec4(color,1);
    }`;
  return twgl.createProgramInfo(gl, [vs, fs]);
}


function _errorBlock(html,width){return(
html`<textarea style="height : 20px; width : ${width}px; font-size: 0.8em; display: block"></textarea>`
)}

function _sceneProgramInfo(errorBlock,twgl,gl)
{
  const shaders = {
    vs: `#version 300 es
    precision mediump float;
    in vec3 position;
    in vec3 normal;
  
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    out vec3 fragNormal;
    void main () {
      vec4 newPosition = modelMatrix*vec4(position,1);
      gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position,1);
      mat4 normalMatrix = transpose(inverse(modelMatrix));
      fragNormal = normalize((normalMatrix*vec4(normal,0)).xyz);
      gl_PointSize = 2.;
    }`,

    fs: `#version 300 es
    precision mediump float;
    out vec4 outColor;
    in vec3 fragNormal;
    uniform int n2c;
    void main () {
      vec3 N = normalize(fragNormal);
      vec3 color = (N+1.)/2.;
      outColor = vec4(color, 1);
    }`
  };
  errorBlock.style.height = "20px";
  errorBlock.innerHTML = "Program Shader compilation successful";
  return twgl.createProgramInfo(gl, [shaders.vs, shaders.fs], (message) => {
    errorBlock.style.height = "400px";
    errorBlock.innerHTML = "Program Shader compilation error\n" + message;
  });
}


function _normalProgramInfo(errorBlock,twgl,gl)
{
  const shaders = {
    vs: `#version 300 es
    precision mediump float;
    in vec3 position;
    in vec3 normal;
    uniform vec4 light;
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec3 Q;
    uniform vec3 planeNormal;
    out vec3 fragPosition;
    out vec3 fragNormal;
    uniform bool shadow;
    void main () {
      vec4 newPosition = modelMatrix*vec4(position,1);
      vec3 fragPosition = newPosition.xyz;
      vec3 q = Q + 0.001*planeNormal;
      float t =  dot((q- fragPosition), planeNormal) / dot((fragPosition - light.xyz) , planeNormal);
      vec3 shadowPosition = fragPosition + t * (fragPosition - light.xyz);
      gl_Position = projectionMatrix*viewMatrix*(shadow?vec4(shadowPosition,1):newPosition);
      mat4 normalMatrix = transpose(inverse(modelMatrix));
      fragNormal = normalize((normalMatrix*vec4(normal,0)).xyz);
    }`,

    fs: `#version 300 es
    precision mediump float;

    uniform vec4 light;

    uniform vec4 color;
    uniform float ambientIntensity;
    out vec4 outColor;
    uniform bool shadow;
    in vec3 fragNormal;
    in vec3 fragPosition;

    void main () {
      
      if (shadow) {
        outColor = vec4(0., 0., 0., 1.);
      }
      else {

      vec3 N = normalize(fragNormal);
      vec3 L;
      if(light.w==0.){
        L = normalize(light.xyz);
      }
      else{
        L = normalize(light.xyz - fragPosition);
      }
      vec3 color2 = color.a*color.rgb*(clamp(dot(N,L),0., 1.) + ambientIntensity);//Compute color
      outColor = vec4(color2, 1);
}

    }`
  };
  errorBlock.style.height = "20px";
  errorBlock.innerHTML = "Program Shader compilation successful";
  return twgl.createProgramInfo(gl, [shaders.vs, shaders.fs], (message) => {
    errorBlock.style.height = "400px";
    errorBlock.innerHTML = "Program Shader compilation error\n" + message;
  });
}


function _134(md){return(
md`** Miscellaneous **`
)}

function _colors(columns,color){return(
columns({
  leftBackgroundColor: color({
    value: "#413f46",
    description: "Left viewport background color"
  }),
  rightBackgroundColor: color({
    value: "#9ea9ae",
    description: "Right viewport background color"
  })
})
)}

function _136(md){return(
md`## Sources
Pacman Model:  
Title: "Pacman animated"   
License: CC Attribution  
Link: https://sketchfab.com/3d-models/pacman-animated-e5e8dfb614da4fa69182f252fa4274a8  
Modifications: Converted from fbx to obj and used different materials `
)}

function _137(md){return(
md`### External Libraries and Imports`
)}

function _deg2rad(){return(
(deg) => (Math.PI * deg) / 180
)}

function _m4(twgl){return(
twgl.m4
)}

function _v3(twgl){return(
twgl.v3
)}

function _twgl(require){return(
require("twgl.js")
)}

function _d3(require){return(
require("d3@7")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["text.png", {url: new URL("./files/aa27bf6437aa8f708034618e5abd5db96d5a6317622db55914a146e3dda6cae2ba853e70f6501585d654d71a7c52a893a451f01f53640231917a7344b8bf19ec.png", import.meta.url), mimeType: "image/png", toString}],
    ["cherry.obj", {url: new URL("./files/fbc54e7a2294ab9ab2da22a24a7ff6e479e8a22a67004407db1f7466b2137c53aee5de95ab589927573874f6519c9a45bacc76fb17286f5b84b2df3ae19ae4a7.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["banana.obj", {url: new URL("./files/130b18e03afd66b4c3a1557fa5189284250efd25441bc7c0a8bdfad11101970daeeaaf912769371e0cce68324b4e03cff0666de8c475382840b3eb72b657b13b.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["ghost.obj", {url: new URL("./files/32cde71d5a2e12b55f0e59a98c6188689f89c69f4a6c7492f4c78a4ce6c6d6f26e4fead849942bac8b64e09af1f53452c98bd3fbba086fe0be9cf3d732979a32.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["pacman layout@2.png", {url: new URL("./files/52d68dca4fc8fafb5066c11c8ce82e2a2cc5cf1470cb01a7e9b53a6c3c04a6f21fe8c1f142ef34c41d04cf3b6385500c50a7cfcc15c3db8a7ef0978aa39f937f.png", import.meta.url), mimeType: "image/png", toString}],
    ["pacman-test.obj", {url: new URL("./files/596e5c910fe566aea1afd41cdc04b00dc589f27d52a73275f8290b017fb66aa0dda0b4e2a07dce4df68eeee22614d7c2ff2e49266d153d8f94cbc0373c112261.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["live.jpg", {url: new URL("./files/033193ddcbb5f0d2d21781130d8d1c0cb1bdb97d76feafec07607271aafa831b47c9b05c9c0f4155601c74a4edce07cf5b81827b94dc3596fbeacf489b7dfbd7.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["score.jpg", {url: new URL("./files/0ce1c61520791604b016d21e3bf100a3969f689975c682fc94edb758aebf4eda4200a5f725f6ef5575bb1abe50f11a5567e363904ed36363d3f46a60303b9d9b.jpeg", import.meta.url), mimeType: "image/jpeg", toString}],
    ["lives.jpg", {url: new URL("./files/5a158192f9c4da67fc3dd88ed069a572d22e5801b926b9fe057d7981452ff3c760e9b7314edb40bc0a4568e2239e4049bb0b6f202f64c9d809b139d5a263a047.jpeg", import.meta.url), mimeType: "image/jpeg", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof fov_Y")).define("viewof fov_Y", ["Inputs"], _fov_Y);
  main.variable(observer("fov_Y")).define("fov_Y", ["Generators", "viewof fov_Y"], (G, _) => G.input(_));
  main.variable(observer("viewof lightParameters")).define("viewof lightParameters", ["columns","Inputs"], _lightParameters);
  main.variable(observer("lightParameters")).define("lightParameters", ["Generators", "viewof lightParameters"], (G, _) => G.input(_));
  main.variable(observer("viewof wallHeight")).define("viewof wallHeight", ["Inputs"], _wallHeight);
  main.variable(observer("wallHeight")).define("wallHeight", ["Generators", "viewof wallHeight"], (G, _) => G.input(_));
  main.variable(observer("viewof ambientLightIntensity")).define("viewof ambientLightIntensity", ["Inputs"], _ambientLightIntensity);
  main.variable(observer("ambientLightIntensity")).define("ambientLightIntensity", ["Generators", "viewof ambientLightIntensity"], (G, _) => G.input(_));
  main.variable(observer("viewof cameraAngles")).define("viewof cameraAngles", ["columns","Inputs"], _cameraAngles);
  main.variable(observer("cameraAngles")).define("cameraAngles", ["Generators", "viewof cameraAngles"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("viewof start")).define("viewof start", ["html"], _start);
  main.variable(observer("start")).define("start", ["Generators", "viewof start"], (G, _) => G.input(_));
  main.variable(observer("viewof b2")).define("viewof b2", ["html","gameDivC","gl","gameOverlayEl","defaultWidth","defaultHeight","start"], _b2);
  main.variable(observer("b2")).define("b2", ["Generators", "viewof b2"], (G, _) => G.input(_));
  main.variable(observer("gameEl")).define("gameEl", ["start","gameDivC","html"], _gameEl);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer("joystick")).define("joystick", ["d3","width","height","joystickRadius","drag"], _joystick);
  main.variable(observer("game")).define("game", ["mazeDataTemplate","createKeyManager","joyStickInput","gameOverlayEl","resetVal","gl","hex2rgb","colors","renderer","renderSoreScene","scoreSceneProgramInfo","invalidation","start"], _game);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer("joyStickInput")).define("joyStickInput", _joyStickInput);
  main.variable(observer("drag")).define("drag", ["d3","joyStickInput"], _drag);
  main.variable(observer("joystickRadius")).define("joystickRadius", _joystickRadius);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer()).define(["md"], _21);
  main.define("initial resetVal", _resetVal);
  main.variable(observer("mutable resetVal")).define("mutable resetVal", ["Mutable", "initial resetVal"], (M, _) => new M(_));
  main.variable(observer("resetVal")).define("resetVal", ["mutable resetVal"], _ => _.generator);
  main.variable(observer("createKeyManager")).define("createKeyManager", _createKeyManager);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer("pelletSphere")).define("pelletSphere", ["twgl","gl"], _pelletSphere);
  main.variable(observer("bigPelletSphere")).define("bigPelletSphere", ["twgl","gl"], _bigPelletSphere);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer("makeBox")).define("makeBox", ["makeQuad","mergeParts","transformVertices"], _makeBox);
  main.variable(observer("wallBufferInfo")).define("wallBufferInfo", ["mazeDataTemplate","makeBox","mergeParts","twgl","gl"], _wallBufferInfo);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("cherryURL")).define("cherryURL", ["FileAttachment"], _cherryURL);
  main.variable(observer("cherryModel")).define("cherryModel", ["loadModelFromURL","cherryURL"], _cherryModel);
  main.variable(observer("cherryVertexAttributes")).define("cherryVertexAttributes", ["cherryModel"], _cherryVertexAttributes);
  main.variable(observer("cherryBuffers")).define("cherryBuffers", ["cherryVertexAttributes","twgl","gl"], _cherryBuffers);
  main.variable(observer("cherryExtent")).define("cherryExtent", ["computeModelExtent","cherryModel"], _cherryExtent);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer("bananaURL")).define("bananaURL", ["FileAttachment"], _bananaURL);
  main.variable(observer("bananaModel")).define("bananaModel", ["loadModelFromURL","bananaURL"], _bananaModel);
  main.variable(observer("bananaVertexAttributes")).define("bananaVertexAttributes", ["bananaModel"], _bananaVertexAttributes);
  main.variable(observer("bananaBuffers")).define("bananaBuffers", ["bananaVertexAttributes","twgl","gl"], _bananaBuffers);
  main.variable(observer("bananaExtent")).define("bananaExtent", ["computeModelExtent","bananaModel"], _bananaExtent);
  main.variable(observer()).define(["md"], _44);
  main.variable(observer("pacmanUrl")).define("pacmanUrl", ["FileAttachment"], _pacmanUrl);
  main.variable(observer("pacmanModel")).define("pacmanModel", ["loadModelFromURL","pacmanUrl"], _pacmanModel);
  main.variable(observer("pacmanVertexAttributes")).define("pacmanVertexAttributes", ["pacmanModel"], _pacmanVertexAttributes);
  main.variable(observer("pacmanBuffers")).define("pacmanBuffers", ["pacmanVertexAttributes","twgl","gl"], _pacmanBuffers);
  main.variable(observer("pacmanExtent")).define("pacmanExtent", ["computeModelExtent","pacmanModel"], _pacmanExtent);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer("clydeURL")).define("clydeURL", ["FileAttachment"], _clydeURL);
  main.variable(observer("clydeModel")).define("clydeModel", ["loadModelFromURL","clydeURL"], _clydeModel);
  main.variable(observer("clydeVertexAttributes")).define("clydeVertexAttributes", ["clydeModel"], _clydeVertexAttributes);
  main.variable(observer("clydeBuffers")).define("clydeBuffers", ["clydeVertexAttributes","twgl","gl"], _clydeBuffers);
  main.variable(observer("clydeExtent")).define("clydeExtent", ["computeModelExtent","clydeModel"], _clydeExtent);
  main.variable(observer()).define(["md"], _56);
  main.variable(observer("inkyURL")).define("inkyURL", ["FileAttachment"], _inkyURL);
  main.variable(observer("inkyModel")).define("inkyModel", ["loadModelFromURL","inkyURL"], _inkyModel);
  main.variable(observer("inkyVertexAttributes")).define("inkyVertexAttributes", ["inkyModel"], _inkyVertexAttributes);
  main.variable(observer("inkyBuffers")).define("inkyBuffers", ["inkyVertexAttributes","twgl","gl"], _inkyBuffers);
  main.variable(observer("inkyExtent")).define("inkyExtent", ["computeModelExtent","inkyModel"], _inkyExtent);
  main.variable(observer()).define(["md"], _62);
  main.variable(observer("blinkyURL")).define("blinkyURL", ["FileAttachment"], _blinkyURL);
  main.variable(observer("blinkyModel")).define("blinkyModel", ["loadModelFromURL","blinkyURL"], _blinkyModel);
  main.variable(observer("blinkyVertexAttributes")).define("blinkyVertexAttributes", ["blinkyModel"], _blinkyVertexAttributes);
  main.variable(observer("blinkyBuffers")).define("blinkyBuffers", ["blinkyVertexAttributes","twgl","gl"], _blinkyBuffers);
  main.variable(observer("blinkyExtent")).define("blinkyExtent", ["computeModelExtent","blinkyModel"], _blinkyExtent);
  main.variable(observer()).define(["md"], _68);
  main.variable(observer("pinkyURL")).define("pinkyURL", ["FileAttachment"], _pinkyURL);
  main.variable(observer("pinkyModel")).define("pinkyModel", ["loadModelFromURL","pinkyURL"], _pinkyModel);
  main.variable(observer("pinkyVertexAttributes")).define("pinkyVertexAttributes", ["pinkyModel"], _pinkyVertexAttributes);
  main.variable(observer("pinkyBuffers")).define("pinkyBuffers", ["pinkyVertexAttributes","twgl","gl"], _pinkyBuffers);
  main.variable(observer("pinkyExtent")).define("pinkyExtent", ["computeModelExtent","pinkyModel"], _pinkyExtent);
  main.variable(observer()).define(["md"], _74);
  main.variable(observer()).define(["htl"], _75);
  main.variable(observer()).define(["htl"], _76);
  main.variable(observer()).define(["md"], _77);
  main.variable(observer("renderer")).define("renderer", _renderer);
  main.variable(observer("b")).define("b", ["renderer","renderScene"], _b);
  main.variable(observer("renderScene")).define("renderScene", ["getViewMatrix","radius","deg2rad","cameraAngles","getProjectionMatrix","fov_Y","near","far","normalProgramInfo","lightParameters","lightPosition","lightDirection","m4","gl","ambientLightIntensity","twgl","makeBox","setMaskingParameters","setStencilingParameters","hex2rgb","cellTypeColors","wallHeight","wallBufferInfo","ghostBarrierBufferInfo","findCellsOfType","pelletSphere","bigPelletSphere","pacmanExtent","pacmanBuffers","inkyExtent","inkyBuffers","blinkyExtent","blinkyBuffers","clydeExtent","clydeBuffers","pinkyExtent","pinkyBuffers","cherryExtent","cherryBuffers","bananaExtent","bananaBuffers","setDefaultParameters"], _renderScene);
  main.variable(observer("findCellsOfType")).define("findCellsOfType", _findCellsOfType);
  main.variable(observer("defaultWidth")).define("defaultWidth", _defaultWidth);
  main.variable(observer("defaultHeight")).define("defaultHeight", _defaultHeight);
  main.variable(observer("gl")).define("gl", ["DOM","defaultWidth","defaultHeight"], _gl);
  main.variable(observer("reset")).define("reset", ["html","mutable resetVal"], _reset);
  main.variable(observer("gameDivC")).define("gameDivC", ["gl","gameOverlayEl"], _gameDivC);
  main.variable(observer("gameOverlayEl")).define("gameOverlayEl", ["gl","reset"], _gameOverlayEl);
  main.variable(observer()).define(["md"], _88);
  main.variable(observer("near")).define("near", _near);
  main.variable(observer("far")).define("far", _far);
  main.variable(observer("cameraLookAt")).define("cameraLookAt", ["modelDim"], _cameraLookAt);
  main.variable(observer("radius")).define("radius", _radius);
  main.variable(observer("getViewMatrix")).define("getViewMatrix", ["m4","v3","cameraLookAt","modelDim"], _getViewMatrix);
  main.variable(observer("getProjectionMatrix")).define("getProjectionMatrix", ["m4","deg2rad","modelDim"], _getProjectionMatrix);
  main.variable(observer("lightPosition")).define("lightPosition", ["lightParameters","modelDim","v3","lightDirection"], _lightPosition);
  main.variable(observer("lightDirection")).define("lightDirection", ["m4","deg2rad","lightParameters"], _lightDirection);
  main.variable(observer()).define(["md"], _97);
  main.variable(observer("livesimg")).define("livesimg", ["FileAttachment"], _livesimg);
  main.variable(observer("liveimg")).define("liveimg", ["FileAttachment"], _liveimg);
  main.variable(observer()).define(["FileAttachment"], _100);
  main.variable(observer("scoresimg")).define("scoresimg", ["FileAttachment"], _scoresimg);
  main.variable(observer("texturl")).define("texturl", ["FileAttachment"], _texturl);
  main.variable(observer("livetex")).define("livetex", ["twgl","gl","liveimg"], _livetex);
  main.variable(observer("livestex")).define("livestex", ["twgl","gl","livesimg"], _livestex);
  main.variable(observer("scoretex")).define("scoretex", ["twgl","gl","scoresimg"], _scoretex);
  main.variable(observer("makeText")).define("makeText", ["DOM"], _makeText);
  main.variable(observer("scoreSceneProgramInfo")).define("scoreSceneProgramInfo", ["errorBlock","twgl","gl"], _scoreSceneProgramInfo);
  main.variable(observer("textbufferInfoArray")).define("textbufferInfoArray", ["textvertexAttributes","twgl","gl"], _textbufferInfoArray);
  main.variable(observer("textvertexAttributes")).define("textvertexAttributes", _textvertexAttributes);
  main.variable(observer("scoretextures")).define("scoretextures", ["makeText","twgl","gl"], _scoretextures);
  main.variable(observer("renderSoreScene")).define("renderSoreScene", ["gl","m4","scoretex","textbufferInfoArray","twgl","scoretextures","livestex","livetex"], _renderSoreScene);
  main.variable(observer()).define(["md"], _112);
  main.variable(observer("boxBufferInfo")).define("boxBufferInfo", ["twgl","gl"], _boxBufferInfo);
  main.variable(observer("modelDim")).define("modelDim", ["mazeDataTemplate"], _modelDim);
  main.variable(observer("lightBufferInfo")).define("lightBufferInfo", ["twgl","gl"], _lightBufferInfo);
  main.variable(observer("setStencilingParameters")).define("setStencilingParameters", ["gl"], _setStencilingParameters);
  main.variable(observer("setMaskingParameters")).define("setMaskingParameters", ["gl"], _setMaskingParameters);
  main.variable(observer("setDefaultParameters")).define("setDefaultParameters", ["gl"], _setDefaultParameters);
  main.variable(observer()).define(["md"], _119);
  main.variable(observer("img")).define("img", ["FileAttachment"], _img);
  main.variable(observer("viewof img3")).define("viewof img3", ["FileAttachment"], _img3);
  main.variable(observer("img3")).define("img3", ["Generators", "viewof img3"], (G, _) => G.input(_));
  main.variable(observer("cellTypeColors")).define("cellTypeColors", ["cellTypes","hex2rgb"], _cellTypeColors);
  main.variable(observer("cellTypes")).define("cellTypes", _cellTypes);
  main.variable(observer("mazeDataTemplate")).define("mazeDataTemplate", ["img","cellTypes"], _mazeDataTemplate);
  main.variable(observer("makeQuad")).define("makeQuad", _makeQuad);
  main.variable(observer("ghostBarrierBufferInfo")).define("ghostBarrierBufferInfo", ["mazeDataTemplate","makeBox","wallHeight","mergeParts","twgl","gl"], _ghostBarrierBufferInfo);
  main.variable(observer("transformVertices")).define("transformVertices", _transformVertices);
  main.variable(observer("mergeParts")).define("mergeParts", _mergeParts);
  main.variable(observer()).define(["md"], _129);
  main.variable(observer("boxProgramInfo")).define("boxProgramInfo", ["twgl","gl"], _boxProgramInfo);
  main.variable(observer("errorBlock")).define("errorBlock", ["html","width"], _errorBlock);
  main.variable(observer("sceneProgramInfo")).define("sceneProgramInfo", ["errorBlock","twgl","gl"], _sceneProgramInfo);
  main.variable(observer("normalProgramInfo")).define("normalProgramInfo", ["errorBlock","twgl","gl"], _normalProgramInfo);
  main.variable(observer()).define(["md"], _134);
  main.variable(observer("viewof colors")).define("viewof colors", ["columns","color"], _colors);
  main.variable(observer("colors")).define("colors", ["Generators", "viewof colors"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _136);
  main.variable(observer()).define(["md"], _137);
  main.variable(observer("deg2rad")).define("deg2rad", _deg2rad);
  main.variable(observer("m4")).define("m4", ["twgl"], _m4);
  main.variable(observer("v3")).define("v3", ["twgl"], _v3);
  const child1 = runtime.module(define1);
  main.import("hex2rgb", child1);
  const child2 = runtime.module(define2);
  main.import("computeModelExtent", child2);
  main.import("loadModelFromURL", child2);
  const child3 = runtime.module(define3);
  main.import("columns", child3);
  const child4 = runtime.module(define4);
  main.import("color", child4);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
