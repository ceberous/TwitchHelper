// https://docs.tmijs.org/v1.4.2/Configuration.html
// https://docs.tmijs.org/v1.4.2/Events.html

function ON_MESSAGE( channel , author , text , message ) {
	return new Promise( function( resolve , reject ) {
		try {
			console.log( "\ntwitch.tv/" + channel.split( "#" )[ 1 ] + " recieved a message" );
			console.log( "Message Type === " + author[ "message-type" ] );

			// [ 'badge-info',
			// 'badges',
			// 'color',
			// 'display-name',
			// 'emotes',
			// 'flags',
			// 'id',
			// 'mod',
			// 'room-id',
			// 'subscriber',
			// 'tmi-sent-ts',
			// 'turbo',
			// 'user-id',
			// 'user-type',
			// 'emotes-raw',
			// 'badge-info-raw',
			// 'badges-raw',
			// 'username',
			// 'message-type' ]

			console.log( author.username + " : " + text );
			console.log( message );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.onMessage = ON_MESSAGE;

function ON_JOIN( channel , username , self ) {
	return new Promise( function( resolve , reject ) {
		try {
			console.log( "\n" + username + " joined twitch.tv/" + channel.split( "#" )[ 1 ] );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.onJoin = ON_JOIN;

function ON_PART( channel , username , self ) {
	return new Promise( function( resolve , reject ) {
		try {
			console.log( "\n" + username + " left twitch.tv/" + channel.split( "#" )[ 1 ] );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.onPart = ON_PART;


function ON_BAN( channel , username , reason , userstate ) {
	return new Promise( function( resolve , reject ) {
		try {
			console.log( "\n" + username + " was banned in  twitch.tv/" + channel.split( "#" )[ 1 ] );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.onBan = ON_BAN;

function ON_TIMEOUT( channel , username , reason , duration , userstate ) {
	return new Promise( function( resolve , reject ) {
		try {
			console.log( "\n" + username + " was timed out in  twitch.tv/" + channel.split( "#" )[ 1 ] + " for " + duration.toString() + " seconds" );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.onTimeout = ON_TIMEOUT;


function ON_MODERATION( ...args ) {
	return new Promise( function( resolve , reject ) {
		try {
			console.log( "Moderation Message" );
			for ( let i = 0; i < args.length; ++i ) {
				console.log( args[ i ] );
			}
			//console.log( "\n" + username + " was timed out in  twitch.tv/" + channel.split( "#" )[ 1 ] + " for " + duration.toString() + " seconds" );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.onModeration = ON_MODERATION;


function ON_RAW_MESSAGE( messageCloned , message ) {
	let that = this;
	return new Promise( function( resolve , reject ) {
		try {
			console.log( `\nType === ${ message.command }` );
			if ( message.tags[ "display-name" ] ) {
				console.log( "From: " + message.tags[ "display-name" ] );
			}
			console.log( message.params );
			console.log( message.raw );

			if ( message.command === "PRIVMSG" )

			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.onRawMessage = ON_RAW_MESSAGE;




