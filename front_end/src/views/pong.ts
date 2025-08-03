import { renderNavbar } from '../componentes/navbar';
import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/loaders/glTF"
import { ArcRotateCamera, Color3, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"
import { setPongGame } from '../state';
import { i18n, t } from '../i18n';
import axios from 'axios';
import { TOURNAMENT_ADDRESS } from '../config';



// tournament_uuid
let tournament_uuid: string = "-1";

// Add type declarations
declare global {
  interface Window {
    pongGameInstance: any;
    onMatchFinished: (winner: string) => void;
  }
}

interface TournamentMatch {
  player1: string;
  player2: string;
  winner: string | null;
}

interface Tournament {
  players: string[];
  matches: TournamentMatch[];
  currentMatchIndex: number;
  winners: string[];
}

export class PongGame {
  canvas: HTMLCanvasElement | any;
  engine: any;
  playerScore: number;
  aiScore: number;
  ballSpeed: { x: number; z: number; } = { x: 0.15, z: 0.1 };
  paddleSpeed: number;
  inputStates: { wPressed: boolean; sPressed: boolean; upPressed: boolean; downPressed: boolean; };
  scene: any;
  camera: any;
  fieldWidth: number;
  fieldHeight: number;
  ball: any;
  playerPaddle: any;
  aiPaddle: any;
  
  // Multiplayer properties
  isMultiplayer: boolean;
  player1Name: string;
  player2Name: string;
  winningScore: number;

  
  // Difficulty property
  difficulty: 'easy' | 'medium' | 'hard';

  constructor(isMultiplayer: boolean = false, player1Name: string = "Player", player2Name: string = "AI", difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.canvas = document.getElementById("renderCanvas");
    this.engine = new Engine(this.canvas, true);

    this.playerScore = 0;
    this.aiScore = 0;
    this.paddleSpeed = 0.3;
    this.fieldWidth = 0;
    this.fieldHeight = 0;
    this.winningScore = 5;

    this.inputStates = {
      wPressed: false,
      sPressed: false,
      upPressed: false,
      downPressed: false
    };

    this.isMultiplayer = isMultiplayer;
    this.player1Name = player1Name;
    this.player2Name = player2Name;
    this.difficulty = difficulty;

    // Set speeds based on difficulty
    this.setDifficulty(difficulty);

    this.createScene();
    this.setupControls();
    this.startGameLoop();
    
    // Listen for language changes and update UI
    i18n.addLanguageChangeListener(() => {
      this.updateUILabels();
    });
  }

  setDifficulty(level: 'easy' | 'medium' | 'hard') {
    this.difficulty = level;
    
    switch(level) {
      case 'easy':
        this.ballSpeed = { x: 0.08, z: 0.06 };
        this.paddleSpeed = 0.25;
        this.winningScore = 3;
        break;
      case 'medium':
        this.ballSpeed = { x: 0.15, z: 0.1 };
        this.paddleSpeed = 0.3;
        this.winningScore = 5;
        break;
      case 'hard':
        this.ballSpeed = { x: 0.25, z: 0.18 };
        this.paddleSpeed = 0.4;
        this.winningScore = 7;
        break;
    }
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

    const ground = MeshBuilder.CreateGround("ground", { width: fieldWidth, height: fieldHeight }, this.scene);
    const groundMaterial = new StandardMaterial("groundMat", this.scene);
    groundMaterial.diffuseColor = new Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;

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

    // AI/Player2 paddle (right)
    this.aiPaddle = MeshBuilder.CreateBox("aiPaddle", { width: 0.3, height: 1, depth: 2 }, this.scene);
    this.aiPaddle.position = new Vector3(7, 0.5, 0);

    const aiMaterial = new StandardMaterial("aiMat", this.scene);
    aiMaterial.diffuseColor = new Color3(1, 0.5, 0);
    this.aiPaddle.material = aiMaterial;
  }

  setupControls() {
    window.addEventListener('keydown', (event) => {

      switch (event.code) {
        // Player 1 controls (left paddle)
        case 'KeyW':
          this.inputStates.wPressed = true;
          break;
        case 'KeyS':
          this.inputStates.sPressed = true;
          break;
        
        // Player 2 controls (right paddle) - only in multiplayer
        case 'ArrowUp':
          if (this.isMultiplayer) {
            this.inputStates.upPressed = true;
          } else {
            this.inputStates.wPressed = true; // Solo mode fallback
          }
          break;
        case 'ArrowDown':
          if (this.isMultiplayer) {
            this.inputStates.downPressed = true;
          } else {
            this.inputStates.sPressed = true; // Solo mode fallback
          }
          break;
      }
    });

    window.addEventListener('keyup', (event) => {

      switch (event.code) {
        // Player 1 controls
        case 'KeyW':
          this.inputStates.wPressed = false;
          break;
        case 'KeyS':
          this.inputStates.sPressed = false;
          break;
        
        // Player 2 controls
        case 'ArrowUp':
          if (this.isMultiplayer) {
            this.inputStates.upPressed = false;
          } else {
            this.inputStates.wPressed = false; // Solo mode fallback
          }
          break;
        case 'ArrowDown':
          if (this.isMultiplayer) {
            this.inputStates.downPressed = false;
          } else {
            this.inputStates.sPressed = false; // Solo mode fallback
          }
          break;
      }
    });
  }

  updatePlayerPaddle() {
    if (this.inputStates.wPressed && this.playerPaddle.position.z < this.fieldHeight / 2 - 1) {
      this.playerPaddle.position.z += this.paddleSpeed;
    }
    if (this.inputStates.sPressed && this.playerPaddle.position.z > -this.fieldHeight / 2 + 1) {
      this.playerPaddle.position.z -= this.paddleSpeed;
    }
  }

  updateAIPaddle() {
    if (this.isMultiplayer) {
      this.updatePlayer2Paddle();
    } else {
      const ballZ = this.ball.position.z;
      const paddleZ = this.aiPaddle.position.z;
      
      // AI speed based on difficulty
      let aiSpeedMultiplier: number;
      switch(this.difficulty) {
        case 'easy':
          aiSpeedMultiplier = 0.4;
          break;
        case 'medium':
          aiSpeedMultiplier = 0.6;
          break;
        case 'hard':
          aiSpeedMultiplier = 0.8;
          break;
      }
      
      const aiSpeed = this.paddleSpeed * aiSpeedMultiplier;

      if (ballZ > paddleZ + 0.5 && this.aiPaddle.position.z < this.fieldHeight / 2 - 1) {
        this.aiPaddle.position.z += aiSpeed;
      } else if (ballZ < paddleZ - 0.5 && this.aiPaddle.position.z > -this.fieldHeight / 2 + 1) {
        this.aiPaddle.position.z -= aiSpeed;
      }
    }
  }

  updatePlayer2Paddle() {

    if (this.inputStates.upPressed && this.aiPaddle.position.z < this.fieldHeight / 2 - 1) {
      this.aiPaddle.position.z += this.paddleSpeed;
    }
    if (this.inputStates.downPressed && this.aiPaddle.position.z > -this.fieldHeight / 2 + 1) {
      this.aiPaddle.position.z -= this.paddleSpeed;
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

      // Check for win condition
      if (this.playerScore >= this.winningScore) {
        this.endMatch(this.player1Name);
      }
    }
    else if (this.ball.position.x < -this.fieldWidth / 2) {
      this.aiScore++;
      this.updateScore();
      this.resetBall();

      // Check for win condition
      if (this.aiScore >= this.winningScore) {
        this.endMatch(this.player2Name);
      }
    }
  }

  endMatch(winner: string) {
    this.engine.stopRenderLoop();
    this.showWinnerOverlay(winner);

    // Only call onMatchFinished for tournament matches
    if (this.isMultiplayer && typeof window['onMatchFinished'] === 'function') {
      // console.log('Calling onMatchFinished in 3 seconds...');
      setTimeout(() => {
        // console.log('About to call onMatchFinished with winner:', winner);
        this.dispose();
        window['onMatchFinished'](winner);
      }, 3000);
    }
    else {
      // console.log('Not a tournament match, returning to main menu');
      // Solo game - just return to main menu, don't call onMatchFinished
      setTimeout(() => {
        this.dispose();
        renderPong();
      }, 3000);
    }
  }

  showWinnerOverlay(winner: string) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      color: white;
      font-size: 3rem;
      font-weight: bold;
      text-align: center;
    `;
    
    overlay.innerHTML = `
      <div>
        <div style="color: #ffd700; margin-bottom: 20px;">🏆</div>
        <div>${winner} ${t('pong.wins')}</div>
        <div style="font-size: 1.5rem; margin-top: 20px; opacity: 0.8;">
          ${t('pong.finalScore')}: ${this.playerScore} - ${this.aiScore}
        </div>
      </div>
    `;


	let match = { 
		match:  {
				player1: this.player1Name,
				player2: this.player2Name,
				player1score: this.playerScore,
				player2score: this.aiScore
				}
			}
	if (tournament_uuid.length > 0 && tournament_uuid != "-1")
		match.tournament_uuid = tournament_uuid;

	axios.post(
			`${TOURNAMENT_ADDRESS}/match/addMatch`,
			{ match },
			{
				headers: {
					'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			}
		);

    document.body.appendChild(overlay);

    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 3000);
  }

  checkPaddleCollision() {
    const ballPos = this.ball.position;
    
    // Acceleration factor based on difficulty
    let accelerationFactor: number;
    let angleFactor: number;
    
    switch(this.difficulty) {
      case 'easy':
        accelerationFactor = 1.02;
        angleFactor = 0.03;
        break;
      case 'medium':
        accelerationFactor = 1.05;
        angleFactor = 0.05;
        break;
      case 'hard':
        accelerationFactor = 1.08;
        angleFactor = 0.08;
        break;
    }

    // Player paddle collision
    const playerPos = this.playerPaddle.position;
    if (ballPos.x <= playerPos.x + 0.4 && ballPos.x >= playerPos.x - 0.4 &&
      ballPos.z <= playerPos.z + 1.2 && ballPos.z >= playerPos.z - 1.2 &&
      this.ballSpeed.x < 0) {

      this.ballSpeed.x *= -accelerationFactor;
      this.ballSpeed.z += (ballPos.z - playerPos.z) * angleFactor;
    }

    // AI/Player2 paddle collision
    const aiPos = this.aiPaddle.position;
    if (ballPos.x >= aiPos.x - 0.4 && ballPos.x <= aiPos.x + 0.4 &&
      ballPos.z <= aiPos.z + 1.2 && ballPos.z >= aiPos.z - 1.2 &&
      this.ballSpeed.x > 0) {

      this.ballSpeed.x *= -accelerationFactor;
      this.ballSpeed.z += (ballPos.z - aiPos.z) * angleFactor;
    }
  }

  resetBall() {
    this.ball.position = new Vector3(0, 0.25, 0);
    
    // Reset speed based on current difficulty
    let baseSpeed: number;
    switch(this.difficulty) {
      case 'easy':
        baseSpeed = 0.08;
        break;
      case 'medium':
        baseSpeed = 0.15;
        break;
      case 'hard':
        baseSpeed = 0.25;
        break;
    }
    
    this.ballSpeed.x = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
    this.ballSpeed.z = (Math.random() - 0.5) * (baseSpeed * 0.8);
  }

  updateScore() {
    let playerscore = document.getElementById('playerScore');
    if (playerscore)
      playerscore.textContent = this.playerScore as unknown as string;
    let aiscore = document.getElementById('aiScore');
    if (aiscore)
      aiscore.textContent = this.aiScore as unknown as string;

    this.updateUILabels();
  }

  updateUILabels() {
    let player1Label = document.getElementById('player1Label');
    let player2Label = document.getElementById('player2Label');
    
    // For solo mode, always use translations. For multiplayer, use actual player names
    if (!this.isMultiplayer) {
      if (player1Label) player1Label.textContent = t('pong.player');
      if (player2Label) player2Label.textContent = t('pong.ai');
    } else {
      if (player1Label) player1Label.textContent = this.player1Name;
      if (player2Label) player2Label.textContent = this.player2Name;
    }

    // Update difficulty display
    const getDifficultyText = (diff: string) => {
      switch(diff) {
        case 'easy': return t('pong.easy');
        case 'medium': return t('pong.medium');
        case 'hard': return t('pong.hard');
        default: return diff;
      }
    };

    // Find and update difficulty display in the game UI
    const gameUI = document.getElementById('gameUI');
    if (gameUI) {
      const difficultyDiv = gameUI.querySelector('div[style*="font-size: 16px"]') as HTMLElement;
      if (difficultyDiv) {
        difficultyDiv.innerHTML = `${t('pong.difficulty')}: ${getDifficultyText(this.difficulty)}`;
      }
    }

    // Update instructions for multiplayer games
    const instructions = document.getElementById('instructions');
    if (instructions && this.isMultiplayer) {
      instructions.innerHTML = `${this.player1Name}: ${t('pong.player1Keys')} | ${this.player2Name}: ${t('pong.player2Keys')} | ${t('pong.firstTo5Wins')}`;
    } else if (instructions && !this.isMultiplayer) {
      instructions.innerHTML = `${t('pong.player1Keys')} / ${t('pong.player2Keys')} - ${t('pong.firstTo5Wins')}`;
    }
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
      this.engine.stopRenderLoop();
      this.engine.dispose();
    }
    if (this.scene) {
      this.scene.dispose();
    }
    
    // Clear the canvas
    const canvas = document.getElementById("renderCanvas");
    if (canvas) {
      const context = (canvas as HTMLCanvasElement).getContext('2d');
      if (context) {
        context.clearRect(0, 0, (canvas as HTMLCanvasElement).width, (canvas as HTMLCanvasElement).height);
      }
    }
  }


}

function startPongGame(isMultiplayer: boolean = false, player1Name: string = "Player", player2Name: string = "AI", difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
  const game = new PongGame(isMultiplayer, player1Name, player2Name, difficulty);
  setPongGame(game);
  
  // Store reference for cleanup
  window.pongGameInstance = game;
}

// Global language change listener for active games
i18n.addLanguageChangeListener(() => {
  const activeGame = window.pongGameInstance;
  if (activeGame && activeGame.updateUILabels && document.getElementById('gameUI')) {
    activeGame.updateUILabels();
  }
});

export function renderPong() {
  renderNavbar();
  document.getElementById('app')!.innerHTML = `
    <div class="flex flex-col justify-content items-center">
      <div class="text-white font-bold text-4xl mb-10">${t('pong.readyToPlay')}</div>
      
	<!-- Difficulty Selection -->
	<div class="mb-8">
		<div class="text-white text-xl mb-4 text-center">${t('pong.selectDifficulty')}</div>
		<div class="difficulty-container">
			<button id="difficulty-easy" class="difficulty-btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
				${t('pong.easy')}
			</button>
			<button id="difficulty-medium" class="difficulty-btn bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold active">
				${t('pong.medium')}
			</button>
			<button id="difficulty-hard" class="difficulty-btn bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
				${t('pong.hard')}
			</button>
		</div>
	</div>
      
      <div class="w-full flex gap-10 justify-center align-items">
        <div class="bg-indigo-950 text-white p-5 text-xl text-center font-semibold h-100 w-100" id="solo">
          Solo
          <img src="paddle.gif"/>
        </div>
        <div class="bg-white text-green-900 p-5 text-xl text-center font-semibold h-100 w-100" id="multiple">
          ${t('pong.startTournament')}
          <img src="paddlesV2.gif"/>
        </div>
      </div>
    </div>
  `;

  // Difficulty selection logic
  let selectedDifficulty: 'easy' | 'medium' | 'hard' = 'medium';
  
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from all buttons
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      (e.target as HTMLElement).classList.add('active');
      
      // Update selected difficulty
      const btnId = (e.target as HTMLElement).id;
      selectedDifficulty = btnId.split('-')[1] as 'easy' | 'medium' | 'hard';
    });
  });

  const gameSolo = document.getElementById("solo");
  gameSolo?.addEventListener('click', () => launchPongGame(selectedDifficulty));

  const gameMultiple = document.getElementById("multiple");
  gameMultiple?.addEventListener('click', launchPongForMultiple);
  
  // Listen for language changes and re-render
  i18n.addLanguageChangeListener(() => {
    if (location.pathname === '/pong') {
      renderPong();
    }
  });
}

export function launchPongGame(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
  // Helper function to get translated difficulty
  const getDifficultyText = (diff: string) => {
    switch(diff) {
      case 'easy': return t('pong.easy');
      case 'medium': return t('pong.medium');
      case 'hard': return t('pong.hard');
      default: return diff;
    }
  };

  renderNavbar();
  document.getElementById('app')!.innerHTML = `
    <div id="gameContainer">
      <canvas id="renderCanvas"></canvas>
      <div id="gameUI">
        <div><span id="player1Label">${t('pong.player')}</span>: <span id="playerScore">0</span> | <span id="player2Label">${t('pong.ai')}</span>: <span id="aiScore">0</span></div>
        <div style="font-size: 16px; margin-top: 10px;">${t('pong.difficulty')}: ${getDifficultyText(difficulty)}</div>
      </div>
      <div id="instructions">
        ${t('pong.player1Keys')} / ${t('pong.player2Keys')} - ${t('pong.firstTo5Wins')}
      </div>
    </div>
  `;
  startPongGame(false, "Player", "AI", difficulty);
}

let currentTournament: Tournament = {
  players: [],
  matches: [],
  currentMatchIndex: 0,
  winners: []
};

export function launchPongForMultiple() {
  renderNavbar();
  document.getElementById('app')!.innerHTML = `
  <div class="flex flex-col -mt-60 justify-center">
    <div class="text-white font-bold text-4xl mb-10">${t('pong.selectPlayers')}</div>
      <div class="card p-7">
        <div class="w-full flex flex-wrap gap-4 justify-center items-center mb-10">
          <div class="bg-indigo-950 text-white p-4 text-lg text-center font-semibold min-w-32 flex-1 max-w-40 cursor-pointer hover:bg-indigo-800 transition-colors rounded" id="2players">
            ${t('pong.players2')}
          </div>
          <div class="bg-white text-green-900 p-4 text-lg text-center font-semibold min-w-32 flex-1 max-w-40 cursor-pointer hover:bg-gray-100 transition-colors rounded" id="4players">
            ${t('pong.players4')}
          </div>
          <div class="bg-green-950 text-white p-4 text-lg text-center font-semibold min-w-32 flex-1 max-w-40 cursor-pointer hover:bg-green-800 transition-colors rounded" id="8players">
            ${t('pong.players8')}
          </div>
      </div>
    </div>

  <div id="playerModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">${t('pong.enterPlayerName')}</h2>
                <div id="playerInputs" class="space-y-4">
                    <!-- Les inputs seront générés dynamiquement -->
                </div>
                <div class="flex gap-4 mt-6">
                    <button id="cancelModal" class="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">
                        ${t('common.cancel')}
                    </button>
                    <button id="startTournament" class="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                        ${t('pong.startTournament')}
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Modal pour afficher le match actuel -->
        <div id="matchModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">${t('pong.tournamentMatch')}</h2>
                <div id="matchInfo" class="text-center mb-6">
                    <!-- Info du match -->
                </div>
                <div class="flex gap-4">
                    <button id="startMatch" class="flex-1 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors">
                        ${t('pong.startMatch')}
                    </button>
                </div>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">${t('pong.player')} ${i}</label>
                <input 
                    type="text" 
                    id="player${i}" 
                    placeholder="${t('pong.enterPlayerName')} ${i}"
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


// uuid
async function startTournament() {
  const inputs = document.querySelectorAll('#playerInputs input');
  const players: string[] = [];

  const uuid: string = await axios.post(`${TOURNAMENT_ADDRESS}/tournament/create_tournament`,
	{},
	{
		headers: {
			'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
			'Content-Type': 'application/json'
		}
	}
  ).then(data => data.data.uuid)
  if (uuid.length == 0) {
	alert('Unable to create tournament!');
    return;
  }

  tournament_uuid = uuid;
  inputs.forEach(input => {
    const name = (input as HTMLInputElement).value.trim();
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

function generateMatches(players: string[]) {
  const matches = [];

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
  // This function should only be called when there's a valid next match
  if (currentTournament.currentMatchIndex >= currentTournament.matches.length) {
    console.error("showNextMatch called but no more matches in current round");
    // console.log('Checking if we need to start next round...');
    
    // Check if we should progress to next round
    if (currentTournament.winners.length > 1) {
      // console.log('Multiple winners, starting next round');
      currentTournament.matches = generateMatches(currentTournament.winners);
      currentTournament.currentMatchIndex = 0;
      currentTournament.winners = [];
      
      // console.log(`Generated new round with players:`, previousWinners);
      showNextMatch(); // Recursive call for new round
      return;
    } else if (currentTournament.winners.length === 1) {
      // console.log('Single winner, tournament complete');
      showTournamentWinner();
      return;
    }
    
    console.error('No valid tournament state found');
    return;
  }

  const currentMatch = currentTournament.matches[currentTournament.currentMatchIndex];
  // console.log('Current match to display:', currentMatch);
  
  const modal = document.getElementById("matchModal");
  const matchInfo = document.getElementById("matchInfo");

  if (matchInfo) {
    const totalRounds = Math.ceil(Math.log2(currentTournament.players.length));
    const currentRound = totalRounds - Math.ceil(Math.log2(currentTournament.matches.length)) + 1;
    
    matchInfo.innerHTML = `
        <div class="text-lg mb-4">
            <strong>${t('pong.round')} ${currentRound}</strong>
        </div>
        <div class="text-xl font-semibold text-blue-600">
            ${currentMatch.player1}
        </div>
        <div class="text-lg text-gray-600 my-2">${t('pong.vs')}</div>
        <div class="text-xl font-semibold text-red-600">
            ${currentMatch.player2}
        </div>
    `;
  }

  modal?.classList.remove('hidden');
  // console.log('Modal classes after removing hidden:', modal?.className);
  
  // Force the modal to be visible
  if (modal) {
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    // console.log('Forced modal visibility');
  } else {
    console.error('Modal element not found! Recreating tournament UI...');
    // If modal doesn't exist, recreate the tournament UI
    launchPongForMultiple();
    // setTimeout(() => showNextMatch(), 1000); // "glitch" blinking here
	showNextMatch();
  }
}

function startCurrentMatch() {
  const modal = document.getElementById("matchModal");
  modal?.classList.add('hidden');

  launchPongGameWithPlayers(
    currentTournament.matches[currentTournament.currentMatchIndex].player1,
    currentTournament.matches[currentTournament.currentMatchIndex].player2
  );
}

// Make this function available globally for the game to call
window['onMatchFinished'] = function(winner: string) {

  if (currentTournament.matches[currentTournament.currentMatchIndex]) {
    currentTournament.matches[currentTournament.currentMatchIndex].winner = winner;
    currentTournament.winners.push(winner);
    currentTournament.currentMatchIndex++;


    // Check if current round is complete
    if (currentTournament.currentMatchIndex >= currentTournament.matches.length) {
      if (currentTournament.winners.length === 1) {
        showTournamentWinner();
        return;
      } else if (currentTournament.winners.length > 1) {

		currentTournament.matches = generateMatches(currentTournament.winners);
        currentTournament.currentMatchIndex = 0;
        currentTournament.winners = [];
          
        // console.log(`Starting new round with players:`, previousWinners);
        showNextMatch();
        return;
      }
    }

	showNextMatch(); // after announcing the winner goes directly to the next match
  } else {
    console.error('No valid match found at current index:', currentTournament.currentMatchIndex);
  }
};

function showTournamentWinner() {
  const winner = currentTournament.winners[0];

  document.getElementById('app')!.innerHTML = `
        <div class="flex flex-col items-center justify-center h-screen overflow-hidden pt-20 text-center">
            <div class="card p-10">
                <h1 class="text-4xl font-bold text-yellow-400 mb-6">🏆 ${t('pong.tournamentWinner')} 🏆</h1>
                <div class="text-3xl font-bold text-purple-950 mb-8">${winner}</div>
                <div class="flex gap-4">
                    <button id="newTournament" class="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        ${t('pong.newTournament')}
                    </button>
                    <button id="mainMenu" class="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors">
                        ${t('pong.backToMenu')}
                    </button>
                </div>
            </div>
        </div>
    `;

  document.getElementById('newTournament')?.addEventListener('click', launchPongForMultiple);
  document.getElementById('mainMenu')?.addEventListener('click', renderPong);

  tournament_uuid = "-1";
}

function launchPongGameWithPlayers(player1Name: string, player2Name: string) {

  renderNavbar();
  
  // Ensure any existing game is cleaned up
  const existingGame = window.pongGameInstance;
  if (existingGame && existingGame.dispose) {
    existingGame.dispose();
  }
  
  document.getElementById('app')!.innerHTML = `
    <div id="gameContainer">
      <canvas id="renderCanvas"></canvas>
      <div id="gameUI">
        <div><span id="player1Label">${player1Name}</span>: <span id="playerScore">0</span> | <span id="player2Label">${player2Name}</span>: <span id="aiScore">0</span></div>
      </div>
      <div id="instructions">
        ${player1Name}: ${t('pong.player1Keys')} | ${player2Name}: ${t('pong.player2Keys')} | ${t('pong.firstTo5Wins')}
      </div>
    </div>
  `;

  // Small delay to ensure DOM is ready
  setTimeout(() => {
    startPongGame(true, player1Name, player2Name);
  }, 100);
}
