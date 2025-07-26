import { renderNavbar } from '../componentes/navbar';
import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/loaders/glTF"
import { ArcRotateCamera, Color3, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"
import { ChatSystem } from "../componentes/chat"
import { setPongGame } from '../state';

export class PongGame {
  canvas: HTMLCanvasElement | any;
  engine: any;
  playerScore: number;
  aiScore: number;
  ballSpeed: { x: number; z: number; };
  paddleSpeed: number;
  inputStates: { wPressed: boolean; sPressed: boolean; };
  scene: any;
  camera: any;
  fieldWidth: number;
  fieldHeight: number;
  ball: any;
  playerPaddle: any;
  aiPaddle: any;
  chat: ChatSystem | null;

  constructor() {
    this.canvas = document.getElementById("renderCanvas");
    this.engine = new Engine(this.canvas, true);

    this.playerScore = 0;
    this.aiScore = 0;
    this.ballSpeed = { x: 0.3, z: 0.2 };
    this.paddleSpeed = 0.5;
    this.fieldWidth = 0;
    this.fieldHeight = 0;

    this.inputStates = {
      wPressed: false,
      sPressed: false
    };

    this.chat = null;

    this.createScene();
    this.setupControls();
    this.startGameLoop();
  }

  createScene() {
    this.scene = new Scene(this.engine);

    this.camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 20, Vector3.Zero(), this.scene);
    this.camera.setTarget(Vector3.Zero());

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    light.intensity = 0.8;

    this.createGameField();
    this.createBall();
    this.createPaddles();
    this.resetBall();
  }

  createGameField() {
    const fieldWidth = 16;
    const fieldHeight = 10;

    // Floor
    const ground = MeshBuilder.CreateGround("ground", { width: fieldWidth, height: fieldHeight }, this.scene);
    const groundMaterial = new StandardMaterial("groundMat", this.scene);
    groundMaterial.diffuseColor = new Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;

    // Center line
    const centerLine = MeshBuilder.CreateBox("centerLine", { width: 0.1, height: 0.1, depth: fieldHeight }, this.scene);
    centerLine.position = new Vector3(0, 0.05, 0);
    const lineMaterial = new StandardMaterial("lineMat", this.scene);
    lineMaterial.diffuseColor = new Color3(1, 1, 1);
    centerLine.material = lineMaterial;

    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;
  }

  createBall() {
    this.ball = MeshBuilder.CreateSphere("ball", { diameter: 0.5 }, this.scene);
    this.ball.position = new Vector3(0, 0.25, 0);

    const ballMaterial = new StandardMaterial("ballMat", this.scene);
    ballMaterial.diffuseColor = new Color3(1, 0, 0); // Red color
    ballMaterial.emissiveColor = new Color3(0.2, 0, 0);
    this.ball.material = ballMaterial;
  }

  createPaddles() {
    // Player paddle (left)
    this.playerPaddle = MeshBuilder.CreateBox("playerPaddle", { width: 0.3, height: 1, depth: 2 }, this.scene);
    this.playerPaddle.position = new Vector3(-7, 0.5, 0);

    const playerMaterial = new StandardMaterial("playerMat", this.scene);
    playerMaterial.diffuseColor = new Color3(0, 0.8, 1);
    this.playerPaddle.material = playerMaterial;

    // AI paddle (right)
    this.aiPaddle = MeshBuilder.CreateBox("aiPaddle", { width: 0.3, height: 1, depth: 2 }, this.scene);
    this.aiPaddle.position = new Vector3(7, 0.5, 0);

    const aiMaterial = new StandardMaterial("aiMat", this.scene);
    aiMaterial.diffuseColor = new Color3(1, 0.5, 0);
    this.aiPaddle.material = aiMaterial;
  }

  setupControls() {
    window.addEventListener('keydown', (event) => {
      // Don't process game controls if player is typing in chat
      if (this.isPlayerTyping()) {
        return;
      }

      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.inputStates.wPressed = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.inputStates.sPressed = true;
          break;
      }
    });

    window.addEventListener('keyup', (event) => {
      // Don't process game controls if player is typing in chat
      if (this.isPlayerTyping()) {
        return;
      }

      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.inputStates.wPressed = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.inputStates.sPressed = false;
          break;
      }
    });
  }

  updatePlayerPaddle() {
    if (this.isPlayerTyping()) {
      return;
    }

    if (this.inputStates.wPressed && this.playerPaddle.position.z < this.fieldHeight / 2 - 1) {
      this.playerPaddle.position.z += this.paddleSpeed;
    }
    if (this.inputStates.sPressed && this.playerPaddle.position.z > -this.fieldHeight / 2 + 1) {
      this.playerPaddle.position.z -= this.paddleSpeed;
    }
  }

  updateAIPaddle() {
    const ballZ = this.ball.position.z;
    const paddleZ = this.aiPaddle.position.z;
    const aiSpeed = this.paddleSpeed * 0.8;

    if (ballZ > paddleZ + 0.5 && this.aiPaddle.position.z < this.fieldHeight / 2 - 1) {
      this.aiPaddle.position.z += aiSpeed;
    } else if (ballZ < paddleZ - 0.5 && this.aiPaddle.position.z > -this.fieldHeight / 2 + 1) {
      this.aiPaddle.position.z -= aiSpeed;
    }
  }

  updateBall() {
    this.ball.position.x += this.ballSpeed.x;
    this.ball.position.z += this.ballSpeed.z;

    // Wall collision
    if (this.ball.position.z >= this.fieldHeight / 2 - 0.25 || this.ball.position.z <= -this.fieldHeight / 2 + 0.25) {
      this.ballSpeed.z *= -1;
    }

    this.checkPaddleCollision();

    // Scoring
    if (this.ball.position.x > this.fieldWidth / 2) {
      this.playerScore++;
      this.updateScore();
      this.resetBall();

      if (this.chat) {
        this.chat.receiveMessage("System", "Player scored! 🎉");
      }

    }
    else if (this.ball.position.x < -this.fieldWidth / 2) {
      this.aiScore++;
      this.updateScore();
      this.resetBall();
    }
  }

  checkPaddleCollision() {
    const ballPos = this.ball.position;

    // Player paddle collision
    const playerPos = this.playerPaddle.position;
    if (ballPos.x <= playerPos.x + 0.4 && ballPos.x >= playerPos.x - 0.4 &&
      ballPos.z <= playerPos.z + 1.2 && ballPos.z >= playerPos.z - 1.2 &&
      this.ballSpeed.x < 0) {

      this.ballSpeed.x *= -1.1;
      this.ballSpeed.z += (ballPos.z - playerPos.z) * 0.1;
    }

    // AI paddle collision
    const aiPos = this.aiPaddle.position;
    if (ballPos.x >= aiPos.x - 0.4 && ballPos.x <= aiPos.x + 0.4 &&
      ballPos.z <= aiPos.z + 1.2 && ballPos.z >= aiPos.z - 1.2 &&
      this.ballSpeed.x > 0) {

      this.ballSpeed.x *= -1.1;
      this.ballSpeed.z += (ballPos.z - aiPos.z) * 0.1;
    }
  }

  resetBall() {
    this.ball.position = new Vector3(0, 0.25, 0);
    this.ballSpeed.x = (Math.random() > 0.5 ? 1 : -1) * 0.3;
    this.ballSpeed.z = (Math.random() - 0.5) * 0.4;
  }

  updateScore() {
    let playerscore = document.getElementById('playerScore');
    if (playerscore)
      playerscore.textContent = this.playerScore as unknown as string;
    let aiscore = document.getElementById('aiScore');
    if (aiscore)
      aiscore.textContent = this.aiScore as unknown as string;
  }

  startGameLoop() {
    this.engine.runRenderLoop(() => {
      this.updatePlayerPaddle();
      this.updateAIPaddle();
      this.updateBall();
      this.scene.render();
    });

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  public clearGame() {
    this.engine.stopRenderLoop();

    if (this.scene) { this.scene.dispose(); }
    if (this.engine) { this.engine.dispose(); }
  }

  dispose() {
    if (this.engine) {
      this.engine.dispose();
    }
  }

  // Pour le chat
  setupChat() {
    try {
      this.chat = new ChatSystem();

      if (this.chat) {
        this.chat.receiveMessage("System", "Welcome to Pong! Use W/S or Arrow keys to move your paddle.");
      }
    } catch (error) {
      console.error("Failed to initialize chat system:", error);
      this.chat = null;
    }
  }

  isPlayerTyping(): boolean {
    return this.chat ? this.chat.getIsTyping() : false;
  }

  sendChatMessage(sender: string, message: string) {
    if (this.chat) {
      this.chat.receiveMessage(sender, message);
    }
  }
}

