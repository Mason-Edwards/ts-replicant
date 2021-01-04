import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { JsonDB } from "node-json-db";




export default class Replicate extends Command {
    public constructor() {
        super("replicate", {
            aliases: ["replicate",
                "rep"],
            category: "Public Commands",
            description: {
                content: "Replicate the tagged user",
                usage: "replicate"
            },
            //cooldown: 1000*180
        });
    }

    public async collectMessages(targetID, message) {
        const db = new JsonDB("msgLog", true, true, "/");
        // Deletes the DB, so the db in new each time the method is run
        db.delete("msgLog");


        let lastMessageID = "";
        let messagesLeft = 0;
        let count = 1;

        let messages = await message.channel.messages.fetch({ limit: 50 });
        messages = messages.filter(m => m.author.id == message.author.id);

        for (let [key, value] of messages) {
            db.push("/messageLog/messages[]", {
                [count]: value.content
            }, true);

            console.log(`${count} : ${key} : ${value}`);
            // Get the last message ID so can fetch the next 50 messages later
            lastMessageID = value.id;
            count++;
        }
        do {
            // Get 50 messages before the last message that was orignally fethched
            let messages = await message.channel.messages.fetch({ before: lastMessageID });
            messagesLeft = messages.size;
            messages = messages.filter(m => m.author.id == message.author.id);

            for (let [key, value] of messages) {

                db.push("/messageLog/messages[]", {
                    [count]: value.content
                }, true);

                console.log(`${count} : ${key} : ${value}`);
                lastMessageID = value.id;
                count++;
            }
            console.log(messages.size + " : " + messagesLeft);
        }

        // Onces all the messages have been fetched, calling it again on the same last message ID seems to return 1,
        // probably because fetch with before filter includes lastMessageID, so once there are no messages, it is just lastMessageID left hence
        // messagesLeft returning 1.
        // So this while loop keeps running until all the messages have been fetched
        // because if messagesLeft is greater than 1, there are more messages to get.
        while (messagesLeft > 1);
    }

    public async exec(message: Message) {
        let mentions = message.mentions.members;


        if (mentions.size > 0) {
            console.log("--------REPLICATING--------");

            let target = message.mentions.members.first();
            console.log("Target: " + target.user.username);

            // Set Nickname 
            if (target.nickname == null) {
                try {
                    console.log("Replicating Username: " + target.user.username);
                    await message.guild.me.setNickname(target.user.username);
                }
                catch (e) {
                    console.log("\n\n--------ERROR setNickname()--------");
                    console.log(e);
                    console.log("-----------------------------------")

                    await message.util.send("Cannot set nickname because of Discord API ratelimit")
                };
            }
            else {
                try {
                    console.log("Replcating nickname: " + target.nickname);
                    await message.guild.me.setNickname(target.nickname);
                }

                catch (e) {
                    console.log("\n\n--------ERROR setNickname()--------");
                    console.log(e);
                    console.log("-----------------------------------")
                    await message.util.send("Cannot set nickname because of Discord API ratelimit")
                };
            }

            // Set Avatar
            try {
                let targetAvaURL = target.user.displayAvatarURL({ format: "png" });
                console.log("Replicating Avatar: " + targetAvaURL);
                await this.client.user.setAvatar(targetAvaURL);
            }

            catch (e) {
                console.log("\n\n--------ERROR: setAvatar()--------")
                console.log(e);
                console.log("----------------------------------")
                await message.util.send("Cannot set avatar because of Discord API ratelimit")
            }


            // Copy users presence 
            try {
                let targetAct = target.user.presence.status;
                if (targetAct == "offline") targetAct = "invisible";

                console.log("Replicating status: " + targetAct)
                await this.client.user.setStatus(targetAct);
            }

            catch (e) {
                console.log("\n\n--------ERROR: setStatus()--------");
                console.log(e);
                console.log("----------------------------------");
                await message.util.send("Cannot set status because of Discord API ratelimit")
            }

            // Copy user game activity? 
            try {
                let targetGame = target.user.presence.activities;
                console.log("Replicating Activity: " + targetGame);
                // Still need to implement this
            }

            catch (e) {
                console.log("\n\n--------ERROR: setActivity()--------");
                console.log(e);
                console.log("----------------------------------");
                await message.util.send("Cannot set activity because of Discord API ratelimit")
            }

            try {
                // Get users messages
                console.log(`Collecting ${target.user.username}'s messages`)
                await this.collectMessages(target.id, message);
            }
            catch (e) {
                console.log("\n\n--------ERROR: collectMessages()--------");
                console.log(e);
                console.log("----------------------------------");
            }


            await console.log("----------------------")
        }

        else {
            return message.util.send("Please tag a user to replicate or wait 1 min before replicating again...");
        }
    }
}