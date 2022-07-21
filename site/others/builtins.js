function Print ( y ) {
    console.log( JSON.stringify( y ) );
};

function isType ( x, name ) {
    var Type = typeof(x);
    return {
        "function": Type == "function",
        "object": Type == "object" && x.length == undefined,
        "array": x.length != undefined,
        "number": Type == "number",
        "string": Type == "string"
    }[name];
};
function Keys ( x ) {
    return Object.keys( x );
};
function Values ( x ) {
    return Object.values( x );
};
function Items ( x ) {
    return Object.entries( x );
};
function MapKeys ( x, f ) {
    return Keys( x ).map( f );
};
function MapValues ( x, f ) {
    return Values( x ).map( f );
};
function MapItems ( x, f ) {
    return Items( x ).map( f );
};
function MapList ( x, f ) {
    return x.map( f );
};
function FilterList ( x, f ) {
    return x.filter( f );
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
function getDate () {
    var y = new Date();
    return {
        sec: y.getSeconds(),
        min: y.getMinutes(),
        hr: y.getHours()
    };
};




function Range ( a, b, ds=1 ) {
    return Array.from(
    	  {length: (b - a - 1) / ds + 1}, (_, i) => a + (i * ds)
    );
};

let Sample = {};
Sample.Int = function ( a, b ) {
    return a + Math.round( Math.random() * Math.abs(b - a) );
};
Sample.List = function ( a, b, n ) {
    var ds = ( n != undefined ) ? n : Math.abs( b - a );
    var x = [];
    var xi = this.Int(a, b);
    x.push(xi);
    while ( x.length < ds ) {
        xi = this.Int(a, b);
        if ( x.indexOf(xi) == -1 ) {
            x.push(xi);
        };
    };
    return x;
};
Sample.dataSet = function ( x, n ) {
    return MapList(
        this.List( 0, x.length - 1, ( n ) ? n : x.length ), function ( i ) { return x[i] }
    );
};

function List ( data ) {
    let list = {
        data: []
    };
    if ( data != undefined ) {
        MapList( data, function ( xi ) { list.data.push( xi ) } );
    };
    list.len = function () { return this.data.length };
    list.index = function ( x ) {
        if ( this.exists( x ) ) {
            return this.data.indexOf( x );
        };
    };
    list.append = function ( x ) { this.data.push(x) };
    list.extend = function ( x ) { MapList( x, function ( xi ) { list.data.push( xi ) } ) };
    list.isIndex = function ( i ) { return i in this.data };
    list.exists = function ( x ) { return this.data.indexOf(x) != -1 };
    list.pop = function ( i ) {
        if ( this.isIndex(i) ) {
            var yi = this.data[i];
            this.data = FilterList( this.data, function ( y ) { return y != yi } );
        };
    };
    list.remove = function ( x ) {
        if ( this.exists( x ) ) {
            var yi = this.data[this.index(x)];
            this.data = FilterList( this.data, function ( y ) { return y != yi } );
        };
    };
    list.get = function ( i, j ) {
        if ( i == -1 ) {
            return this.data[this.len() - 1];
        } else if ( j != undefined ) {
            return Range(i, j).filter(
                n => this.isIndex(n)
            ).map( m => this.data[m] );
        } else {
            return this.data[i];
        };
    };
    return list;
};
function Dict ( data ) {
    let dict = {};
    if ( data != undefined ) {
        dict.data = data;
    } else {
        dict.data = {};
    };
    dict.isDict = function ( x ) {
        return isType( x, "object" );
    };
    dict.exists = function ( x ) {
        return x in this.data;
    };
    dict.isEqual = function ( x ) {
        if ( this.isDict( x ) ) {
            if ( Keys( x ).length != this.len() ) {
                return false;
            } else {
                for ( i of this.items() ) {
                    if ( x[i[0]] == undefined || x[i[0]] != i[1] ) {
                        return false;
                    };
                };
            };
            return true;
        };
    };
    dict.keys = function () {
        return Keys( this.data );
    };
    dict.values = function () {
        return Values( this.data );
    };
    dict.get = function ( key ) {
        return this.data[key];
    };
    dict.update = function ( x ) {
        if ( this.isDict( x ) ) {
            MapKeys( x, function ( k ) { dict.data[k] = x[k] } );
        };
    };
    dict.len = function () {
        return Keys( this.data ).length;
    };
    dict.items = function () {
        return Items( this.data );
    };
    dict.pop = function ( key ) {
        delete this.data[key];
    };
    return dict;
};

let Str = {};
Str.join = function ( x, pattern="\n" ) {
    return x.join( pattern );
};
Str.replace = function ( x, data ) {
    if ( isType( data, "array" ) ) {
        MapList(
            data, function( s ) { x = x.replace( s, "" ) }
        );
        return x;
    } else {
        return x.replace( data, "" );
    };
};


