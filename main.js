process.on( "unhandledRejection" , function( reason , p ) {
	console.error( reason, "Unhandled Rejection at Promise" , p );
	console.trace();
});
process.on( "uncaughtException" , function( err ) {
	console.error( err , "Uncaught Exception thrown" );
	console.trace();
});

const path = require( "path" );
const schedule = require( "node-schedule" );
const JFODB = require( "jsonfile-obj-db" );

const PersonalFilePath = path.join( process.env.HOME , ".config" , "personal" , "twitch_helper.js" );
const Personal = require( PersonalFilePath );
module.exports.personal = Personal;

//const TwitchAPI = require( "./twitch_api_utils.js" );
// const TwitchIRCBot = require( "./twitch_irc_bot.js" );
// const IRC_Observer = require( "./twitch_irc_observer.js" );

( async ()=> {

	let db = new JFODB( "state" );
	if ( !db.self.twitch_users ) { db.self.twitch_users = {}; db.save(); }
	module.exports.db = db;

	const Task_Manager = require( "./task_manager.js" );

	//await TwitchAPI.refollowAll();

	//let connection = await TwitchIRCBot.connect();
	//connection.irc.on( "raw_message" , IRC_Observer.onRawMessage );

	let update_notifiable_live_followers = schedule.scheduleJob( "*/5 * * * *" , Task_Manager.updateNotifiableLiveFollowers );
	//await Task_Manager.updateNotifiableLiveFollowers();

	//let cache_viewer_list = schedule.scheduleJob( "*/5 * * * *" , Task_Manager.cacheViewerList );
	//await Task_Manager.cacheViewerList();

})();