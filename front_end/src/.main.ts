import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/loaders/glTF";
import axios from 'axios';
import { AdvancedDynamicTexture, Button, TextBlock, Rectangle, Control, Image, InputText, InputPassword, LinearGradient } from "@babylonjs/gui";
import { Engine, Scene, Vector3, FreeCamera, Color4, Mesh, MeshBuilder, HemisphericLight, ArcRotateCamera } from "@babylonjs/core";
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
        const background = new Rectangle("titleContainer");
        background.thickness = 0;
        background.background = "#00533C"
        guiMenu.addControl(background);

        // const startbg = new Image("startbg", "/zgeg.png");
        // background.addControl(startbg);

        const title = new TextBlock("title", "SIGN IN");
        title.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        title.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        title.resizeToFit = true;
        title.fontFamily = "Poppins";
        title.fontSize = "45px";
        title.fontWeight = "800";
        title.color = "white";
        title.resizeToFit = true;
        title.width = 0.8;
        title.left = "-50px";
        background.addControl(title);

        var emailInput = new InputText("email", "");
        emailInput.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        emailInput.width = 0.2;
        emailInput.maxWidth = 0.2;
        emailInput.top = "40px";
        emailInput.left = "-50px";
        emailInput.height = "20px";
        emailInput.fontFamily = "Poppins";
        emailInput.fontSize = "8px"
        emailInput.text = "Yourname@gmail.com";
        emailInput.color = "#A4A4A4";
        emailInput.background = "#261046";
        guiMenu.addControl(emailInput);

        var passwordInput = new InputPassword("password");
        passwordInput.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        passwordInput.width = 0.2;
        passwordInput.maxWidth = 0.2;
        passwordInput.top = "80px";
        passwordInput.left = "-50px";
        passwordInput.height = "20px";
        passwordInput.fontFamily = "Poppins";
        passwordInput.fontSize = "8px"
        passwordInput.text = "YourPassword";
        passwordInput.color = "#A4A4A4";
        passwordInput.background = "#261046";
        guiMenu.addControl(passwordInput);

        const startBtn = Button.CreateSimpleButton("start", "Sign Up");
        startBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
        startBtn.left = "-50px"
        startBtn.top = "120px";
        startBtn.width = 0.2
        startBtn.height = "20px";
        startBtn.fontFamily = "Poppins";
        startBtn.fontSize = "8px";
        startBtn.thickness = 0;
        startBtn.color = "white";
        const gradient = new LinearGradient();
        gradient.addColorStop(0, "#501794");
        gradient.addColorStop(1, "#3E70A1");

        startBtn.backgroundGradient = gradient;
        background.addControl(startBtn);

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