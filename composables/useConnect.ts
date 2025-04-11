import { io, Socket } from "socket.io-client";

export const useConnect = () => {
	const route = useRoute()
	let playerId = localStorage.getItem('playerId');
	const gameId = route.params.gameId;

	if (!playerId) {
		playerId = crypto.randomUUID();
		localStorage.setItem('playerId', playerId);
	}

	const socket: Socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000/", {
		auth: { playerId, gameId },
		autoConnect: true,
		transports: ["websocket"],
	});

	const send = (type: string, data: any) => socket.emit(type, data);
	const close = () => socket.disconnect();

	return { send, close, socket };
};
