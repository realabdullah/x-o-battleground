import type { IGame } from "~/types";

const games: { [key: string]: IGame } = {};

const createGameState = (): IGame => {
	return {
		board: Array(9).fill(null),
		currentPlayer: "X",
		status: "waiting",
		players: { X: { id: null, name: "" }, O: { id: null, name: "" } },
		winner: null,
		creator: null,
	};
};

const checkWinner = (board: IGame["board"]) => {
	const winPatterns = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (const pattern of winPatterns) {
		const [a, b, c] = pattern;
		if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
	}

	if (board.every(cell => cell !== null)) return "draw";
	return null;
};

export default defineWebSocketHandler({
	open(peer) {},
	message(peer, message) {
		const data = JSON.parse(message.text());
		const gameId = data.gameId;

		if (data.type === "create game") {
			games[gameId] = createGameState();
			peer.subscribe(gameId);
			games[gameId].players.X.id = peer.id;
			games[gameId].players.X.name = data.name;
			games[gameId].creator = peer.id;
			peer.send({ type: "game created", data: { game: games[gameId], symbol: "X" } });
		} else if (data.type === "join game") {
			console.log("joining")
			const game = games[gameId];

			if (!game) {
				console.log("jon snow: ", games);
				peer.send({ type: "error", data: "Invalid game id!" });
				return;
			}

			if (game.players.X.id && game.players.O.id) {
				peer.send({ type: "error", data: "Two players already in the game!" });
				return;
			}

			peer.subscribe(gameId);

			const symbol = game.players.X.id ? "O" : "X";
			game.players[symbol].id = peer.id;
			game.players[symbol].name = data.name;
			peer.send({ type: "game joined", data: game });

			if (game.players.X.id && game.players.O.id) {
				game.status = "playing";
				peer.send({ type: "game started", data: game });
				peer.publish(gameId, { type: "game started", data: game });
			}
		} else if (data.type === "make move") {
			const index = data.index;
			const game = games[gameId];

			if (!game) {
				peer.send({ type: "error", data: "Game not found!" });
				return;
			}

			let playerSymbol = null;
			if (game.players.X.id === peer.id) playerSymbol = "X";
			if (game.players.O.id === peer.id) playerSymbol = "O";

			if (game.status !== "playing" || playerSymbol !== game.currentPlayer || game.board[index] !== null || index < 0 || index > 8) {
				peer.send({ type: "soft error", data: "Invalid move!" });
				return;
			}

			game.board[index] = playerSymbol;
			game.currentPlayer = playerSymbol === "X" ? "O" : "X";

			const result = checkWinner(game.board);
			if (result) {
				game.status = "finished";
				game.winner = result as string;
			}

			peer.send({ type: "game update", data: game });
			peer.publish(gameId, { type: "game update", data: game });
			console.log(`Player ${peer.id} made move at index ${index} in game: [${gameId}] -- ${game.status} || ${game.winner}`);
		} else if (data.type === "restart game") {
			games[gameId] = createGameState();
			peer.publish(gameId, { type: "restart game", data: { game: games[gameId] } });
		}
	},
	close(peer) {
		console.log("Client disconnected:", peer.id);

		for (const gameId in games) {
			const game = games[gameId];

			if (game.players.X.id === peer.id || game.players.O.id === peer.id) {
				game.status = "waiting";
				if (game.players.X.id === peer.id) game.players.X.id = null;
				if (game.players.O.id === peer.id) game.players.O.id = null;
				peer.publish(gameId, { type: "player disconnected", data: game });
				peer.unsubscribe(gameId);
				break;
			}
		}
	},
	error(peer, message) {
		console.log("error: ", peer, message);
	},
});
