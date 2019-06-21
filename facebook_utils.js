const GenericUtils = require( "./generic_utils.js" );

function MESSAGE( user_name , message ) {
	return new Promise( function( resolve , reject ) {
		try {
			let cmd = `messer --command='m "${ user_name }" ${ message }'`;
			let result = GenericUtils.runCommandGetOutput( cmd );
			resolve( result );
			return result;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.message = MESSAGE;