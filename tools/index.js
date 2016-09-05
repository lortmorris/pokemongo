const config = require("config");
const db = require("mongojs")(config.get("mongodb").host, config.get("mongodb").collections);
const program = require('commander');


const webcrawler = require("./webcrawler")(db);
const random = require("./pokerandom")(db);


program
    .version('0.0.1')
    .option('-c, --crawler', 'Crawler: Read data from public/images/pokemons/*.png and craw Wikipedia')
    .option('-r, --random', 'Put random pokemons inside Buenos Aires City')
    .parse(process.argv);


new Promise((resolve, reject)=> {
    if (program.crawler) {
        return webcrawler()
            .then((docs)=> {
                resolve(docs);
            })
    }


    if (program.random) {
        return random()
            .then((docs)=> {
                resolve(docs);
            })
    }


})
    .then((data)=> {
        console.log("Terminado : ", data.length);
    })
    .catch((err)=> {
        console.error("ERORR!: ", err);
    })

