document
.getElementById("setHomeBtn")
.addEventListener(
    "click",
    function(){

        const result =
        document
        .getElementById(
            "result"
        );

        if(
            navigator.geolocation
        ){

            navigator
            .geolocation
            .getCurrentPosition(

                function(position){

                    const lat =
                    position.coords.latitude;

                    const lng =
                    position.coords.longitude;

                    localStorage.setItem(
                        "homeLatitude",
                        lat
                    );

                    localStorage.setItem(
                        "homeLongitude",
                        lng
                    );

                    result.innerHTML = `

                        <h3>
                            Home Saved
                        </h3>

                        <p>
                            Latitude:
                            ${lat}
                        </p>

                        <p>
                            Longitude:
                            ${lng}
                        </p>

                    `;

                    setTimeout(

                        function(){

                            window.location.href =
                            "login.html";

                        },

                        1500

                    );

                },

                function(){

                    alert(
                        "Location Required"
                    );

                }

            );

        }

    }
);