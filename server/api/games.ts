import { useDatabase } from "nitropack/runtime";
import type { Connector, Database } from "db0";

const createGame = async (db: Database<Connector<unknown>>, gameId: string) => {
	try {
		await db.sql`CREATE TABLE IF NOT EXISTS games (
		id TEXT PRIMARY KEY
	)`;
		await db.sql`INSERT INTO games (id) VALUES (${gameId})`;
		return { ok: true, message: "Game created", gameId };
	} catch (error) {
		return { ok: false, error: error };
	}
};

const saveGameId = async (db: Database<Connector<unknown>>, gameId: string) => {
	await db.sql`INSERT INTO games (id) VALUES (${gameId}) ON CONFLICT DO NOTHING`;
};

const joinGame = async (db: Database<Connector<unknown>>, gameId: string) => {
	try {
		const gameExists = await db.sql`SELECT * FROM games WHERE id = ${gameId}`;
		if (!gameExists.rows?.length) {
			throw new Error("Game ID not found");
		}
		return { ok: true, message: "Game joined", gameId };
	} catch (error) {
		return { ok: false, error: error };
	}
};

export default defineEventHandler(async event => {
	const db = useDatabase();
	const body = await readBody(event);
	const { action, gameId } = body;

	if (action === "create") {
		return await createGame(db, gameId);
	}
	if (action === "saveGame") {
		return await saveGameId(db, gameId);
	}
	if (action === "join") {
		return await joinGame(db, gameId);
	}

	return { error: "Invalid action" };
});
