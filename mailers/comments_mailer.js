const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    console.log('Inside newComment mailer');

    nodeMailer.transporter.sendMail({
        from: 'amir.anis.rkl.2@gmail.com',
        to: comment.user.email,
        subject: 'New comment published',
        html: '<h1>Your comment has been published</h1>'
    }, (err, info) => {
        if(err){
            console.log('error in sending mail', err);
            return;
        }
        console.log('Message sent!', info);
    });
}