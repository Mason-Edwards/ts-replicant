import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class PingCommand extends Command{
    public constructor(){
    super("ping", {
        aliases: ["ping"],
        category: "Public Commands",
        description: {
            content: "Check Ping to Discord API",
            usage: "ping"
            },
        cooldown: 1000*6
        });
    }

    public exec(message: Message){
        console.log("----------PINGING ---------\n\n")
        return message.util.send(`Ping: ${this.client.ws.ping}ms`);
    }

}