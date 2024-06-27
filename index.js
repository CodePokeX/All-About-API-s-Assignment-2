const express = require('express');
const myApp= express();
myApp.use(express.json());
const {v4:uuidv4}= require('uuid');

myApp.listen(3000, ()=>{
    console.log("Running on port 3000");
});

myApp.get("/", (req,res)=>{
    res.send("Welcome to my API page. Go to /home for more details");
});

myApp.get("/home", (req,res)=>{
    res.send("Please create a user first at /user. Then you can create your dream list at /list.")
});

let userList=[];
myApp.post("/user", (req,res)=>{
    const uName=req.body.name;
    const uMail=req.body.email;
    const uAge=req.body.age;
    if(!(req.body.hasOwnProperty("name") && req.body.hasOwnProperty("email") && req.body.hasOwnProperty("age"))){
        res.status(400).send("Please enter name, email and age");
    }
    else{
        const uId=uuidv4();
        const user={
            "name":uName,
            "email":uMail,
            "age":uAge,
            "uid":uId
        };
        const usr=userList.find(usr=>(usr.name===user.name && usr.email===user.email && usr.age===user.age));
        const index=userList.indexOf(usr);
        if(index>-1){
            res.status(400).send(`User already exists!`);
            }
        else{
            userList.push(user);
            res.send(`${JSON.stringify(user)} created successfully!`);
        }
}
});

myApp.get("/user",(req,res)=>{
    res.send(userList);
})

myApp.get("/user/:uid",(req,res)=>{
    const searchId=req.params.uid;
    const user=userList.find(usr=> usr.uid===searchId);
    const index=userList.indexOf(user);
    if(index>-1){
        res.send(userList[index]);
    }
    else{
        res.status(404).send(`User Id: ${searchId} not found!`);
    }
});

let userList2=[];

myApp.get("/list",(req,res)=>{
    res.status(400).send(`Add your user id after /list such as /list/<your_uid>`);
});

myApp.get("/list/:uid",(req,res)=>{
    const searchId=req.params.uid;
    const user=userList.find(usr=> usr.uid===searchId);
    const index=userList.indexOf(user);
    if(index>-1){
        res.send(userList2[index]);
    }
    else{
        res.status(404).send(`User Id: ${searchId} not found!`)
    }
});

myApp.post("/list",(req,res)=>{
    res.status(400).send(`Add your user id after /list such as /list/<your_uid>`);
});

myApp.post("/list/:uid", (req,res)=>{
    const usrId=req.params.uid;
    if(!(req.body.hasOwnProperty("item"))){
        res.status(400).send("Please add to your dream list as item");
    }
    else{
        const user=userList.find(usr=> usr.uid===usrId);
        const index=userList.indexOf(user);
        if(index>-1){
            const item=req.body.item;
            if(userList2[index]==null){
                userList2[index]=[];
                userList2[index].push(item);
            }
            else{
                userList2[index].push(item);
            }
            res.send(`${item} added successfully!`);
        }
        else{
            res.status(404).send(`User Id: ${usrId} not found!`);
        }
    }    
});

myApp.put("/list",(req,res)=>{
    res.status(400).send(`Please add the user id and the item to replace as /list/<userId>/<itemName>`);
});

myApp.put("/list/:uid",(req,res)=>{
    const searchId=req.params.uid;
    const user=userList.find(usr=> usr.uid===searchId);
    const index=userList.indexOf(user);
    if(index>-1){
        res.status(400).send(`Please add the item to be replaced as /list/${searchId}/<itemName>`);
        }
    else{
        res.status(404).send(`User Id: ${searchId} not found!`);
    }
});

myApp.put("/list/:uid/:item", (req,res)=>{
    const searchId=req.params.uid;
    const searchItem=req.params.item;
    const newItem=req.body.item;
    if(!(req.body.hasOwnProperty("item"))){
        res.status(400).send("Please add to your dream list as item");
    }
    else{
        const user=userList.find(usr=> usr.uid===searchId);
        const index=userList.indexOf(user);
        if(index>-1){
            const ind=userList2[index].indexOf(searchItem);
            if(ind>-1){
                userList2[index].splice(ind,1,newItem);
                res.send(`${searchItem} has been replaced with ${newItem} successfully!`);
            }
            else{
                res.status(404).send(`${searchItem} not found!`);
            }        
        }
        else{
            res.status(404).send(`User Id: ${searchId} not found!`);
        }
    }  
});

myApp.delete("/list/:uid/:item",(req,res)=>{
    const searchId=req.params.uid;
    const searchItem=req.params.item;
    const user=userList.find(usr=> usr.uid===searchId);
    const index=userList.indexOf(user);
    if(index>-1){
        const ind=userList2[index].indexOf(searchItem);
        if(ind>-1){
            userList2[index].splice(ind,1);
            res.send(`${searchItem} has been deleted successfully!`);
        }
        else{
            res.status(404).send(`${searchItem} not found!`);
        }        
    }
    else{
        res.status(404).send(`User Id: ${searchId} not found!`);
    }
});

myApp.delete("/user/:uid",(req,res)=>{
    const searchId=req.params.uid;
    const user=userList.find(usr=> usr.uid===searchId);
    const index=userList.indexOf(user);
    if(index>-1){
        userList.splice(index,1);
        userList2.splice(index,1);
        res.send(`User Id: ${searchId} user has been deleted successfully!`);   
    }
    else{
        res.status(404).send(`User Id: ${searchId} not found!`);
    }
});