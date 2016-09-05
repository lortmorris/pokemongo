const random = db=> {
    let points = [];

    var Pokemons = [];
    let getMarkerRandom = ()=> {

        let lat = parseFloat("-34." + (547920 + Math.floor(Math.random() * 155241) ));
        let long = parseFloat("-58." + (347889 + Math.floor(Math.random() * 165138) ));
        let pokemon = Pokemons[Math.floor(Math.random() * Pokemons.length)];

        let obj = {
            location: {type: "Point", coordinates: [long, lat]},
            name: pokemon.name,
            photos: [pokemon.image],
            type: "pokemon"
        };

        console.log("Random Pokemon: ", obj);
        return obj;
    };


    let getPokemons = ()=> {
        console.log("getting pokemons");
        return new Promise((resolve, reject)=> {
            db.pokemons.find({}, {}, (err, docs)=> {

                if (err) reject(err);
                else return resolve(docs);
            });
        })
    };//end getPokemons


    return ()=> {

        console.log('Random called');
        return new Promise((resolve, reject)=> {
            getPokemons()
                .then((pokemons)=> {
                    Pokemons = pokemons;

                    for (var i = 0; i < 10000; i++) {
                        db.markers.insert(getMarkerRandom());
                    }//end for

                    resolve([]);
                })
                .catch(reject);
        })//end promise

    }//end return


}


module.exports = random;



