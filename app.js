const bodyParser = require("body-parser");

const express = require("express");

// const request = require("request");

const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
   res.sendFile(__dirname + "/signup.html");
     
})

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const emailAddress= req.body.emailAddress;
    const phoneNumber= parseFloat(req.body.phoneNumber);
    
var data = {
    members: [
        {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: secondName,
            PHONE: phoneNumber
        }
        }
    ]
};

const jsonData = JSON.stringify(data);

const url = "https://us21.api.mailchimp.com/3.0/lists/84da9bedd8";

const options = {
    method: "POST",
    auth: "felix1:23b9b78c4b161a945f15a9f5e412122e-us21"
} 
const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
        }else{
        res.sendFile(__dirname + "/failure.html");
    }
    
    let responseData = '';
        //Accumulate Data till the response is complete
    response.on("data", function(data){ 
        responseData += data;

    });
    response.on("end", function(){
        try{
            //Parse accumulated data when the response is complete
            const parsedData = JSON.parse(responseData);
            console.log(parsedData);
           } catch (error){
             //Handle JSON parsing errors
             console.error("Error parsing JSON:", error);
        }
    })
})
request.write(jsonData);
request.end();

});
app.post("/failure", function(req, res){
    res.redirect("/")
})
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000 ");
})

//Api Key
// 23b9b78c4b161a945f15a9f5e412122e-us21

//Audience id
//84da9bedd8
