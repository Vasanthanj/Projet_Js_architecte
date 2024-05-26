
document.addEventListener("DOMContentLoaded", () => {
    
    const navList = document.querySelector("nav ul"); 
    //console.log(navList);
    
    function redirectionLoginPage(){
        window.location.href = "connexion.html";
    }
    
    //Fonction de déconnexion
    function logout (){
        localStorage.removeItem("token");
        updateButton();
        redirectionHomePage(true);
    }

    //Fonction de redirection vers la page d'accueil après déconnexion
    function redirectionHomePage(isLogout){
        if (isLogout) window.location.href = "index.html";
        else window.location.href="index.html";
    }

    //fonction pour vérifier si l'utilisateur est connecté

    function isLoggedIn(){
        return !!localStorage.getItem("token");
    }

    // Fonction pour adapter le bouton Log In en Log out

    function updateButton(){
        
        const buttonLogIn = document.querySelector(".button_Login_Logout");
        //console.log(buttonLogIn);

        if (isLoggedIn()){
            buttonLogIn.textContent ="logout";
            buttonLogIn.removeEventListener("click", redirectionLoginPage);
            buttonLogIn.addEventListener("click", logout);
        } else{
            buttonLogIn.textContent ="login";
            buttonLogIn.removeEventListener("click", logout);
            buttonLogIn.addEventListener ("click", redirectionLoginPage)
        }
    }

    //création du bouton login/logout et ajout à la nav
    function createButtonLoginLogout (){
        const loginLi = document.createElement("li");
        loginLi.classList ="button_Login_Logout";

        //insertion du bouton davant le dernier élément 
        if (navList.children.length > 1){
            const lastLi = navList.lastElementChild;
            navList.insertBefore (loginLi, lastLi);
        }else{
            navList.appendChild(loginLi);
        }
        updateButton(); //Mettre à jour l'état du boutton
    }

    // Fonction pour la formulaire de connexion
    function loginSubmit(event){
        event.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        fetch ("http://localhost:5678/api/users/login",{
            method : "POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({email , password}),
        })
        .then ((response) =>{
            if (!response.ok){
                throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.json();
        })
        .then((data)=>{
            localStorage.setItem("token", data.token);
            updateButton();
            redirectionHomePage(false);
        })
        .catch((error)=>{
            console.error("Login failed:", error);
            const errorForm = document.querySelector(".errorMailOrPassword");
            //console.log(errorForm);
            errorForm.textContent = 
            "L'adresse mail ou le mot de passe n'est pas correct.";
        });
    }
    // Attacher l'événement au formulaire de connexion
    const loginForm = document.getElementById("loginForm");
    if (loginForm){
        loginForm.addEventListener("submit",loginSubmit);
    }
    
    //iniatilisation du bouton de connexion/déconnexion
    createButtonLoginLogout();

});