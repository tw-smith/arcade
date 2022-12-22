//TODO put formData data retrieval into function for DRY

let token: string


function validateForm(username, email, password, passwordRepeat) {
    let formValid = true;

    if (password != passwordRepeat) {
        document.getElementById("matchPasswordError").style.opacity = "1";
        formValid = false;
    }

    if (password.length < 8) {
        document.getElementById("weakPasswordError").style.opacity = "1";
        formValid = false;
    }

    if (username == "") {
        document.getElementById("usernameError").style.opacity = "1";
        formValid = false;
    }

    if (email == "") {
        document.getElementById("emailError").style.opacity = "1";
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

    if (validateForm(username, email, password, passwordRepeat)) {
        const formData = {username: username,
                          email: email,
                          password: password};

        let response = await fetch("/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        })
    }
}

async function userlogin() {
    // TODO validation
    const form = document.forms['login'];
    const username: string = form.username.value;
    const password: string = form.password.value;
    const formData = {username: username,
                      password: password}

    let response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })

    token = await response.json();
    token = token['token'];
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