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
			video_object[titles[n]] = {
				url: videos[titles[n]].url,
				image: videos[titles[n]].image
			};
		};
    });
};

var Vol = [];
for ( var i = 0; i <= 10; i++ ) {
  Vol.push( i  / 10 );
};
music_app.add_volume = function () {
    if ( videoMedia.volume != 1 ) {
        videoMedia.volume = Vol[Vol.indexOf(videoMedia.volume) + 1];
    };
};
music_app.down_volume = function () {
    if ( videoMedia.volume != 0 ) {
        videoMedia.volume = Vol[Vol.indexOf(videoMedia.volume) - 1];
    };
};

music_app.random_list = function () {
    key_list = Object.keys(this.video_list);
    return this.video_list[key_list[Math.round(Math.random() * key_list.length  - 1)]];
};
music_app.random_video = function () {
    videos = this.random_list();
    titles = Object.keys(videos);
    index = Math.round(Math.random() * titles.length - 1);
    title = titles[index];
    videoTitle.innerHTML = title;
    videoMedia.setAttribute('src', videos[title].url);
    videoMedia.play();
};
music_app.videos_by_title = function ( title ) {
    return this.video_list[title[0].toLowerCase()];
};
music_app.change_video = function ( option ) {
    current_title = videoTitle.textContent;
    if ( current_title == '' ) {
        music_app.random_video();
    } else {
        videos = this.videos_by_title(current_title);
        titles = Object.keys(videos);
        if ( titles.indexOf(current_title) > titles.length ) {
            this.random_video();
        } else {
            index = titles.indexOf(current_title) + {previous: -1, next: 1}[option];
            title = titles[index];
            videoTitle.innerHTML = title;
            videoMedia.setAttribute('src', videos[title].url);
            videoMedia.play();
        };
    };
};
music_app.play_video = function () {
    if ( videoMedia.src == '' ) {
        music_app.random_video();
    } else {
        videoMedia.play();
    };
};
music_app.pause_video = function () {
    videoMedia.pause();
};
music_app.change_video_from = function ( title ) {
    videos = this.videos_by_title(title);
    videoTitle.innerHTML = title;
    videoMedia.setAttribute('src', videos[title].url);
    videoMedia.play();
};

function set_buttons () {
    var volume_buttons = {
        minus: music_app.down_volume,
        plus: music_app.add_volume
    };
    var media_buttons = {
        play: function () { music_app.play_video() },
        pause: function () { music_app.pause_video() },
        previous: function () { music_app.change_video('previous') },
        next: function () { music_app.change_video('next') }
    };
    for ( option in volume_buttons ) {
        button = $('#' + option)[0];
        button.onclick = volume_buttons[option];
    };
    for ( option in media_buttons ) {
        button = $('#' + option)[0];
        button.onclick = media_buttons[option];
    };
};

function Search_Template ( title, image ) {
	var strObj = '<li class="button card-content bg-darkTeal bg-dark-hover fg-light" '
	             + 'onclick=music_app.change_video_from(this.getElementsByClassName("label")[0].textContent) >'
				 + '<img class="avatar" src="' + image + '">'
				 + '<span class="label">'+ title +'</span>'
				 + '<span class="second-label"> 1 min </span>'
				 + '</li>';
	return strObj;
};

$('input')[0].addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   Search_List($('#search')[0].value);
  }
});

function Search_List ( q ) {
    image ="https://circuitalminds.github.io/static/images/desktop/julia.gif";
	if ( q != '' & q != undefined & q != null ) {
		query_result = '';
		q = q.toLowerCase()
		if ( music_app.video_list[q[0]] != undefined ) {			
			videos = music_app.video_list[q[0]];
			query_data = Object.keys(videos);
			filter_data = queryFilter(query_data, q);
			if ( filter_data.length == 0 ) {				
				query_result += Search_Template('search not found', image);
			} else {			
				for ( title of filter_data ) {
					query_result += Search_Template(title, videos[title].image);
				};
			};
		} else {
			query_result += Search_Template('search not found', image);
		};
		query_search = q;
    	$('#search-result')[0].setAttribute("class", "bg-darkTeal fg-white");    	
    	$('#search-result')[0].innerHTML = '<ul class="feed-list bg-darkTeal fg-light"><li class="title"> Search Result </li>' + query_result + '</ul>';
    	$('#search-result')[0].style['display'] = 'block';
   	} else if ( q == '' ) {   	
   		query_search = q;
   		$('#search-result')[0].setAttribute("class", "bg-white");
   		$('#search-result')[0].innerHTML = '';   		
   		$('#search-result')[0].style['display'] = 'none';
   	};
};

function queryFilter ( array_data, target ) {	
	result = [];
	for ( element of array_data ) {
		r = element.toLowerCase();
		if ( r.search(target) != -1 || target.split('').map( l => r[target.indexOf(l)] == l ).indexOf(false) == -1 ) {
	        result.push(element);
	    };
	};
	return result;
};

$( document ).ready(function() {
    videoMedia.poster = "https://circuitalminds.github.io/static/images/desktop/julia.gif";
    set_buttons();
});
