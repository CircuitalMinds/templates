function WordMatches ( word, target ) {
    matches = 0;
    for ( var i = 0; i < word.length; i++ ) {
        if ( word[i] == target[i] ) {
            matches += 1;
        } else {
            break;
        };
    };
    return matches;
};

function SearchFilter ( query, array_data ) {
    data = {};
    query_data = [];
    for ( var j = 0; j < query.length + 1; j++ ) {
        data[j] = [];
    };
    for ( element of array_data ) {
          data[WordMatches(query.toLowerCase(), element.toLowerCase())].push(element);
    };
    matches = Object.keys(data).sort().reverse();
    for ( m of matches ) {
        if ( data[m].length > 0 ) {
            for ( r of data[m] ) {
                query_data.push(r);
            };
        };                
    };
    return query_data;    
};



function Search_Template ( title, image ) {
	var strObj = '<li class="button card-content bg-darkTeal bg-dark-hover fg-light" '
	             + 'onclick=music_app.change_video_from(this.getElementsByClassName("label")[0].textContent) >'
				 + '<img class="avatar" src="' + image + '">'
				 + '<span class="label">'+ title +'</span>'
				 + '<span class="second-label"> 1 min </span>'
				 + '</li>';
	return strObj;
};

$('input')[0].addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   Search_List($('#search')[0].value);
  }
});

function Search_List ( q ) {
    image ="https://circuitalminds.github.io/static/images/desktop/julia.gif";
	if ( q != '' & q != undefined & q != null ) {
		query_result = '';
		q = q.toLowerCase()
		if ( music_app.video_list[q[0]] != undefined ) {			
			query_data = Object.keys(music_app.video_list[q[0]]);
			filter_data = queryFilter(query_data, q);
			if ( filter_data.length == 0 ) {				
				query_result += Search_Template('search not found', image);
			} else {			
				for ( title of filter_data ) {
					query_result += Search_Template(title, image);
				};
			};
		} else {
			query_result += Search_Template('search not found', image);
		};
		query_search = q;
    	$('#search-result')[0].setAttribute("class", "bg-darkTeal fg-white");    	
    	$('#search-result')[0].innerHTML = '<ul class="feed-list bg-darkTeal fg-light"><li class="title"> Search Result </li>' + query_result + '</ul>';
    	$('#search-result')[0].style['display'] = 'block';
   	} else if ( q == '' ) {   	
   		query_search = q;
   		$('#search-result')[0].setAttribute("class", "bg-white");
   		$('#search-result')[0].innerHTML = '';   		
   		$('#search-result')[0].style['display'] = 'none';
   	};
};

