import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/loaders/glTF"
import { ArcRotateCamera, Color3, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"
import { ChatSystem } from "./chat"

// /* VARIABLES GLOBALES */
// let isLoginMode = true;

// document.addEventListener('DOMContentLoaded', () => {
// 	initializeAuthToggle();
// 	initializeAuthHandlers();
// 	initializeBackButton();
// });

// function initializeAuthToggle() {
// 	const loginToggle = document.getElementById('loginToggle');
// 	const signupToggle = document.getElementById('signupToggle');
// 	const authTitle = document.getElementById('authTitle');
// 	const authDescription = document.getElementById('authDescription');
// 	const authBtn = document.getElementById('authBtn');
// 	const signupFields = document.querySelectorAll('.signup-only');

// 	function switchToLogin() {
// 		isLoginMode = true;

// 		loginToggle?.classList.add('active');
// 		signupToggle?.classList.remove('active');

// 		if (authTitle) authTitle.textContent = 'LOG IN';
// 		if (authDescription) authDescription.textContent = 'Log in with email address';
// 		if (authBtn) authBtn.textContent = 'Log In';

// 		signupFields.forEach((field: Element) => {
// 			const htmlField = field as HTMLElement;
// 			htmlField.style.display = 'none';
// 			if (field instanceof HTMLInputElement) {
// 				field.required = false;
// 			}
// 		});
// 	}

// 	function switchToSignup() {
// 		isLoginMode = false;

// 		loginToggle?.classList.remove('active');
// 		signupToggle?.classList.add('active');

// 		if (authTitle) authTitle.textContent = 'SIGN IN';
// 		if (authDescription) authDescription.textContent = 'Create your account';
// 		if (authBtn) authBtn.textContent = 'Sign Up';

// 		signupFields.forEach((field: Element) => {
// 			const htmlField = field as HTMLElement;
// 			htmlField.style.display = 'block';
// 			if (field instanceof HTMLInputElement) {
// 				field.required = true;
// 			}
// 		});
// 	}

// 	loginToggle?.addEventListener('click', switchToLogin);
// 	signupToggle?.addEventListener('click', switchToSignup);
// }

// function initializeAuthHandlers() {

// 	document.getElementById('authBtn')?.addEventListener('click', async () => {
// 		const email = (document.getElementById('email') as HTMLInputElement)?.value;
// 		const password = (document.getElementById('password') as HTMLInputElement)?.value;

// 		if (isLoginMode) {
// 			if (!email || !password) {
// 				alert('Please fill in both email and password');
// 				return;
// 			}

// 			const loginSuccessful = await Login(email, password);
// 			if (loginSuccessful) {
// 				startPongGame();
// 			} else {
// 				alert('Login failed. Please try again.');
// 			}
// 		} else {
//       // Pour le sign in
// 			if (!email || !password) {
// 				alert('Please fill in all fields');
// 				return;
// 			}

// 			const signupSuccessful = await SignUp(email, password);
// 			if (signupSuccessful) {
// 				alert('Account created successfully! Please sign in.');
// 				document.getElementById('loginToggle')?.click();
// 			} else {
// 				alert('Sign up failed. Please try again.');
// 			}
// 		}
// 	});


// /* BOUTON GOOGLE */
// 	document.getElementById('googleBtn')?.addEventListener('click', () => {
// 		console.log('Google authentication');
// 		// Test Minh - SIMULATION
// 		startPongGame();
// 	});

// 	// Gestion de la touche Entree
// 	document.addEventListener('keypress', (e) => {
// 		if (e.key === 'Enter' && document.getElementById('authContainer')?.style.display !== 'none') {
// 			document.getElementById('authBtn')?.click();
// 		}
// 	});
// }

// function initializeBackButton() {
// 	document.getElementById('backBtn')?.addEventListener('click', () => {
// 		document.getElementById('gameContainer')!.style.display = 'none';
// 		document.getElementById('authContainer')!.style.display = 'flex';

// 		if ((window as any).currentGame) {
// 			(window as any).currentGame.dispose();
// 			(window as any).currentGame = null;
// 		}
// 	});
// }

// async function SignUp(email: string, password: string): Promise<boolean> {
// 	if (!email || !password) return false;

// 	try {
// 		const response = await axios.post(`${BASE_ADDRESS}/auth/register`, {
// 			email,
// 			password,
// 		});
// 		const token = response.data?.token;
// 		if (token) {
// 			window.sessionStorage.setItem("token", token);
// 			return true;
// 		}
// 		return false;
// 	} catch (err) {
// 		console.error("Signup failed:", err);
// 		return false;
// 	}
// }


// async function Login(email: string, password: string) {
// 	if (!email || !password) return false;

// 	try {
// 		const response = await axios.post(`${BASE_ADDRESS}/auth/login`,
// 			{ email, password },
// 		);
// 		const token = response.data?.token;
// 		if (token) {
// 			window.sessionStorage.setItem("token", token);
// 			return true;
// 		}
// 		return false;
// 	} catch (err) {
// 		console.error("Login failed:", err);
// 		return false;
// 	}
// }


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

      if (this.chat) {
        this.chat.receiveMessage("System", "AI scored! 🤖");
      }
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