import fetch from "node-fetch"
import { Client, DiscordAPIError, MessageEmbed} from "discord.js"
import pkg from 'quick.db'
const {get , push, set, add} = pkg;
const client = new Client()

client.on("ready", () => {
if(!Array.isArray(get("links"))) {
    set("links", [])
}
})


setTimeout(() => {
var linkler = get("links")
if(!linkler) console.log("Sistemde Link Bulunamadı")
var links = linkler.map(s => s.url)
links.forEach(s => {
try {
  fetch(s)
} catch(e) {
    console.error(e)
}
})
console.log(`Linklere ping gönderildi`)
},8000)

client.on("message", message => {
let args = message.content.split(" ")
if(args[0] === "!ekle"){
    var link = args[1]
    if(!link) return message.reply("Link belirt")
    fetch(link).then(() => {
        var d = get("links").map(s => s.url).includes(link) 
        if(d) return message.reply("Zaten belirtmiş olduğun url sistemde kayıtlı")
        if(!d) {
        if(!Array.isArray(get(`linkleri_${message.author.id}`))) set(`linkleri_${message.author.id}`,[])
        push(`linkleri_${message.author.id}`,link)
        push("links",{url: link , owner: message.author.id})
        add("link-sayisi",1)
        add(`linksay_${message.author.id}`,1)
        return message.reply("Linkiniz sisteme başarı ile eklendi")
       }
})
}
if(args[0] === "!linklerim") {
let k = get(`linkleri_${message.author.id}`)
if(!get("links").map(d => d.owner).includes(message.author.id)) return message.reply("Sistemde hiç linkin yok")
message.channel.send("Ne olur ne olmaz diye linklerini dm kutuna gönderdik")
message.author.send(`Linklerin: `+k.join("\n")+` `)
}
if(args[0] === "!göster") {
var s = get(`linksay_${message.author.id}`)
var d = get(`link-sayisi`)
const embed = new MessageEmbed()
.setTitle("Link sayıları")
.setDescription(`

Sistemdeki toplam link sayısı : ${d || "Sistemde link bulunmamakta"}

Senin sistemdeki link sayın : ${s || "Linkin bulunmamakta"}
`)  
.setTimestamp()
message.channel.send(embed)
}
})

client.login("TOKENİ BURAYA YAPIŞTIRCAN")