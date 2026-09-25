document
.getElementById("continueBtn")
.addEventListener(
    "click",
    function(){

        const name =
        document
        .getElementById("name")
        .value
        .trim();

        const phone =
        document
        .getElementById("phone")
        .value
        .trim();

        if(
            name === "" ||
            phone === ""
        ){

            alert(
                "Fill All Fields"
            );

            return;
        }

        localStorage.setItem(
            "name",
            name
        );

        localStorage.setItem(
            "phone",
            phone
        );

        window.location.href =
        "setHome.html";

    }
);