function startPongGame() {
  const game = new PongGame();
  setPongGame(game);
}

export function renderPong() {
  renderNavbar();
  document.getElementById('app')!.innerHTML = `
	<div class="flex flex-col justify-content items-center">
    <div class="text-white font-bold text-4xl mb-10">How do you want to play ?</div>
    <div class="w-full flex gap-10 justify-center align-items">
      <div class="bg-indigo-950 text-white p-5 text-xl text-center font-semibold h-100 w-100" id="solo">
      Solo
      <img src="paddle.gif"/>
      </div>
      <div class="bg-white text-green-900 p-5 text-xl text-center font-semibold h-100 w-100" id="multiple">
      With your friends
       <img src="paddlesV2.gif"/>
       </div>


	</div>
`;

  const gameSolo = document.getElementById("solo")
  gameSolo?.addEventListener('click', launchPongGame)

  const gameMultiple = document.getElementById("multiple")
  gameMultiple?.addEventListener('click', launchPongForMultiple)
}

export function launchPongGame() {
  renderNavbar();
  document.getElementById('app')!.innerHTML = `
	<div id="gameContainer">
		<canvas id="renderCanvas"></canvas>
		<div id="gameUI">
			<div>Player: <span id="playerScore">0</span> | AI: <span id="aiScore">0</span></div>
		</div>
		<div id="instructions">
			Use W/S or Arrow Keys to move
		</div>
	</div>
`;
  startPongGame();
}

