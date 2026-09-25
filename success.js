const meetupData = JSON.parse(
    localStorage.getItem("meetupData")
);

const details =
document.getElementById(
    "meetupDetails"
);

if(meetupData){

    details.innerHTML = `

        <p>
            <strong>Meetup Name:</strong>
            ${meetupData.meetupName}
        </p>

        <p>
            <strong>Date:</strong>
            ${meetupData.meetupDate}
        </p>

        <p>
            <strong>Time:</strong>
            ${meetupData.meetupTime}
        </p>

        <p>
            <strong>Meeting Point:</strong>
            ${meetupData.meetingPoint}
        </p>

        <p>
            <strong>Arrival Radius:</strong>
            ${meetupData.radius} meters
        </p>

        <h2>
            Code: ${meetupData.meetupCode}
        </h2>

    `;

}

document
.getElementById("copyBtn")
.addEventListener(
    "click",
    function(){

        navigator.clipboard.writeText(
            meetupData.meetupCode
        );

        alert(
            "Meetup code copied!"
        );

    }
);

document
.getElementById("continueBtn")
.addEventListener(
    "click",
    function(){

        window.location.href =
        "dashboard.html";

    }
);