//TODO put formData data retrieval into function for DRY

let token: string

async function signup() {
    // username, email, password
    // TODO validation
    const form = document.forms['signUp'];
    const username: string = form.username.value;
    const email: string = form.email.value;
    const password: string = form.password.value;
    const passwordRepeat: string = form.passwordRepeat.value;

    if (password === passwordRepeat) {
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
    } else {
        console.log("passwords don't match")
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