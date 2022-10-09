const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
// Replace the uri string with your connection string.
const uri =
"mongodb+srv://root:rootuser@cluster0.tfekrwi.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');

const app= express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,'./')));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./login.html'));
});

async function insert(obj){
    console.log("JAI SHREE RAM");
    try{
        const database = client.db('account_details');
        const collection = database.collection('mycollection');
        collection.insertOne(obj);
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
async function search(obj){
    try{
        const database = client.db('account_details');
        const collection = database.collection('mycollection');
        const user = await collection.findOne(obj);
        // console.log(user);
        return user;
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

app.post('/register',async(req,res) => {
    try{
        let query = {username:req.body.username};
        const obj = search(query);
        console.log(obj);
        if (obj==null) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            insert(newUser);
            console.log('User list', users);
            
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});

app.post('/login',async(req,res) => {
    try{
        let username = req.body.username;
        let password=req.body.password;
        let query = {'username':username};
        const obj = search(query);
        const passwordMatch = await bcrypt.compare(password, obj.password);
        if (passwordMatch) {
            let usrname = foundUser.username;
            console.log("matched password");
            res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
        } else {
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});



server.listen(3000, function(){
    console.log("server is listening on port: 3000");
});