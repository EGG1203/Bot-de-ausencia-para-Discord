// Servidor de suporte: https://discord.gg/sgZAMyM3st
// Codado por É GG#1203 (714143339368415294)
// Github: https://github.com/EGG1203

const client = new (require('discord.js')).Client()
const client_send = new (require('discord.js')).Client()
const chalk = require('chalk')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('config.json')
const db = low(adapter)

const config = {
    "user_permission": "", // seu id
    "token": "", // sua conta
    "token_to_send": "", // bot para enviar a mensagem
    "message": "", // mensagem para enviar
    "alertMessage": "ausencia on!"
}

var users = []

client.on('ready', () => {
    console.log(chalk.green('[+] '+ chalk.white(client.user.tag+' ligado!')))
})

client_send.on('ready', () => {
    console.log(chalk.green('[+] '+ chalk.white(client_send.user.tag+' ligado!')))
})

client.on('message', (message) => {
    const args = message.content.slice('/'.length).trim().split(/ +/g);
    let ausencia = db.get('ausencia').value()

    if(message.author.id === config.user_permission) {
        if(args[0] === "ausencia") {
            switch (args[1]) {
                case 'on':
                    db.set('ausencia', 'on').write()
                    message.delete()
                    message.reply('ligado!').then(msg=>{msg.delete(1000)})
                break;

                case 'off':
                    db.set('ausencia', 'off').write()
                    message.delete()
                    message.reply('desligado!').then(msg=>{msg.delete(1000)})
                break;
            
                default:
                    message.reply('`/ausencia <on-off>`')
                break;
            }
        }
    }

    if(message.channel.type === "dm") {
        if(message.author.id === config.user_permission) {
            if(ausencia === "on") {
                return client_send.users.get(config.user_permission).send(config.alertMessage).catch(e=>{})
            } else {return;}
        };
        if(ausencia === "on") {
            try {
                if(!users.includes(message.author.id)) {   
                    client_send.users.get(message.author.id).send(config.message).catch(e=>{})
                    users.push(message.author.id)
                }
            } catch (e) {}
        }
    }
})

client_send.login(config.token_to_send)
client.login(config.token)