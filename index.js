const express = require("express")
const app = express();
require('dotenv').config()

const port = process.env.PORT || 4000;

// so that data coming from client side can be understood by express
app.use(express.urlencoded({extended: true})); // parses the received data

const path = require("path"); // for managing file paths 
app.set("view engine", "ejs"); // set view engine
app.set("/views", path.join(__dirname, "views")); // set path for views
app.use(express.static(path.join(__dirname, "public"))); // set path for public folder

const {v4: uuidv4} = require("uuid")
const methodOverride = require("method-override")
app.use(methodOverride("_method"))  // declare there is req override being used

app.get('/', (req, res)=>{
    res.send("Server working Well");
})

app.listen(port, ()=>{
    console.log("server started")
})


// [as we're not using database for this project, we'll store post data in an array]
let posts = [
    // {
    //     id: uuidv4(),
    //     username: "Arjun",
    //     content: "I'm a student",
    //     createdAt: new Date().toISOString()
    // },
    // {
    //     id: uuidv4(),
    //     username: "Ben",
    //     content: "I'm a working professional",
    //     createdAt: new Date().toISOString()
    // }
]

// implementing APIs

// accepts get request in this path "/posts"
// use: to get data for all the posts  [index route]
app.get("/posts", (req, res)=>{  // basically "/posts" path par janese index.ejs file render hoga
    res.render("index.ejs", {posts});  // renders the index.ejs file which shows all posts & we're also sending the posts obj to index.ejs file
})


/* (create route), when we send post request, it adds a new post
it'll be done using two routes:
i.  "/posts/new" route serves a new form, where user types in username and content and sends it to the backend
ii. then a post request will be accepted which will add the received data to the array(database)
*/

// jaise hi "/posts/new" path pe jayega toh form.ejs file render hoga
app.get("/posts/new", (req, res)=>{
    res.render("form.ejs");
})

// after submit button clicked, post req will be sent to "/posts" path
app.post("/posts", (req, res)=>{
    // add the new post data to the posts array
    let newPost = {id: uuidv4(), createdAt: new Date().toISOString(), ...req.body};
    posts.push(newPost)
    res.render("index.ejs", {posts});
})


// implement GET "/posts/:id"  [jis post ki id match karega on this route, uss post ka data render hoga]
app.get("/posts/:id", (req, res)=>{
    const {id} = req.params;
    let post = posts.find((p) => (p.id===id) )
    res.render("post.ejs", {post, id});
})


// --- functionality achieved: on clicking edit btn, go to edit page & update the posts array
// on clicking the edit button on each post, we go to edit page and after submitting it, patch req is sent & we again go to the posts page 
// when get request on path "/posts/:id/edit" is received, render the edit page
app.get("/posts/:id/edit", (req, res)=>{
    const {id} = req.params;
    let post = posts.find((p)=> (p.id === id));
    res.render("edit.ejs", {post});
})

// implement PATCH [update the content of post], we can also use PUT to do this
app.patch("/posts/:id", (req, res)=>{
    const {id} = req.params;
    let post = posts.find((p)=> (p.id === id)); // access the updating post
    let newContent = req.body.content; // name="content" is present in textarea in the form, so we get updated value in req.body.content
    post.content = newContent; // update our post
    // console.log(newContent)
    res.redirect("/posts") // redirect to posts page
})


// implement DELETE [delete a post]
app.delete("/posts/:id", (req, res)=>{
    const {id} = req.params;
    posts = posts.filter((post)=> (post.id !== id))
    res.redirect("/posts")
})