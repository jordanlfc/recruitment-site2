const mongoose = require("mongoose")

//schema set up 

const jobSchema = new mongoose.Schema({
    title:String,
    location:String, 
    salary:String,
    start_date:String,
    overview:String,
    requirements:Array,
    you:String,
    duties:Array,
    other:String,

});


module.exports = mongoose.model('Job', jobSchema);