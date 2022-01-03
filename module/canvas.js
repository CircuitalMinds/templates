let canvasObj = new Object();
canvasObj.gradientColors = {
    Default: [
        {stop: 0.1, name: "sienna"},
        {stop: 0.5, name: "crimson"},
        {stop: 0.7, name: "indianred"},
        {stop: 1, name: "royalblue"}
    ]
};
canvasObj.setGradient = function ( contextObj, L=[300, 0, 0, 100] ) {
    var grad = contextObj.createLinearGradient(L[0], L[1], L[2], L[3]);
    this.gradientColors.Default.map(
        color => grad.addColorStop(color.stop, color.name)
    );
    return grad;
};
canvasObj.setModel = function ( Obj ) {
    Obj.innerHTML = `
        <canvas width="${Obj.clientWidth}" height="${Obj.clientWidth}"
                style="display: inline-block; max-width: 100%; max-height: 100%;">
        </canvas>`;
    modelObj = Obj.querySelector("canvas");
    modelObj.context = modelObj.getContext("2d");
    return modelObj;
};
canvasObj.Models = {
    sieveCrib: function ( N, Id="sieveCrib" ) {
            viewObj = $("#" + Id)[0];
            $("#" + Id + "-n")[0].innerHTML = N;
            obj = canvasObj.setModel( viewObj );
            Dx = obj.width / 10;
            obj.height = Dx + Dx * N / 10;
            primeNumbers = [];
            Prod = 1.0;
            setGenerator = [2, 3, 5, 7];
            gradient = canvasObj.setGradient( obj.context );
            obj.context.strokeStyle = gradient;
            obj.context.beginPath();
            obj.context.stroke();
            obj.context.font = "15px Arial";
            function setCrib ( Col, Row, n ) {
                if ( setGenerator.indexOf(n) != -1 ) {
                    primeNumbers.push( 1.0 / (1.0 - n ** -2) );
                    obj.context.strokeText(n, Row * Dx + Dx / 4, Col * Dx + 3 * Dx / 4);
                } else if ( setGenerator.filter( x => n % x != 0 ).length == 4 ) {
                    primeNumbers.push( 1.0 / (1.0 - n ** -2) );
                    obj.context.strokeText(n, Row * Dx + Dx / 4, Col * Dx + 3 * Dx / 4);
                };
            };
            Cn = 1;
            for ( var i = 0; i < N / 10; i++ ) {
                for (var j = 0; j < 10; j++ ) {
                    if ( Cn > 1 ) {
                        setCrib( i, j, Cn );
                    };
                    obj.context.rect(j * Dx, i * Dx, Dx, Dx);
                    Cn += 1;
                };
            };
            gradient = canvasObj.setGradient( obj.context );
            obj.context.strokeStyle = gradient;
            obj.context.stroke();
            $("#" + Id + "-Cn")[0].innerHTML = primeNumbers.length;
            primeNumbers.map( x => Prod *= x );
            $("#" + Id + "-Pi")[0].innerHTML = Math.sqrt( 6.0 * Prod );
    },
    Cantor: function ( N, Id="Cantor" ) {
        viewObj = $("#" + Id)[0];
        $("#" + Id + "-N")[0].innerHTML = N;
        obj = canvasObj.setModel( viewObj );
        x = 10;
        y = 10;
        l = obj.width - 20;
        n = l * (1 / 3) ** N;
        animate(x, y, l, n);
        function animate (x, y, l, n) {
            if ( l >= n ) {
                gradient = canvasObj.setGradient( obj.context );
                obj.context.strokeStyle = gradient;
                obj.context.beginPath();
                obj.context.moveTo(x, y);
                obj.context.lineTo(x + l, y);
                obj.context.lineWidth = 5;
                obj.context.stroke();
                y += 20;
                animate(x, y, l / 3, n);
                animate(x + l * 2 / 3, y, l / 3, n);
            };
        };
    },
    LorenzAttractor: function ( Id="LorenzAttractor" ) {
        var x, y, z;
        h = 0.01;
        cx = 250;
        cy = 330;
        scale = 15;
        N = 8192;
        viewObj = $("#" + Id)[0];
        obj = canvasObj.setModel( viewObj );
        a = parseFloat( $("#" + Id + "-a")[0].value );
        b = parseFloat( $("#" + Id + "-b")[0].value );
        c = parseFloat( $("#" + Id + "-c")[0].value );
        x0 = parseFloat( $("#" + Id + "-x0")[0].value );
        y0 = parseFloat( $("#" + Id + "-y0")[0].value );
        z0 = parseFloat( $("#" + Id + "-z0")[0].value );
        $("#" + Id + "-out-a")[0].innerHTML = a;
        $("#" + Id + "-out-b")[0].innerHTML = b;
        $("#" + Id + "-out-c")[0].innerHTML = c;
        $("#" + Id + "-out-x0")[0].innerHTML = x0;
        $("#" + Id + "-out-y0")[0].innerHTML = y0;
        $("#" + Id + "-out-z0")[0].innerHTML = z0;
        var i = 0;
        var interval = setInterval(function () {
            if (i < N) {
                x = x0 + h * a * (x0 - y0);
                y = y0 + h * (-x0 * z0 + b * x0 - y0);
                z = z0 + h * (x0 * y0 - z0);
                obj.context.strokeStyle = "hsl(" + Math.abs(x) * 10 + "," + Math.abs(y) * 10 + "%," + Math.abs(z) * 2 + "%)";
                obj.context.beginPath();
                obj.context.moveTo(cx + x0 * scale, cy + y0 * scale);
                obj.context.lineTo(cx + x * scale, cy + y * scale);
                obj.context.stroke();
                x0 = x;
                y0 = y;
                z0 = z;
                i += 1;
            } else {
                clearInterval(interval);
            }
        });
    },
    Sierpinski: function ( Id="Sierpinski" ) {
        steps = parseInt( $("#" + Id + "-sn")[0].value );
        $("#" + Id + "-out-sn")[0].innerHTML = steps;
        viewObj = $("#" + Id)[0];
        obj = canvasObj.setModel( viewObj );
        Triangle = new init();
        function init() {
            this.w = obj.width;
            this.h = Math.sqrt(3) / 2 * this.w;
            this.maxDepth = 10;
        };
        init.prototype.drawSierpinskiTriangle = function( steps ) {
            obj.context.clearRect(0, 0, this.w, this.h);
            var x0 = 0, y0 = this.h - 1;
            var x1 = this.w, y1 = this.h - 1;
            var x2 = this.w/2, y2 = 0;
            gradBefore = canvasObj.setGradient( obj.context );
            obj.context.fillStyle = gradBefore;
            this.drawTriangle(x0, y0, x1, y1, x2, y2);
            gradAfter = canvasObj.setGradient( obj.context, [100, 0, 0, 300] );
            obj.context.fillStyle = gradAfter;
            this.removeCenterTriangle(x0, y0, x1, y1, x2, y2, steps);
        };
        init.prototype.drawTriangle = function(x0, y0, x1, y1, x2, y2) {
            obj.context.beginPath();
            obj.context.moveTo(x0, y0);
            obj.context.lineTo(x1, y1);
            obj.context.lineTo(x2, y2);
            obj.context.lineTo(x0, y0);
            obj.context.fill();
        };
        init.prototype.removeCenterTriangle = function(x0, y0, x1, y1, x2, y2, steps) {
            if (steps > 0) {
                var x01 = (x0 + x1)/2, y01 = (y0 + y1)/2;
                var x02 = (x0 + x2)/2, y02 = (y0 + y2)/2;
                var x12 = (x1 + x2)/2, y12 = (y1 + y2)/2;
                this.drawTriangle(x01, y01, x02, y02, x12, y12);
                if (steps > 1) {
                    this.removeCenterTriangle(x0, y0, x01, y01, x02, y02, steps - 1);
                    this.removeCenterTriangle(x01, y01, x1, y1, x12, y12, steps - 1);
                    this.removeCenterTriangle(x02, y02, x12, y12, x2, y2, steps - 1);
                };
            };
        };
        Triangle.drawSierpinskiTriangle(steps);
    },
    Pixels: function ( Id="Pixels" ) {
        viewObj = $("#" + Id)[0];
        obj = canvasObj.setModel( viewObj );
        imageObj = obj.context.createImageData(obj.width, obj.height);
        init(0);
        function startFrame( n ) {
            for ( var i = 0; i < obj.width; i++ ) {
                for ( var j = 0; j < obj.height; j++ ) {
                    Index = (j * obj.width + i) * 4;
                    r = ( (i + n) % 256 ) ^ ( (j + n) % 256 );
                    g = ( (2 * i + n) % 256 ) ^ ( (2 * j + n) % 256 );
                    b = 50 + Math.floor( Math.random() * 100 );
                    b = (b + n) % 256;
                    imageObj.data[Index] = r;
                    imageObj.data[Index + 1] = g;
                    imageObj.data[Index + 2] = b;
                    imageObj.data[Index + 3] = 255;
                };
            };
        };
        function init( t ) {
            window.requestAnimationFrame( init );
            startFrame( Math.floor( t / 10 ) );
            obj.context.putImageData(imageObj, 0, 0);
        };
    },
    Mandelbrot: function ( Id="Mandelbrot" ) {
        viewObj = $("#" + Id)[0];
        obj = canvasObj.setModel( viewObj );
        imageObj = obj.context.createImageData(obj.width, obj.height);
        Lx = - obj.width / 2;
        Ly = - obj.height / 2;
        xp = parseInt( $("#" + Id + "-xp")[0].value );
        yp = parseInt( $("#" + Id + "-yp")[0].value );
        zoom = parseInt( $("#" + Id + "-zoom")[0].value );
        $("#" + Id + "-out-xp")[0].innerHTML = xp;
        $("#" + Id + "-out-yp")[0].innerHTML = yp;
        $("#" + Id + "-out-zoom")[0].innerHTML = zoom;
        Palette = [];
        maxIterations = 250;
        obj.addEventListener("mousedown", onMouseDown);
        setPalette();
        setImage();
        init(0);
        function init( t ) {
            window.requestAnimationFrame( init );
            obj.context.putImageData(imageObj, 0, 0);
        };
        function setPalette() {
            r = parseFloat( $("#" + Id + "-r")[0].value );
            g = parseFloat( $("#" + Id + "-g")[0].value );
            b = parseFloat( $("#" + Id + "-b")[0].value );
            $("#" + Id + "-out-r")[0].innerHTML = r;
            $("#" + Id + "-out-g")[0].innerHTML = g;
            $("#" + Id + "-out-b")[0].innerHTML = b;
            for ( var i = 0; i < 256; i++ ) {
                Palette[i] = { r: r, g: g, b: b };
                if ( i < 256 ) {
                    r += 3;
                } else if ( i < 195 ) {
                    g += 3;
                } else if ( i < 182 ) {
                    b += 3;
                };
            };
        };
        function setImage() {
            for ( var i = 0; i < obj.height; i++ ) {
                for ( var j = 0; j < obj.width; j++ ) {
                    Iterate(j, i);
                };
            };
        };
        function Iterate(x, y) {
            x0 = (x + Lx + xp) / zoom;
            y0 = (y + Ly + yp) / zoom;
            a = 0;
            b = 0;
            rx = 0;
            ry = 0;
            iterations = 0;
            while (iterations < maxIterations && (rx * rx + ry * ry <= 4)) {
                rx = a * a - b * b + x0;
                ry = 2 * a * b + y0;
                a = rx;
                b = ry;
                iterations++;
            };
            var color;
            if (iterations == maxIterations) {
                color = { r: 0, g: 0, b: 0 };
            } else {
                n = Math.floor( ( iterations / (maxIterations - 1) ) * 255 );
                color = Palette[n];
            };
            Index = (y * obj.width + x) * 4;
            imageObj.data[Index] = color.r;
            imageObj.data[Index + 1] = color.g;
            imageObj.data[Index + 2] = color.b;
            imageObj.data[Index + 3] = 255;
        };
        function zoomFractal(x, y, factor, zoomIn) {
            if (zoomIn) {
                zoom *= factor;
                xp = factor * (x + Lx + xp);
                yp = factor * (y + Ly + yp);
            } else {
                zoom /= factor;
                xp = (x + Lx + xp) / factor;
                yp = (y + Ly + yp) / factor;
            };
        };
        function onMouseDown( e ) {
            Position = getPosition( obj, e );
            zoomIn = true;
            if ( e.ctrlKey ) {
                zoomIn = false;
            };
            zoomFactor = 2;
            if (e.shiftKey) {
                zoomFactor = 1;
            };
            zoomFractal(pos.x, pos.y, zoomFactor, zoomIn);
            setImage();
        };
        function getPosition( obj, e ) {
            rect = obj.getBoundingClientRect();
            return {
                x: Math.round( (e.clientX - rect.left) / (rect.right - rect.left) * obj.width ),
                y: Math.round( (e.clientY - rect.top) / (rect.bottom - rect.top) * obj.height )
            };
        };
    }
};