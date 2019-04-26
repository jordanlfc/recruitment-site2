var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Job = require("./models/jobs"),
    cookieSession = require('cookie-session'),
    nodemailer = require("nodemailer");



//route requirements 


//route requirements--end



mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
//mongodb+srv://data_access:<password>@cluster0-lzsn2.mongodb.net/test?retryWrites=true



//--setup

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB(); //seed the database

// PASSPORT CONFIGURATION

app.use(cookieSession({
    name: 'adminsession',
    keys: ['key1', 'key2'],
    maxAge: 1500000

}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//functions

const authenticator = (passport.authenticate('local', {
    successRedirect: '/admin/portal',
    failureRedirect: '/admin/portal'
}));


const loginCheck = function (req, res, next) {
    if (req.isAuthenticated() && res.locals.currentUser.admin===true) {
        return next();
    }
    res.redirect("/admin/login");
};

//functions--end


//get routes

app.get('/', (req, res) => res.render('index'));

app.get('/about-us', (req, res) => res.render('aboutus'));

app.get('/jobs', (req, res) => {
    Job.find({}, (err, allJobs) => err ? console.log(err) : res.render('job-page', { allJobs: allJobs }));

});

app.get('/contact', (req, res) => res.render('contact'));

app.get('/admin/create/new/admin1', (req, res) => res.render('newadmin'));

app.get('/admin/login', (req, res) => res.render('login'));

app.get('/admin/portal', loginCheck, (req, res) => {
    Job.find({}, (err, allJobs) => err ? console.log(err) : res.render('jobportal', { allJobs: allJobs }));

});

app.get('/portal/:id/edit', loginCheck, (req, res) => {
    Job.findById(req.params.id, function (err, foundJob) {
        res.render('edit', { job: foundJob });
    });
});

//get routes--end

//post routes

app.post("/admin/create/new/admin1", function (req, res) {
    var newUser = new User({ username: req.body.username, admin: false });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err)
            return res.render('index')
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect('/');
        });
    });
});




app.post('/admin/login', authenticator, (req, res, err) => {
    res.redirect('/admin/portal')
});

app.post('/admin/portal', loginCheck, (req, res) => {
    let jobTitle = req.body.title;
    let jobLocation = req.body.location;
    let jobSalary = req.body.salary;
    let jobYou = req.body.you;
    let jobDate = req.body.date;
    let requ = req.body.requirements.match(/([^\+!\?]+[\+!\?]+)|([^\+!\?]+$)/g);
    let duties = req.body.duties.match(/([^\+!\?]+[\+!\?]+)|([^\+!\?]+$)/g);
    let other = req.body.other;
    let overview = req.body.overview;

    let newJob = { title: jobTitle, location: jobLocation, overview: overview, salary: jobSalary, start_date: jobDate, you: jobYou, requirements: requ, duties: duties, other: other };

    Job.create(newJob, (err, newlyCreated) => err ? console.log(err) : (res.redirect('/admin/portal'), console.log(newlyCreated)));

});

//post routes--end


//update route


app.put('/portal/:id', loginCheck, (req, res) => {
    console.log(req.body.job);
    Job.findOneAndUpdate(req.params.id, req.body.job, (err, updatedJob) => err ? res.redirect('/admin/portal') :
        res.redirect('/admin/portal'));

});


//update route--end


//delete routes

app.delete('/admin/portal/:id', loginCheck, (req, res) => {
    Job.findByIdAndDelete(req.params.id, (err) => err ? res.redirect('/staff_portal') :
        res.redirect('/admin/portal'))
});

//delete route--end 



app.post('/jobs', (req, res) => {
    var el = req.body
    console.log(el)
    res.redirect('/')
});






//logout route


app.get('/logout', (req, res) => (req.logout(), res.redirect('/jobs')));


//logout route--end



app.post('/send', (req, res) => {
    const output = `
    <p>You have a new job application for '${req.body.position}'</p>
    <h3>Contact Details<h3>
    <ul>
        <li>Name: ${req.body.fname} ${req.body.lname}</li>
        <li>Email: ${req.body.email}</li>
        <li>Number: ${req.body.fname}</li>
        <li>City: ${req.body.city}</li>
        <li>Position applied for: ${req.body.position}</li>
        <li>Expected Salary: ${req.body.salary}</li>
        <li>Available Date: ${req.body.available}</li>
        
    <ul>
    
    <h3>Message</h3>
    
    <p> ${req.body.message}
    `

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass // generated ethereal password
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from:`admin <${req.body.email}>`, // sender address
            to: "jordanfear1989@gmail.com", // list of receivers
            subject: `Application - ${req.body.position}`, // Subject line
            html: output // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        
        Job.find({}, (err, allJobs) => err ? console.log(err) : res.render('job-page', { 
            allJobs: allJobs,
            
        }));
    }

    main().catch(console.error);

});


app.post('/contact', (req, res) => {
    const output = `
    <p>You have a contact request from ${req.body.name} </p>
    <p> ${req.body.number} </p>
    
    <h3>Message</h3>
    <p> ${req.body.message} </p>
    
    
    `

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass // generated ethereal password
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from:`admin <${req.body.email}>`, // sender address
            to: "jordanfear1989@gmail.com", // list of receivers
            subject: `Application - ${req.body.subject}`, // Subject line
            html: output // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        
        res.render('contact')
            
    }

    main().catch(console.error);

});

//nodemailer route--end






app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server started.....");
});












