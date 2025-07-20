import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/loaders/glTF";
import { BASE_ADDRESS } from "./config";
import { ArcRotateCamera, Color3, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import axios from "axios";


document.getElementById('signInBtn').addEventListener('click', async () => {
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	if (!email || !password) {
	alert('Please fill in both email and password');
	return;
	}

	//  Test Minh
	const loginSuccessful = await Login(email, password);

	if (loginSuccessful) {
	startPongGame();
	} else {
	alert('Login failed. Please try again.');
	}
});

document.getElementById('backBtn').addEventListener('click', () => {
	document.getElementById('gameContainer').style.display = 'none';
	document.getElementById('loginContainer').style.display = 'flex';

	if (window.currentGame) {
	window.currentGame.dispose();
	window.currentGame = null;
	}
});

// Test Minh
async function Login(email: string, password: string) {
	if (!email || !password) return false;

	try {
		const response = await axios.post(`${BASE_ADDRESS}/auth/login`,
			{ email, password },
		);
		const token = response.data?.token;
		if (token) {
			window.sessionStorage.setItem("token", token);
			return true;
		}
		return false;
	} catch (err) {
		console.error("Login failed:", err);
		return false;
	}
}

function startPongGame() {
	document.getElementById('loginContainer').style.display = 'none';
	document.getElementById('gameContainer').style.display = 'block';
	window.currentGame = new PongGame();
}

class PongGame {
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
	constructor() {
	this.canvas = document.getElementById("renderCanvas");
	this.engine = new Engine(this.canvas, true);

	this.playerScore = 0;
	this.aiScore = 0;
	this.ballSpeed = { x: 0.3, z: 0.2 };
	this.paddleSpeed = 0.5;

	this.inputStates = {
		wPressed: false,
		sPressed: false
	};

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
	ballMaterial.diffuseColor = new Color3(1, 0, 0); // Red ball
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
	} else if (this.ball.position.x < -this.fieldWidth / 2) {
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
	document.getElementById('playerScore').textContent = this.playerScore;
	document.getElementById('aiScore').textContent = this.aiScore;
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

	dispose() {
	if (this.engine) {
		this.engine.dispose();
	}
	}
}

// class App {
//   private async _login(email: string, password: string): Promise<boolean> {
//     if (!email || !password) return false;
//     try {
//       const response = await fetch(`${BASE_ADDRESS}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });
      
//       const data = await response.json();
//       const token = data?.token;
      
//       if (token) {
//         window.sessionStorage.setItem("token", token);
//         return true;
//       }
//       return false;
//     } catch (err) {
//       console.error("Login failed:", err);
//       return false;
//     }
//   }

//   public async handleSignIn(): Promise<void> {
//     const email = (document.getElementById('email') as HTMLInputElement)?.value;
//     const password = (document.getElementById('password') as HTMLInputElement)?.value;
//     const loginContainer = document.getElementById('loginContainer');
//     const gameContainer = document.getElementById('gameContainer');

//     if (!email || !password) {
//       alert('Please enter both email and password');
//       return;
//     }

//     const signInBtn = document.getElementById('signInBtn') as HTMLButtonElement;
//     const originalText = signInBtn.textContent;
//     signInBtn.textContent = 'Signing in...';
//     signInBtn.disabled = true;

//     try {
//       const loginSuccess = await this._login(email, password);
      
//       if (loginSuccess) {
//         if (loginContainer) loginContainer.style.display = 'none';
//         if (gameContainer) gameContainer.style.display = 'block';
        
//         const pongGame = new PongGame();
//         pongGame.startGame();
//         (window as any).currentPongGame = pongGame;

//       } else {
//         alert('Login failed. Please check your credentials.');
//       }
//     } catch (error) {
//       alert('An error occurred during login. Please try again.');
//       console.error('Login error:', error);
//     } finally {
//       signInBtn.textContent = originalText;
//       signInBtn.disabled = false;
//     }
//   }
// }


// document.addEventListener('DOMContentLoaded', () => {
//   const loginContainer = document.getElementById('loginContainer');
//   const gameContainer = document.getElementById('gameContainer');
//   const signInBtn = document.getElementById('signInBtn');
//   const googleBtn = document.getElementById('googleBtn');
//   const backBtn = document.getElementById('backBtn');

//   const app = new App();
//   let pongGame: PongGame | null = null;


//   signInBtn?.addEventListener('click', async () => {
//     await app.handleSignIn();
//   });


//   googleBtn?.addEventListener('click', () => {
//     if (loginContainer) loginContainer.style.display = 'none';
//     if (gameContainer) gameContainer.style.display = 'block';

//     pongGame = new PongGame();
//     pongGame.startGame();
//   });

//   backBtn?.addEventListener('click', () => {

//     const currentGame = (window as any).currentPongGame;
//     if (currentGame) {
//       currentGame.stopGame();
//       (window as any).currentPongGame = null;
//     }

//     if (gameContainer) gameContainer.style.display = 'none';
//     if (loginContainer) loginContainer.style.display = 'flex';
//   });

//   const passwordField = document.getElementById('password') as HTMLInputElement;
//   passwordField?.addEventListener('keypress', async (e) => {
//     if (e.key === 'Enter') {
//       await app.handleSignIn();
//     }
//   });
// });

// // FOR THE GAME
// interface GameState {
//   playerScore: number;
//   aiScore: number;
//   gameRunning: boolean;
// }

// interface Paddle {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   speed: number;
// }

// interface Ball {
//   x: number;
//   y: number;
//   radius: number;
//   speedX: number;
//   speedY: number;
// }

// class PongGame {
//   private canvas: HTMLCanvasElement;
//   private ctx: CanvasRenderingContext2D;
//   private gameState: GameState;
//   private playerPaddle: Paddle;
//   private aiPaddle: Paddle;
//   private ball: Ball;
//   private keys: { [key: string]: boolean } = {};
//   private animationId: number | null = null;

//   constructor() {
//     this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
//     this.ctx = this.canvas.getContext('2d')!;
    
//     // Initialize game state
//     this.gameState = {
//       playerScore: 0,
//       aiScore: 0,
//       gameRunning: false
//     };

//     this.initializeGame();
//     this.setupEventListeners();
//   }

//   private initializeGame(): void {
//     // Set canvas size
//     this.resizeCanvas();
    
 
//     this.playerPaddle = {
//       x: 50,
//       y: this.canvas.height / 2 - 60,
//       width: 15,
//       height: 120,
//       speed: 8
//     };

//     this.aiPaddle = {
//       x: this.canvas.width - 65,
//       y: this.canvas.height / 2 - 60,
//       width: 15,
//       height: 120,
//       speed: 6
//     };

//     this.resetBall();
//   }

//   private resizeCanvas(): void {
//     this.canvas.width = window.innerWidth;
//     this.canvas.height = window.innerHeight;
//   }

//   private resetBall(): void {
//     this.ball = {
//       x: this.canvas.width / 2,
//       y: this.canvas.height / 2,
//       radius: 10,
//       speedX: Math.random() > 0.5 ? 5 : -5,
//       speedY: (Math.random() - 0.5) * 8
//     };
//   }

//   private setupEventListeners(): void {
//     // Keyboard events
//     document.addEventListener('keydown', (e) => {
//       this.keys[e.key.toLowerCase()] = true;
//     });

//     document.addEventListener('keyup', (e) => {
//       this.keys[e.key.toLowerCase()] = false;
//     });

//     // Window resize
//     window.addEventListener('resize', () => {
//       this.resizeCanvas();
//       this.initializeGame();
//     });
//   }

//   private updatePlayerPaddle(): void {
//     // W or Arrow Up
//     if (this.keys['w'] || this.keys['arrowup']) {
//       this.playerPaddle.y = Math.max(0, this.playerPaddle.y - this.playerPaddle.speed);
//     }
    
//     // S or Arrow Down
//     if (this.keys['s'] || this.keys['arrowdown']) {
//       this.playerPaddle.y = Math.min(
//         this.canvas.height - this.playerPaddle.height,
//         this.playerPaddle.y + this.playerPaddle.speed
//       );
//     }
//   }

//   private updateAIPaddle(): void {
//     // Simple AI: follow the ball
//     const paddleCenter = this.aiPaddle.y + this.aiPaddle.height / 2;
//     const ballY = this.ball.y;

//     if (paddleCenter < ballY - 10) {
//       this.aiPaddle.y = Math.min(
//         this.canvas.height - this.aiPaddle.height,
//         this.aiPaddle.y + this.aiPaddle.speed
//       );
//     } else if (paddleCenter > ballY + 10) {
//       this.aiPaddle.y = Math.max(0, this.aiPaddle.y - this.aiPaddle.speed);
//     }
//   }

//   private updateBall(): void {
//     this.ball.x += this.ball.speedX;
//     this.ball.y += this.ball.speedY;

//     // Top and bottom wall collision
//     if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.canvas.height) {
//       this.ball.speedY = -this.ball.speedY;
//     }

//     // Paddle collisions
//     if (this.checkCollision(this.ball, this.playerPaddle) && this.ball.speedX < 0) {
//       this.ball.speedX = -this.ball.speedX;
//       this.ball.speedY += (Math.random() - 0.5) * 2; // Add some randomness
//     }

//     if (this.checkCollision(this.ball, this.aiPaddle) && this.ball.speedX > 0) {
//       this.ball.speedX = -this.ball.speedX;
//       this.ball.speedY += (Math.random() - 0.5) * 2; // Add some randomness
//     }

//     // Score when ball goes off screen
//     if (this.ball.x < 0) {
//       this.gameState.aiScore++;
//       this.updateScore();
//       this.resetBall();
//     } else if (this.ball.x > this.canvas.width) {
//       this.gameState.playerScore++;
//       this.updateScore();
//       this.resetBall();
//     }
//   }

//   private checkCollision(ball: Ball, paddle: Paddle): boolean {
//     return ball.x - ball.radius < paddle.x + paddle.width &&
//            ball.x + ball.radius > paddle.x &&
//            ball.y - ball.radius < paddle.y + paddle.height &&
//            ball.y + ball.radius > paddle.y;
//   }

//   private updateScore(): void {
//     const playerScoreElement = document.getElementById('playerScore');
//     const aiScoreElement = document.getElementById('aiScore');
    
//     if (playerScoreElement) playerScoreElement.textContent = this.gameState.playerScore.toString();
//     if (aiScoreElement) aiScoreElement.textContent = this.gameState.aiScore.toString();
//   }

//   private render(): void {
//     // Clear canvas
//     this.ctx.fillStyle = '#000';
//     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

//     // Draw center line
//     this.ctx.setLineDash([5, 15]);
//     this.ctx.strokeStyle = '#fff';
//     this.ctx.lineWidth = 2;
//     this.ctx.beginPath();
//     this.ctx.moveTo(this.canvas.width / 2, 0);
//     this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
//     this.ctx.stroke();
//     this.ctx.setLineDash([]);

//     // Draw paddles
//     this.ctx.fillStyle = '#fff';
//     this.ctx.fillRect(this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.width, this.playerPaddle.height);
//     this.ctx.fillRect(this.aiPaddle.x, this.aiPaddle.y, this.aiPaddle.width, this.aiPaddle.height);

//     // Draw ball
//     this.ctx.beginPath();
//     this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
//     this.ctx.fill();
//   }

//   private gameLoop(): void {
//     if (!this.gameState.gameRunning) return;

//     this.updatePlayerPaddle();
//     this.updateAIPaddle();
//     this.updateBall();
//     this.render();

//     this.animationId = requestAnimationFrame(() => this.gameLoop());
//   }

//   public startGame(): void {
//     this.gameState.gameRunning = true;
//     this.gameLoop();
//   }

//   public stopGame(): void {
//     this.gameState.gameRunning = false;
//     if (this.animationId) {
//       cancelAnimationFrame(this.animationId);
//       this.animationId = null;
//     }
//   }

//   public resetGame(): void {
//     this.stopGame();
//     this.gameState.playerScore = 0;
//     this.gameState.aiScore = 0;
//     this.updateScore();
//     this.resetBall();
//     this.initializeGame();
//   }
// }

// // DOM Content Loaded
// document.addEventListener('DOMContentLoaded', () => {
//   const loginContainer = document.getElementById('loginContainer');
//   const gameContainer = document.getElementById('gameContainer');
//   const signInBtn = document.getElementById('signInBtn');
//   const googleBtn = document.getElementById('googleBtn');
//   const backBtn = document.getElementById('backBtn');

//   let pongGame: PongGame | null = null;

//   // Sign in button click
//   signInBtn?.addEventListener('click', () => {
//     const email = (document.getElementById('email') as HTMLInputElement)?.value;
//     const password = (document.getElementById('password') as HTMLInputElement)?.value;

//     if (email && password) {
//       // Hide login, show game
//       if (loginContainer) loginContainer.style.display = 'none';
//       if (gameContainer) gameContainer.style.display = 'block';
      
//       // Initialize and start game
//       pongGame = new PongGame();
//       pongGame.startGame();
//     } else {
//       alert('Please enter both email and password');
//     }
//   });

//   // Google sign in button click
//   googleBtn?.addEventListener('click', () => {
//     // Hide login, show game
//     if (loginContainer) loginContainer.style.display = 'none';
//     if (gameContainer) gameContainer.style.display = 'block';
    
//     // Initialize and start game
//     pongGame = new PongGame();
//     pongGame.startGame();
//   });

//   // Back button click
//   backBtn?.addEventListener('click', () => {
//     // Stop game
//     if (pongGame) {
//       pongGame.stopGame();
//       pongGame = null;
//     }
    
//     // Show login, hide game
//     if (gameContainer) gameContainer.style.display = 'none';
//     if (loginContainer) loginContainer.style.display = 'flex';
//   });

//   // Handle enter key on password field
//   const passwordField = document.getElementById('password') as HTMLInputElement;
//   passwordField?.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//       signInBtn?.click();
//     }
//   });
// });