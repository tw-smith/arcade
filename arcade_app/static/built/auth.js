//TODO put formData data retrieval into function for DRY
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let token;
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
    return formValid;
}
function signup() {
    return __awaiter(this, void 0, void 0, function* () {
        const form = document.forms['signUp'];
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;
        const passwordRepeat = form.passwordRepeat.value;
        const formData = { username: username, email: email, password: password, passwordRepeat: passwordRepeat };
        if (validateForm(formData, "signup")) {
            let response = yield fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });
            if (response.status == 201) {
                window.location.replace("/login?signup=success");
            }
            else {
                if (response.status == 409) {
                    window.location.replace("/login?signup=exists");
                }
                else {
                    //unknown HTML code
                }
            }
        }
    });
}
function userlogin() {
    return __awaiter(this, void 0, void 0, function* () {
        const form = document.forms['login'];
        const username = form.username.value;
        const password = form.password.value;
        const formData = { username: username,
            password: password };
        if (validateForm(formData, "login")) {
            let response = yield fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.redirected) {
                console.log("redirected");
                window.location.replace(response.url);
            }
            if (response.ok) {
                token = yield response.json();
                token = token['token'];
            }
        }
    });
}
// TODO change after implementation tested
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch("/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        console.log(response);
    });
}
function logout() {
}
