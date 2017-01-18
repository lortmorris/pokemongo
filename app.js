/**
 * Pokemon.io, example using Node.js & MongoDB
 * Powered By César Casas
 */

const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongojs = require("mongojs");
const server = http.createServer(app);
const config = require("config");
const debug = require("debug")("pokemongo");
const db = mongojs(config.get("mongodb").host, config.get("mongodb").collections);
const PORT = process.env.PORT || 5000

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.post("/getpoints", (req, res)=> {

    debug("/getpoints called: ", JSON.stringify(req.body.query));

    let query = {
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(req.body.query.long), parseFloat(req.body.query.lat)]
                },
                $maxDistance: parseInt(req.body.query.distance)
            }
        }
    };

    if(req.body.query.type && req.body.query.type!='all') query.type = req.body.query.type;

    db.markers.find(query, {}, (err, docs)=> res.json(docs));

});

app.post("/savemarkers", (req, res)=> {

    debug("/savemarkers called: ", JSON.stringify(req.body));
    let response = {error: false, msg: "", result: null};

    req.body.points.forEach(p=> {
        p.location.coordinates[0] = parseFloat(p.location.coordinates[0]);
        p.location.coordinates[1] = parseFloat(p.location.coordinates[1]);
    });

    db.markers.insert(req.body.points, (err, docs)=> {
        if (err) {
            response.error = true;
            response.msg = err;
        } else {
            response.result = docs;
        }

        res.json(response);
    })
});

app.listen(PORT, (err)=>{
  err ? console.log('error') : console.log('listen on *:', PORT);
});
