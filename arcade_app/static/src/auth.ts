//TODO put formData data retrieval into function for DRY

let token: string


function validateForm(formData, formType) {
    let formValid = true;
    document.getElementById("usernameError").style.opacity = "0";
    if (formType === "signup") {
        document.getElementById("matchPasswordError").style.opacity = "0";
        document.getElementById("weakPasswordError").style.opacity = "0";
        document.getElementById("emailError").style.opacity = "0";
        if (formData.password != formData.passwordRepeat) {
            document.getElementById("matchPasswordError").style.opacity = "1";
            formValid = false;
        }

        if (formData.password.length < 8) {
            document.getElementById("weakPasswordError").style.opacity = "1";
            formValid = false;
        }

        if (formData.email == "") {
            document.getElementById("emailError").style.opacity = "1";
            formValid = false;
        }
    }
    if (formType === "login") {
        document.getElementById("passwordError").style.opacity = "0";
        if (formData.password == "") {
            document.getElementById("passwordError").style.opacity = "1";
            formValid = false;
        }
    }
    if (formData.username == "") {
        document.getElementById("usernameError").style.opacity = "1";
        formValid = false;
    }
    return formValid
}



async function signup() {
    const form = document.forms['signUp'];
    const username: string = form.username.value;
    const email: string = form.email.value;
    const password: string = form.password.value;
    const passwordRepeat: string = form.passwordRepeat.value;
    const formData = {username: username, email: email, password: password, passwordRepeat: passwordRepeat};

    if (validateForm(formData, "signup")) {
        let response = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        })

        if (response.status == 201) {
            window.location.replace("/login?signup=success")
        } else {
            if (response.status == 409) {
                window.location.replace("/login?signup=exists")
            } else {
                //unknown HTML code
            }
        }
    }
}

async function userlogin() {
    const form = document.forms['login'];
    const username: string = form.username.value;
    const password: string = form.password.value;
    const formData = {username: username,
                      password: password}

    if (validateForm(formData, "login")) {
        let response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        if (response.redirected) {
            console.log("redirected")
            window.location.replace(response.url)
        }
    
        if (response.ok) {
            token = await response.json();
            token = token['token'];
        }

    }
}


// TODO change after implementation tested
async function getUsers() {
    let response = await fetch ("/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization":  token
        }
    })

    console.log(response)

}



function logout() {

}