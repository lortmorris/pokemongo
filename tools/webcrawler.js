const browser = require("browserwithphantom");
const fs = require("fs");

const mybrowser = new browser("craw", {ttl: 60});


const crawler = (db)=> {

    return ()=> {
        return new Promise((resolve, reject)=> {
            mybrowser.ready()
                .then(()=> {
                    console.log("opening wikipedia...");
                    return mybrowser.browseTo("https://en.wikipedia.org/wiki/List_of_Pok%C3%A9mon");
                })
                .then(()=> {
                    console.log("opened, go to evaluate");
                    return mybrowser.evaluate(function () {
                        var trs = document.querySelectorAll("table.wikitable tr");
                        var $return = [];
                        for (var x = 0; x < trs.length; x++) {
                            var tds = trs[x].querySelectorAll("td");
                            if (tds.length > 10) {
                                $return.push({code: tds[0].textContent, name: tds[1].textContent});
                            }

                        }//end for
                        return $return;
                    });//end evaluate
                })
                .then((pokemons)=> {
                    console.log("scanning directory and union...");
                    let images = fs.readdirSync(process.cwd() + "/public/images/pokemons");
                    pokemons = pokemons.filter((e, i)=> images[i] ? e.image = images[i] : false);

                    mybrowser.close();

                    return Promise.resolve(pokemons);
                })
                .then((pokemons)=> {
                    console.log("saving to DB...");

                    db.pokemons.insert(pokemons, (err, docs)=> {
                        if (err) return reject(err);
                        else return resolve(docs);
                    });
                })
                .catch((e)=> {
                    console.error("Error: ", e);
                })
        })

    }
}

module.exports = crawler;