let currentTournament = {
  players: [],
  matches: [],
  currentMatchIndex: 0,
  winners: []
};

export function launchPongForMultiple() {
  renderNavbar();
  document.getElementById('app')!.innerHTML = `
  <div class="flex flex-col -mt-60 justify-center">
    <div class="text-white font-bold text-4xl mb-10">How many players ?</div>
      <div class="card p-7">
        <div class="w-full flex gap-10 justify-center align-items mb-10">
          <div class="bg-indigo-950 text-white p-5 text-xl text-center font-semibold w-100" id="2players">
            2 players
          </div>
          <div class="bg-white text-green-900 p-5 text-xl text-center font-semibold w-100" id="4players">
            4 players
          </div>
          <div class="bg-green-950 text-white p-5 text-xl text-center font-semibold w-100" id="8players">
            8 players
          </div>
      </div>
    </div>

  <div id="playerModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Enter Player Names</h2>
                <div id="playerInputs" class="space-y-4">
                    <!-- Les inputs seront générés dynamiquement -->
                </div>
                <div class="flex gap-4 mt-6">
                    <button id="cancelModal" class="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">
                        Cancel
                    </button>
                    <button id="startTournament" class="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                        Start Tournament
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Modal pour afficher le match actuel -->
        <div id="matchModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Tournament Match</h2>
                <div id="matchInfo" class="text-center mb-6">
                    <!-- Info du match -->
                </div>
                <div class="flex gap-4">
                    <button id="startMatch" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                        Start Match
                    </button>
                </div>
            </div>
        </div>
  `;

  const twoPlayers = document.getElementById("2players")
  const fourPlayers = document.getElementById("4players")
  const eightPlayers = document.getElementById("8players")
  twoPlayers?.addEventListener('click', () => openPlayerModal(2));
  fourPlayers?.addEventListener('click', () => openPlayerModal(4));
  eightPlayers?.addEventListener('click', () => openPlayerModal(8));

  document.getElementById("cancelModal")?.addEventListener('click', closePlayerModal);
  document.getElementById("startTournament")?.addEventListener('click', startTournament);
  document.getElementById("startMatch")?.addEventListener('click', startCurrentMatch);
}

function openPlayerModal(playerCount: number) {
  const modal = document.getElementById("playerModal");
  const inputsContainer = document.getElementById("playerInputs");

  if (inputsContainer != null) {
    inputsContainer.innerHTML = '';
    for (let i = 1; i <= playerCount; i++) {
      inputsContainer.innerHTML += `
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Player ${i}</label>
                <input 
                    type="text" 
                    id="player${i}" 
                    placeholder="Enter player ${i} name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
            </div>
        `;
    }

    modal?.classList.remove('hidden');
  }

  setTimeout(() => {
    document.getElementById("player1")?.focus();
  }, 100);
}

