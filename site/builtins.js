// Basic Module
/*
==================================================
    Builtins and Definitions
==================================================
*/
function print ( x ) {
    console.log(
        ( Type.isData(x, "object") ) ? JSON.stringify( y ) : y
    );
};
function Join ( y, pattern ) {
    return y.join( pattern );
};
function Replace ( y, w ) {
    if ( getType( w ) == "array" ) {
        w.map( wi => y=y.replaceAll( wi, "" ) );
        return y;
    } else {
        return y.replaceAll( w, "" );
    };
};
function Range ( start, stop, dy ) {
    if ( stop == undefined ) { stop = start; start = 0 };
    if ( dy == undefined ) { dy = 1 };
    var L = {
        length: ( stop - start - 1 ) / dy + 1
    };
    return Array.from( L, ( _, i ) => start + ( i * dy ) );
};
function Abs ( x ) {
    return Math.abs( x );
};
function Round ( x ) {
    return Math.round( x );
};
function Tf ( name ) {
    return Math[ name.toLowerCase() ];
};
function Ct ( name ) {
    return Math[ name.toUpperCase() ];
};

function Precision ( x, n ) {
    var xn = Tf( "trunc" )( x );
  	var yn = Tf( "trunc" )( ( xn - n ) * 10 ** n );
    return parseFloat( xn + "." + yn );
};

function Prod ( y ) {
    return y.reduce( function ( i, j ) { return i * j }, 1.0 );
};
function Sum ( y ) {
    return y.reduce( function ( i, j ) { return i + j }, 0.0 );
};
function Fact ( n ) {
    return Prod( Range(1, n + 1) );
};
function RandInt ( start, stop ) {
    var L = Abs( stop - start );
    var Xr = Round( Math.random() * L );
    return start + Xr;
};

function getSample ( y, size ) {
    if ( size > y.length) {
        size = y.length;
    };
    var ys = [];
    var yi = y[RandInt( 0, y.length - 1)];
    ys.push(yi);
    while ( ys.length < size ) {
        yi = y[RandInt( 0, y.length - 1)];
        if ( ys.indexOf(yi) == -1 ) {
            ys.push(yi);
        };
    };
    return ys;
};

function getKeys ( y ) {
    return Object.keys( y );
};
function getValues ( y ) {
    return Object.values( y );
};
function getItems ( y ) {
    return Object.entries( y );
};

function Dict ( y ) {
    let dict = {};
    dict.isDict = function ( x ) {
        return typeof( x ) == "object" && !x.length;
    };
    dict.data = ( dict.isDict( y ) ) ? y : {};
    dict.keys = function () { return Object.keys( this.data ) };
    dict.values = function () { return Object.values( this.data ) };
    dict.items = function () { return Object.entries( this.data ) };
    dict.get = function ( q ) { return this.data[q] };
    dict.set = function ( k, v ) { this.data[k] = v };
    dict.update = function ( x ) {
        for ( key in x ) { this.set( key, x[key] ) };
    };
    dict.len = function () {
        return this.keys().length;
    };
    dict.pop = function ( key ) {
        delete this.data[key];
    };
    dict.clear = function () {
        this.data = {};
    };
    return dict;
};

function List ( y ) {
    let list = {};
    list.isArray = function ( x ) {
        return getType( x ) == "array";
    };
    list.data = ( list.isArray( y ) ) ? y : [];
    list.len = function ( x ) {
        return ( x ) ? x.length : this.data.length;
    };
    list.index = function ( x ) {
        return this.data.indexOf( x );
    };
    list.append = function ( x ) {
        this.data.push(x);
    };
    list.extend = function ( x ) {
        if ( this.isArray( x ) ) {
            for ( i of x ) {
                this.append( i );
            };
        };
    };
    list.pop = function ( i ) {
        var z = [];
        for ( n of Range(this.len()) ) {
            if ( n != i ) {
                z.push(this.data[n]);
            };
        };
        this.data = z;
    };
    list.remove = function ( x ) {
        var i = this.index(x);
        if ( i != -1 ) {
            this.pop( i );
        };
    };
    list.get = function ( i, j ) {
        if ( i != undefined && j == undefined ) {
            if ( i < 0 ) {
                return this.data.slice(i);
            } else {
                return this.data[i];
            };
        } else if ( i != undefined && j != undefined ) {
            return this.data.slice( i, j );
        };
    };
    list.clear = function () {
        this.data = [];
    };
    return list;
};

