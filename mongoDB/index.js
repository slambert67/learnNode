/*
MongoDB is a schema-less NoSQL document database. 
It means you can store JSON documents in it, and the structure of these documents can vary as it is not enforced like SQL databases. 
This is one of the advantages of using NoSQL as it speeds up application development and reduces the complexity of deployments.


Mongoose is an ODM library - Object Document Mapping
Wraps standard mongoDB API - easier to use
uses schemas and models
schemas
- defines data structure
- auto generated id property
model
- created based on schema
- model used to communicate with a specific database collection
- e.g. user model based on user schema
- model with have static and instance methods (get, sve, delete etc)


default port : 27017
- show databases
- use newDB - creates if not present
- show collections
- db.items.insert({name:"name"});
- db.items.find();
- db.<collection name>.drop();
- db.dropDatabase()

*/

const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blogs');

// create the express application
const app = express();

// connect to mongodb
const dbString = 'mongodb://localhost:27017/learningdb';
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// asynchronous call so returns a promise
mongoose.connect(dbString, dbOptions)
    .then( (result) => {console.log('connected to learningdb'); app.listen(3000);} )
    .catch( (err) => console.log('error: ' || err) );

// mongoose and mongodb sandbox routes
app.get('/add-blog', (req, res) => {
    const newBlog = new Blog({
        title: 'new blog2',
        snippet: 'about my new blog2',
        body: 'more about my new blog2'
    });

    // asynchronous task
    // instance method - save
    newBlog.save()
        .then( (result) => {
            res.send(result);
        })
        .catch( (err) => 
            console.log(err)
        );
});

// class/model method - find
app.get('/all-blogs', (req,res) => {
    Blog.find()
    .then( (result) => {
        res.send(result);
    })
    .catch( (err) => 
        console.log(err)
    );
    
});

app.get('/single-blog', (req,res) => {
    Blog.findById('600d84d740597d04cc6c371b')
    .then( (result) => {
        res.send(result);
    })
    .catch( (err) => 
        console.log(err)
    );
    
});

