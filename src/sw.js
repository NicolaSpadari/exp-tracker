import { precacheAndRoute } from "workbox_precaching";

let self;

self.addEventListener("message", (e) => {
    if (e.data && e.data.type === "SKIP_AWAITING") {
        self.skipWaiting();
    }
});

precacheAndRoute(self.__WB_MANIFEST);
