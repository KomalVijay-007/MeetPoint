document
.getElementById("loginBtn")
.addEventListener(
    "click",
    function(){

        const phone =
        document
        .getElementById("phone")
        .value
        .trim();

        const savedPhone =
        localStorage.getItem(
            "phone"
        );

        if(
            phone === savedPhone
        ){

            alert(
                "Login Success"
            );

            window.location.href =
            "create.html";

        }
        else{

            alert(
                "Invalid Phone Number"
            );

        }

    }
);
