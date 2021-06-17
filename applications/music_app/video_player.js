var Player = {
	media: document.getElementById("video-media"),
	title: document.getElementById("video-title")	
}

function vol_adjusts ( step_size ) {	
	vol = [];
	steps = Math.round(1.0 / step_size);	
	for ( var i = 0; i <= steps; i++ ) {
		vol.push(step_size * i);
	};
	return vol
}


function add_volume () {
    if ( this.media.volume != 1 ) {
        this.media.volume = this.Vol[this.Vol.indexOf(this.media.volume) + 1]
	}
};	

function down_volume () {
	if ( this.media.volume != 0 ) { 
		this.media.volume = 0.1; 
	}
};

function random_list () {
    key_list = Object.keys(video_list);
    return video_list[key_list[Math.round(Math.random() * key_list.length  - 1)]];
};

function set_buttons () {
    var volume_buttons = {
        minus: music_app.down_volume,
        plus: music_app.add_volume
    };
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
