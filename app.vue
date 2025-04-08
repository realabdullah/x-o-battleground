<script setup lang="ts">
	import {
		Notivue,
		Notification,
		NotivueSwipe,
		pastelTheme,
	} from "notivue";
</script>

<template>
	<Notivue v-slot="item">
		<NotivueSwipe :item="item">
			<Notification :item="item" :theme="pastelTheme" />
		</NotivueSwipe>
	</Notivue>

	<UApp>
		<main
			class="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950">
			<NuxtRouteAnnouncer />
			<NuxtPage />
		</main>
	</UApp>
</template>
