
    var X = El.Copy(IsoGraff.Data.querySelector( ".models-sieve" ));
    var B = IsoGraff.Fig();
    var Dx = B.width / 10;
    B.setH(Dx + Dx * N / 10);
    var Pn = List( [2, 3, 5, 7] );
    Pn.isFactor = function ( x ) { return this.get(0, 4).filter( y => y % x != 0 ).length == 4 };
    B.strokeSty();
    B.Ctx.beginPath();
    B.Ctx.stroke();
    B.Ctx.font = "15px Arial";
    function setCrib ( Col, Row, n ) {
        if ( Pn.exists(n) ) {
            B.strokeTxt( n, Row * Dx + Dx / 4, Col * Dx + 3 * Dx / 4 );
        } else if ( Pn.isFactor(n) ) {
            B.strokeTxt( n, Row * Dx + Dx / 4, Col * Dx + 3 * Dx / 4 );
        };
    };
    var Cn = 1;
    for ( var i = 0; i < N / 10; i++ ) {
        for (var j = 0; j < 10; j++ ) {
            if ( Cn > 1 ) {
                setCrib( i, j, Cn );
            };
            B.Ctx.rect(j * Dx, i * Dx, Dx, Dx);
            Cn += 1;
        };
    };
    B.strokeSty();
    B.Ctx.stroke();
    X.querySelector( ".data-fig" ).append( B );
    return X;
}


function Fig ( x ) {
    x.setW = function ( w ) { this.width = w };
    x.setH = function ( h ) { this.height = h };
    x.ctx = x.getContext("2d");
    x.clear = function () { this.ctx.clearRect(0, 0, this.width, this.height) };
    x.plot = function ( q, p ) {
        this.ctx.beginPath();
        this.ctx.moveTo(q, this.height - p);
        for ( var i = 0; i < q.length; i++ ) {
            this.ctx.lineTo(q[i], this.height - p[i]);
            this.ctx.stroke();
        };
    };
    x.grad = x.ctx.createLinearGradient( 0, 0, x.width, x.height );
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
    x.move = function ( q, p ) {
        this.ctx.beginPath();
        this.ctx.moveTo(q[0], p[1]);
        this.ctx.lineTo(q[0], p[1]);
        this.ctx.stroke();
    };
    return B;
};
function ( N ) {
    var X = El.Copy(IsoGraff.Data.querySelector( ".models-sieve" ));
    var B = IsoGraff.Fig();
    var Dx = B.width / 10;
    B.setH(Dx + Dx * N / 10);
    var Pn = List( [2, 3, 5, 7] );
    Pn.isFactor = function ( x ) { return this.get(0, 4).filter( y => y % x != 0 ).length == 4 };
    B.strokeSty();
    B.Ctx.beginPath();
    B.Ctx.stroke();
    B.Ctx.font = "15px Arial";
    function setCrib ( Col, Row, n ) {
        if ( Pn.exists(n) ) {
            B.strokeTxt( n, Row * Dx + Dx / 4, Col * Dx + 3 * Dx / 4 );
        } else if ( Pn.isFactor(n) ) {
            B.strokeTxt( n, Row * Dx + Dx / 4, Col * Dx + 3 * Dx / 4 );
        };
    };
    var Cn = 1;
    for ( var i = 0; i < N / 10; i++ ) {
        for (var j = 0; j < 10; j++ ) {
            if ( Cn > 1 ) {
                setCrib( i, j, Cn );
            };
            B.Ctx.rect(j * Dx, i * Dx, Dx, Dx);
            Cn += 1;
        };
    };
    B.strokeSty();
    B.Ctx.stroke();
    X.querySelector( ".data-fig" ).append( B );
    return X;
}