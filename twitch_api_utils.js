const request = require( "request" );

const Personal = require( "./main.js" ).personal.twitch;
console.log( Personal );


function GET_VIEWERS( wChannel ) {
	return new Promise( function( resolve , reject ) {
		try {
			let headers = {
				'Accept': 'application/json; charset=UTF-8',
				'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
				'content-type': 'application/json; charset=UTF-8'
			};

			let options = {
				url: `https://tmi.twitch.tv/group/user/${ wChannel }/chatters`,
				headers: headers
			};

			request( options , function ( err , response , body ) {
				if ( err ) { console.log( err ); reject( err ); return; }
				let result = JSON.parse( body );
				//console.log( result );
				if ( !result ) { resolve( false ); return; }
				resolve( result );
				return;
			});

		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.getViewers = GET_VIEWERS;


function GET_VIEWERS_IN_OBSERVED_CHANNELS() {
	return new Promise( async function( resolve , reject ) {
		try {
			let final = {};
			// for( let i = 0; i < Personal.observe_channels.length; ++i ) {
			// 	let channel = Personal.observe_channels[ i ].split( "#" )[ 1 ];
			// 	let result = await GET_VIEWERS( channel );
			// 	final[ channel ] = result;
			// }
			for( let i = 0; i < Personal.followers.length; ++i ) {
				let channel = Personal.followers[ i ];
				let result = await GET_VIEWERS( channel );
				final[ channel ] = result;
			}
			resolve( final );
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.getViewersInObservedChannels = GET_VIEWERS_IN_OBSERVED_CHANNELS;

function GET_LIVE_USERS() {
	return new Promise( async function( resolve , reject ) {
		try {
			function parseResults( result ) {
				let wTMP = [];
				if ( !result[ "streams" ] ) { return wTMP; }
				for ( let x1 = 0; x1 < result[ "streams" ].length; ++x1 ) {
					let t1 = new Date( result[ "streams" ][ x1 ][ "created_at" ] );
					let t2 = Math.round( t1.getTime() / 1000 );
					let wOBJ = {
						name: result[ "streams" ][ x1 ][ "channel" ][ "display_name" ].toLowerCase() ,
						game: result[ "streams" ][ x1 ][ "game" ] ,
						_id: result[ "streams" ][ x1 ][ "_id" ] ,
						start_time: t2 ,
						resolution: result[ "streams" ][ x1 ][ "video_height" ] ,
						status: result[ "streams" ][ x1 ][ "stream_type" ] ,
					};
					//console.log( wOBJ );
					if ( wOBJ.status === "live" ) {
						wTMP.push( wOBJ );
					}
				}
				return wTMP;
			}
			let url = "https://api.twitch.tv/kraken/streams/followed?client_id=" +
			Personal.client_id + "&oauth_token=" + Personal.oauth_token + "&on_site=1";
			request( url , async function ( err , response , body ) {
				let result = JSON.parse( body );
				if ( result[ "error" ] ) { if ( result[ "error"] === "Bad Request" ) { console.log( result ); resolve( result ); } }

				// Else , Parse Results
				let final = await parseResults( result );
				resolve( final );
				return;
			});
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.getLiveUsers = GET_LIVE_USERS;

function GET_LIVE_NOTIFIABLE_USERS() {
	return new Promise( async function( resolve , reject ) {
		try {
			let live = await GET_LIVE_USERS();
			let live_usernames = live.map( x => x.name );
			let live_notifiable = [];
			for ( let i = 0; i < Personal.users_to_notify_about.length; ++i ) {
				if ( live_usernames.indexOf( Personal.users_to_notify_about[ i ] ) > -1 ) {
					live_notifiable.push( Personal.users_to_notify_about[ i ] );
				}
			}
			resolve( live_notifiable );
			return;
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.getLiveNotifiableUsers = GET_LIVE_NOTIFIABLE_USERS;



function GET_USER_ID( wUserName  ) {
	return new Promise( async function( resolve , reject ) {
		try {
			let headers = {
				'Accept': 'application/vnd.twitchtv.v5+json',
				'Client-ID': Personal.client_id ,
			};

			let options = {
				url: 'https://api.twitch.tv/kraken/users?login=' + wUserName ,
				headers: headers
			};
			request( options , function ( err , response , body ) {
				if ( err ) { console.log( err ); reject( err ); return; }
				let result = JSON.parse( body );
				//console.log( result );
				if ( !result ) { resolve( false ); return; }
				if ( !result.users ) { resolve( false ); return; }
				if ( !result.users[ 0 ] ) { resolve( false ); return; }
				if ( !result.users[ 0 ]._id ) { resolve( false ); return; }
				resolve( result.users[ 0 ]._id );
			});
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.getUserID = GET_USER_ID;


function FOLLOW_USERNAME( wUserNameToFollow  ) {
	return new Promise( async function( resolve , reject ) {
		try {
			let user_id_to_follow = await GET_USER_ID( wUserNameToFollow );
			//console.log( user_id_to_follow );

			let headers = {
				'Accept': 'application/vnd.twitchtv.v5+json',
				'Client-ID': Personal.client_id ,
				'Authorization': 'OAuth ' + Personal.oauth_token
			};

			let options = {
				url: 'https://api.twitch.tv/kraken/users/' + Personal.user_id + '/follows/channels/' + user_id_to_follow ,
				method: 'PUT',
				headers: headers
			};
			console.log( options );
			request( options , function ( err , response , body ) {
				if ( err ) { console.log( err ); reject( err ); return; }
				let result = JSON.parse( body );
				console.log( result );
				resolve( result );
			});
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.follow = FOLLOW_USERNAME;

function REFOLLOW_ALL() {
	return new Promise( async function( resolve , reject ) {
		try {
			for ( let i = 0; i < Personal.followers.length; ++i ) {
				await FOLLOW_USERNAME( Personal.followers[ i ] );
				console.log( "Refollowed " + Personal.followers[ i ] );
			}
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.refollowAll = REFOLLOW_ALL;

function UNFOLLOW_USERNAME( wUserNameToUnFollow ) {
	return new Promise( function( resolve , reject ) {
		try {
			let wURL = "https://api.twitch.tv/kraken/users/" + Personal.user_name + "/follows/channels/" + wUserNameToUnFollow +"?client_id=" +
			Personal.client_id + "&oauth_token=" + Personal.oauth_token + "&on_site=1";
			console.log( wURL );
			request.delete( wURL , function ( err , response , body ) {
				if ( err ) { console.log( err ); reject( err ); return; }
				let x11 = null;
				try { x11 = JSON.parse( body ); }
				catch( err ) { x11 = ""; }
				resolve( x11 );
				return;
			});
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.unfollow = UNFOLLOW_USERNAME;

function GET_FOLLOWERS() {
	return new Promise( function( resolve , reject ) {
		try {
			//let wURL = "https://api.twitch.tv/kraken/streams/followed?client_id=" +
			//Personal.client_id + "&oauth_token=" + Personal.oauth_token + "&on_site=1";
			let wURL = "https://api.twitch.tv/kraken/users/" + Personal.user_name + "/follows/channels?client_id=" + Personal.client_id + "&oauth_token=" + Personal.oauth_token + "&on_site=1&limit=100";
			//console.log( wURL );
			request( wURL , async function ( err , response , body ) {
				if ( err ) {
					console.log( err );
					reject( err );
					return;
				}
				let followers = JSON.parse( body );
				followers = followers[ "follows" ];
				followers = followers.map( x => x[ "channel" ][ "name" ] );
				resolve( followers );
			});
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
module.exports.getFollowers = GET_FOLLOWERS;