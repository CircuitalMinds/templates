var videoTitle = document.getElementById('video-title');
var videoMedia = document.getElementById('video-media');
var query_search = '';
var music_app = {};

music_app.video_list = {};
var location_names = 'abcdefghijklmnopqrstuvwxyz'.split('').map((l) => 'music_' + l );
for ( var i = 0; i < location_names.length; i++ ) {
	repo = location_names[i];
	name = repo.replace("music_", "");
    loc = 'https://raw.githubusercontent.com/circuitalmynds/' + repo + '/main/info.json';    
    music_app.video_list[name] = {};
    getVideos(loc, music_app.video_list[name]);
};
function getVideos ( location, video_object ) {
    var getVideoList = $.get( location );
    getVideoList.done( function( data ) {
		videos = JSON.parse(data).video_list;
		titles = Object.keys(videos);
		for ( var n = 0; n < titles.length; n++ ) {
			video_object[titles[n]] = videos[titles[n]];
		};
    });
};

$( document ).ready(function() {
    videoMedia.poster = "https://circuitalminds.github.io/static/images/desktop/julia.gif";
    set_buttons();
});
