// const nodemailer = require("nodemailer"),
//       express    = require("express"),
//       router     = express.Router({mergeParams:true}), 
//       Job        = require("../models/jobs");



// //nodemailer route 

// router.post('/send', (req, res) => {
//     const output = `
//     <p>You have a new job application for '${req.body.position}'</p>
//     <h3>Contact Details<h3>
//     <ul>
//         <li>Name: ${req.body.fname} ${req.body.lname}</li>
//         <li>Email: ${req.body.email}</li>
//         <li>Number: ${req.body.fname}</li>
//         <li>City: ${req.body.city}</li>
//         <li>Position applied for: ${req.body.position}</li>
//         <li>Expected Salary: ${req.body.salary}</li>
//         <li>Available Date: ${req.body.available}</li>
        
//     <ul>
    
//     <h3>Message</h3>
    
//     <p> ${req.body.message}
//     `

//     // async..await is not allowed in global scope, must use a wrapper
//     async function main() {

//         // Generate test SMTP service account from ethereal.email
//         // Only needed if you don't have a real mail account for testing
//         let testAccount = await nodemailer.createTestAccount();

//         // create reusable transporter object using the default SMTP transport
//         let transporter = nodemailer.createTransport({
//             host: "smtp.ethereal.email",
//             port: 587,
//             secure: false, // true for 465, false for other ports
//             auth: {
//                 user: testAccount.user, // generated ethereal user
//                 pass: testAccount.pass // generated ethereal password
//             }
//         });

//         // send mail with defined transport object
//         let info = await transporter.sendMail({
//             from:`admin <${req.body.email}>`, // sender address
//             to: "jordanfear1989@gmail.com", // list of receivers
//             subject: `Application - ${req.body.position}`, // Subject line
//             html: output // html body
//         });

//         console.log("Message sent: %s", info.messageId);
//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//         // Preview only available when sending through an Ethereal account
//         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        
//         Job.find({}, (err, allJobs) => err ? console.log(err) : res.render('job-page', { 
//             allJobs: allJobs,
            
//         }));
//     }

//     main().catch(console.error);

// });


// router.post('contact', (req, res) => {
//     const output = `
//     <p>You have a contact request from ${req.body.name} </p>
//     <p> ${req.body.number} </p>
    
//     <h3>Message</h3>
//     <p> ${req.body.message} </p>
    
    
//     `

//     // async..await is not allowed in global scope, must use a wrapper
//     async function main() {

//         // Generate test SMTP service account from ethereal.email
//         // Only needed if you don't have a real mail account for testing
//         let testAccount = await nodemailer.createTestAccount();

//         // create reusable transporter object using the default SMTP transport
//         let transporter = nodemailer.createTransport({
//             host: "smtp.ethereal.email",
//             port: 587,
//             secure: false, // true for 465, false for other ports
//             auth: {
//                 user: testAccount.user, // generated ethereal user
//                 pass: testAccount.pass // generated ethereal password
//             }
//         });

//         // send mail with defined transport object
//         let info = await transporter.sendMail({
//             from:`admin <${req.body.email}>`, // sender address
//             to: "jordanfear1989@gmail.com", // list of receivers
//             subject: `Application - ${req.body.subject}`, // Subject line
//             html: output // html body
//         });

//         console.log("Message sent: %s", info.messageId);
//         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//         // Preview only available when sending through an Ethereal account
//         console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        
//         res.render('contact')
            
//     }

//     main().catch(console.error);

// });

// //nodemailer route--end


// module.exports = router;