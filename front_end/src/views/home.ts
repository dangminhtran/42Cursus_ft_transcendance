import { renderNavbar } from '../componentes/navbar';

type GameScore = {
	player1name: string,
	player1score: number,
	player2name: string,
	player2score: number,
	date: string,
};

const gameHistory: GameScore[] = [
	{ player1name: "Alice",    player1score: 5, player2name: "Bot",       player2score: 3, date: "2025-07-24" },
	{ player1name: "Bob",      player1score: 2, player2name: "Eve",       player2score: 5, date: "2025-07-23" },
	{ player1name: "Charlie",  player1score: 4, player2name: "Dave",      player2score: 4, date: "2025-07-22" },
	{ player1name: "Eve",      player1score: 1, player2name: "Alice",     player2score: 5, date: "2025-07-21" },
	{ player1name: "Mallory",  player1score: 3, player2name: "Trent",     player2score: 5, date: "2025-07-20" },
	{ player1name: "Oscar",    player1score: 5, player2name: "Peggy",     player2score: 0, date: "2025-07-19" },
	{ player1name: "Trent",    player1score: 2, player2name: "Charlie",   player2score: 5, date: "2025-07-18" },
	{ player1name: "Victor",   player1score: 4, player2name: "Mallory",   player2score: 5, date: "2025-07-17" },
	{ player1name: "Peggy",    player1score: 5, player2name: "Bob",       player2score: 2, date: "2025-07-16" },
	{ player1name: "Dave",     player1score: 3, player2name: "Oscar",     player2score: 5, date: "2025-07-15" },
];

export function renderHome() {
	renderNavbar();

	// get history from back
	// build HTMLArray
	// renderIT

	const rowsHtml = gameHistory.map(game => `
		<tr>
		<td>${game.date}</td>
		<td>${game.player1name}</td>
		<td>${game.player1score}</td>
		<td>${game.player2name}</td>
		<td>${game.player2score}</td>
		</tr>
	`).join('');

	// Injection du HTML avec styles intégrés
	document.getElementById('app')!.innerHTML = `
		<table class="w-5xl h-80 border-collapse border border-gray-700" id="history-table">
		<thead>
			<tr>
			<th>Date</th>
			<th>Joueur 1</th>
			<th>Score 1</th>
			<th>Joueur 2</th>
			<th>Score 2</th>
			</tr>
		</thead>
		<tbody>
			${rowsHtml}
		</tbody>
		</table>
	`;
}