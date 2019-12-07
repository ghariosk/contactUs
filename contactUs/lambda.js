let AWS = require('aws-sdk');
const ses = new AWS.SES();
const pug = require('pug');

exports.handler = function async(event, context, callback) {
    console.log(event)

    var { who, email, name, phoneNumber, city, description } = event.body
    var data
    if (who == "eater") {
        data = `${name} wants to know more about Wazifa. You can reach them at ${email} or ${phoneNumber}. He lives in ${city}`
    } else if (who=="baker") {
        data = `${name} wants to join Wazifa. You can reach them at ${email} or ${phoneNumber}. They operate from ${city}`
    } else {
        data = `${name} sent a Contact Request to Waziifa You can reach them them at ${email} or ${phoneNumber}. They operate from ${city}`
    }


    const compiledFunction = pug.compileFile('views/index.pug');

    var htmlData = compiledFunction({
        name: name,
        email: email,
        phoneNumber:phoneNumber,
        city: city,
        description: description
    })

    ses.sendEmail({
        Destination: {
            ToAddresses: ['karl.gharios@waziifa.com', 'karim.hatem@waziifa.com'],
            CcAddresses: [],
            BccAddresses: []
        },
        Message: {
            Body: {
                Text: {
                    Data: data
                },
                Html: {
                    Data: htmlData
                }
            },
            Subject: {
                Data: 'Contact Request from' + name
            }
        },
        Source: 'Wazifa No Reply <no-reply@waziifa.com>'
    }, function (err, data) {
        console.log(err, data)
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "message": "Success" })
        };
        if (err) callback(null, { "message": "Error" }); // an error occurred
        else callback(null, response);           // successful response
    });
}