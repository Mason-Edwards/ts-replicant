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
            cooldown: 1000*180
        });
    }

    // setAvatar being ratelimited or something? 
    public exec(message: Message) {
        let mentions = message.mentions.members;
        
        if(mentions.size > 0)
        {
            console.log("--------REPLICATING--------");
            
            let target = message.mentions.members.first();
            console.log("Target: " + target.user.username);
    
            // Set Nickname 
            if(target.nickname == null)
            {
                console.log("Replicating Username: " + target.user.username);
                const p = message.guild.me.setNickname(target.user.username);
                p.catch((e) => {
                    console.log("--------ERROR setNickname()--------");
                    console.log(e);
                    console.log("-----------------------------------")
                });
            }
            else
            {
                console.log("Replcating nickname: " + target.nickname);
                const pGuildMember = message.guild.me.setNickname(target.nickname);
                pGuildMember.catch((e) => {
                    console.log("--------ERROR setNickname()--------");
                    console.log(e);
                    console.log("-----------------------------------")
                });
            }
            
            // Set Avatar
            let targetAvaURL = target.user.displayAvatarURL({format: "png"});
            console.log("Replicating Avatar: " + targetAvaURL);
            let pClientUser = this.client.user.setAvatar(targetAvaURL);
            
            pClientUser.catch((e)=> {
                console.log("--------ERROR: setAvatar()--------")
                console.log(e);
                console.log("----------------------------------")
                console.log(e + "\n");
            });
            
            // Copy users presence 
            let targetAct = target.user.presence.status;
            if (targetAct == "offline") targetAct = "invisible";
      
            console.log("Replicating status: " + targetAct)
            let pPresence = this.client.user.setStatus(targetAct);
            pPresence.catch((e) => {
                console.log("--------ERROR: setStatus()--------");
                console.log(e);
                console.log("----------------------------------");
            });

            console.log("-----------------------------\n")
 
        }
            else
        {
            return message.util.send("Please tag a user to replicate or wait 1 min before replicating again...");
        }
    }
}