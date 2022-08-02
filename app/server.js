let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

let mongoUrl = `mongodb://${process.env.USER_NAME}:${process.env.USER_PWD}@${process.env.DB_URL}`
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
let databaseName = "lms";

app.post('/courses', function (req, res) {
    let courseObj = req.body;

    MongoClient.connect(mongoUrl, mongoClientOptions, function (err, client) {
        if (err) throw err;

        let db = client.db(databaseName);

        db.collection("courses").insertOne(courseObj, function (er, res) {
            if (er) throw er;
            client.close();
        });

    });
    res.send(courseObj);
});

app.get('/courses', function (req, res) {
    let response = {};
    // Connect to the db
    MongoClient.connect(mongoUrl, mongoClientOptions, function (err, client) {
        if (err) throw err;

        let db = client.db(databaseName);

        db.collection("courses").find().toArray().then(result => {
            response = result;
            client.close();

            // Send response
            res.send(response ? response : []);
        }).catch(er=>{
            res.setHeader('Content-type', 'application/json')
            res.status(400).send(er)
            console.log(er);
        });
    });
});

app.listen(3000, function () {
    console.log("app listening on port 3000!");
});
