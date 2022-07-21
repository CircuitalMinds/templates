let IsoGraff = $("#iso-graff")[0];

IsoGraff.setAttr = function ( Key, Value, X=IsoGraff ) { X.setAttribute( Key, Value ) };
IsoGraff.setStyle = function ( Key, Value, X=IsoGraff ) { X.style[Key] = Value };
IsoGraff.Data = {};

IsoGraff.Set = function ( Key, Value ) { this.Data[Key] = Value };
IsoGraff.Get = function ( Key ) { return this.Data[Key] };

IsoGraff.Set( "colors", {{ site.data.colors.byName | jsonify }} );
IsoGraff.Size = function ( X=IsoGraff ) {
    S = X.getClientRects()[0];
    return {"w": S.width, "h": S.height};
};

IsoGraff.Query = function ( w, q, X=IsoGraff ) {
    return X.querySelector({
        Id: "#",
        Tag: "",
        Cls: "."
    }[w] + q);
};

IsoGraff.Fig = function () {
    B = this.Query("Cls", "base");
    B.size = this.Size( this.Base );
    B.innerHTML = [
        "<canvas",
        'width="' + B.size.w + 'px"',
        'height="' + B.size.h + 'px"',
        'style="display: inline-block;"',
        "></canvas>"
    ].join(" ");
    B.obj = this.Query( "Tag", "canvas", B );
    B.ctx = B.obj.getContext("2d");
    B.clear = function () { this.ctx.clearRect(0, 0, this.size.w, this.size.h) };
    B.plot = function ( x, y ) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, this.size.h - y);
        for ( var i = 0; i < x.length; i++ ) {
            this.ctx.lineTo(x[i], this.size.h - y[i]);
            this.ctx.stroke();
        };
    };
    B.Grad = B.ctx.createLinearGradient( 0, 0, B.size.w, B.size.h );
    [[0.2, "darkMagenta"], [0.5, "darkRed"], [1, "lightAmber"]].map( c => B.Grad.addColorStop(c[0], this.Get("colors")[c[1]]) );
    B.fillSty = function () { this.ctx.fillStyle = this.Grad; this.ctx.fillRect(0, 0, this.size.w, this.size.h) };
    B.strokeSty = function () { this.ctx.strokeStyle = this.Grad };
    return B;
};

function Grad ( X ) {
    N = X.length;
    dn = Math.round(100 / N);
    LGrad = "background-image: linear-gradient(60deg";
    for ( var n = 0; n < N - 1; n++ ) {
        LGrad += ", " + X[n] + " " + n * dn + "%";
    };
    LGrad += ", " + X[N - 1] + " 100%); background-size: cover;";
    return LGrad;
};
