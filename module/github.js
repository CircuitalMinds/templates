let GitHub = new Object();
GitHub.Url = "https://github.com";
GitHub.apiUrl = "https://api.github.com";
GitHub.User = "";
GitHub.userData = {};

GitHub.setUser = function ( user ) {
    isUser = [
        "alanmatzumiya", "CircuitalMinds", "circuitalmynds"
    ].indexOf(user) != -1;
    if ( isUser ) {
        this.User = user;
        this.userData.url_users = [this.apiUrl, "users", user, "repos"].join("/");
        this.userData.url_repos = [this.apiUrl, "repos", user].join("/");
        this.userData.info = Object();
        this.userData.repos = Object();
        this.userData.getInfo = function () {
            if ( Object.keys(this.info).length > 0 ) {
                return this.info;
            } else {
                $.getJSON(this.url_users, function( data ) {
                    setTimeout(
                        function () {
                            for ( repo of data ) {
                                GitHub.userData.info[repo.name] = {};
                                GitHub.userData.repos[repo.name] = [];
                                for ( key in repo ) {
                                    if ( key != "name" ) {
                                        GitHub.userData.info[repo.name][key] = repo[key];
                                    };
                                };
                            };
                    }, 1000);
                });
            };
        };
        this.userData.getInfo();
        this.userData.getRepoContents = function ( name, path ) {
            isRepo = this.repos[name] != undefined;
            if ( isRepo ) {
                repoData = this.repos[name].filter( x => x.path == path )[0]
                if ( repoData == undefined ) {
                    urlData = [this.url_repos, name, "contents"].join("/");
                    if ( path != undefined ) {
                        urlData.concat( "/", path );
                    };
                    $.getJSON(urlData, function( data ) {
                        setTimeout(
                            function () {
                                for ( v of data ) {
                                	GitHub.userData.repos[name].push(v);
                                };
                                console.log(GitHub.userData.repos[name]);
                        }, 1000);
                    });
                } else {
                    return repoData;
                };
            };
        };
        return "success";
    } else {
        return "failed";
    };
};

GitHub.getPage = function ( Path ) {
    window.location = [this.Url, Path].join("/");
};

GitHub.createRepo = function ( Name ) {
    if ( document.URL == [this.Url, "new"].join("/") ) {
        createBtn = document.querySelector('button.btn-primary');
        createBtn.disabled = false;
        ["name", "description"].map( e => document.getElementById("repository_" + e).value = Name );
        ["visibility_public", "auto_init"].map( e => document.getElementById("repository_" + e).checked = "checked" );
    } else {
        this.getPage("new");
    };
};

GitHub.setUser( "CircuitalMinds" );
