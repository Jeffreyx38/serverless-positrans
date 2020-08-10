const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
var mysql = require('mysql');

const IS_OFFLINE = process.env.IS_OFFLINE;

app.use(bodyParser.json({ strict: false }));
app.use(express.static(__dirname + "/"));


var currentUser;
var connection = mysql.createConnection({
    connectionLimit: 100,
    host: '35.192.103.127',
    port: 3306,
    user: 'jz553',
    password: 'student031221',
    database: 'positrans'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected to db successful." + "\r\n")

});


app.get('/test', function (req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + "/index.html");
})

app.post('/login', function (req, res, next) {

    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    var userExist = `SELECT user_ID,NAME FROM user WHERE NAME='${username}'`;
    console.log(userExist);
    connection.query(userExist, function (error, result) {

        if (error) {
            console.log(error);
        }
        if (result.length > 0) {
            console.log(`${username} already exists.` + "\r\n");
            let data = result[0];
            let id = data.user_ID;
            res.redirect("/dev/homepage" + "?id=" + `${id}`);
        } else {
            // var recordInserted = `INSERT INTO user (NAME, PASSWORD) VALUES ('${username}', '${password}')`;
            // connection.query(recordInserted, function (err, result) {
            //     if (err) throw err;
            //     let id = result.insertId;
            //     console.log(`${username} record inserted.`);
            //     res.redirect("/homepage" + "?id=" + `${id}`);
            //  });
            //res.send("Please create account!");
            console.log("Please create account!");

        }
    });
})

app.post('/observation', function (req, res, next) {
    console.log("Current user " + currentUser);

    let observation = req.body.observation;

    console.log(observation);

    var recordInserted = `INSERT INTO observation (user_ID, OBSERVATION) VALUES (${currentUser}, '${observation}')`;
    connection.query(recordInserted, function (err, result) {
        if (err) throw err;
        console.log(`Observation inserted to user ID: ${currentUser}.`);
        res.redirect("/dev/homepage" + "?id=" + `${currentUser}`);
    });

    // let id = req.url;
    // console.log(id);
});

app.get('/getobservation', function (req, res) {


    var observatioQuery = `SELECT OBSERVATION, DATE 
        FROM user, observation 
        WHERE (user.user_ID = observation.user_ID) 
        AND (observation.user_ID = ${currentUser});`;
    connection.query(observatioQuery, function (err, result) {
        if (err) throw err;
        let record = JSON.parse(JSON.stringify(result));
        res.send(record);
    });


});

app.post('/register', function (req, res, next) {

    let username = req.body.username;
    let password = req.body.password;

    var userExist = `SELECT user_ID,NAME FROM user WHERE NAME='${username}'`;
    connection.query(userExist, function (error, result) {

        if (error) {
            console.log(error);
        }
        if (result.length > 0) {
            console.log(`${username} already exists.` + "\r\n");
            let data = result[0];
            let id = data.user_ID;
            res.send(`${username} already exists.` + "\r\n")
            //return user exist 
            //res.redirect("/homepage" + "?id=" + `${id}`);
        } else {
            var recordInserted = `INSERT INTO user (NAME, PASSWORD) VALUES ('${username}', SHA1('${password}'))`;
            connection.query(recordInserted, function (err, result) {
                if (err) throw err;
                let id = result.insertId;
                console.log(`${username} record inserted.`);
                res.send(`${username} record inserted.`)
                //res.redirect("/homepage" + "?id=" + `${id}`);

            });
        }
    });
})

app.get('/homepage', function (req, res) {
    //console.log(__dirname);
    currentUser = req.query.id;
    res.sendFile(__dirname + "/homepage.html");
});

app.get('/mylist', function (req, res) {
    //console.log(__dirname);
    res.sendFile(__dirname + "/mylist.html");
});

app.get('/logout', function (req, res) {
    //console.log(__dirname);
    res.sendFile(__dirname + "/index.html");
});

app.get('/register', function (req, res) {
    //console.log(__dirname);
    res.sendFile(__dirname + "/register.html");
});

app.get('/goback', function (req, res) {
    //console.log(__dirname);
    res.redirect("/dev/homepage" + "?id=" + `${currentUser}`);
});


// if (IS_OFFLINE === 'true') {
//     dynamoDb = new AWS.DynamoDB.DocumentClient({
//         region: 'localhost',
//         endpoint: 'http://localhost:8000'
//     })
//     console.log(dynamoDb);
// } else {
//     dynamoDb = new AWS.DynamoDB.DocumentClient();
// };



// Get User endpoint
// app.get('/users/:userId', function (req, res) {
//     const params = {
//         TableName: USERS_TABLE,
//         Key: {
//             userId: req.params.userId,
//         },
//     }

//     dynamoDb.get(params, (error, result) => {
//         if (error) {
//             console.log(error);
//             res.status(400).json({ error: 'Could not get user' });
//         }
//         if (result.Item) {
//             const { userId, name } = result.Item;
//             res.json({ userId, name });
//         } else {
//             res.status(404).json({ error: "User not found" });
//         }
//     });
// })

// Create User endpoint
// app.post('/users', function (req, res) {
//     const { userId, name } = req.body;
//     if (typeof userId !== 'string') {
//         res.status(400).json({ error: '"userId" must be a string' });
//     } else if (typeof name !== 'string') {
//         res.status(400).json({ error: '"name" must be a string' });
//     }

//     const params = {
//         TableName: USERS_TABLE,
//         Item: {
//             userId: userId,
//             name: name,
//         },
//     };

//     dynamoDb.put(params, (error) => {
//         if (error) {
//             console.log(error);
//             res.status(400).json({ error: 'Could not create user' });
//         }
//         res.json({ userId, name });
//     });
// })


module.exports.handler = serverless(app);