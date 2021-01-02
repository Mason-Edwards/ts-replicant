import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { PresenceStatusData } from "discord.js"; 



export default class Replicate extends Command{
    
    
    
    public constructor(){
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

    // setAvatar being ratelimited or something? 
    public async exec(message: Message) {
        let mentions = message.mentions.members;
        
        if(mentions.size > 0)
        {
            console.log("--------REPLICATING--------");
            
            let target = message.mentions.members.first();
            console.log("Target: " + target.user.username);
    
            // Set Nickname 
            if(target.nickname == null)
            {
                try
                {
                    console.log("Replicating Username: " + target.user.username);
                    await message.guild.me.setNickname(target.user.username);
                }  
                catch(e){
                    console.log("\n\n--------ERROR setNickname()--------");
                    console.log(e);
                    console.log("-----------------------------------")

                    await message.util.send("Cannot set nickname because of Discord API ratelimit")
                };
            }
            else
            {
                try
                {
                    console.log("Replcating nickname: " + target.nickname);
                    await message.guild.me.setNickname(target.nickname);
                }
                
                catch(e) {
                    console.log("\n\n--------ERROR setNickname()--------");
                    console.log(e);
                    console.log("-----------------------------------")
                    await message.util.send("Cannot set nickname because of Discord API ratelimit")
                };
            }
            
            // Set Avatar
            try
            {
                let targetAvaURL = target.user.displayAvatarURL({format: "png"});
                console.log("Replicating Avatar: " + targetAvaURL);
                await this.client.user.setAvatar(targetAvaURL);
            }
            
            
            catch(e) {
                console.log("\n\n--------ERROR: setAvatar()--------")
                console.log(e);
                console.log("----------------------------------")
                await message.util.send("Cannot set avatar because of Discord API ratelimit")
            }
            
            
            
            // Copy users presence 
            try
            {
                let targetAct = target.user.presence.status;
                if (targetAct == "offline") targetAct = "invisible";
          
                console.log("Replicating status: " + targetAct)
                await this.client.user.setStatus(targetAct);
            }
            
            catch(e) {
                console.log("\n\n--------ERROR: setStatus()--------");
                console.log(e);
                console.log("----------------------------------");
                await message.util.send("Cannot set nickname because of Discord API ratelimit")
            }

            console.log("-----------------------------\n")
 
        }
            else
        {
            return message.util.send("Please tag a user to replicate or wait 1 min before replicating again...");
        }
    }
}