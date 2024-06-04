//Constante générales:
const token = localStorage.getItem("token");
//console.log("Token:", token);
const modalWork = document.querySelector (".modal-work");
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
        return works; // Retourne les données récupérées

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

//////////////
// Modification de la page en fonction de l'état de connexion de l'utilisateur
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

//Gestion du modal
//ouverture de la modal
const modal = document.getElementById("modal");
const firstModal = document.querySelector(".modal-wrapper");
const secondModal = document.querySelector(".modal-wrapper__secondaire");
const ouvreModalBtn = document.querySelector(".modify a");
const fermeModalBtn = document.querySelector(".modal-close");
const fermeModalSecondaireBtn = document.querySelector(".modal-secondaire-close");
const arrow = document.getElementById("arrow");
const buttonFirstModal = document.querySelector(".modal-bouton");
const imagePreview = document.querySelector('.image-preview-hidden');
const imagePlaceholder = document.querySelector('.ajout-photo');

ouvreModalBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    modal.setAttribute("aria-hidden","false");
    modal.classList.add("is-open");
    firstModal.style.display = "flex";
    secondModal.style.display = "none";
    genererWorkModal();
});

fermeModalBtn.addEventListener("click",() => {
    modal.setAttribute("aria-hidden","true");
    modal.classList.remove("is-open");
});

window.addEventListener("click", (e)=>{
    if(e.target === modal){
        modal.setAttribute("aria-hidden","true");
        modal.classList.remove("is-open");
        // Réinitialiser le contenu de l'aperçu de l'image
        imagePreview.innerHTML="";
        imagePreview.style.display ="none";
        imagePlaceholder.style.display="flex";
        
    }
})

buttonFirstModal.addEventListener("click", (e)=>{
    e.preventDefault();
    secondModal.style.display = "flex";
    firstModal.style.display = "none";

});

arrow.addEventListener("click", (e)=>{
    e.preventDefault();
    secondModal.style.display = "none";
    firstModal.style.display = "flex";
   // Réinitialiser le contenu de l'aperçu de l'image
   imagePreview.innerHTML="";
   imagePreview.style.display ="none";
   imagePlaceholder.style.display="flex";
});
fermeModalSecondaireBtn.addEventListener("click",() => {
    modal.setAttribute("aria-hidden","true");
    modal.classList.remove("is-open");
     // Réinitialiser le contenu de l'aperçu de l'image
     imagePreview.innerHTML="";
     imagePreview.style.display ="none";
     imagePlaceholder.style.display="flex";
});

//affichage des works modal
async function genererWorkModal(){
    modalWork.innerHTML=""; //vide le HTML
    const works = await genererWork();
    if(Array.isArray(works)){
        works.forEach((works)=>{
            const figure = document.createElement("figure");
            const img = document.createElement ("img");
            img.src = works.imageUrl;
            //ajout de la corbeille
            const divIconTrash = document.createElement("div");//parent des icônes corbeilles
            const iconTrash = `<svg class="trash "width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="trash-can-solid">
            <path id="Vector" d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
            </g>
            </svg>
            `;
            divIconTrash.innerHTML = iconTrash; //mise en place des icones dans le parent
            divIconTrash.id = works.id //récupère l'id des works sur les corbeilles
            figure.appendChild(img);
            figure.appendChild(divIconTrash);
            modalWork.appendChild(figure);
        });
        supprimeModalWork();
    }   
}

//gestion suppression des travaux
function supprimeModalWork(){
    const trashButton = document.querySelectorAll(".trash");
    trashButton.forEach((trashSVG)=>{
        trashSVG.addEventListener("click",(e)=>{
            e.preventDefault();// Empêche le rechargement de la page après la suppression
            const id = trashSVG.parentNode.id;
            const options = {
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`,
                },
            };
            fetch(`http://localhost:5678/api/works/${id}`, options)
            .then((response)=>{
                if(!response.ok){
                    throw new Error("Une erreur s'est produite lors de la suppression");
                }
            })
            .then(()=>{
                console.log("Suppression réussie");
                genererWorkModal();
                genererWork();
            })
            .catch((error)=>{
                console.error(error);
            })
            alert('Photo supprimée avec succès');
        })
    })
}
genererWork();

// Gestion  de l'aperçu de l'image et remplacement du contenu dans la modal secondaire


document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('photo-file');
    const photoContainer = document.querySelector(".modal__secondaire-photo");
    const imagePreview = document.querySelector('.image-preview-hidden');
    const imagePlaceholder = document.querySelector('.ajout-photo');
    const errorMessage = document.getElementById('modal__secondaire-message-erreur');
    const boutonValiderphoto = document.getElementById('submitValider');
    const titleInput = document.getElementById('photo-title');
    const categorySelect = document.getElementById('photo-category');

    // Fonction pour vérifier si tous les champs sont remplis
    function checkFormValidity() {
        const title = titleInput.value;
        const category = categorySelect.value;
        const file = fileInput.files[0];

        if (title && category && file) {
            boutonValiderphoto.style.backgroundColor = "#1D6154";
        } else {
            boutonValiderphoto.style.backgroundColor = "#a7a7a7";
        }
    }

    // Événement lorsque le fichier est sélectionné
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        errorMessage.textContent = "";

        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png'];
            if (!validImageTypes.includes(file.type)) {
                errorMessage.textContent = 'Veuillez sélectionner un fichier JPG ou PNG.';
                return;
            }
            const maxSizeInBytes = 4 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                errorMessage.textContent = 'Le fichier ne doit pas dépasser 4 Mo.';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = '';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Aperçu de l\'image';
                img.style.maxWidth = '129px';
                img.style.maxHeight = '193px';

                imagePreview.appendChild(img);
                imagePlaceholder.style.display = 'none';
                imagePreview.style.display = 'flex';

                
                checkFormValidity();
            };
            reader.readAsDataURL(file);
        }
    });

    // Événement lorsque le titre ou la catégorie sont modifiés
    titleInput.addEventListener('input', checkFormValidity);
    categorySelect.addEventListener('input', checkFormValidity);

    async function remplirCategories() {
        try {
            const response = await fetch('http://localhost:5678/api/categories');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des catégories');
            }
            const categories = await response.json();
            const selectElement = document.getElementById('photo-category');

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('Une erreur s\'est produite', error);
        }
    }

    document.getElementById('add-photo-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const title = document.getElementById('photo-title').value;
        const category = document.getElementById('photo-category').value;
        const file = fileInput.files[0];

        if (!file || !title || !category) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi des données');
            }

            alert('Photo ajoutée avec succès');         
            await genererWorkModal();            
            await genererWork();
            
        } catch (error) {
            console.error('Une erreur s\'est produite', error);
        }
    });

    // Remplir les catégories lors du chargement de la page
    remplirCategories();
});