var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"), 
    User        = require("./models/user"), 
    Job  = require("./models/jobs"),
    cookieSession = require('cookie-session');
    
    
    
    

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
//mongodb+srv://data_access:<password>@cluster0-lzsn2.mongodb.net/test?retryWrites=true



//--setup

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB(); //seed the database

// PASSPORT CONFIGURATION

app.use(cookieSession({
  name: 'adminsession',
  keys: ['key1', 'key2'],
  maxAge:1500000

}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
   next();
});

//functions

const authenticator = (passport.authenticate('local', {
        successRedirect:'/admin/portal',
        failureRedirect:'/admin/portal'
}));


const loginCheck = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/admin/login");
};

//functions--end


//get routes

app.get('/',(req,res)=> res.render('index'));

app.get('/about-us', (req,res) => res.render('aboutus'));

app.get('/jobs',(req,res)=> {
    Job.find({}, (err,allJobs) => err? console.log(err) : res.render('job-page', {allJobs:allJobs}));
    
});

app.get('/contact', (req,res) => res.render('contact'));

app.get('/admin/create/new/admin1',(req,res) => res.render('newadmin'));

app.get('/admin/login', (req,res) => res.render('login'));

app.get('/admin/portal',loginCheck,(req,res) => {
    Job.find({}, (err,allJobs) => err? console.log(err) : res.render('jobportal', {allJobs:allJobs}));

});

app.get('/portal/:id/edit',loginCheck,(req,res)=> {
    Job.findById(req.params.id, function(err,foundJob){
        res.render('edit', {job:foundJob});
    });
});

//get routes--end

//post routes

app.post("/admin/create/new/admin1", function(req, res){
    var newUser = new User({username: req.body.username, admin:false});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render('index')
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect('/'); 
        });
    });
});



app.post('/admin/login', authenticator ,(req,res,err) => {
    
});

app.post('/admin/portal',loginCheck,(req,res) => {
    let jobTitle = req.body.title;
    let jobLocation = req.body.location;
    let jobSalary = req.body.salary;
    let jobYou = req.body.you;
    let jobDate = req.body.date;
    let requ = req.body.requirements.match(/([^\+!\?]+[\+!\?]+)|([^\+!\?]+$)/g);
    let duties = req.body.duties.match(/([^\+!\?]+[\+!\?]+)|([^\+!\?]+$)/g);
    let other = req.body.other;
    let overview = req.body.overview;
    
    let newJob = {title:jobTitle, location:jobLocation, overview:overview, salary:jobSalary, start_date:jobDate ,you:jobYou, requirements:requ, duties:duties, other:other};
    
    Job.create(newJob, (err,newlyCreated) => err? console.log(err) : (res.redirect('/admin/portal'), console.log(newlyCreated)));
    
});

//post routes--end


//update route


app.put('/portal/:id',loginCheck,(req,res) => {
    console.log(req.body.job);
    Job.findOneAndUpdate(req.params.id,req.body.job, (err,updatedJob) => err? res.redirect('/admin/portal') :
    res.redirect('/admin/portal'));
    
});


//update route--end


//delete routes

app.delete('/admin/portal/:id',loginCheck,(req,res)=> {
    Job.findByIdAndDelete(req.params.id, (err) => err? res.redirect('/staff_portal') :
    res.redirect('/admin/portal'))
});

//delete route--end 



app.post('/jobs',(req,res)=> {
    var el = req.body
    console.log(el)
    res.redirect('/')
});














app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started.....");
});


















