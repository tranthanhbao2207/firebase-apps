const admin = require('firebase-admin');
const twilio = require('./twilio');
module.exports = function(req, res) {
    if (!req.body.phone) {
        return res.status(422).send({ error: ' need phone number'});
    }

    const phone = String(req.body.phone).replace(/[^\d]/g,'');

    admin.auth().getUser(phone)
        .then(userRecord => {
           const code = 3000;
           twilio.messages.create({
               body: 'code is ' + code,
               from: '+19166340415',
               to: '+' + phone
           }, (err) => {
               if (err) { return res.status(422).send(err);}

               admin.database().ref('users/' + phone)
                .update({ code: code, codeValid: true}, () =>{
                    res.send({success: true});
                })
           })
        })
        .catch( err => {
            res.status(422).send({ error: err });
        });
}
