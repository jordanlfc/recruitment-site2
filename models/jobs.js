const mongoose = require("mongoose")

//schema set up 

const jobSchema = new mongoose.Schema({
    title:String,
    location:String, 
    salary:String,
    start_date:String,
    requirements:Array,
    description:String,
    what:String,
    other:String,

});


module.exports = mongoose.model('Job', jobSchema);