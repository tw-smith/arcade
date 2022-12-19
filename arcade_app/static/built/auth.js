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
function signup() {
    return __awaiter(this, void 0, void 0, function* () {
        // username, email, password
        // TODO validation
        const form = document.forms['signUp'];
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;
        const passwordRepeat = form.passwordRepeat.value;
        if (password === passwordRepeat) {
            const formData = { username: username,
                email: email,
                password: password };
            let response = yield fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });
        }
        else {
            console.log("passwords don't match");
        }
    });
}
function userlogin() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO validation
        const form = document.forms['login'];
        const username = form.username.value;
        const password = form.password.value;
        const formData = { username: username,
            password: password };
        let response = yield fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
        token = yield response.json();
        token = token['token'];
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
