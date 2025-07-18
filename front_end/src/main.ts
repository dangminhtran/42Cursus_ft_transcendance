import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/loaders/glTF";
import { AdvancedDynamicTexture, Button, TextBlock, Rectangle, Control, Image, InputText, InputPassword } from "@babylonjs/gui";

import { Engine, Scene, Vector3, FreeCamera, Color4, Mesh, MeshBuilder, HemisphericLight, ArcRotateCamera } from "@babylonjs/core";

import axios from 'axios';

import { BASE_ADDRESS } from "./config";

import "./style.css"


enum AppState {
	START = 0,
	GAME = 1,
	LOSE = 2,
	CUTSCENE = 3
}


class App {
	// Gereral variables
	private _scene: Scene;
	private _canvas: HTMLCanvasElement;
	private _engine: Engine;

	// Scene related

	private _state: AppState = 0;

    constructor() {

		this._canvas = this._createCanvas();
        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && (ev.key === "I" || ev.key === "i")) {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });

        this._main();
    }

	private _createCanvas(): HTMLCanvasElement {
        // create the canvas html element and attach it to the webpage
        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100vw";
        this._canvas.style.height = "100vh";
        this._canvas.id = "gameCanvas";
        document.body.appendChild(this._canvas);
		return this._canvas;
	}

	private async _goToStart() {
        this._engine.displayLoadingUI(); //make sure to wait for start to load

        //--SCENE SETUP--
        //dont detect any inputs from this ui while the game is loading
        this._scene.detachControl();
        let scene = new Scene(this._engine);
        scene.clearColor = new Color4(0, 0, 0, 1);
        //creates and positions a free camera
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero()); //targets the camera to scene origin


		//--GUI--
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720;

        //background image
        const imageRect = new Rectangle("titleContainer");
        imageRect.width = 0.8;
        imageRect.thickness = 0;
        guiMenu.addControl(imageRect);

        const startbg = new Image("startbg", "/zgeg.png");
        imageRect.addControl(startbg);

        const title = new TextBlock("title", "GIGA PONG");
        title.resizeToFit = true;
        title.fontFamily = "Ceviche One";
        title.fontSize = "32px";
        title.color = "white";
        title.resizeToFit = true;
        title.top = "14px";
        title.width = 0.8;
        title.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        imageRect.addControl(title);

		var emailInput = new InputText("email", "");
        emailInput.width = 0.2;
        emailInput.maxWidth = 0.2;
        emailInput.height = "20px";
        emailInput.text = "";
        emailInput.color = "white";
        emailInput.background = "black";
        guiMenu.addControl(emailInput); 

		var passwordInput = new InputPassword("password");
        passwordInput.width = 0.2;
        passwordInput.maxWidth = 0.2;
        passwordInput.height = "20px";
        passwordInput.top = "30px";
        passwordInput.text = "";
        passwordInput.color = "white";
        passwordInput.background = "black";
        guiMenu.addControl(passwordInput); 

        const startBtn = Button.CreateSimpleButton("start", "Login");
        startBtn.fontFamily = "Viga";
        startBtn.width = 0.2
        startBtn.height = "40px";
        startBtn.color = "white";
        startBtn.top = "60px";
        startBtn.thickness = 0;
        imageRect.addControl(startBtn);
		startBtn.onPointerDownObservable.add(async () => {
			let email: string = emailInput.text;
			let password: string = passwordInput.text;
			const ok = await this._login(email, password);
			if (ok)
				await this._goToGame();
		});

		//--SCENE FINISHED LOADING--
		await scene.whenReadyAsync();
		this._engine.hideLoadingUI();
		//lastly set the current state to the start state and set the scene to the start scene
		this._scene.dispose();
		this._scene = scene;
		this._state = AppState.START;
    }

	private async _goToGame() {
		this._engine.displayLoadingUI();

		this._scene.dispose();

		const gameScene = new Scene(this._engine);
		gameScene.clearColor = new Color4(0.1, 0.1, 0.1, 1);

		var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(),
		 gameScene);
        camera.attachControl(this._canvas, true);

		var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), gameScene);
		var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, gameScene);


		await gameScene.whenReadyAsync();

		this._engine.hideLoadingUI();
		this._scene = gameScene;
		this._state = AppState.GAME;
	}

	private async _login(email: string, password: string): Promise<boolean> {
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


	private async _main(): Promise<void> {
		await this._goToStart();

		this._engine.runRenderLoop(() => {
            switch (this._state) {
                case AppState.START:
                    this._scene.render();
                    break;
                case AppState.GAME:
                    this._scene.render();
                    break;
                
                default: break;
            }
        });

		window.addEventListener('resize', () => {
			this._engine.resize();
		});
	}
}
new App();