const moment = require( "moment-timezone" );

const TwitchAPI = require( "./twitch_api_utils.js" );
const FacebookUtils = require( "./facebook_utils.js" );

const Personal = require( "./main.js" ).personal;
let db = require( "./main.js" ).db;

// StateDB.self[ "last_notified" ][ notifiable[ i ] ] = new Date();
// StateDB.save();


function CACHE_VIEWER_LIST() {
	return new Promise( async function( resolve , reject ) {
		try {
			console.log( "Starting Task --> CACHE_VIEWER_LIST()" );
			let result = await TwitchAPI.getViewersInObservedChannels();
			console.log( result );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.cacheViewerList = CACHE_VIEWER_LIST;

const twitch_base_url = "https://twitch.tv/";
const earliest_notification_time = moment().hour( 11 ).minute( 0 );
const latest_notification_time = moment().hour( 22 ).minute( 30 );
function UPDATE_NOTIFIABLE_LIVE_FOLLOWERS() {
	return new Promise( async function( resolve , reject ) {
		try {
			console.log( "Starting Task --> UPDATE_NOTIFIABLE_LIVE_FOLLOWERS()" );

			// 0.) If Not in Time Window , Return
			let now = moment.tz( "America/New_York" ); // Eastern Time Zone
			//if ( now.isBefore( earliest_notification_time ) ) { console.log( "Too Early" );  return; }
			if ( !now.isAfter( earliest_notification_time ) ) { console.log( "Too Early" ); resolve(); return; }
            if ( now.isAfter( latest_notification_time ) ) { console.log( "Too Late" ); resolve(); return; }

			// 1.) Get 'Live' twitch 'followers'
			let result = await TwitchAPI.getLiveNotifiableUsers();
			console.log( "Online 'Notifiable' Twitch Users === " );
			console.log( result );
			let final_notifiable = [];
			for ( let i = 0; i < result.length; ++i ) {
				if ( !db.self.twitch_users[ result[ i ] ] ) { db.self.twitch_users[ result[ i ] ] = {}; }
				const now = new Date().getTime() / 1000
				// If a record exists for this user already
				if ( db.self.twitch_users[ result[ i ] ] && db.self.twitch_users[ result[ i ] ][ "last_notified" ] ) {
					const previous = new Date( db.self.twitch_users[ result[ i ] ][ "last_notified" ] );
					let difference = ( now - previous );
					if ( difference > 57600 ) {
						final_notifiable.push( result[ i ] );
						db.self.twitch_users[ result[ i ] ][ "last_notified" ] = now;
						db.save();
					}
					else {
						console.log( "Already Notified in 'this' 16 hour window" );
						console.log( "Waiting at Least " + ( 57600 - difference ).toString() + " seconds" );
					}
				}
				else { // Create New / Initial Record
					final_notifiable.push( result[ i ] );
					db.self.twitch_users[ result[ i ] ][ "last_notified" ] = now;
					db.save();
				}
			}

			// 2.) Confirm their channels have a decent amount of activity

			// 3.) Notify Facebook Group
			for ( let i = 0; i < final_notifiable.length; ++i ) {
				let message = final_notifiable[ i ] + " is LIVE on Twitch " + twitch_base_url + final_notifiable[ i ];
				FacebookUtils.message( Personal.facebook.twitch_notify.groups.main , message );
			}
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}
module.exports.updateNotifiableLiveFollowers = UPDATE_NOTIFIABLE_LIVE_FOLLOWERS;