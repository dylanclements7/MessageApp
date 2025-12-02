const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

const {MongoClient, ServerApiVersion} = require('mongodb');
const uri = "mongodb+srv://dylanclements77_db_user:hWgDtfiLQ6Izf961@message.h41xerv.mongodb.net/?appName=Message";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// hWgDtfiLQ6Izf961
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(console.dir);

mongoose.connect(uri, {})
    .then(function (db) {
        console.log("db connected");
    });

const messageSchema = {
    username: {
        type: String,
        required: [true, "Title cannot be empty"]
    },
    message: String,
}

const Message = mongoose.model('Message', messageSchema);

app.listen(8080, function () {
    console.log("server started at 8080")
});

app.get("/", function (req, res) {
    res.sendFile("/public/index.html");
});


app.post("/save-message", function (req, res) {
    console.log(req.body);
    const msg = {
        "username": req.body.username,
        "message": req.body.message
    }
    const nm = new Message(msg);
    nm.save()
        .then(function (new_msg) {
            console.log(new_msg._id);
            res.redirect("/");
        }).catch(function (err) {
        console.log(err);
    });
});

app.get("/get-all-messages", function (req, res) {
    Message.find().then(messages => {
        res.send({
            "message": "success",
            "data": messages
        })
    }).catch(err => {
        res.send({
            "message": err.message,
            "data": []
        })
    });
});