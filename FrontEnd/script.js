//Constante générales:
const token = localStorage.getItem("token");
// Récupération des travaux depuis le back-end avec fetch

async function genererWork (){
    try{
        const response = await fetch('http://localhost:5678/api/works');

        if (!response.ok){
            throw new Error ('Erreur lors de la récupération des données');
        }
        const works = await response.json(); 
        
        //console.log(works);

        creerGallery(works);
        if (!token){
            creerFiltreBouttons(works); 
        }
        

        } catch (error){
            console.error ('Une erreur s\'est produite',error);
        }
}


//fonction pour créer la galerie des travaux
function creerGallery (works){
    const divGallery = document.querySelector('.gallery');
    
    supprimerDivGallery(divGallery);

    works.forEach(work => {
        const figureElement = document.createElement("figure");
        figureElement.dataset.id = work.id;

        const imgElement = document.createElement("img");
        imgElement.src = work.imageUrl;

        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.textContent = work.title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);

        divGallery.appendChild(figureElement);
    });
}    
//Fonction pour supprimer la galerie existante
function supprimerDivGallery (divGallery){
    divGallery.innerHTML="";
}


//Fonction pour créer les boutons de filtre

async function creerFiltreBouttons(works){
    
    const divFilters = document.createElement ("div");
    divFilters.classList.add("filters")

    const boutonsNoms = ["Tous", "Objets","Appartements","Hotels & restaurants"];

    boutonsNoms.forEach((nom, index)=> {
        const categorieBouton = document.createElement ("button");
        categorieBouton.textContent = nom;
        divFilters.appendChild(categorieBouton);

        categorieBouton.addEventListener("click", () => {
            let categoryId = null;
            if (index > 0){
                categoryId = index;
            }
            filtreTravauxParCategories(works, categoryId);

            divFilters.querySelectorAll("button").forEach(button => {
                button.classList.remove("bouton_actif");
            });
            categorieBouton.classList.add("bouton_actif");
        });
    });
    // Insérez les boutons de filtre après le H2 de la section
    const modifyContainer = document.querySelector(".modify_container")
    modifyContainer.insertAdjacentElement("afterend", divFilters); 
}
// Fonction pour filtrer les travaux par catégorie
function filtreTravauxParCategories (works, categoryId){
    let filtreWorks;
    if (categoryId !== null){
        filtreWorks = works.filter (work => work.category.id === categoryId);
    }else{
        filtreWorks = works;
    }
    
    
    creerGallery(filtreWorks);
   
}


genererWork();

// Modification de la page de connexion de l'utilisateur
// Banner

//Récupération de l'élément .banner 
const banniere = document.querySelector(".banner_mode_edition");
const modifier = document.querySelector(".modify");
if (token){
  //Créer l'élément pour le texte
const textBanniere = document.createElement ("p");
textBanniere.textContent ="Mode édition";

//Créer l'élément pour l'icône Font awesome
const iconBanniere = document.createElement("i");
iconBanniere.classList = "fa-regular fa-pen-to-square";

//Créer l'élément pour le lien modifier qui envoi sur la modal
const textModify = document.createElement ("a");
textModify.textContent="modifier";
textModify.href="#modal";


// Créer l'élement pour l'icone font awesome au niveau des projets
const iconModify = document.createElement("i");
iconModify.classList = "fa-regular fa-pen-to-square";

// Rattacher les deux enfants au parent Bannière
banniere.appendChild(iconBanniere);
banniere.appendChild(textBanniere);

//Rattacher les deux enfants au parent Modifier
modifier.appendChild(iconModify);
modifier.appendChild(textModify);


} else{
    banniere.remove();
    modifier.remove();
}