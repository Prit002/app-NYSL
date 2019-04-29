const app = new Vue({
    el: '#app',
    data: {

        object: [],
        games: [],
        teams: [],
        locations: [],
        teamNames: [],
        locationNames: [],
        teamsValue: "select",
        locationValue: "select",
        filterArray: [],
        collapsibleItems: [],
        landingPage: [],
        currentPage: 0,
        loggedIn: false,
        messages: {},
        currentUser: '',


    },
    created() {
        this.getData();
    },


    methods: {
        getData() {

    

            fetch("https://api.myjson.com/bins/18hykw", {

                    method: "GET",
                })

                .then(function (response) {
                    return response.json();
                }).then(function (json) {
                    
                    app.object = json;
                    app.games = json.games;
                    app.teams = json.teams;
                    app.locations = json.locations;
                    app.filterArray = app.games;

                    app.filterTeam();
                    app.filterLocation();
                    app.landingPage = 0
                    var displayMessage = document.getElementById("displayMessage");

                

                }).catch(function (error) {
                    console.log(error)
                })


        },

        filterTeam: function () {
            var teamNames = [];
            var teams = app.teams;

            for (var property in teams) {
                teamNames.push(teams[property].teamName);
            }
            
            app.teamNames = teamNames
        },

        filterLocation: function () {
            var locationNames = [];
            var location = app.locations;

            for (var key in location) {
                locationNames.push(location[key].locationName);
            }
        
            app.locationNames = locationNames;
        },

        filterData: function () {
            app.filterArray = [];
            for (var i = 0; i < app.games.length; i++) {

                if (app.games[i].team == app.teamsValue || app.games[i].opposingTeam == app.teamsValue || app.teamsValue == "select") {

                    if (app.games[i].location == app.locationValue || app.locationValue == "select") {
                        app.filterArray.push(app.games[i]);
                    }
                }

            }
        },
        changePage: function (pageNumber) {

            app.currentPage = pageNumber;
            if (app.currentPage == 3) {
                app.checkUser();
            }
        },

        login: function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then(function () {
            
                    app.loggedIn = true;
                    app.getPosts();
                })

        },

        logout: function () {
            firebase.auth().signOut();
            app.loggedIn = false;
        },
        writeNewPost: function (chat) {
            // https://firebase.google.com/docs/database/web/read-and-write

            // Values
            var text = document.getElementById("textInput").value;
            var splitTheName = firebase.auth().currentUser.displayName.split(' ');
            var userName = splitTheName[0];
            var picture = firebase.auth().currentUser.photoURL;
            var mail = firebase.auth().currentUser.email;

            // A post entry

            var post = {
                name: userName,
                body: text,
                image: picture,
                email: mail,
            };

            // Get a key for a new Post.
            var newPostKey = firebase.database().ref().child('chat').push().key;

            //Write data
            var updates = {};
            updates[newPostKey] = post;
            document.getElementById("textInput").value = "";
            return firebase.database().ref('chat').update(updates);

        },
        getPosts: function () {
            app.currentUser = firebase.auth().currentUser.email;
            app.loggedIn = true;

            firebase.database().ref('chat').on('value', function (data) {


                app.messages = data.val();

                setTimeout(function () {
                    console.log("hi")
                    $(".chat-body").animate({
                        scrollTop: $(".chat-body").prop("scrollHeight")
                    }, 500);
                });
            })
        },

        checkUser: function () {
            //To check if user is logged in
            firebase.auth().onAuthStateChanged(function (user) {
                if (user != null) {
                    app.loggedIn = true;
                    app.getPosts();
                    // User is logged in.
                } else {
                    app.loggedIn = false;
                    // No user is logged in.
                }
            })
        },
        refreshPage: function () {
            app.filterArray = app.games 
            app.teamsValue = "select";
            app.locationValue = "select";

        }

    },

    computed: {
        customItems() {
            this.collapsibleItems = this.locations.map((location) => {
                return {
                    locationName: location.locationName,
                    iframe: location.iframe,
                    active: false
                }
            });
            return this.collapsibleItems;
        }

    }

})
