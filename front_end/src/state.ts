import { PongGame } from "./views/pong";

type AppState = {
	pong: PongState | null,
};

type PongState = {
	player1_score: number,
	player2_score: number,
	pong: PongGame,

};

const state: AppState = {
	pong: null
};

export function setPongGame(pongGame: PongGame) {
	let ponggame: PongState =  {
		player1_score: 0,
		player2_score: 0,
		pong : pongGame,
	};

	state.pong = ponggame;
}

export function clearPongGame() {
	state.pong?.pong.clearGame();
}