function Http ( url ) {
    let http = {
        url: ( url ) ? url : "https://circuitalminds.github.io"
    };
    http.get = function ( path, g=print ) {
        $.getJSON(
            [url, path].join("/"),
            ( data ) => setTimeout( () => g(data), 2e2 )
        );
    };
    http.post = function ( path, q, g=print ) {
        $.post(
            [url, path].join("/"), q,
            ( data ) => setTimeout( () => g(data), 2e2 )
        );
    };
    return http;
};
/*
==================================================
    Built-Module and Include
==================================================
    Search-Register
==================================================
*/

function jklSearch () {
    var jkl = {};
    jkl.Data = [];
    jkl.setData = function ( data ) {
        this.Data.push( data );
        if ( !$( "body" )[0].onload ) {
            $( "body" )[0].onload = function () {
                jkl.getData()
            };
        };
    };
    jkl.getData = function () {
        for ( t of this.Data ) {
            t.searchInput = $( "#" + t.searchInput )[0];
            t.resultsContainer = $( "#" + t.resultsContainer )[0];
            SimpleJekyllSearch(t);
        };
    };
    return jkl;
};
let Jkl = jklSearch();
/*
==================================================
    Built-Timer
==================================================
*/
function Timer() {
    return {
        counter: {
            value: 0,
            next: function () { this.value += 1 },
            back: function () { this.value -= 1 },
            reset: function () { this.value = 0 }
        },
        init: function ( n, delay=1e3, new_counter=true ) {
            var log = console.log;
            var counter = this.counter;
            if ( new_counter ) {
                counter.reset();
            };
            log( "starting to count" )
            var interval = setInterval( function () {
                if ( counter.value < n ) {
                    counter.next();
                    log( "i="+counter.value );
                } else {
                    clearInterval( interval );
                    log( "count terminated" );
                };
            }, delay );
        },
        sleep: function ( t ) {
            var log = console.log;
            log( "start sleeping..." );
            this.init( t );
            setTimeout( function () { log( "wake up !!!" ) }, ( t + 1 ) * 1e3 );
        },
        clock: function () {
            var t = new Date();
            var tdata = {};
            tdata.full = t.toLocaleTimeString();
            [ ["Hours","hr"], ["Minutes", "min"], ["Seconds", "sec"] ].map(
                s => tdata[ s[1] ] = t[ "get" + s[0] ]()
            );
            return tdata;
        },
        date: function () {
            var d = new Date();
            return d.toLocaleDateString();
        }
    };
};

function Color () {
    var c = {};
    var y = {{ site.data.colors | jsonify }};
    c.get = function ( n ) {
        return y.byName[ n ];
    };
    c.palette = {
        "spectral": y.Palette.spectral,
        "default": y.Palette["default"]
    };
    c.random = function () {
        return "#" + getSample(
            "0123456789ABCDEF", 6
        ).join( "" );
    };
    return c;
};

function getColor ( name ) {
    return {{ site.data.colors | jsonify }}.byName[ name ];
};


function colorGrd ( y ) {
    var grd = "background-image: linear-gradient(60deg";
    var L = y.length;
    var di = Round( 100 / L );
    for ( var i = 0; i < L - 1; i++ ) {
        grd += ", " + y[i] + " " + (i + 1) * di + "%";
    };
    grd += ", " + y[L - 1] + " " + 100 + "%";
    return grd + "); background-size: cover;";
};
function getRandomColor () {
  	return "#" + getSample(
  	    "0123456789ABCDEF", 6
  	).join( "" );
};

