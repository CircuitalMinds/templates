Player = $("#video-media")[0];
Player.video_title = $('#video-title')[0];
buttons = {
    previous: $("#previous")[0], next: $("#next")[0], play: $("#play")[0], pause: $("#pause")[0],
    minus: $("#minus")[0], plus: $("#plus")[0], random: $("#random")[0]
};
buttons.previous.onclick = function () { Player.previous_video() };
buttons.next.onclick = function () { Player.next_video() };
buttons.play.onclick = function () { Player.onplay() };
buttons.pause.onclick = function () { Player.onpause() };
buttons.minus.onclick = function () { Player.set_volume('-') };
buttons.plus.onclick = function () { Player.set_volume('+') };

Player.set_video = function ( index ) {
    title = get_video('keys')[index];
    this.video_title.innerHTML = videos[title].title;
    this.src = videos[title].url;
    this.onplay();
};
Player.onplay = function () {
    this.play()
};
Player.onpause = function () {
    this.pause()
};
Player.previous_video = function () {
    if ( buttons.random.checked ) {
        this.set_video(this.random_video());
    } else if ( this.video_title == '' ) {
        this.set_video(this.random_video());
    } else {
        index = get_video('index', this.video_title.textContent);
        if ( index > 0 ) {
            this.set_video(index - 1);
        } else {
            this.set_video(this.random_video());
        };
    };
};
Player.next_video = function () {
    if ( buttons.random.checked ) {
        this.set_video(this.random_video());
    } else if ( this.video_title == '' ) {
        this.set_video(this.random_video());
    } else {
        index = get_video('index', this.video_title.textContent);
        if ( index > 0 ) {
            this.set_video(index + 1);
        } else {
            this.set_video(this.random_video());
        };
    };
};
Player.random_video = function () {
    return Math.round(Math.random() * get_video('keys').length  - 1);
}
Player.query_from_uri = function ( uri ) {
    found_data = get_video('keys').filter( t => Lower(videos[t].title).match(Lower(uri)) != null );
    if ( found_data.length != 0 ) {
        found_data.sort();
        Player.set_video( get_video('keys').indexOf(found_data[0]) );
    };
};
Player.set_volume = function ( option ) {
    if ( option == '+' & this.volume != 1 ) {
        this.volume += 0.1;
    } else if ( option == '-' & this.volume != 0 ) {
        this.volume -= 0.1;
    };
};

var APP = {
    url_data: 'https://raw.githubusercontent.com/CircuitalMinds/video_app/main/video_data.json',
    git_url: "https://circuitalminds.github.io",
    static: {}
};
["images", "js", "css"].map( i => APP.static[i] = APP.git_url + '/static/' + i );

var videos = get_server_data(APP.url_data);
var search_query = $('input[id="search-query"]')[0];
var search_display = $('div.dialog-content')[0];

function set_feed ( Id, img='' ) {
    obj = document.querySelector( 'li[id="feed-' + Id + '"]' );
    if ( img == '' ) {
        v = get_video('keys')[Player.random_video()];
        obj.setAttribute(
            'onclick', 'Player.set_video(' + get_video('keys').indexOf(v) + ')'
        );
        obj.querySelector('img').setAttribute("src", videos[v].image);
        obj.querySelector('span').innerHTML = videos[v].title;
    } else {
        obj.querySelector('img').setAttribute("src", img);
    };
}

select_object("button", "id", "get-lyrics").onclick = function () {
    video_lyrics = select_object("div", "id", "video-lyrics");
    title = Player.video_title.textContent.split('[')[0].split('(')[0].replace('-', '');
    get_server_data( "/get_lyrics?title=" + title, lyrics );
    setTimeout(function () {
        string_list = '<ul class="cell-md-12 feed-list bg-darkTeal fg-light">\n';
        lyrics['data'].split('\n').map( s => string_list += '<li>' + s + '</li>\n' );
        video_lyrics.innerHTML = string_list + '</ul>';
    }, 5000);
};

function get_video ( attr, data='' ) {
    if ( attr == 'keys' ) {
        titles = Object.keys(videos);
        titles.sort();
        return titles;
    } else if ( attr == 'values' ) {
        return Object.values(videos);
    } else if ( attr == 'index' ) {
        Index = Object.keys(videos).indexOf(data);
        if ( Index == undefined ) {
            Index = Object.values(videos).map( v => v.title ).indexOf(data);
        };
        return Index;
    };
};

search_query.onkeyup = function () {
    q = this.value;
    Metro.dialog.open('#search-dialog')
    if ( q != '' & q != Results.query ) {
        Results.query = q;
        r = GetMatches(q);
        Results.data = ListTemplate(r);
        Results.paginate = SubLists(Results.data, 3);
        set_page(0);
    };
};

var Results = {
    data: [],
    query: '',
    paginate: []
};

function set_page ( x ) {
    if ( 0 < x < Results.paginate.length - 1 ) {
        page = Results.paginate[x].join('\n');
        search_display.innerHTML = [
            '<ul class="feed-list bg-darkTeal fg-light">', page, '</ul>'
        ].join('');
        button_l = $("#left")[0];
        button_r = $("#right")[0];
        if ( x == button_r.value ) {
            button_l.value += 1;
            button_r.value += 1;
        } else {
            button_l.value -= 1;
            button_r.value -= 1;
        };
    };
};

function Lower ( data ) {
    return data.toLowerCase()
};

function GetMatches ( data_str ) {
    target = Lower(data_str);
    video_list = get_video('keys');
    return video_list.filter(
        t => [
            Lower(videos[t].title).match(target),
            Lower(videos[t].keywords).match(target),
            Lower(videos[t].description).match(target)
        ].join('') != ''
    );
};

function ListTemplate ( data ) {
    function Row ( x ) {
        return [
            '<li class="button card-content bg-darkTeal bg-dark-hover fg-light" ',
            'onclick=Player.set_video(INDEX); >'.replace('INDEX', get_video('index', x)),
            '<img class="avatar" src="IMAGE" >'.replace('IMAGE', videos[x].image),
            '<span id="title" class="label">' + videos[x].title + '</span>',
            '<span class="second-label">' + videos[x].duration + '</span>',
            '</li>'
        ].join('\n');
    };
    return data.map( x => Row(x) );
};

window.setInterval( function() {
    set_feed("A");
}, 10000);

$( document ).ready(function() {
    Player.poster = APP.static.images + "/desktop/julia.gif";
    set_feed("A", APP.static.images + "/desktop/julia.gif");
});
