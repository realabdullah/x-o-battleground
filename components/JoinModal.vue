<script setup lang="ts">
	const route = useRoute();

	const emits = defineEmits<(event: "send", type: string, data: any) => void>()
	const isOpen = defineModel<boolean>()
	const state = reactive({ gameId: route.params.gameId as string, name: "" });

	const validate = (state: { gameId?: string; name?: string }) => {
		const errors = [];
		if (!state?.gameId) errors.push({ name: "gameId", message: "Game ID is required" });
		if (!state.name?.trim()) errors.push({ name: "name", message: "Name is required" });
		if ((state.name?.length || 0) <= 2) errors.push({ name: "name", message: "Name is too short" });
		return errors;
	};

	const onSubmit = async () => {
		await useRouter().replace({ query: { ...route.query, name: state.name } });
		emits("send", "join game", { name: state.name })
		isOpen.value = false;
	};
</script>

<template>
	<UModal v-model:open="isOpen">
		<template #content>
			<UForm :state="state" :validate="validate" class="mt-3 space-y-4 p-6" @submit="onSubmit">

				<UFormField label="Name" name="name">
					<UInput v-model="state.name" placeholder="Enter name" size="xl" class="mt-1 w-full" block />
				</UFormField>

				<UFormField label="Game ID" name="gameId">
					<UInput v-model="state.gameId" placeholder="Enter game ID" size="xl" class="mt-1 w-full" disabled block />
				</UFormField>

				<UButton label="Join Game" size="xl" block type="submit">
					<template #trailing>
						<UIcon name="i-lucide-arrow-right" />
					</template>
				</UButton>
			</UForm>
		</template>
	</UModal>
</template>