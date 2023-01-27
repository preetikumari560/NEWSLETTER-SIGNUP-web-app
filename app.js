//The dotenv package  load env. var. from a .env file in Node.js,

const dotenv = require('dotenv');
dotenv.config(); //dotenv package  call the config() method to load the variables from the .env file.
// console.log(process.env.SECRET_KEY);
// console.log(process.env.MY_API_TOKEN);
//console.log(process.env.AUTH_K)

const express= require('express')

const app = express()

const bodyParser = require('body-parser')

const https= require('https');

/*

// way for accessing other in-built js file data to another js file: 

var extrnalData= require('./config')

console.log(extrnalData.config.MYAPITOKEN);
console.log(extrnalData.config.Auth);
console.log(extrnalData.config.SECRETAPIKEY);
*/


//npm i @mailchimp/mailchimp_marketing (need to install this package)
const client = require("@mailchimp/mailchimp_marketing");
const { response } = require('express');
// const { json } = require('body-parser');



app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.get("/",(req,res)=>{

  res.sendFile(__dirname+"/signup.html") 

})


app.post("/failure",(req,res)=>{
 
  res.redirect("/");

});


app.post("/success",(req,res)=>{
  res.redirect("/");
});

 

app.post("/",(req,res)=>
{   
  // console.log(res.statusCode);

    const firstName= req.body.fName;
    const lastName= req.body.lName;
    const emaiL= req.body.email;
    console.log(req.body);
  
    // javascript data object
  
    const data={  members:[
    {email_address:emaiL,status:'subscribed',merge_fields:
    {FNAME:firstName,LNAME:lastName}
  }
]
  }


  // this json data will send to the mailchimp
  // turning a js object into json object i.e in flat string pack
 const jsonData = JSON.stringify(data); 

 const url=`https://${process.env.SECRET_KEY}.api.mailchimp.com/3.0/lists/${process.env.MY_API_TOKEN}`;
              console.log(url);
             
 
            const options={
                method:"post",
                auth:process.env.AUTH_K
                
 }
    
 
  const holdRequest= https.request(url,options,(response)=>
 {
  if(response.statusCode===200)
  {
   res.sendFile(__dirname+"/success.html") 
  }
 
  else{
   res.sendFile(__dirname+"/failure.html") 
  }
    
    response.on("data",(data)=>{
    console.log(JSON.parse(data));
    //console.log(response.statusCode);
  });

 });

 holdRequest.write(jsonData);

 holdRequest.end();
 

});

app.listen(process.env.PORT||4000,()=>{
    console.log(`server is running on 4000 port`)
});