/*
==================================================
    Plot-Figure
==================================================
*/
let IsoGraff = {};
IsoGraff.Data = {};
IsoGraff.Data.models = {};
IsoGraff.linearGrad = function ( name, grd ) {
    var C = Color.Get( name );
    var L = C.length;
    Range( 0, L ).map( i => grd.addColorStop( (i + 1) / L, C[i] ) );
};
IsoGraff.getData = function ( q, x ) {
    y = ( x ) ? x : this.Data;
    return y[q];
};
IsoGraff.getModel = function ( name, ID, args ) {
    var r = El.queryID( ID );
    r.innerHTML = "";
    r.append( this.Data.models[name]( args ) );
};

IsoGraff.Fig = function () {
    var B = El.Copy(this.Data.querySelector(".base"));
    B.setW = function ( w ) { this.width = w };
    B.setH = function ( h ) { this.height = h };
    B.Ctx = B.getContext("2d");
    B.Clear = function () { this.Ctx.clearRect(0, 0, this.width, this.height) };
    B.Plot = function ( x, y ) {
        this.Ctx.beginPath();
        this.Ctx.moveTo(x, this.height - y);
        for ( var i = 0; i < x.length; i++ ) {
            this.Ctx.lineTo(x[i], this.height - y[i]);
            this.Ctx.stroke();
        };
    };
    B.Grad = B.Ctx.createLinearGradient( 0, 0, B.width, B.height );
    this.linearGrad( "Spectral", B.Grad );
    B.fillSty = function ( data ) {
        var grad = ( data ) ? data : this.Grad;
        this.Ctx.fillStyle = grad;
        this.Ctx.fillRect( 0, 0, this.width, this.height );
    };
    B.strokeSty = function ( data ) {
        var grad = ( data ) ? data : this.Grad;
        this.Ctx.strokeStyle = grad;
    };
    B.strokeTxt = function ( data, x, y ) {
        this.Ctx.strokeText( data, x, y );
    };
    B.createImg = function () {
        var Img = new Object();
        Img.obj = this.Ctx.createImageData( this.width, this.height );
        Img.set = function ( i, n ) {
            this.obj.data[ i ] = n;
        };
        this.Img = Img;
    };
    B.Move = function ( x, y ) {
        this.Ctx.beginPath();
        this.Ctx.moveTo(x[0], x[1]);
        this.Ctx.lineTo(y[0], y[1]);
        this.Ctx.stroke();
    };
    return B;
};


function getType ( y ) {
    var name = typeof( y );
    if ( name == "object" ) {
        if ( y.length != undefined ) {
            return "array";
        } else { return name };
    } else { return name };
};

function print ( y ) {
    console.log(
        ( getType( y ) == "object" ) ? JSON.stringify( y ) : y
    );
};

function getDate () {
    var t = new Date();
    return {
        sec: t.getSeconds(),
        min: t.getMinutes(),
        hr: t.getHours()
    };
};

