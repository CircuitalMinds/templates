var APP = {};
APP.git_url = "https://circuitalminds.github.io";
APP.static = {
    images: APP.git_url + "/static/images",
    js: APP.git_url + "/static/js",
    css: APP.git_url + "/static/css"
};
APP.templates = {
    applications: APP.git_url + "/templates/applications",
    previews: APP.git_url + "/templates/previews"
};
APP.container_url = function ( ID ) {
    return 'https://raw.githubusercontent.com/circuitalmynds/music_' + ID + '/main/info.json'
};
APP.videos = {};
'abcdefghijklmnopqrstuvwxyz'.split('').map( ID => APP.videos[ID] = {} );

APP.GetData = function ( Id ) { return $("#" + Id)[0] };

function GetVideosRequest ( ID ) {
    var url = APP.container_url(ID);
	var requestURL = url;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var data = request.response;
        videos = data.video_list;
        for ( title in videos ) {
            APP.videos[ID][title] = {
                url: videos[title].url,
                image: videos[title].image
            };
        };
    };
};

APP.get_videos = function () {
    for ( ID in APP.videos ) {GetVideosRequest(ID)}
};
APP.player = APP.GetData('video-media');
APP.get_current_video = function () {
    title = this.GetData('video-title').textContent;
    if ( title == "" ) {title = this.get_random_video(this.get_random_list()).title};
    container_id = title[0].toLowerCase();
    index = this.get_titles(this.videos[container_id]).indexOf(title);
    return {
        title: title,
        container_id: container_id,
        index: index
    }
};

APP.vol = {};
APP.set_video = {};
APP.searcher = {};

APP.get_titles = function ( video_object ) {return Object.keys(video_object)};
APP.get_urls = function ( video_object ) {return Object.values(video_object)};
APP.get_random_list = function () {
    letters = Object.keys(this.videos);
    return this.videos[letters[Math.round(Math.random() * letters.length  - 1)]];
};
APP.get_random_video = function ( video_object ) {
    titles = Object.keys(video_object);
    title = titles[Math.round(Math.random() * titles.length  - 1)];
    return {title: title, url: video_object[title].url};
};

$( document ).ready(function() {
    APP.get_videos();
    APP.player.poster = APP.static.images + "/desktop/julia.gif";
    config_searcher(APP);
    config_player(APP);
});
