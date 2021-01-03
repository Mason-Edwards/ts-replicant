import { Listener } from "discord-akairo";

export default class RateLimitListener extends Listener {
    public constructor() {
        super("rateLimit", {
            emitter: "client",
            event: "rateLimit",
            category: "client"
        });
    }

    public exec(rateLimit: object): void {
        console.log(rateLimit);
    }
}