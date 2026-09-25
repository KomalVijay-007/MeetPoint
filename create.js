import { db } from "./firebase.js";

import {
    doc,
    setDoc
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

let meetingLatitude = null;

let meetingLongitude = null;

const map =
L.map("createMap")
.setView(
    [17.3850, 78.4867],
    11
);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
        "&copy; OpenStreetMap"
    }
).addTo(map);

let selectedMarker;

map.on(

    "click",

    function(e){

        meetingLatitude =
        e.latlng.lat;

        meetingLongitude =
        e.latlng.lng;

        if(
            selectedMarker
        ){

            map.removeLayer(
                selectedMarker
            );

        }

        selectedMarker =
        L.marker(
            [
                meetingLatitude,
                meetingLongitude
            ]
        ).addTo(map);

        document.getElementById(
            "selectedLocation"
        ).innerHTML =

        `📍 ${meetingLatitude.toFixed(5)},
        ${meetingLongitude.toFixed(5)}`;

    }

);

function generateCode(){

    const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for(
        let i = 0;
        i < 6;
        i++
    ){

        code += chars.charAt(

            Math.floor(
                Math.random() *
                chars.length
            )

        );

    }

    return code;

}

document
.getElementById("meetupForm")
.addEventListener(

    "submit",

    async function(e){

        e.preventDefault();

        if(
            meetingLatitude === null ||
            meetingLongitude === null
        ){

            alert(
                "Please Select A Location On The Map"
            );

            return;

        }

        const meetupData = {

            meetupName:
            document.getElementById(
                "meetupName"
            ).value,

            meetupDate:
            document.getElementById(
                "meetupDate"
            ).value,

            meetupTime:
            document.getElementById(
                "meetupTime"
            ).value,

            meetingPoint:
            document.getElementById(
                "meetingPoint"
            ).value,

            meetingLatitude:
            meetingLatitude,

            meetingLongitude:
            meetingLongitude,

            radius:
            document.getElementById(
                "radius"
            ).value,

            meetupCode:
            generateCode(),

            members: [

    {

        name:
        document.getElementById(
            "creatorName"
        ).value,

        status:
        "Not Started",

        latitude:
        null,

        longitude:
        null,

        lastUpdated:
        null,

        path: []

    }

]
        };

        try{

            await setDoc(

                doc(
                    db,
                    "meetups",
                    meetupData.meetupCode
                ),

                meetupData

            );

            localStorage.setItem(

                "meetupData",

                JSON.stringify(
                    meetupData
                )

            );

            window.location.href =
            "success.html";

        }

        catch(error){

            console.error(
                error
            );

            alert(
                "Failed To Create Meetup"
            );

        }

    }

);