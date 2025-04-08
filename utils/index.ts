import type { GameResponse, GameResponseContext, IGame } from "~/types";
import { useWinConfetti } from "~/composables/useWinConfetti";
import { useLoseConfetti } from "~/composables/useLoseConfetti";
import { push } from "notivue";

export const handleGameResponse = (response: GameResponse, context: GameResponseContext) => {
	const { type, data: responseData } = response;
	const { gameData, symbol } = context;

	const handlers: Record<string, () => void> = {
		"reconnected": () => {
			const { game, symbol: playerSymbol } = responseData as { game: IGame; symbol: "X" | "O" };
			symbol.value = playerSymbol;
			gameData.value = { ...game };
			push.info("Reconnected to game");
		},
		"game created": () => {
			symbol.value = responseData.symbol;
			gameData.value = { ...responseData.game } as IGame;
		},
		"game joined": () => {
			gameData.value = { ...responseData } as IGame;
		},
		"game started": () => {
			gameData.value = { ...responseData } as IGame;
		},
		"game update": () => {
			gameData.value = { ...responseData } as IGame;
			if (gameData.value?.status === "finished" && gameData.value?.winner) {
				push.success(`Winner is ${gameData.value.winner}`);
				if (symbol.value === gameData.value.winner) {
					useWinConfetti();
				} else {
					useLoseConfetti();
				}
			}
		},
		"game restarted": () => {
			gameData.value = { ...responseData } as IGame;
			push.info("Game restarted");
		},
		"round restarted": () => {
			gameData.value = { ...responseData } as IGame;
			push.info("Round restarted");
		},
		"rematch offered": () => {
			push.info("Rematch offered by opponent");
		},
		"player disconnected": () => {
			gameData.value = { ...responseData } as IGame;
			push.warning("Player disconnected");
		},
		"soft error": () => {
			push.warning(responseData);
		},
		error: () => {
			throw showError({ statusCode: 404, statusMessage: responseData });
		},
	};

	const handler = handlers[type];
	if (handler) handler();
	else {
		console.warn(`Unhandled response type: ${type}`);
	}
};