function closePlayerModal() {
  document.getElementById("playerModal")?.classList.add('hidden');
}

function startTournament() {
  const inputs = document.querySelectorAll('#playerInputs input');
  const players: string[] = [];

  inputs.forEach(input => {
    const name = input.value.trim();
    if (name) {
      players.push(name);
    }
  });

  if (players.length !== inputs.length) {
    alert('Please fill in all player names!');
    return;
  }

  const uniqueNames = new Set(players);
  if (uniqueNames.size !== players.length) {
    alert('Player names must be unique!');
    return;
  }

  currentTournament.players = players;
  currentTournament.matches = generateMatches(players);
  currentTournament.currentMatchIndex = 0;
  currentTournament.winners = [];

  closePlayerModal();
  showNextMatch();
}

function generateMatches(players) {
  const matches = [];

  // Pour un tournoi, on apparie les joueurs
  for (let i = 0; i < players.length; i += 2) {
    if (i + 1 < players.length) {
      matches.push({
        player1: players[i],
        player2: players[i + 1],
        winner: null
      });
    }
  }

  return matches;
}

function showNextMatch() {
  if (currentTournament.currentMatchIndex >= currentTournament.matches.length) {
    // Vérifier s'il faut créer la prochaine ronde
    if (currentTournament.winners.length > 1) {
      // Créer la prochaine ronde avec les gagnants
      currentTournament.matches = generateMatches(currentTournament.winners);
      currentTournament.currentMatchIndex = 0;
      currentTournament.winners = [];
      showNextMatch();
    } else if (currentTournament.winners.length === 1) {
      // Tournoi terminé !
      showTournamentWinner();
    }
    return;
  }

  const currentMatch = currentTournament.matches[currentTournament.currentMatchIndex];
  const modal = document.getElementById("matchModal");
  const matchInfo = document.getElementById("matchInfo");

  matchInfo.innerHTML = `
        <div class="text-lg mb-4">
            <strong>Round ${Math.ceil(Math.log2(currentTournament.players.length)) - Math.ceil(Math.log2(currentTournament.winners.length + currentTournament.matches.length)) + 1}</strong>
        </div>
        <div class="text-xl font-semibold text-blue-600">
            ${currentMatch.player1}
        </div>
        <div class="text-lg text-gray-600 my-2">VS</div>
        <div class="text-xl font-semibold text-red-600">
            ${currentMatch.player2}
        </div>
    `;

  modal.classList.remove('hidden');
}

function startCurrentMatch() {
  const modal = document.getElementById("matchModal");
  modal.classList.add('hidden');

  launchPongGameWithPlayers(
    currentTournament.matches[currentTournament.currentMatchIndex].player1,
    currentTournament.matches[currentTournament.currentMatchIndex].player2
  );
}

// TODO - A ENVOYER DANS LE BACK
export function onMatchFinished(winner) {
  currentTournament.matches[currentTournament.currentMatchIndex].winner = winner;
  currentTournament.winners.push(winner);
  currentTournament.currentMatchIndex++;

  setTimeout(() => {
    showNextMatch();
  }, 2000);
}

function showTournamentWinner() {
  const winner = currentTournament.winners[0];

  document.getElementById('app')!.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-screen text-center">
            <div class="card p-10">
                <h1 class="text-4xl font-bold text-yellow-400 mb-6">🏆 TOURNAMENT WINNER! 🏆</h1>
                <div class="text-3xl font-bold text-white mb-8">${winner}</div>
                <div class="flex gap-4">
                    <button onclick="launchPongForMultiple()" class="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        New Tournament
                    </button>
                    <button onclick="goToMainMenu()" class="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors">
                        Main Menu
                    </button>
                </div>
            </div>
        </div>
    `;
}

function launchPongGameWithPlayers(player1Name: string, player2Name: string) {
  // Tu peux modifier ta fonction launchPongGame() existante pour accepter ces paramètres
  // ou créer une nouvelle version qui les utilise
  console.log(`Starting match: ${player1Name} vs ${player2Name}`);

  launchPongGame();

  // TODO
  // 1. Afficher les noms des joueurs dans l'interface
  // 2. Appeler onMatchFinished(winner) quand le match se termine
}
