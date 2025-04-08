import type { GameResponse, IGame } from "~/types";
import { handleGameResponse } from "~/utils";
import { push, type NotificationClearMethods, type PushPromiseReturn } from "notivue";

export const useGame = () => {
	const { send, close, socket } = useConnect();
	const route = useRoute();
	const gameID = route.params.gameId as string;

	const notification = ref<NotificationClearMethods & PushPromiseReturn>();
	const isJoinModalOpen = ref(false);
	const gameData = ref<IGame>();
	const symbol = ref<"X" | "O" | null>(null);
	const isCopied = ref(false);
	const isJoiningGame = ref(false);

	const status = computed(() => gameData.value?.status || "waiting");
	const playersCount = computed(() => {
		return [gameData.value?.players?.X?.id, gameData.value?.players?.O?.id].filter(p => p !== null).length;
	});

	socket.onAny((type: string, response: GameResponse) => {
		handleGameResponse(response, { gameData, symbol });
	});

	const copyToClipboard = async () => {
		try {
			const url = `${window.location.origin}/game/${gameID}?action=join`;
			await navigator.clipboard.writeText(url);
			isCopied.value = true;
			push.success({
				title: "Link copied!",
				message: "Share this link with a friend to play together.",
			});
			setTimeout(() => (isCopied.value = false), 3000);
		} catch (error) {
			push.error(error as string);
		}
	};

	const makeMove = (index: number) => {
		send("make move", { index });
	};

	const joinGame = (type: string, data: any) => send(type, data);

	watch(() => status.value, (val) => {
		if (val === "waiting") {
			notification.value = push.promise("Waiting for other player...");
		} else {
			notification.value?.resolve("Both players now connected!");
		}
	}, { immediate: true });

	onMounted(async () => {
		if (route.query?.action === "create") {
			send("create game", { name: route.query.name });
			await useRouter().replace({ query: { ...route.query, action: undefined } });
		} else if (route.query?.action === "join") {
			if (!route.query.name) {
				isJoinModalOpen.value = true;
				return;
			}
			send("join game", { name: route.query.name });
			await useRouter().replace({ query: { ...route.query, action: undefined } });
		}
	});

	onBeforeUnmount(() => {
		close();
		push.destroyAll();
	});

	return {
		playersCount,
		gameID,
		symbol,
		isCopied,
		isJoiningGame,
		status,
		gameData,
		isJoinModalOpen,
		copyToClipboard,
		makeMove,
		send,
		joinGame
	};
};
