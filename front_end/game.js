window.addEventListener('DOMContentLoaded', () => {
	document.getElementById("startgame").addEventListener('click', () => {
		launchGame();
	})
});


function launchGame() {

	const winningScore = 5;
	let p1score = 0;
	let p2score = 0;

	const canvas = document.getElementById('renderCanvas');
	
	const setCanvasSize = () => {
		const dpr = Math.max(window.devicePixelRatio || 1, 1);
		canvas.width = canvas.clientWidth * dpr;
		canvas.height = canvas.clientHeight * dpr;
	};

	const engine = new BABYLON.Engine(canvas, true, {}, true);

	setCanvasSize();
	engine.resize();
	window.addEventListener('resize', () => {
		setCanvasSize();
		engine.resize();
	});

	const scene = new BABYLON.Scene(engine);

	const ball = BABYLON.MeshBuilder.CreateSphere('ball',
		{ diameter: 0.5 }, scene);
	ball.position.set(0, 0, 0);

	const paddleLeft = BABYLON.MeshBuilder.CreateBox('paddleLeft',
		{ width: 0.2, height: 1.5, depth: 0.2 }, scene);
	paddleLeft.position.set(-3, 0, 0);

	const paddleRight = BABYLON.MeshBuilder.CreateBox('paddleRight',
		{ width: 0.2, height: 1.5, depth: 0.2 }, scene);
	paddleRight.position.set(3, 0, 0);

	const camera = new BABYLON.ArcRotateCamera('cam',
		Math.PI / 2, Math.PI / 4, 4,
		BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, true);

	camera.wheelPrecision = 0.5;
	camera.wheelDeltaPercentage = 0.05;

	new BABYLON.HemisphericLight('light',
		new BABYLON.Vector3(0, 1, 0), scene);

	let ballVelocity = new BABYLON.Vector3(0.07, 0, 0);
	const inputMap = {};
	scene.actionManager = new BABYLON.ActionManager(scene);

	scene.actionManager.registerAction(
		new BABYLON.ExecuteCodeAction(
			BABYLON.ActionManager.OnKeyDownTrigger,
			evt => { inputMap[evt.sourceEvent.key] = true; }
		)
	);
	scene.actionManager.registerAction(
		new BABYLON.ExecuteCodeAction(
			BABYLON.ActionManager.OnKeyUpTrigger,
			evt => { inputMap[evt.sourceEvent.key] = false; }
		)
	);


	function bounceWithAngle(paddle) {
		// Hauteur semi-active de la raquette
		const halfHeight = paddle.scaling.y / 2 || 1; // si tu scalais avec `height`, adapte ici
		// Position relative entre le centre de la balle et de la raquette (entre -1 et 1)
		const relativeY = (ball.position.y - paddle.position.y) / halfHeight;
		// Angle max de déviation (ici 45°)
		const maxAngle = Math.PI / 4;
		// Angle de rebond
		const bounceAngle = relativeY * maxAngle;
		// Vitesse totale avant rebond
		let speed = Math.sqrt(ballVelocity.x ** 2 + ballVelocity.y ** 2);
		if (speed < 0.15)
			speed += 0.01;
		// Sens horizontal : si c’est la raquette de gauche, on repart à droite (+), sinon à gauche (-)
		const dir = paddle === paddleLeft ? +1 : -1;
		// Recalcul des composantes
		ballVelocity.x = dir * Math.cos(bounceAngle) * speed;
		ballVelocity.y = Math.sin(bounceAngle) * speed;
	}


	const renderLoop = () => {
		ball.position.addInPlace(ballVelocity);

		if (ball.position.y > 2 || ball.position.y < -2) {
			ballVelocity.y *= -1;
		}

		if (ball.intersectsMesh(paddleLeft, false) && ballVelocity.x < 0) {
			bounceWithAngle(paddleLeft);
		}

		if (ball.intersectsMesh(paddleRight, false) && ballVelocity.x > 0) {
			bounceWithAngle(paddleRight);
		}

		if (ball.position.x > 3.5 || ball.position.x < -3.5) {
			if (ball.position.x > 3) { // player 1 + 1 points
				p2score += 1;
				document.getElementById("pong-p2-score").innerHTML = `Player 2: ${p2score}`;
				ball.position = BABYLON.Vector3.Zero();
				ballVelocity = new BABYLON.Vector3(0.07, 0, 0);
			}
			else {
				p1score += 1;
				document.getElementById("pong-p1-score").innerHTML = `Player 1: ${p1score}`;
				ball.position = BABYLON.Vector3.Zero();
				ballVelocity = new BABYLON.Vector3(-0.07, 0, 0);
			}
			if (p1score === winningScore || p2score === winningScore) {
				engine.stopRenderLoop(renderLoop);
				engine.clear(new BABYLON.Color4(0, 0, 0, 0), true, true, true);
				scene.dispose();
				return;
			}
		}

		// contrôle paddles
		if (inputMap['w']) paddleLeft.position.y += 0.1;
		if (inputMap['s']) paddleLeft.position.y -= 0.1;
		if (inputMap['o']) paddleRight.position.y += 0.1;
		if (inputMap['l']) paddleRight.position.y -= 0.1;

		scene.render();

	}

	engine.runRenderLoop(renderLoop);
}