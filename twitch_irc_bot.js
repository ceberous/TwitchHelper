let tmi = require("tmi.js");
const path = require( "path" );

const PersonalFilePath = path.join( process.env.HOME , ".config" , "personal" , "observe_twitch_chat.js" );
const Personal = require( PersonalFilePath ).twitch;

function sleep( ms ) { return new Promise( resolve => setTimeout( resolve , ms ) ); }

function getRandomPropertyKey( wOBJ ) { let keys = Object.keys( wOBJ ); return keys[ keys.length * Math.random() << 0 ]; }
function getRandomArrayItem( wArray ) { return wArray[ Math.floor( Math.random() * wArray.length ) ]; }

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

//https://twitchapps.com/tmi

let EMOTES = {
	STINGS: {
		squid: "Squid1 Squid2 Squid3 Squid4",
		hearts1: "<3 <3 <3 <3",
		hearts2: "",
		energy1: "GivePLZ "
	},
	SINGLES: {
		MERICA: [ "🇺🇸" ] ,
		HELLO: [ "HeyGuys" , "VoHiYo" , "TehePelo" ] ,
		GOODBYE: [ "✌" ] ,
		KAPPA: [ "Keepo" , "Kappa" , "KappaClaus" , "KappaRoss" ] ,
		INDIFFERENT: [ "CoolStoryBob" , "SabaPing" , "SeemsGood" , "ResidentSleeper" , "Keepo" , "Kappa" , "KappaClaus" , "PunOko" ] ,
		HOPEFUL: [ "GivePLZ" , "BlessRNG" , "🙏" ] ,
		EXCITED: [ "PogChamp" , "Kreygasm" ] ,
		HEARTS: [ "<3" , "♥" , "💙" , "❤" , "💚" , "💖" , "💛" ,"💕" ] ,
		LOVE: [ "TwitchUnity" , "bleedPurple" , "😍" ] ,
		SAD: [ "FeelsBadMan" , "BibleThump" , "AngelThump" ] ,
		EMBARASED: [ "☺" ] ,
		ASHAMED: [ "FailFish" ] ,
		CRAZY: [ "HotPokket" ] ,
		CONFUSED: [ "DansGame" , "WutFace" , "D:" , "🤔" ] ,
		OFFENDED: [ "cmonBruh" ] ,
		APPROVE: [ "👍" , "👌" , " 🙌" ] ,
		DISAPROVE: [ "👎" ] ,
		UPVOTE: [ "👍" ] ,
		DOWNVOTE: [ "👎" ] ,
	}
};

function twitchSay( wChannelName , wMessage ) {
	let that = this;
	return new Promise( async function( resolve , reject ) {
		try {
			await that.irc.say( wChannelName , wMessage );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); }
	 });
}
function twitchSaySingleRepeat( wChannelName , wNumber  , wEmote  ) {
	return new Promise( async function( resolve , reject ) {
		try {
			let wSTR = "";
			for ( let i = 0; i < wNumber; ++i ) { wSTR = wSTR + wEmote + " "; }
			await twitchSay( wChannelName , wSTR );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
function twitchSayRandomSingleRepeat( wChannelName , wNumber , wEmotion  ) {
	return new Promise( async function( resolve , reject ) {
		try {
			wNumber = wNumber || 1;
			wEmotion = wEmotion || getRandomPropertyKey( EMOTES.SINGLES );
			let wEMOTE = getRandomArrayItem( EMOTES.SINGLES[ wEmotion ] );
			let wSTR = "";
			for ( let i = 0; i < wNumber; ++i ) { wSTR = wSTR + wEMOTE + " "; }
			await twitchSay( wChannelName , wSTR );
			resolve();
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}
function twitchSayRandomSinglesInEmotion( wChannelName , wNumber , wEmotion  ) {
	return new Promise( async function( resolve , reject ) {
		try {
			wNumber = wNumber || 1;
			wEmotion = wEmotion || getRandomPropertyKey( EMOTES.SINGLES );
			let wSTR = "";
			for ( let i = 0; i < wNumber; ++i ) {
				let wEMOTE = getRandomArrayItem( EMOTES.SINGLES[ wEmotion ] );
				wSTR = wSTR + wEMOTE + " ";
			}
			await twitchSay( wChannelName , wSTR );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}

function twitchSayRandomSinglesInRandomEmotion( wChannelName , wNumber  ) {
	return new Promise( async function( resolve , reject ) {
		try {
			wNumber = wNumber || 1;
			let wSTR = "";
			for ( let i = 0; i < wNumber; ++i ) {
				let wEmotion = getRandomPropertyKey( EMOTES.SINGLES );
				let wEMOTE = getRandomArrayItem( EMOTES.SINGLES[ wEmotion ] );
				wSTR = wSTR + wEMOTE + " ";
			}
			await twitchSay( wChannelName , wSTR );
			resolve();
			return;
		}
		catch( error ) { console.log( error ); reject( error ); }
	});
}

function info( data ) { console.log( data ); }
function warn( data ) { console.log( data ); }
function error( data ) { console.log( data ); }

function connect() {
	return new Promise( async function( resolve , reject ) {
		try {
			let irc_client = new tmi.client({
				options: {
					debug: false
				} ,
				connection: {
					reconnect: true ,
					secure: true
				} ,
				identity: {
					username: Personal.irc.username ,
					password: Personal.irc.oauth ,
				},
				channels: Personal.observe_channels ,
				logger: {
					info: info ,
					warn: warn ,
					error: error
				}
			});
			await irc_client.connect();
			let obj = {
				irc: irc_client ,
				say: twitchSay ,
			};
			resolve( obj );
			return;
		}
		catch( error ) { console.log( error ); reject( error ); return; }
	});
}

// (async ()=>{
// 	await twitchIRCClient.connect();
// 	console.log( "connected" );
// })();
// console.log( to.username + " = " + text );
// twitchIRCClient.on( "message" , function( from , to , text , message ) {  console.log( text + "\n" ); });
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------


module.exports.connect = connect;
module.exports.say                      = twitchSay;
module.exports.sayEmoteRepeat           = twitchSaySingleRepeat
module.exports.sayRandomEmoteRepeat     = twitchSayRandomSingleRepeat
module.exports.sayRandomEmotionRepeat   = twitchSayRandomSinglesInEmotion
module.exports.sayRandomEmote           = twitchSayRandomSinglesInRandomEmotion

// await sleep( 3000 );
// await twitchSaySingleRepeat( "ram_ram_ram_ram" , 5 , EMOTES.SINGLES.MERICA[0] );
// //setInterval( async function() { await twitchSayRandomSinglesInRandomEmotion( "ram_ram_ram_ram" , 140 ); } , 15000 );

// process.on( "unhandledRejection" , function( reason , p ) {
//     console.error( reason, "Unhandled Rejection at Promise" , p );
//     console.trace();
// });
// process.on( "uncaughtException" , function( err ) {
//     console.error( err , "Uncaught Exception thrown" );
//     console.trace();
// });