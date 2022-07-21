function Vn ( x ) {
    let Vx = {};
    Vx.isVector = function ( y ) {
        return getType( y ) == "array";
    };
    Vx.isNumber = function ( y ) {
        return getType( y ) == "number";
    };
    Vx.data = ( Vx.isVector( x ) ) ? x : [];
    Vx.len = function ( y ) {
        if ( this.isVector(y) ) {
            return y.length;
        } else {
            return this.data.length;
        };
    };
    Vx.append = function ( y ) {
        if ( this.isNumber(y) ) {
            this.data.push( y );
        };
    };
    Vx.extend = function ( y ) {
        if ( this.isVector(y) ) {
            for ( yi of y ) {
                this.append( yi );
            };
        };
    };
    Vx.clear = function () {
        this.data = [];
    };
    Vx.sum = function ( y ) {
        var yn = [];
        if ( this.isNumber(y) ) {
            for ( var i = 0; i < this.len(); i++ ) {
                yn.push(this.data[i] + y);
            };
        } else if ( this.isVector(y) ) {
            for ( var i = 0; i < this.len(); i++ ) {
                yn.push(this.data[i] + y[i]);
            };
        };
        return yn;
    };
    Vx.prod = function ( y ) {
        var yn = [];
        if ( this.isNumber(y) ) {
            for ( var i = 0; i < this.len(); i++ ) {
                yn.push(this.data[i] * y);
            };
        } else if ( this.isVector(y) ) {
            for ( var i = 0; i < this.len(); i++ ) {
                yn.push(this.data[i] * y[i]);
            };
        };
        return yn;
    };
    Vx.zeros = function ( n ) {
        return Range(0, n).map( i => 0.0 );
    };
    Vx.grid = function ( a, b, n ) {
        var dx = (b - a) / n;
        return Range(0, n + 1).map( i => a + i * dx );
    };
    Vx.dot = function ( y ) {
        return this.prod( y ).reduce( ( xi, yi ) => xi + yi );
    };
    Vx.norm = function () {
        return Fw.get( "sqrt" )(
            Fw.get( "abs" )( this.dot(this.data) )
        );
    };
    Vx.unitary = function () {
        return this.prod( 1.0 / this.norm() );
    };
    Vx.eval = function ( f ) {
        if ( getType(f) == "function" ) {
            return this.data.map( xi => f( xi ) );
        };
    };
    return Vx;
};

function Integral ( f, a, b, n ) {
    var dx = ( b - a ) / n;
    var In = ( f(a) + f(b) ) * 0.5 * dx;
    Range( 1, n ).map( i => In += f( a + i * dx ) * dx );
    return In;
};

let Color = {};
Color.Data = {{ site.data.colors | jsonify }};
Color.Get = function ( name ) {
    return this.Data[name];
};
Color.Random = function ( n=1 ) {
  	var data = [];
  	var Gen = "0123456789ABCDEF";
  	var c = "#";
	for ( var i = 0; i < n; i ++ ) {
  		for ( var j = 0; j < 6; j++ ) {
      		c += Gen[Sample.Int( 0, Gen.length - 1 )];
      	};
      	data.push( c );
      	c = "#";
    };
    return ( n == 1 ) ? data[0] : data;
};
Color.Grad = function ( Data ) {
    var grd = "background-image: linear-gradient(60deg";
    var Len = Data.length;
    var dn = Math.round( 100 / Len );
    function iterColor ( c, l ) { grd += ", " + c + " " + l + "%" };
    for ( var n = 0; n < Len - 1; n++ ) { iterColor( Data[n], (n + 1) * dn ) };
    iterColor( Data[Len - 1], 100 );
    return grd + "); background-size: cover;";
};

let IsoGraff = new Object();
IsoGraff.Data = El.Query("Id", "isograff-data");
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
    var r = El.Query( "Id", ID );
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