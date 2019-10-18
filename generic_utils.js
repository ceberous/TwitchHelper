const shell = require( "shelljs" );
const Personal = require( "./main.js" ).personal;

function W_SLEEP( ms ) { return new Promise( resolve => setTimeout( resolve , ms ) ); }
module.exports.sleep = W_SLEEP;

function RUN_COMMAND_GET_OUTPUT( wCommand ) {
	try {
		console.log( wCommand );
		const result = shell.exec( wCommand , { async: false , silent: true } );
		if ( result.stderr ) { console.log( result.stderr ); return result.stderr; }
		else { console.log( result.stdout ); return result.stdout; }
	}
	catch( error ) { console.log( error ); return( error ); }
}
module.exports.runCommandGetOutput = RUN_COMMAND_GET_OUTPUT;


const TwilioClient = require( "twilio" )( Personal.twilio.twilio_sid , Personal.twilio.twilio_auth_token );
function TWILIO_MESSAGE( message ) {
	try {
		TwilioClient.messages.create({
		     body: message ,
		     from: Personal.twilio.fromSMSNumber,
		     to: Personal.twilio.toSMSNumber
		})
		.then( message => {
			resolve();
			return;
		});
	}
	catch( error ) { console.log( error ); return( error ); }
}
module.exports.twilioMessage = TWILIO_MESSAGE;