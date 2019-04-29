var repeatState;



const app = new Vue({
    el: '#app',
    data: {

        members: [],
        filteredArray: [],
        states: [],
        value: "",
        show: true,

    },
    created() {
        if (
            location.pathname == "/house_data.html") {
            this.getData("https://api.propublica.org/congress/v1/113/house/members.json");
        }
        if (
            location.pathname == "/senate_data.html") {
            this.getData("https://api.propublica.org/congress/v1/113/senate/members.json");
        }
    },
    methods: {
        getData(URL) {

            fetch(URL, {

                    method: "GET",
                    headers: new Headers({
                        "X-API-KEY": "w6GVb3bkdQknDI03JiTP4DyJqmqD0l7vmErCXpLt"
                    })
                })

                .then(function (response) {
                    return response.json();
                }).then(function (json) {
                    app.members = json.results[0].members;
                console.log(app.members);
                    app.show = false;
                    app.filteredArray = app.members;
                    app.filterState();
//                   

                    var table = document.getElementById("senate-data");
                    repeatState = document.getElementById("state-filter");
                    var democratic = document.getElementById("democratic");
                    var republican = document.getElementById("republican");
                    var independent = document.getElementById("independent");
                    var displayMessage = document.getElementById("displayMessage");



                }).catch(function (error) {
                    console.log(error)
                })


        },

        filter: function () {
        
            app.filteredArray = [];

            for (var i = 0; i < app.members.length; i++) {
                if (app.members[i].state == repeatState.value || repeatState.value == "all") {
                    if (democratic.checked == true && app.members[i].party == "D") {
                        app.filteredArray.push(app.members[i]);
                    }
                    console.log()
                    if (republican.checked == true && app.members[i].party == "R") {
                        app.filteredArray.push(app.members[i]);
                    }
                    if (independent.checked == true && app.members[i].party == "I") {
                        app.filteredArray.push(app.members[i])
                    }

                }

            }
        
        },

        filterState: function () {

            var unique = app.members.map(item => item.state).filter(function (item, i, ar) {
                return ar.indexOf(item) === i;
            }).sort();
            app.states = unique;
        }

    }
})

 <form name="filter" id="FilterForm" action="" method="">

                <p><strong>Filter by State :</strong>
                    <select id="state-filter" class="filter" v-on:change="filter">

                        <option value="all">--All--</option>
                        <option v-for="state in states" v-bind:value="state">{{state}}</option>

                    </select>
                </p>
            </form>
            
            
            
               <div v-for="(index, location) in locations">
           {{location.locationName}} <iframe :src="location.iframe" frameborder="0"></iframe>
       </div>
        </div>
        </div>
        <div id="map-page">