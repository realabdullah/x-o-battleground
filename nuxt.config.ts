// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxt/ui", "motion-v/nuxt", "@vueuse/nuxt", "notivue/nuxt"],
	ssr: false,
	devtools: { enabled: true },
	css: ["~/assets/css/main.css", "notivue/notification.css", "notivue/animations.css"],
	compatibilityDate: "2024-11-01",
	nitro: {
		experimental: { websocket: true, database: true },
		database: {
			default: {
				connector: "postgresql",
				options: {
					url: "postgresql://x_o_battleground_user:7r3V3bxOlEUkjZwyFQ9UNuMOmSQx38NS@dpg-cvngg9gdl3ps73fped9g-a.oregon-postgres.render.com/x_o_battleground?ssl=true",
				},
			},
		},
	},
	vite: { server: { hmr: { protocol: "http", host: "localhost", clientPort: 3000, port: 3000 } } },
	notivue: {
		position: 'top-center',
		limit: 2,
		enqueue: true,
		avoidDuplicates: true,
		notifications: {
			global: {
				duration: 5000
			}
		}
	}
});
