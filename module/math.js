function floatPrecision ( x, n ) {
    xInt = Math.trunc(x);
  	xDec = Math.trunc( (x - xInt) * 10 ** n );
    return parseFloat( xInt + "." + xDec );
};

function Range (start, stop, step=1) {
    return Array.from(
    	  {length: (stop - start - 1) / step + 1}, (_, i) => start + (i * step)
    );
};

function randomInt ( a, b ) {
    return a + Math.round(
        Math.random() * (b - a)
    );
};

function randomArray ( a, b, n ) {
    A = [];
    while ( A.length < n ) {
        ei = randomInt(a, b);
        if ( A.indexOf(ei) == -1 ) {
            A.push(ei);
        };
    };
    return A;
};

function Factorial ( n ) {
    return Range(1, n + 1).reduce( function (x, y) { return x * y }, 1 );
};

function mathFunction ( name ) {
    Func = Math[name.toLowerCase()];
    if ( Func != undefined ) {
        return Func;
    } else {
        return "function " + name + " not found";
    };
};

function mathConstant ( name ) {
    Constant = Math[name.toUpperCase()];
    if ( Constant != undefined ) {
        return Constant;
    } else {
        return "constant " + name + " not found";
    };
};

let Vector = new Object();
Vector.isVector = function ( u ) {
    return u.length != undefined;
};
Vector.isCallable = function ( f ) {
    return typeof(f) == "function";
};
Vector.Zeros = function ( n ) {
    return Range(0, n).map( i => 0.0 );
};
Vector.Grid = function ( a, b, n ) {
    dx = (b - a) / n;
    return Range(0, n + 1).map( i => a + i * dx );
};
Vector.Prod = function ( u, v ) {
    if ( this.isVector(u) == false && this.isVector(v) == false ) {
        return u * v;
    } else if ( this.isVector(u) && this.isVector(v) == false ) {
        return Range(0 , u.length).map( i => u[i] * v );
    } else if ( this.isVector(u) == false && this.isVector(v) ) {
        return Range(0 , v.length).map( i => u * v[i] );
    } else if ( this.isVector(u) && this.isVector(v) ) {
        if ( u.length == v.length ) {
            return Range(0 , u.length).map( i => u[i] * v[i] );
        };
    };
};
Vector.Sum = function ( u, v ) {
    if ( this.isVector(u) == false && this.isVector(v) == false ) {
        return u + v;
    } else if ( this.isVector(u) && this.isVector(v) == false ) {
        return Range(0 , u.length).map( i => u[i] + v );
    } else if ( this.isVector(u) == false && this.isVector(v) ) {
        return Range(0 , v.length).map( i => u + v[i] );
    } else if ( this.isVector(u) && this.isVector(v) ) {
        if ( u.length == v.length ) {
            return Range(0 , u.length).map( i => u[i] + v[i] );
        };
    };
};
Vector.Dot = function ( u, v ) {
    if ( this.isVector(u) && this.isVector(v) ) {
        return this.Prod(u, v).reduce(
            ( x, y ) => x + y
        );
    };
};
Vector.Norm = function ( u ) {
    if ( this.isVector(u) ) {
        return Math.sqrt(Math.abs( this.Dot(u, u) ));
    };
};
Vector.Unitary = function ( u ) {
    if ( this.isVector(u) ) {
        return this.Prod( 1.0 / this.Norm(u), u );
    };
};
Vector.Eval = function ( F, u ) {
    if ( this.isCallable(F) && this.isVector(u) ) {
        return u.map( x => F(x) );
    };
};