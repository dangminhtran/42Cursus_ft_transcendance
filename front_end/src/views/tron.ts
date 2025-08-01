import "@babylonjs/core/Debug/debugLayer"
import "@babylonjs/loaders/glTF"
import { ArcRotateCamera, Color3, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"
import { renderNavbar } from '../componentes/navbar';
import { setTronGame } from '../state';

export class TronGame {
	canvas: HTMLCanvasElement | any;
	engine: any;
	playerOneScore: number;
	playerTwoScore: number;
	winningScore: number;
	carSpeed: number;
	inputStates: { wPressed: boolean, aPressed: boolean; sPressed: boolean, dPressed: boolean; };
	aiStates: { upPressed: boolean, leftPressed: boolean; downPressed: boolean, rightPressed: boolean; };
	trail : any;
	scene: any;
	camera: any;
	fieldWidth: number;
	fieldHeight: number;
	ball: any;
	playerCar: any;
	aiCar: any;

	constructor() {
		this.canvas = document.getElementById("renderCanvas");
		this.engine = new Engine(this.canvas, true);
		this.trail = [];

		this.playerOneScore = 0;
		this.playerTwoScore = 0;
		this.winningScore = 5;
		this.carSpeed = 1;

		this.inputStates = {
			wPressed: false,
			aPressed: false,
			sPressed: false,
			dPressed: true,
		};

		this.aiStates = {
			upPressed: false,
			leftPressed: true,
			downPressed: false,
			rightPressed: false,
		};

		this.createScene();
		this.setupControls();
		this.startGameLoop();
	}

	createScene() {
		this.scene = new Scene(this.engine);

		this.camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 300, Vector3.Zero(), this.scene);
		this.camera.setTarget(Vector3.Zero());

		const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
		light.intensity = 0.8;

		this.createGameField();
		this.createCars();
	}

	createGameField() {
		const fieldWidth = 200;
		const fieldHeight = 200;

		// Floor
		const ground = MeshBuilder.CreateGround("ground", { width: fieldWidth, height: fieldHeight }, this.scene);
		const groundMaterial = new StandardMaterial("groundMat", this.scene);
		groundMaterial.diffuseColor = new Color3(0, 0, 0);
		ground.material = groundMaterial;

		this.fieldWidth = fieldWidth;
		this.fieldHeight = fieldHeight;

		MeshBuilder.CreateLines("bounds", {
			points: [
				new Vector3(-100, 0.01, -100),
				new Vector3(100, 0.01, -100),
				new Vector3(100, 0.01, 100),
				new Vector3(-100, 0.01, 100),
				new Vector3(-100, 0.01, -100),
			],
		}, this.scene);
	}

	createCars() {
		// Player paddle (left)
		this.playerCar = MeshBuilder.CreateBox("playerCar", { width: 1, height: 1, depth: 1 }, this.scene);
		this.playerCar.position = new Vector3(-90, 0.5, 0);

		const playerMaterial = new StandardMaterial("playerMat", this.scene);
		playerMaterial.diffuseColor = new Color3(0, 0.8, 1);
		this.playerCar.material = playerMaterial;

		// AI paddle (right)
		this.aiCar = MeshBuilder.CreateBox("aiCar", { width: 1, height: 1, depth: 1 }, this.scene);
		this.aiCar.position = new Vector3(90, 0.5, 0);

		const aiMaterial = new StandardMaterial("aiMat", this.scene);
		aiMaterial.diffuseColor = new Color3(1, 0.5, 0.05);
		this.aiCar.material = aiMaterial;
	}

	setupControls() {
		window.addEventListener('keydown', (event) => {

			switch (event.code) {
				case 'KeyW':
					if ( this.inputStates.sPressed == true || this.inputStates.wPressed == true )
						break;
					this.resetDirections()
					this.inputStates.wPressed = true;
					break;
				case 'KeyA':
					if ( this.inputStates.dPressed == true || this.inputStates.aPressed == true)
						break;
					this.resetDirections()
					this.inputStates.aPressed = true;
					break;
				case 'KeyS':
					if ( this.inputStates.wPressed == true || this.inputStates.sPressed == true)
						break;
					this.resetDirections()
					this.inputStates.sPressed = true;
					break;
				case 'KeyD':
					if ( this.inputStates.aPressed == true || this.inputStates.dPressed == true )
						break;
					this.resetDirections()
					this.inputStates.dPressed = true;
					break;

				case 'ArrowUp':
					if ( this.aiStates.downPressed == true || this.aiStates.upPressed == true )
						break;
					this.resetAIDirections()
					this.aiStates.upPressed = true;
					break;
				case 'ArrowLeft':
					if ( this.aiStates.rightPressed == true || this.aiStates.leftPressed == true)
						break;
					this.resetAIDirections()
					this.aiStates.leftPressed = true;
					break;
				case 'ArrowDown':
					if ( this.aiStates.upPressed == true || this.aiStates.downPressed == true)
						break;
					this.resetAIDirections()
					this.aiStates.downPressed = true;
					break;
				case 'ArrowRight':
					if ( this.aiStates.leftPressed == true || this.aiStates.rightPressed == true )
						break;
					this.resetAIDirections()
					this.aiStates.rightPressed = true;
					break;
				}

		});
	}

	resetDirections() {
		this.inputStates.wPressed = false;
		this.inputStates.aPressed = false;
		this.inputStates.sPressed = false;
		this.inputStates.dPressed = false;
	}

	resetAIDirections() {
		this.aiStates.upPressed = false;
		this.aiStates.leftPressed = false;
		this.aiStates.downPressed = false;
		this.aiStates.rightPressed = false;
	}

	updatePlayerCar() {

		let car = this.playerCar;

		let oldPos = car.position.clone();

		if ( this.inputStates.wPressed )
			this.playerCar.position.z += this.carSpeed;
	
		else if ( this.inputStates.aPressed )
			this.playerCar.position.x -= this.carSpeed;
	
		else if ( this.inputStates.sPressed )
			this.playerCar.position.z -= this.carSpeed;

		else if ( this.inputStates.dPressed )
			this.playerCar.position.x += this.carSpeed;

		if ( this.checkCollision(this.playerCar.position.x, this.playerCar.position.z, 0) == true )
			return ;

		this.addTrailBlock(oldPos.x, oldPos.z, new Color3(0, 0.8, 1));


		car = this.aiCar;

		oldPos = car.position.clone();

		if ( this.aiStates.upPressed )
			this.aiCar.position.z += this.carSpeed;
	
		else if ( this.aiStates.leftPressed )
			this.aiCar.position.x -= this.carSpeed;
	
		else if ( this.aiStates.downPressed )
			this.aiCar.position.z -= this.carSpeed;

		else if ( this.aiStates.rightPressed )
			this.aiCar.position.x += this.carSpeed;

		if ( this.checkCollision(this.aiCar.position.x, this.aiCar.position.z, 1) == true )
			return ;

		Color3 
		this.addTrailBlock(oldPos.x, oldPos.z, new Color3(1, 0.5, 0.05));
	}

	addTrailBlock(x: any, z: any, c: Color3) {
		const trailBlock = MeshBuilder.CreateBox("trail", { size: 1 }, this.scene);
		trailBlock.position = new Vector3(x, 0.5, z);

		const trailMaterial = new StandardMaterial("trailMat", this.scene);
		trailMaterial.diffuseColor = c; // couleur du joueur
		trailBlock.material = trailMaterial;

		this.trail.push(trailBlock); // pour garder une référence si besoin
	}

	checkCollision(x: any, z: any, who: any) {
		if ( this.checkCollisionWithTrail(x, z) == true ||  x >= 100 || x <= -100 ||  z >= 100 || z <= -100  )
		{
			this.resetGame();
			if ( who == 0 )
				this.playerTwoScore += 1;
			else
				this.playerOneScore += 1;
			this.updateScore();

			if (this.playerOneScore >= this.winningScore) {
				this.endMatch("Player(blue)");
				return true;
			}
			if (this.playerTwoScore >= this.winningScore) {
				this.endMatch("Player(orange)");
				return true;
			}

			return ( true );
		}
		return ( false );
	}

	endMatch(winner: string) {
		this.engine.stopRenderLoop();

		this.showWinnerOverlay(winner);

		// Optionally, you can reset the game or go back to menu after a delay
		setTimeout(() => {
			renderTron(); // Go back to Tron menu
		}, 3000);
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
				<div>${winner} Wins!</div>
				<div style="font-size: 1.5rem; margin-top: 20px; opacity: 0.8;">
					Final Score: ${this.playerOneScore} - ${this.playerTwoScore}
				</div>
			</div>
		`;

		document.body.appendChild(overlay);

		setTimeout(() => {
			if (overlay.parentNode) {
				overlay.parentNode.removeChild(overlay);
			}
		}, 3000);
	}

	resetGame() {
		this.playerCar.position = new Vector3(-90, 0.5, 0);
		this.resetDirections();
		this.inputStates.dPressed = true;

		this.aiCar.position = new Vector3(90, 0.5, 0);
		this.resetAIDirections();
		this.aiStates.leftPressed = true;

		for (const block of this.trail) {
			block.dispose();
		}

		this.trail = [];
	}

	checkCollisionWithTrail(x: any, z: any) {
		for (const block of this.trail) {
			if (Math.floor(block.position.x) === Math.floor(x) &&
				Math.floor(block.position.z) === Math.floor(z)) {
				return true;
			}
		}
		return false;
	}

	updateScore() {
		let playerscore = document.getElementById('playerOneScore');
		if (playerscore)
			playerscore.textContent = this.playerOneScore as unknown as string;
		let aiscore = document.getElementById('playerTwoScore');
		if (aiscore)
			aiscore.textContent = this.playerTwoScore as unknown as string;
	}

	startGameLoop() {
		this.engine.runRenderLoop(() => {
			this.updatePlayerCar();
		// if ( this.playerOneScore == 5 ) 
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

	public clearGame() {
		this.engine.stopRenderLoop();

		if (this.scene)  { this.scene.dispose();  }
		if (this.engine) { this.engine.dispose(); }
	}
}

function startTronGame() {
	const game = new TronGame();
	setTronGame(game);
}

// export function renderTron() {
// 	renderNavbar();
// 	document.getElementById('app')!.innerHTML = `
// 		<div class="flex flex-col justify-center items-center min-h-screen -mt-20">
// 			<div class="card p-7">
// 				<div class="text-purple-950 font-bold text-4xl mb-10">Ready to play Tron?</div>
// 				<button id="startTronBtn">
// 					Start Game
// 				</button>
// 			</div>
// 		</div>
// 	`;

// 	const startBtn = document.getElementById('startTronBtn');
// 	startBtn?.addEventListener('click', () => {
// 		renderNavbar();
// 		document.getElementById('app')!.innerHTML = `
// 			<div id="gameContainer">
// 				<canvas id="renderCanvas"></canvas>
// 				<div id="gameUI">
// 					<div>Player1(blue): <span id="playerOneScore">0</span> | Player2(orange): <span id="playerTwoScore">0</span></div>
// 				</div>
// 				<div id="instructions">
// 					Use W/S/A/D or Arrow Keys to move
// 				</div>
// 			</div>
// 		`;
// 		startTronGame();
// 	});
// }

export function renderTron() {
    renderNavbar();
    document.getElementById('app')!.innerHTML = `
        <div class="flex flex-col justify-center items-center -mt-20 h-screen overflow-hidden">
            <div class="card p-7">
                <div class="text-purple-950 font-bold text-4xl mb-10">Ready to play Tron?</div>
                <button id="startTronBtn">
                    Start Game
                </button>
            </div>
        </div>
    `;

    const startBtn = document.getElementById('startTronBtn');
    startBtn?.addEventListener('click', () => {
        renderNavbar();
        document.getElementById('app')!.innerHTML = `
            <div id="gameContainer">
                <canvas id="renderCanvas"></canvas>
                <div id="gameUI">
                    <div>Player1(blue): <span id="playerOneScore">0</span> | Player2(orange): <span id="playerTwoScore">0</span></div>
                </div>
                <div id="instructions">
                    Use W/S/A/D or Arrow Keys to move
                </div>
            </div>
        `;
        startTronGame();
    });
}
