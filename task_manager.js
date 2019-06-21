const TwitchAPI = require( "./twitch_api_utils.js" );

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