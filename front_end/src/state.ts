import { PongGame } from "./views/pong";
import { TronGame } from "./views/tron";

type AppState = {
	pong: PongState | null,
	tron: TronState | null
};

type PongState = {
	player1_score: number,
	player2_score: number,
	pong: PongGame,
};

type TronState = {
	player1_score: number,
	player2_score: number,
	tron: TronGame,
};

const state: AppState = {
	pong: null,
	tron: null
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

export function setTronGame(tronGame: TronGame) {
	let trongame: TronState =  {
		player1_score: 0,
		player2_score: 0,
		tron : tronGame,
	};

	state.tron = trongame;
}

export function clearTronGame() {
	
	state.tron?.tron.clearGame();
}