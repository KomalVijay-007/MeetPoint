import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const meetupData =
JSON.parse(
    localStorage.getItem(
        "meetupData"
    )
);

const joinedUser =
localStorage.getItem(
    "joinedUser"
);

console.log("joinedUser =", joinedUser);

const dashboardContent =
document.getElementById(
    "dashboardContent"
);

if(meetupData){

    dashboardContent.innerHTML = `

        <div class="result-card">

            <h2>
                🚀 LIVE MEETUP
            </h2>

            <div class="info-grid">

                <div class="info-card">

                    <div class="info-label">
                        Meetup
                    </div>

                    <div class="info-value">
                        ${meetupData.meetupName}
                    </div>

                </div>

                <div class="info-card">

                    <div class="info-label">
                        Date
                    </div>

                    <div class="info-value">
                        ${meetupData.meetupDate}
                    </div>

                </div>

                <div class="info-card">

                    <div class="info-label">
                        Time
                    </div>

                    <div class="info-value">
                        ${meetupData.meetupTime}
                    </div>

                </div>

                <div class="info-card">

                    <div class="info-label">
                        User
                    </div>

                    <div class="info-value">
                        ${joinedUser}
                    </div>

                </div>

            </div>

            <div
            style="
            margin-top:20px;
            padding:15px;
            border-radius:14px;
            background:rgba(59,130,246,0.1);
            border:1px solid rgba(59,130,246,0.2);
            ">

                📍 <strong>Meeting Point:</strong><br>
                ${meetupData.meetingPoint}

            </div>

            <div
            style="
            margin-top:20px;
            padding:15px;
            border-radius:14px;
            background:rgba(34,197,94,0.08);
            border:1px solid rgba(34,197,94,0.2);
            ">

                <h3
                style="
                margin-bottom:10px;
                color:white;
                ">
                    👥 Members
                </h3>

                ${
                    meetupData.members &&
                    meetupData.members.length > 0

                    ?

                    meetupData.members.map(
                        member => `

                            <div
                            style="
                            margin:8px 0;
                            color:white;
                            display:flex;
                            justify-content:space-between;
                            ">

                                <span>
                                    ${member.name}
                                </span>

                                <span>
                                    ${
                                        member.status ===
                                        "Started Journey"

                                        ?

                                        "🟢 Started"

                                        :

                                        "⚪ Not Started"
                                    }
                                </span>

                            </div>

                        `
                    ).join("")

                    :

                    `

                    <div
                    style="
                    color:white;
                    ">
                        No Members Yet
                    </div>

                    `
                }

            </div>

        </div>

    `;

}else{

    dashboardContent.innerHTML = `

        <div class="result-card">

            <h2>
                No Meetup Found
            </h2>

            <p>
                Create or Join a Meetup First
            </p>

        </div>

    `;

}

document
.getElementById("startJourneyBtn")
.addEventListener(
    "click",
    async function(){

        if(
            !navigator.geolocation
        ){
            alert(
                "Location Not Supported"
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(

            async function(position){

                try{

                    const latitude =
                    position.coords.latitude;

                    const longitude =
                    position.coords.longitude;

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

                    const data =
                    meetupSnap.data();

                    const members =
                    data.members || [];

                    const updatedMembers =
                    members.map(
                        member => {

                            if(
                                member.name ===
                                joinedUser
                            ){

                                return {

                                    ...member,

                                    status:
                                    "Started Journey",

                                    latitude:
                                    latitude,

                                    longitude:
                                    longitude

                                };

                            }

                            return member;

                        }
                    );

                    await updateDoc(

                        meetupRef,

                        {
                            members:
                            updatedMembers
                        }

                    );

                    alert(
                        "🚀 Journey Started"
                    );

                    startLiveTracking();

                }

                catch(error){

                    console.error(
                        error
                    );

                }

            }

        );

    }
);

document
.getElementById("shareLocationBtn")
.addEventListener(
    "click",
    async function(){

        const locationStatus =
        document.getElementById(
            "locationStatus"
        );

        navigator.geolocation.getCurrentPosition(

            async function(position){

                try{

                    const latitude =
                    position.coords.latitude;

                    const longitude =
                    position.coords.longitude;

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

                    const data =
                    meetupSnap.data();

                    const members =
                    data.members || [];

                    const updatedMembers =
                    members.map(
                        member => {

                            if(
                                member.name ===
                                joinedUser
                            ){

                                return {

                                    ...member,

                                    latitude:
                                    latitude,

                                    longitude:
                                    longitude,

                                    lastUpdated:
                                    new Date()
                                    .toLocaleTimeString(),

                                    path: [

                                    ...(member.path || []),

                                    {
                                        lat: latitude,
                                        lng: longitude
                                    }

                                ]


                                };

                            }

                            return member;

                        }
                    );

                    await updateDoc(

                        meetupRef,

                        {
                            members:
                            updatedMembers
                        }

                    );

                    localStorage.setItem(
                        "latitude",
                        latitude
                    );

                    localStorage.setItem(
                        "longitude",
                        longitude
                    );

                    locationStatus.innerHTML = `
                    <div class="result-card">

                        <h2>
                            📍 Location Shared
                        </h2>

                        <p>
                            Latitude:
                            ${latitude}
                        </p>

                        <p>
                            Longitude:
                            ${longitude}
                        </p>

                        <p>
                            ✅ Saved To Firebase
                        </p>

                    </div>
                    `;

                }

                catch(error){

                    console.error(
                        error
                    );

                    locationStatus.innerHTML = `
                    <div class="result-card">

                        ❌ Firebase Update Failed

                    </div>
                    `;

                }

            },

            function(error){

                locationStatus.innerHTML = `
                <div class="result-card">

                    ❌ Location Error

                </div>
                `;

                console.log(error);

            }

        );

    }
);

document
.getElementById("startJourneyBtn")
.addEventListener(
    "click",
    function(){

        window.location.href =
        "map.html";

    }
);

document
.getElementById("openMapBtn")
.addEventListener(
    "click",
    function(){

        window.location.href =
        "map.html";

    }
);

document
.getElementById("restaurantBtn")
.addEventListener(
    "click",
    function(){

        alert(
            "Nearby Restaurants Coming Next 🍽️"
        );

    }
);

document
.getElementById("hotelBtn")
.addEventListener(
    "click",
    function(){

        alert(
            "Nearby Hotels Coming Next 🏨"
        );

    }
);
function startLiveTracking(){

    setInterval(

        async function(){

            navigator.geolocation.getCurrentPosition(

                async function(position){

                    try{

                        const latitude =
                        position.coords.latitude;

                        const longitude =
                        position.coords.longitude;

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

                        const data =
                        meetupSnap.data();

                        const members =
                        data.members || [];

                        const updatedMembers =
                        members.map(
                            member => {

                                if(
                                    member.name ===
                                    joinedUser
                                ){

                                    return {

                                        ...member,

                                        latitude:
                                        latitude,

                                        longitude:
                                        longitude,

                                        path: [

                                        ...(member.path || []),

                                        {
                                            lat: latitude,
                                            lng: longitude
                                        }

                                    ]

                                    };

                                }

                                return member;

                            }
                        );

                        await updateDoc(

                            meetupRef,

                            {
                                members:
                                updatedMembers
                            }

                        );

                    }

                    catch(error){

                        console.error(
                            error
                        );

                    }

                }

            );

        },

        5000

    );

}