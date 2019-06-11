var express = require("express")
var app = express()
var bodyParser = require('body-parser')
var request = require('request')
var MongoClient = require("mongodb").MongoClient
var ObjectId = require("mongodb").ObjectID
var url = "mongodb://127.0.0.1:27017"
app.use(bodyParser.json())

var list = [
    "<li>asdf</li>",
    "<li>asdfa</li>",
    "<li>123</li>",
]

app.get("/", (req, res) => {
    res.send(`<ul>${list.join("")}</ul>`)
    // var name = req.query.name, age = req.query.age;
    // res.send("Hello "+name+"\nAge "+age);
})

app.get("/reg", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbo = db.db("lesson")
        dbo.collection("users").findOne({login: req.query.login}, (err, check) => {
            if (err) throw err;
            if(!check){
                var obj = {
                    login: req.query.login,
                    password: req.query.password
                }
                dbo.collection("users").insertOne(obj, (err, result) => {
                    if (err) throw err;
                    if(result){
                        res.json({type: "ok"})
                    }else{
                        res.json({type: "server_err"})
                    }
                })
            }else{
                res.json({type: "just_used"})
            }
        })
    })
})

app.get("/change_password", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        var dbo = db.db("lesson")
        dbo.collection("users").updateOne({login: req.query.login, password: req.query.password}, {$set: {password: req.query.new_password}}, (err, result) => {
            if(err) throw ersr;
            if(result){
                res.json({type: "ok"})
            }else{
                res.json({type: "err"})
            }
        })
    })
})

app.get('/user', (req, res) => {
    var options = {method: 'POST', url: 'https://frilancebackend.herokuapp.com/all_users'};

    request(options, function (error, response, body) {
      if (error) throw error;
      var json = JSON.parse(body)
      var out = false;
      for(var i = 0; i < json.length; i++){
          if(json[i].user_id == req.query.user_id){
            out = json[i]
          }
      }
      res.send(out ? out  : "Not found")
    });
})

app.post('/qwe', (req, res) => {
    var a = req.body.a, b = req.body.b;
    var main = "<table border='1' style='text-align: center'>"
    for(var j = 1; j <= 10; j++){
        main += "<tr>"
        for(var i = a; i <= b; i++){
            main += "<td>"+(i*j)+"</td>"
        }
        main += "</tr>"
    }
    main += "</table>"
    res.send(main)
})

app.post('/new', (req, res) => {
    console.log(req.body)
    res.json({type: "ok"})
})

app.listen(1337, () => {
    console.log("Server listening on port 1337")
})