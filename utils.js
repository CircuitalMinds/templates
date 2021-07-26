function add_listener ( ) {
    var doc = document;
    for ( n in doc ) {
      if ( typeof( doc[n] ) == 'object' ) {
        doc[n].addEventListener("mousedown", console.log);    
    };
  };
};


function select_object( tag, attr='', value='' ) { 
    if ( attr == '' ) {
        return document.querySelectorAll(tag);
    } else if ( value == '' ) {
        return document.querySelectorAll(
            tag + "[" + attr + "]"
        );
    } else {
        return document.querySelector(
            tag + "[" + attr + "='" + value + "']"
        );
    }
}
function object_size ( obj ) {
    return [
      obj.clientWidth, obj.clientHeight
    ];
};

function object_resize ( obj, w, h ) {
    obj.style.width = w + 'px';
    obj.style.height = h + 'px';
}

function object_boundary ( obj ) {
    var rect = obj.getBoundingClientRect();
    return {
      top: rect.top,  bottom: rect.bottom,
      left: rect.left, right: rect.right
    };
};


function get_location () {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function success ( data ) {
        var loc = data.coordinates;
        return {
            "latitude": loc.latitude,
            "Longitude": loc.longitude,
            "accuracy": loc.accuracy
        };
    };
    function error ( data ) {
        console.warn('ERROR(' + data.code + '): ' + data.message);
    };
    navigator.geolocation.getCurrentPosition( success, error, options );
}

function parseHTML( string_data, tag='' ) {
    var parsed_data = document.createElement('template');
    parsed_data.innerHTML = string_data;
    if ( tag != '' ) {
        return parsed_data.content.querySelectorAll(tag);
    } else {
        return parsed_data.content;
    }
};

function get_server_data (url, response_data={}) {  
    filetype = url.split('/').reverse()[0].split('.')[1];
    $.ajax({
        type: 'GET',
        url: url,
        success: function( request_data ) {
            if ( filetype == 'json' ) {
                for ( key in request_data ) {
                    response_data[key] = request_data[key];
                }
            } else {
                response_data.data = request_data;
            }
        }
    });
    return response_data;
};

