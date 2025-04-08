export interface IGame {
	board: Array<string | null>;
	currentPlayer: "X" | "O";
	status: "waiting" | "playing" | "finished";
	players: {
		X: { name: string; id: string | null };
		O: { name: string; id: string | null };
	};
	winner: string | null;
	creator: string | null;
}

export type GameResponse = {
	type: string;
	data: any;
};

export interface GameResponseContext {
	gameData: Ref<IGame | undefined>;
	symbol: Ref<string | null>;
}
