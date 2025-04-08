<script setup lang="ts">
	import type { TabsItem } from "@nuxt/ui";

	const active = ref("create");
	const items = ref<TabsItem[]>([
		{ label: "Create Game", value: "create" },
		{ label: "Join Game", value: "join" },
	]);
	const state = reactive({ gameId: undefined, name: "" });

	const onSubmit = async () => {
		localStorage.removeItem("playerId");
		if (active.value === "create") await createNewGame();
		else {
			await navigateTo({ name: "game-id", params: { gameId: state.gameId }, query: { action: "join", name: state.name } });
		}
	};

	const createNewGame = async () => {
		const mainPart = Math.random().toString(36).substring(2, 8).toUpperCase();
		const suffix = Math.random().toString(36).substring(2, 5).toLowerCase();
		const gameId = `${mainPart}-${suffix}`;
		await navigateTo({ name: "game-id", params: { gameId: gameId }, query: { action: "create", name: state.name } });
	};

	const validate = (state: { gameId?: string; name?: string }) => {
		const errors = [];
		if (active.value === "join" && !state?.gameId) errors.push({ name: "gameId", message: "Game ID is required" });
		if (!state.name?.trim()) errors.push({ name: "name", message: "Name is required" });
		if ((state.name?.length || 0) <= 2) errors.push({ name: "name", message: "Name is too short" });
		return errors;
	};
</script>

<template>
	<div class="w-full max-w-md">
		<h1 class="text-3xl font-bold text-center mb-2">x-o battleground</h1>

		<p class="text-gray-500 text-center mb-8">Real-time multiplayer game</p>

		<UCard>
			<div class="flex flex-col p-6">
				<h3 class="font-semibold tracking-tight flex items-center justify-center text-2xl">
					<UIcon name="i-lucide-gamepad-2" class="mr-2 h-6 w-6" />
					Play x-o battleground
				</h3>

				<p class="mt-3 mb-6 text-sm text-muted-foreground text-center">Create a new game or join an existing one</p>

				<UTabs v-model="active" :items="items" class="w-full">
					<template #content="{ item }">
						<UForm :state="state" :validate="validate" class="mt-3 space-y-4" @submit="onSubmit">
							<p v-if="item.value === 'create'" class="text-sm text-gray-500">Create a new game and share the game ID with a friend</p>

							<UFormField label="Name" name="name">
								<UInput v-model="state.name" placeholder="Enter name" size="xl" class="mt-1 w-full" block />
							</UFormField>

							<UFormField v-if="item.value === 'join'" label="Game ID" name="gameId">
								<UInput v-model="state.gameId" placeholder="Enter game ID" size="xl" class="mt-1 w-full" block />
							</UFormField>

							<UButton :label="item.value === 'create' ? 'Create New Game' : 'Join Game'" size="xl" block type="submit">
								<template #trailing>
									<UIcon name="i-lucide-arrow-right" />
								</template>
							</UButton>
						</UForm>
					</template>
				</UTabs>
			</div>

			<template #footer>
				<div class="items-center flex justify-center">
					<p class="text-xs text-gray-500">Play against friends in real-time</p>
				</div>
			</template>
		</UCard>
	</div>
</template>