function Join ( y, pattern ) {
    return y.join( pattern );
};
function Replace ( y, w ) {
    if ( getType( w ) == "array" ) {
        w.map( wi => y=y.replaceAll( wi, "" ) );
        return y;
    } else {
        return y.replaceAll( w, "" );
    };
};
function Range ( start, stop, dy ) {
    if ( stop == undefined ) { stop = start; start = 0 };
    if ( dy == undefined ) { dy = 1 };
    var L = {
        length: ( stop - start - 1 ) / dy + 1
    };
    return Array.from( L, ( _, i ) => start + ( i * dy ) );
};
function Abs ( x ) {
    return Math.abs( x );
};
function Round ( x ) {
    return Math.round( x );
};
function Tf ( name ) {
    return Math[ name.toLowerCase() ];
};
function Ct ( name ) {
    return Math[ name.toUpperCase() ];
};
function Precision ( x, n ) {
    var xn = Tf( "trunc" )( x );
  	var yn = Tf( "trunc" )( ( xn - n ) * 10 ** n );
    return parseFloat( xn + "." + yn );
};
function Prod ( y ) {
    return y.reduce( function ( i, j ) { return i * j }, 1.0 );
};
function Sum ( y ) {
    return y.reduce( function ( i, j ) { return i + j }, 0.0 );
};
function Fact ( n ) {
    return Prod( Range(1, n + 1) );
};
function RandInt ( start, stop ) {
    var L = Abs( stop - start );
    var Xr = Round( Math.random() * L );
    return start + Xr;
};
function getSample ( y, size ) {
    if ( size > y.length) {
        size = y.length;
    };
    var ys = [];
    var yi = y[RandInt( 0, y.length - 1)];
    ys.push(yi);
    while ( ys.length < size ) {
        yi = y[RandInt( 0, y.length - 1)];
        if ( ys.indexOf(yi) == -1 ) {
            ys.push(yi);
        };
    };
    return ys;
};
function getKeys ( y ) {
    return Object.keys( y );
};
function getValues ( y ) {
    return Object.values( y );
};
function getItems ( y ) {
    return Object.entries( y );
};
function Dict ( y ) {
    let dict = {};
    dict.isDict = function ( x ) {
        return getType( x ) == "object";
    };
    dict.data = ( dict.isDict( y ) ) ? y : {};
    [
        ["keys", getKeys],
        ["values", getValues],
        ["items", getItems]
    ].map(
        v => dict[v[0]] = function ( x ) {
            var t = ( x ) ? x : this.data;
            return v[1]( t );
        }
    );
    dict.get = function ( q ) {
        return this.data[q];
    };
    dict.set = function ( k, v ) {
        this.data[k] = v;
    };
    dict.update = function ( x ) {
        if ( this.isDict( x ) ) {
            for ( v of this.items( x ) ) {
                this.set( v[0], v[1] );
            };
        };
    };
    dict.len = function ( x ) {
        return this.keys( x ).length;
    };
    dict.pop = function ( key ) {
        delete this.data[key];
    };
    dict.clear = function () {
        this.data = {};
    };
    return dict;
};
function List ( y ) {
    let list = {};
    list.isArray = function ( x ) {
        return getType( x ) == "array";
    };
    list.data = ( list.isArray( y ) ) ? y : [];
    list.len = function ( x ) {
        return ( x ) ? x.length : this.data.length;
    };
    list.index = function ( x ) {
        return this.data.indexOf( x );
    };
    list.append = function ( x ) {
        this.data.push(x);
    };
    list.extend = function ( x ) {
        if ( this.isArray( x ) ) {
            for ( i of x ) {
                this.append( i );
            };
        };
    };
    list.pop = function ( i ) {
        var z = [];
        for ( n of Range(this.len()) ) {
            if ( n != i ) {
                z.push(this.data[n]);
            };
        };
        this.data = z;
    };
    list.remove = function ( x ) {
        var i = this.index(x);
        if ( i != -1 ) {
            this.pop( i );
        };
    };
    list.get = function ( i, j ) {
        if ( i != undefined && j == undefined ) {
            if ( i < 0 ) {
                return this.data.slice(i);
            } else {
                return this.data[i];
            };
        } else if ( i != undefined && j != undefined ) {
            return this.data.slice( i, j );
        };
    };
    list.clear = function () {
        this.data = [];
    };
    return list;
};
function Merge ( x, y ) {
    if ( isType( x, "object" ) && isType( y, "object" ) ) {
        var xy = { ...x, ...y };
        return xy;
    } else if ( isType( x, "array" ) && isType( y, "array" ) ) {
        var xy = [ ...x, ...y ];
        return xy.sort();
    };
};
function getUrl ( host, path ) {
    return [
        host, ( getType(path) == "array" )
        ? path.join( "/" ) : path
    ].join( "/" );
};

function HttpRequest ( url ) {
    let Req = {};
    if ( url == undefined ) {
        Req.url = "https://circuitalminds.github.io";
    } else {
        Req.url = url;
    };
    Req.get = function ( path, handler=print ) {
        $.getJSON(
            getUrl( Req.url, path ),
            (data) => setTimeout( () => handler(data), 200 )
        );
    };
    Req.post = function ( path, req, handler=print ) {
        $.post(
            getUrl( Req.url, path ), req,
            (data) => setTimeout( () => handler(data), 200 )
        );
    };
    return Req;
};

function bodySize ( scale=1.0 ) {
    var y = document.body;
    return {
        w: Round( y.clientWidth * scale ) + "px",
        h: Round( y.clientHeight * scale ) + "px"
    };
};

