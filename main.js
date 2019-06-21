process.on( "unhandledRejection" , function( reason , p ) {
	console.error( reason, "Unhandled Rejection at Promise" , p );
	console.trace();
});
process.on( "uncaughtException" , function( err ) {
	console.error( err , "Uncaught Exception thrown" );
	console.trace();
});

const schedule = require( "node-schedule" );

//const TwitchAPI = require( "./twitch_api_utils.js" );
const TwitchIRCBot = require( "./twitch_irc_bot.js" );
const IRC_Observer = require( "./twitch_irc_observer.js" );
const Task_Manager = require( "./task_manager.js" );

( async ()=> {

	//await TwitchAPI.refollowAll();

	let connection = await TwitchIRCBot.connect();
	connection.irc.on( "raw_message" , IRC_Observer.onRawMessage );
	// connection.irc.on( "message" , CustomObserver.onMessage );
	// connection.irc.on( "join" , CustomObserver.onJoin );
	// connection.irc.on( "part" , CustomObserver.onPart );
	// connection.irc.on( "timeout" , CustomObserver.onTimeout );
	// connection.irc.on( "ban" , CustomObserver.onBan );
	// connection.irc.on( "chat_moderator_actions" , CustomObserver.onModeration );


	//let cache_viewer_list = schedule.scheduleJob( "*/5 * * * *" , Task_Manager.cacheViewerList );
	await Task_Manager.cacheViewerList();

})();