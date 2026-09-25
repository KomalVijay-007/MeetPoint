import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

document
.getElementById("joinForm")
.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const enteredName =
        document.getElementById(
            "userName"
        ).value;

        const enteredCode =
        document.getElementById(
            "meetupCode"
        )
        .value
        .trim()
        .toUpperCase();

        const joinResult =
        document.getElementById(
            "joinResult"
        );

        try{

            const q = query(

                collection(
                    db,
                    "meetups"
                ),

                where(
                    "meetupCode",
                    "==",
                    enteredCode
                )

            );

            const querySnapshot =
            await getDocs(q);

            if(
                !querySnapshot.empty
            ){

                const meetupDoc =
                querySnapshot.docs[0];

                const meetupData =
                meetupDoc.data();

                const members =
                meetupData.members || [];

                const memberExists =
                members.some(
                    member =>
                    member.name === enteredName
                );

                if(
                    !memberExists
                ){

                    members.push({

                    name:
                    enteredName,

                    status:
                    "Not Started",

                    latitude:
                    null,

                    longitude:
                    null,

                    lastUpdated:
                    null

});

                }

                await updateDoc(

                    doc(
                        db,
                        "meetups",
                        meetupDoc.id
                    ),

                    {
                        members: members
                    }

                );

                meetupData.members =
                members;

                localStorage.setItem(
                    "joinedUser",
                    enteredName
                );

                localStorage.setItem(
                    "meetupData",
                    JSON.stringify(
                        meetupData
                    )
                );

                joinResult.innerHTML = `

                    <div class="result-card">

                        <h2>
                            ✅ Successfully Joined
                        </h2>

                        <p>
                            Welcome,
                            <strong>
                            ${enteredName}
                            </strong>
                        </p>

                        <hr>

                        <p>
                            📍 ${meetupData.meetupName}
                        </p>

                        <p>
                            📅 ${meetupData.meetupDate}
                        </p>

                        <p>
                            🕒 ${meetupData.meetupTime}
                        </p>

                        <p>
                            📌 ${meetupData.meetingPoint}
                        </p>

                        <p>
                            👥 Members:
                            ${members.length}
                        </p>

                        <br>

                        <button
                            class="btn"
                            onclick="goNext()">

                            Continue

                        </button>

                    </div>

                `;

            }else{

                joinResult.innerHTML = `

                    <div class="result-card">

                        <h2
                        style="color:#ef4444;">

                            ❌ Invalid Meetup Code

                        </h2>

                        <p>

                            Meetup Not Found

                        </p>

                    </div>

                `;

            }

        }
        catch(error){

            console.error(
                error
            );

            joinResult.innerHTML = `

                <div class="result-card">

                    <h2
                    style="color:#ef4444;">

                        Firebase Error

                    </h2>

                    <p>

                        Check Console

                    </p>

                </div>

            `;

        }

    }
);

window.goNext = function(){

    window.location.href =
    "dashboard.html";

};