let El = {};
El.queryID = function ( Id ) {
    var obj = $( "#" + Id )[0];
    this.setObject( obj );
    return obj;
};
El.queryCls = function ( Cls, all=false ) {
    var objs = $( "." + Cls );
    for ( var i = 0; i < objs.length; i++ ) {
        var obj = objs[i];
        this.setObject( obj );
        objs[i] = obj;
    };
    return ( all ) ? objs : objs[0];
};
El.queryTag = function ( Tag, all=false ) {
    var objs = $( Tag );
    for ( var i = 0; i < objs.length; i++ ) {
        var obj = objs[i];
        this.setObject( obj );
        objs[i] = obj;
    };
    return ( all ) ? objs : objs[0];
};
El.create = function ( name, content ) {
    var el = document.createElement( name );
    el.innerHTML = content;
    return el;
};
El.setObject = function ( obj ) {
    obj.getSize = function () {
        var S = this.getBoundingClientRect();
        return {"w": S.width, "h": S.height, x: S.x, y: S.y};
    };
    obj.setStyle = function ( key, value ) {
        this.style[key] = value;
    };
    obj.hide = function () {
        this.setStyle( "display", "none" );
    };
    obj.show = function () {
        this.setStyle( "display", "block" );
    };
    obj.copy = function () {
        return this.cloneNode(true);
    };
    obj.iterNodes = function ( cls, func ) {
        getValues(
            this.querySelector( cls ).childNodes
        ).map( func );
    };
    obj.iterAll = function ( cls, func ) {
        getValues(
            this.querySelectorAll( cls )
        ).map( func );
    };
    obj.addClass = function ( cls ) {
        this.addClass( cls );
    };
    obj.pos = function () {
        var P = this.getBoundingClientRect();
        return {x: [P.left, P.right], y: [P.bottom, P.top], w: P.width, h: P.height};
    };
    obj.setX = function ( x ) {
        var dx = this.Pos().w;
        this.style.left = x + "px";
        this.style.width = dx + "px";
    };
    obj.setY = function ( y ) {
        var dy = this.Pos().h;
        this.style.bottom = y + "px";
        this.style.height = dy + "px";
    };
    obj.setW = function ( w ) {
        this.style.width = w + "px";
    };
    obj.setH = function ( h ) {
        this.style.height = h + "px";
    };
};

getClock = function () {
    var clock = El.queryID( "clock-time" );
    setInterval( function () {
        var t = new Date();
        clock.innerHTML = t.toLocaleTimeString();
    }, 1e3);
};
getDateTime = function () {
    var d = new Date();
    El.queryID( "date-time" ).innerHTML = d.toLocaleDateString();
};
function getRequest ( url ) {
    var req = new XMLHttpRequest();
    req.open( "GET", url );
    req.send();
    req.onreadystatechange = function () {
        setTimeout( function () { console.log( req.responseText ) }, 200 );
    };
};


function iter ( x, g ) {
    var k, v;
    var w = {};
    for ( key of getKeys( x ) ) {
        k, v = g( key , x[key] );
        w[k] = v;
    };
    return w;
};

function filter ( x, g ) {
    var w = ( getType == "array" ) ? [] : {};
    for ( i of getKeys( x ) ) {
        if ( g( i, x[i] ) ) {
            w[i] = x[i];
        };
    };
    return w;
};


function All ( x ) {
    return x.reduce( ( xi, yi ) => xi + yi, 0 ) == x.length;
};
function Any ( x ) {
    return x.reduce( ( xi, yi ) => xi + yi, 0 ) != 0;
};


function setattr( x, k, v ) {
    if ( All([k, v].map( i => getType( i ) == "array" )) ) {
        Range( k.length ).map( i => x[k[i]] = v[i] );
    } else {
        x[k] = v
    };
};

function getattr( x, k ) {
    if ( getType( k ) == "array" ) {
        return k.map( ki => x[ki] );
    } else {
        return x[k];
    };
};

function Grid ( a, b, n ) {
    var dx = (b - a) / n;
    return Range(0, n + 1).map( i => a + i * dx );
};


console.log("ok")