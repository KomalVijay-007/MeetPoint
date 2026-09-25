import { db } from "./firebase.js";

import {
    doc,
    getDoc
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const meetupData =
JSON.parse(
    localStorage.getItem(
        "meetupData"
    )
);

const markers = {};

const paths = {};

const routes = {};


let lastRouteUpdate = 0;

let autoFitDone = false;

let destinationMarker = null;

let radiusCircle = null;

const memberList =
document.getElementById(
    "memberList"
);

const memberSearch =
document.getElementById(
    "memberSearch"
);

const reachedCounter =
document.getElementById(
    "reachedCounter"
);

const map =
L.map("map").setView(
    [17.3850, 78.4867],
    11
);

let currentTheme =
"light";

const themeToggleBtn =
document.getElementById(
    "themeToggleBtn"
);

const themeIconBtn =
document.getElementById(
    "themeIconBtn"
);

if(themeToggleBtn){
    themeToggleBtn.addEventListener(
        "click",
        toggleTheme
    );
}

if(themeIconBtn){
    themeIconBtn.addEventListener(
        "click",
        toggleTheme
    );
}

function toggleTheme(){

    if(
        currentTheme ===
        "light"
    ){

        map.removeLayer(
            lightLayer
        );

        darkLayer.addTo(
            map
        );

        currentTheme =
        "dark";

        themeToggleBtn.innerHTML =
        "☀️ Light Map";

        themeIconBtn.innerHTML =
        "☀️";

    }

    else{

        map.removeLayer(
            darkLayer
        );

        lightLayer.addTo(
            map
        );

        currentTheme =
        "light";

        themeToggleBtn.innerHTML =
        "🌙 Dark Map";

        themeIconBtn.innerHTML =
        "🌙";

    }

}


const lightLayer =
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
        "&copy; OpenStreetMap"
    }
);

const darkLayer =
L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
    {
        attribution:
        "&copy; Stadia Maps & OpenStreetMap"
    }
);

lightLayer.addTo(map);

loadMembers();

function renderMembers(
    members
){

    memberList.innerHTML = "";

    members.forEach(
        member => {

              const distance =
                member.distanceKm || "--";

                const eta =
                member.etaMinutes || "--";

                const status =
                member.liveStatus || "Travelling";
            

            const div =
            document.createElement(
                "div"
            );

            div.className =
            "member-item";

           div.innerHTML = `
            <div style="
                font-size:16px;
                font-weight:bold;
                color:white;
            ">
                ${status === "✅ Reached" ? "🟢" : "🔵"}
                ${member.name}
            </div>

            <div style="
                font-size:13px;
                color:#cccccc;
                margin-top:5px;
            ">
                📍 ${distance} km away
            </div>

            <div style="
                font-size:13px;
                color:#cccccc;
                margin-top:3px;
            ">
                ⏱ ETA: ${eta} mins
            </div>
        `;

            div.style.color =
            "white";

            div.style.fontWeight =
            "bold";

            div.style.padding =
            "15px";

            div.style.marginBottom =
            "8px";

            div.style.background =
            "rgba(255,255,255,0.08)";

            div.style.border =
            "1px solid rgba(255,255,255,0.1)";

            div.style.borderRadius =
            "12px";

            div.style.cursor =
            "pointer";

            div.style.transition =
            "0.3s";

            div.onmouseenter =
            function(){

                div.style.boxShadow =
                "0 0 18px rgba(0,255,255,0.4)";

            };

            div.onmouseleave =
            function(){

                div.style.boxShadow =
                "none";

            };

            div.onclick =
            function(){

                if(
                    markers[
                        member.name
                    ]
                ){

                    const latlng =
                    markers[
                        member.name
                    ].getLatLng();

                    map.setView(
                        latlng,
                        16
                    );

                    markers[
                        member.name
                    ].openPopup();

                }

            };

            memberList.appendChild(
                div
            );

        }
    );



}

function getDistanceMeters(
    lat1,
    lon1,
    lat2,
    lon2
){

    const R = 6371000;

    const dLat =
    (lat2 - lat1) *
    Math.PI / 180;

    const dLon =
    (lon2 - lon1) *
    Math.PI / 180;

    const a =

    Math.sin(dLat / 2) *
    Math.sin(dLat / 2)

    +

    Math.cos(
        lat1 * Math.PI / 180
    )

    *

    Math.cos(
        lat2 * Math.PI / 180
    )

    *

    Math.sin(dLon / 2)
    *
    Math.sin(dLon / 2);

    const c =

    2 *

    Math.atan2(

        Math.sqrt(a),

        Math.sqrt(
            1 - a
        )

    );

    return R * c;

}


