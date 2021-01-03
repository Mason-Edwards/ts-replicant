import { Command } from "discord-akairo";
import { MessageCollector } from "discord.js";
import { Message } from "discord.js";
import { JsonDB } from "node-json-db";

export default class CollectUserMessages extends Command {
    count: number = 1;

    public constructor() {
        super("cm", {
            aliases: ["cm"],
            category: "Public Commands",
            description: {
                content: "Collect user messages",
                usage: "cm"
            },
            //cooldown: 1000*6
        });
    }

    // This will run into rate limit problems, but it gets all messages
    // This runs forever atm
    public async exec(message: Message) {
        console.log("----------Collecting messages ---------")

        const db = new JsonDB("msgLog", true, true, "/");
        let lastMessageID = "";
        let messagesLeft = 0;

        // Get 50 messages
        let messages = await message.channel.messages.fetch({ limit: 50 });
        // Filter out all messages that arent the authors
        // TODO INSTEAD OF AUTHOR IT WILL BE WHO IS MENTIONED IN THE REPLICATE
        messages = messages.filter(m => m.author.id == message.author.id);
        // Loop though all the messages, log them in the DB and console log them.
        for (let [key, value] of messages) {
            db.push("/messageLog/messages[]", {
                [this.count]: value.content
            }, true);

            console.log(`${this.count} : ${key} : ${value}`);
            // Get the last message ID so can fetch the next 50 messages later
            lastMessageID = value.id;
            this.count++;
        }

        do {
            // Get 50 messages before the last message that was orignally fethched
            let messages = await message.channel.messages.fetch({ before: lastMessageID });
            messagesLeft = messages.size;
            messages = messages.filter(m => m.author.id == message.author.id);

            for (let [key, value] of messages) {

                db.push("/messageLog/messages[]", {
                    [this.count]: value.content
                }, true);

                console.log(`${this.count} : ${key} : ${value}`);
                lastMessageID = value.id;
                this.count++;
            }
            console.log(messages.size + " : " + messagesLeft);
        }

        // Onces all the messages have been fetched, calling it again on the same last message ID seems to return 1,
        // probably because fetch with before filter includes lastMessageID, so once there are no messages, it is just lastMessageID left hence
        // messagesLeft returning 1.
        // So this while loop keeps running until all the messages have been fetched
        // because if messagesLeft is greater than 1, there are more messages to get.
        while (messagesLeft > 1);

        console.log("Last Message ID - " + lastMessageID);
        console.log("-------------------------------------")
    }

}