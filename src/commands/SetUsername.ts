import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { PresenceStatusData } from "discord.js";


export default class SetUsername extends Command {
    public constructor() {
        super("setUsername", {
            aliases: ["su"],
            category: "Public Commands",
            description: {
                content: " Sets the username of the bot to the given text",
                usage: "su"
            },
        });
    }

    public exec(message: Message) {
        let p = this.client.user.setUsername(message.content.slice(4));
        p.catch(() => {
            console.log("Error setting bots username\n");
        });
    }

}
