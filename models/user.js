const mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose');






const UserSchema = new mongoose.Schema({
    username:String, 
    Password:String,
    admin:false
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
