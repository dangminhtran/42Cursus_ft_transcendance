window.addEventListener('DOMContentLoaded', () => {
	document.getElementById("startgame").addEventListener('click', () => {
		launchGame();
	})
});


function launchGame() {

	const winningScore = 50;
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
		{ diameter: 0.3 }, scene);
	ball.position.set(0, 0, 0);

	const paddleLeft = BABYLON.MeshBuilder.CreateBox('paddleLeft',
		{ width: 0.2, height: 1.5, depth: 0.2 }, scene);
	paddleLeft.position.set(-3, 0, 0);

	const paddleRight = BABYLON.MeshBuilder.CreateBox('paddleRight',
		{ width: 0.2, height: 1.5, depth: 0.2 }, scene);
	paddleRight.position.set(3, 0, 0);

	const camera = new BABYLON.ArcRotateCamera('cam',
		- (Math.PI / 2), Math.PI / 2, 8,
		BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, true);

	camera.wheelPrecision = 0.5;
	camera.wheelDeltaPercentage = 0.05;

	camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");

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
		const halfHeight = paddle.scaling.y / 2 || 1;
		const relativeY = (ball.position.y - paddle.position.y) / halfHeight;
		const maxAngle = Math.PI / 4;
		const bounceAngle = relativeY * maxAngle;
		let speed = Math.sqrt(ballVelocity.x ** 2 + ballVelocity.y ** 2);
		if (speed < 0.25)
			speed += 0.01;
		const dir = paddle === paddleLeft ? +1 : -1;
		// Recalcul des composantes
		ballVelocity.x = dir * Math.cos(bounceAngle) * speed;
		ballVelocity.y = Math.sin(bounceAngle) * speed;
	}


	// GUI
	const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = "Player 1: 0";
    text1.color = "white";
    text1.fontSize = 24;
	text1.left = "-420px";
	text1.top = "-220px"
    advancedTexture.addControl(text1);

    var text2 = new BABYLON.GUI.TextBlock();
    text2.text = "Player 2: 0";
    text2.color = "white";
	text2.left = "420px";
	text2.top = "-220px"
    text2.fontSize = 24;
    advancedTexture.addControl(text2);

	const renderLoop = () => {
		ball.position.addInPlace(ballVelocity);

		if (ball.position.y > 2 || ball.position.y < -2) {
			ballVelocity.y *= -1;
		}

		if (ball.intersectsMesh(paddleLeft, false)) {
			bounceWithAngle(paddleLeft);
		}

		if (ball.intersectsMesh(paddleRight, false)) {
			bounceWithAngle(paddleRight);
		}

		if (ball.position.x > 3.5 || ball.position.x < -3.5) {
			if (ball.position.x > 3) { // player 1 + 1 points
				p2score += 1;
				text2.text = `Player 2: ${p2score}`;
				ball.position = BABYLON.Vector3.Zero();
				ballVelocity = new BABYLON.Vector3(0.07, 0, 0);
			}
			else {
				p1score += 1;
				text1.text = `Player 1: ${p1score}`;
				ball.position = BABYLON.Vector3.Zero();
				ballVelocity = new BABYLON.Vector3(-0.07, 0, 0);
			}
			if (p1score === winningScore || p2score === winningScore) {
				engine.stopRenderLoop(renderLoop);
				engine.clear(new BABYLON.Color4(0, 0, 0, 1), true, true, true);
				var text3 = new BABYLON.GUI.TextBlock();
				text3.text = p1score > p2score ? "Player 1 WINS" : "Player 2 WINS";
				text3.color = "white";
				text3.fontSize = 24;
				advancedTexture.addControl(text3);
				scene.dispose();
				return;
			}
		}

		// contrôle paddles
		if (inputMap['w'])
		{
			if ( paddleLeft.position.y < 2 )
				paddleLeft.position.y += 0.1;
		}
		if (inputMap['s'])
		{
			if ( paddleLeft.position.y > -2 )
				paddleLeft.position.y -= 0.1;
		}
		if (inputMap['a'])
		{
			if ( paddleLeft.position.x > -3 )
				paddleLeft.position.x -= 0.1;
		}
		if (inputMap['d']) 
		{
			if ( paddleLeft.position.x < -1 )
				paddleLeft.position.x += 0.1;
		}

		if (inputMap['ArrowUp'])
		{
			if ( paddleRight.position.y < 2 )
				paddleRight.position.y += 0.1;
		}
		if (inputMap['ArrowDown'])
		{
			if ( paddleRight.position.y > -2 )
				paddleRight.position.y -= 0.1;
		}
		if (inputMap['ArrowLeft'])
		{
			if ( paddleRight.position.x > 1 )
				paddleRight.position.x -= 0.1;
		}
		if (inputMap['ArrowRight'])
		{
			if ( paddleRight.position.x < 3 )
				paddleRight.position.x += 0.1;
		}

		scene.render();

	}

	engine.runRenderLoop(renderLoop);
}