async function loadMembers(){

    try{

        const meetupRef =
        doc(
            db,
            "meetups",
            meetupData.meetupCode
        );

        const meetupSnap =
        await getDoc(
            meetupRef
        );

        if(
            !meetupSnap.exists()
        ){
            return;
        }

       const data =
meetupSnap.data();

const bounds = [];

if(
    data.meetingLatitude &&
    data.meetingLongitude
){
      bounds.push([
        data.meetingLatitude,
        data.meetingLongitude
    ]);

    if(
        !destinationMarker
    ){

        destinationMarker =
        L.circleMarker(
            [
                data.meetingLatitude,
                data.meetingLongitude
            ],
            {
                radius: 10,
                color: "red",
                fillColor: "red",
                fillOpacity: 1
            }
        )
        .addTo(map)
        .bindPopup(
            `
            <h3>📍 Destination</h3>
            <p>${data.meetingPoint}</p>
            `
        );

    }

    if(
        !radiusCircle
    ){

        radiusCircle =
        L.circle(
            [
                data.meetingLatitude,
                data.meetingLongitude
            ],
            {
                radius: Number(data.radius),
                color: "red",
                fillColor: "red",
                fillOpacity: 0.1
            }
        )
        .addTo(map);

    }

}



const members =
data.members || [];

let reachedCount = 0;
let travellingCount = 0;

    
        members.forEach(
            member => {


                if(
                        member.latitude != null &&
                        member.longitude != null
                ){
                    bounds.push([
                    member.latitude,
                    member.longitude
                ]);

                    const distanceMeters =

                    getDistanceMeters(

                        member.latitude,
                        member.longitude,

                        data.meetingLatitude,
                        data.meetingLongitude

                    );

                    const distanceKm =

                    (
                        distanceMeters / 1000
                    )
                    .toFixed(2);

                    const currentTime =
                    Date.now();

                    const averageSpeedKmH = 25;

                    const etaMinutes =

                    Math.ceil(

                        (
                            distanceKm /
                            averageSpeedKmH
                        )

                        * 60

                    );

                   let liveStatus =
                    "Travelling";

                    if(
                        distanceMeters <=
                        Number(data.radius)
                    ){

                        liveStatus =
                        "✅ Reached";

                        reachedCount++;

                    }
                    else{

                        travellingCount++;

                    }
                
                member.distanceKm =
                distanceKm;

                member.etaMinutes =
                etaMinutes;

                member.liveStatus =
                liveStatus;


                   const popupContent =
                    `
                    <h3>${member.name}</h3>

                    <p>
                        Status:
                        ${liveStatus}
                    </p>

                    <p>
                        Distance Left:
                        ${distanceKm} km
                    </p>

                    <p>
                        ETA:
                        ${etaMinutes} mins
                    </p>

                    <p>
                        Last Updated:
                        ${member.lastUpdated || "N/A"}
                    </p>

                    <p>
                        Latitude:
                        ${member.latitude}
                    </p>

                    <p>
                        Longitude:
                        ${member.longitude}
                    </p>
                    `;

                    if(
                        markers[
                            member.name
                        ]
                    ){

                        markers[
                            member.name
                        ].setLatLng(
                            [
                                member.latitude,
                                member.longitude
                            ]
                        );

                        markers[
                            member.name
                        ].setPopupContent(
                            popupContent
                        );

                    }

                    else{

                        markers[
                            member.name
                        ] =
                        L.marker(
                            [
                                member.latitude,
                                member.longitude
                            ]
                        )
                        .addTo(map)
                        .bindPopup(
                            popupContent
                        );

                    }

                    if(
                        member.path &&
                        member.path.length > 1
                    ){

                        const pathCoordinates =

                        member.path.map(
                            point => [

                                point.lat,

                                point.lng

                            ]
                        );

                        if(
                            paths[
                                member.name
                            ]
                        ){

                            paths[
                                member.name
                            ]
                            .setLatLngs(
                                pathCoordinates
                            );

                        }

                        else{

                            paths[
                                member.name
                            ] =

                            L.polyline(
                                pathCoordinates,
                                {
                                    color: "cyan",
                                    weight: 4,
                                    opacity: 0.8
                                }
                            )
                            .addTo(map);

                        }

                    } 


                    if(

    currentTime -
    lastRouteUpdate >

    30000

){

    if(

        data.meetingLatitude &&
        data.meetingLongitude

    ){

        if(
            routes[
                member.name
            ]
        ){

            map.removeControl(

                routes[
                    member.name
                ]

            );

        }

        routes[
            member.name
        ] =

        L.Routing.control({

            waypoints:[

                L.latLng(

                    member.latitude,

                    member.longitude

                ),

                L.latLng(

                    data.meetingLatitude,

                    data.meetingLongitude

                )

            ],

            routeWhileDragging:false,

            addWaypoints:false,

            draggableWaypoints:false,

            fitSelectedRoutes:false,

            show:false,

            createMarker:
            function(){

                return null;

            },

            lineOptions:{

                styles:[

                    {

                        color:"#5bebf0",

                        weight:4,

                        opacity:0.8

                    }

                ]

            }

        })
        .addTo(map);

    }

}

                }

            }
        );

        renderMembers(
    members
);

        reachedCounter.innerHTML =
`👥 ${reachedCount} / ${members.length} Reached`;

document.getElementById(
    "totalMembers"
).innerText =
members.length;

document.getElementById(
    "reachedCountTop"
).innerText =
reachedCount;

document.getElementById(
    "travellingCount"
).innerText =
travellingCount;

        if(
    Date.now() -
    lastRouteUpdate >
    30000
){

    lastRouteUpdate =
    Date.now();

}

        if(
    !autoFitDone &&
    bounds.length > 0
){

    map.fitBounds(
        bounds,
        {
            padding:[50,50]
        }
    );

    autoFitDone = true;

}

    }

    catch(error){

        console.error(
            error
        );

    }

}

setInterval(

    loadMembers,

    5000

);

memberSearch.addEventListener(

    "input",

    function(){

        const text =
        this.value
        .toLowerCase();

        const items =
        document.querySelectorAll(
            ".member-item"
        );

        items.forEach(
            item => {

                item.style.display =

                item.innerText
                .toLowerCase()
                .includes(text)

                ?

                "block"

                :

                "none";

            }
        );

    }

);

