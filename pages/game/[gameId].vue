<script setup lang="ts">
	definePageMeta({
		name: "game-id",
		// middleware: [() => {
		// 	const gameId = useRoute().params.gameId;
		// 	if (!gameId) return navigateTo("/");
		// }],
	});

	const {
		isJoinModalOpen,
		playersCount,
		gameID,
		gameData,
		status,
		isCopied,
		copyToClipboard,
		makeMove,
		joinGame,
	} = useGame();
</script>

<template>
	<div class="w-full max-w-md">
		<UCard>
			<template #header>
				<div class="flex items-center justify-between gap-3">
					<div class="flex flex-col gap-1">
						<h2 class="font-bold text-2xl">x-o battleground</h2>
						<p class="flex items-center gap-2 text-sm text-gray-600">
							Game ID: {{ gameID }}

							<UButton :icon="isCopied ? 'i-lucide-copy-check' : 'i-lucide-copy'" size="xs"
									 variant="ghost" @click="copyToClipboard" />
						</p>
					</div>

					<div class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
						 :class="[playersCount < 2 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700']">
						<UIcon :name="playersCount < 2 ? 'i-lucide-loader-circle' : 'i-lucide-circle-check'"
							   class="h-3 w-3" :class="[{ 'animate-spin': playersCount < 2 }]" />
						<span class="capitalize">{{ playersCount < 2 ? "connecting" : status }}</span>
					</div>
				</div>
			</template>

			<GameBox v-if="gameData" :count="playersCount" :game="gameData" @move="makeMove" />

			<template #footer>
				<UButton to="/" label="New Game" icon="i-lucide-house" color="neutral" variant="outline" />
			</template>
		</UCard>

		<JoinModal v-model="isJoinModalOpen" @send="joinGame" />
	</div>
</template>
