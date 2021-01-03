import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class SetAvatar extends Command {
    public constructor() {
        super("setAvatar", {
            aliases: ["sa"],
            category: "Public Commands",
            description: {
                content: "sets the avatar to the URL given",
                usage: "sa"
            },
        });
    }

    public exec(message: Message) {
        let url = message.content;
        url = url.slice(4);
        let p = this.client.user.setAvatar(url);
        p.catch(() => {
            console.log("Setting avatar failed");
        })
    }
}