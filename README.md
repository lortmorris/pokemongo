# PokemonGo
Powered by [César Casas](https://ar.linkedin.com/in/cesarcasas).

This project is was built for educational reasons.

# Install
```bash
$ git clone https://github.com/lortmorris/pokemongo.git
$ cd pokemongo
$ npm install
$ node app.js
```

Inside mongodb console run:

```js
$ mongo
> use pokemon
> db.markers.createIndex({location: '2dsphere'});
 ```
## using
open you web browser and go to
http://localhost:5000/


# Tools
## getting pokemons info
```bash
$ node tools/ --crawler
```

## random pokemons map
generate random pokemon position
```bash
$ node tools/ --random
```
