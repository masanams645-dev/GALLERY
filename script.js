// ========================================
// IMAGE DATA
// ========================================

const defaultImages = [

    {
        id: 1,
        title: "Mountain Escape",
        category: "nature",
        url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=80",
        favorite: false
    },

    {
        id: 2,
        title: "Forest Adventure",
        category: "nature",
        url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80",
        favorite: false
    },

    {
        id: 3,
        title: "Ocean Paradise",
        category: "travel",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        favorite: true
    },

    {
        id: 4,
        title: "Modern City",
        category: "travel",
        url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1000&q=80",
        favorite: false
    },

    {
        id: 5,
        title: "Wild Lion",
        category: "animals",
        url: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1000&q=80",
        favorite: false
    },

    {
        id: 6,
        title: "Cute Dog",
        category: "animals",
        url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80",
        favorite: true
    },

    {
        id: 7,
        title: "Developer Setup",
        category: "technology",
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
        favorite: false
    },

    {
        id: 8,
        title: "Coding Workspace",
        category: "technology",
        url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=80",
        favorite: false
    },

    {
        id: 9,
        title: "Fresh Food",
        category: "food",
        url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1000&q=80",
        favorite: false
    },

    {
        id: 10,
        title: "Delicious Pizza",
        category: "food",
        url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80",
        favorite: false
    }

];


// ========================================
// LOAD SAVED DATA
// ========================================

let uploadedImages = [];

try {

    uploadedImages =
        JSON.parse(
            localStorage.getItem("uploadedImages")
        ) || [];

} catch {

    uploadedImages = [];

}

let images = [
    ...defaultImages,
    ...uploadedImages
];


// ========================================
// VARIABLES
// ========================================

let currentCategory = "all";

let filteredImages = [];

let currentIndex = 0;

let zoomLevel = 1;

let slideshowTimer = null;


// ========================================
// ELEMENTS
// ========================================

const gallery =
    document.getElementById("gallery");

const searchInput =
    document.getElementById("searchInput");

const sortSelect =
    document.getElementById("sortSelect");

const noResults =
    document.getElementById("noResults");

const filters =
    document.querySelectorAll(".filter");

const totalImages =
    document.getElementById("totalImages");

const totalCategories =
    document.getElementById("totalCategories");

const totalFavorites =
    document.getElementById("totalFavorites");


// ========================================
// RENDER GALLERY
// ========================================

function renderGallery() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    filteredImages =
        images.filter(image => {

            const matchesSearch =
                image.title
                    .toLowerCase()
                    .includes(searchText);


            let matchesCategory = true;


            if (currentCategory === "favorites") {

                matchesCategory =
                    image.favorite === true;

            }

            else if (currentCategory !== "all") {

                matchesCategory =
                    image.category ===
                    currentCategory;

            }


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    // SORT

    const sortType =
        sortSelect.value;


    if (sortType === "az") {

        filteredImages.sort(
            (a, b) =>
                a.title.localeCompare(b.title)
        );

    }


    if (sortType === "za") {

        filteredImages.sort(
            (a, b) =>
                b.title.localeCompare(a.title)
        );

    }


    if (sortType === "favorites") {

        filteredImages.sort(
            (a, b) =>
                Number(b.favorite) -
                Number(a.favorite)
        );

    }


    gallery.innerHTML = "";


    // EMPTY

    if (filteredImages.length === 0) {

        noResults.style.display = "block";

    }

    else {

        noResults.style.display = "none";

    }


    // CREATE CARDS

    filteredImages.forEach(image => {

        const card =
            document.createElement("div");

        card.className =
            "gallery-card";


        card.innerHTML = `

            <img
                src="${image.url}"
                alt="${escapeHTML(image.title)}"
            >

            <button
                class="favorite ${image.favorite ? "liked" : ""}"
            >
                ${image.favorite ? "♥" : "♡"}
            </button>

            <div class="overlay">

                <h3>
                    ${escapeHTML(image.title)}
                </h3>

                <p>
                    ${image.category}
                </p>

            </div>

        `;


        // OPEN LIGHTBOX

        card.addEventListener(
            "click",
            () => openLightbox(image.id)
        );


        // FAVORITE

        const favoriteButton =
            card.querySelector(".favorite");


        favoriteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleFavorite(image.id);

            }
        );


        gallery.appendChild(card);

    });


    updateStats();

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ========================================
// STATS
// ========================================

function updateStats() {

    totalImages.textContent =
        images.length;


    const categorySet =
        new Set(
            images.map(
                image => image.category
            )
        );


    totalCategories.textContent =
        categorySet.size;


    totalFavorites.textContent =
        images.filter(
            image => image.favorite
        ).length;

}


// ========================================
// FAVORITE
// ========================================

function toggleFavorite(id) {

    const image =
        images.find(
            image => image.id === id
        );


    if (!image) return;


    image.favorite =
        !image.favorite;


    saveUploadedImages();

    renderGallery();


    if (
        filteredImages[currentIndex] &&
        filteredImages[currentIndex].id === id
    ) {

        updateLightbox();

    }

}


// ========================================
// FILTER
// ========================================

filters.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filters.forEach(btn =>
                btn.classList.remove("active")
            );


            button.classList.add("active");


            currentCategory =
                button.dataset.category;


            renderGallery();

        }
    );

});


// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
    "input",
    renderGallery
);


// ========================================
// SORT
// ========================================

sortSelect.addEventListener(
    "change",
    renderGallery
);


// ========================================
// LIGHTBOX
// ========================================

const lightbox =
    document.getElementById("lightbox");

const previewImage =
    document.getElementById("previewImage");

const previewTitle =
    document.getElementById("previewTitle");

const previewCategory =
    document.getElementById("previewCategory");

const counter =
    document.getElementById("counter");

const favoriteBtn =
    document.getElementById("favoriteBtn");


// ========================================
// OPEN LIGHTBOX
// ========================================

function openLightbox(id) {

    filteredImages =
        getFilteredImages();


    currentIndex =
        filteredImages.findIndex(
            image => image.id === id
        );


    if (currentIndex === -1) return;


    zoomLevel = 1;


    updateLightbox();


    lightbox.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


// ========================================
// GET FILTERED IMAGES
// ========================================

function getFilteredImages() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    let result =
        images.filter(image => {

            const searchMatch =
                image.title
                    .toLowerCase()
                    .includes(searchText);


            let categoryMatch = true;


            if (currentCategory === "favorites") {

                categoryMatch =
                    image.favorite;

            }

            else if (
                currentCategory !== "all"
            ) {

                categoryMatch =
                    image.category ===
                    currentCategory;

            }


            return (
                searchMatch &&
                categoryMatch
            );

        });


    const sort =
        sortSelect.value;


    if (sort === "az") {

        result.sort(
            (a, b) =>
                a.title.localeCompare(b.title)
        );

    }

    if (sort === "za") {

        result.sort(
            (a, b) =>
                b.title.localeCompare(a.title)
        );

    }

    if (sort === "favorites") {

        result.sort(
            (a, b) =>
                Number(b.favorite) -
                Number(a.favorite)
        );

    }


    return result;

}


// ========================================
// UPDATE LIGHTBOX
// ========================================

function updateLightbox() {

    const image =
        filteredImages[currentIndex];


    if (!image) return;


    previewImage.src =
        image.url;


    previewTitle.textContent =
        image.title;


    previewCategory.textContent =
        image.category;


    counter.textContent =
        `${currentIndex + 1} / ${filteredImages.length}`;


    favoriteBtn.textContent =
        image.favorite
            ? "♥ Favorited"
            : "♡ Favorite";


    previewImage.style.transform =
        `scale(${zoomLevel})`;

}


// ========================================
// CLOSE LIGHTBOX
// ========================================

document
    .getElementById("closeLightbox")
    .addEventListener(
        "click",
        closeLightbox
    );


function closeLightbox() {

    stopSlideshow();


    lightbox.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

}


// ========================================
// NEXT
// ========================================

document
    .getElementById("nextBtn")
    .addEventListener(
        "click",
        nextImage
    );


function nextImage() {

    if (!filteredImages.length)
        return;


    currentIndex++;


    if (
        currentIndex >=
        filteredImages.length
    ) {

        currentIndex = 0;

    }


    zoomLevel = 1;

    updateLightbox();

}


// ========================================
// PREVIOUS
// ========================================

document
    .getElementById("prevBtn")
    .addEventListener(
        "click",
        previousImage
    );


function previousImage() {

    if (!filteredImages.length)
        return;


    currentIndex--;


    if (currentIndex < 0) {

        currentIndex =
            filteredImages.length - 1;

    }


    zoomLevel = 1;

    updateLightbox();

}


// ========================================
// LIGHTBOX FAVORITE
// ========================================

favoriteBtn.addEventListener(
    "click",
    () => {

        const image =
            filteredImages[currentIndex];


        if (!image) return;


        toggleFavorite(image.id);


        filteredImages =
            getFilteredImages();


        const newIndex =
            filteredImages.findIndex(
                item => item.id === image.id
            );


        if (newIndex !== -1) {

            currentIndex = newIndex;

            updateLightbox();

        }

    }
);


// ========================================
// ZOOM
// ========================================

document
    .getElementById("zoomIn")
    .addEventListener(
        "click",
        () => {

            zoomLevel += .2;


            if (zoomLevel > 3)
                zoomLevel = 3;


            updateLightbox();

        }
    );


document
    .getElementById("zoomOut")
    .addEventListener(
        "click",
        () => {

            zoomLevel -= .2;


            if (zoomLevel < .5)
                zoomLevel = .5;


            updateLightbox();

        }
    );


document
    .getElementById("zoomReset")
    .addEventListener(
        "click",
        () => {

            zoomLevel = 1;

            updateLightbox();

        }
    );


// ========================================
// DOWNLOAD
// ========================================

document
    .getElementById("downloadBtn")
    .addEventListener(
        "click",
        async () => {

            const image =
                filteredImages[currentIndex];


            if (!image) return;


            try {

                const response =
                    await fetch(image.url);


                const blob =
                    await response.blob();


                const url =
                    URL.createObjectURL(blob);


                const link =
                    document.createElement("a");


                link.href = url;


                link.download =
                    image.title
                        .replace(/[^a-z0-9]/gi, "-")
                        .toLowerCase()
                    + ".jpg";


                document.body.appendChild(link);

                link.click();

                link.remove();


                URL.revokeObjectURL(url);

            }

            catch {

                window.open(
                    image.url,
                    "_blank"
                );

            }

        }
    );


// ========================================
// SHARE
// ========================================

document
    .getElementById("shareBtn")
    .addEventListener(
        "click",
        async () => {

            const image =
                filteredImages[currentIndex];


            if (!image) return;


            if (navigator.share) {

                try {

                    await navigator.share({

                        title: image.title,

                        text:
                            `Check out ${image.title}`,

                        url: image.url

                    });

                }

                catch {

                    // User cancelled share

                }

            }

            else {

                try {

                    await navigator.clipboard.writeText(
                        image.url
                    );

                    alert(
                        "Image link copied!"
                    );

                }

                catch {

                    alert(
                        "Sharing is not supported."
                    );

                }

            }

        }
    );


// ========================================
// FULLSCREEN
// ========================================

document
    .getElementById("fullscreen")
    .addEventListener(
        "click",
        async () => {

            try {

                if (!document.fullscreenElement) {

                    await lightbox.requestFullscreen();

                }

                else {

                    await document.exitFullscreen();

                }

            }

            catch {

                alert(
                    "Fullscreen is not supported."
                );

            }

        }
    );


// ========================================
// SLIDESHOW
// ========================================

const slideshowBtn =
    document.getElementById(
        "slideshowBtn"
    );


slideshowBtn.addEventListener(
    "click",
    () => {

        if (slideshowTimer) {

            stopSlideshow();

        }

        else {

            startSlideshow();

        }

    }
);


function startSlideshow() {

    slideshowBtn.textContent =
        "⏸ Pause";


    slideshowTimer =
        setInterval(
            nextImage,
            3000
        );

}


function stopSlideshow() {

    clearInterval(
        slideshowTimer
    );


    slideshowTimer = null;


    slideshowBtn.textContent =
        "▶ Slideshow";

}
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// ========================================
// THEME
// ========================================

const savedTheme =
    localStorage.getItem(
        "pixelvault-theme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

    document.getElementById(
        "themeBtn"
    ).textContent = "☀️";

}


document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            const dark =
                document.body.classList.contains(
                    "dark"
                );


            localStorage.setItem(
                "pixelvault-theme",
                dark
                    ? "dark"
                    : "light"
            );


            document.getElementById(
                "themeBtn"
            ).textContent =
                dark
                    ? "☀️"
                    : "🌙";

        }
    );


// ========================================
// UPLOAD MODAL
// ========================================

const uploadModal =
    document.getElementById(
        "uploadModal"
    );


document
    .getElementById("uploadBtn")
    .addEventListener(
        "click",
        () => {

            uploadModal.classList.add(
                "show"
            );

        }
    );


document
    .getElementById("closeUpload")
    .addEventListener(
        "click",
        () => {

            uploadModal.classList.remove(
                "show"
            );

        }
    );


// ========================================
// ADD UPLOADED IMAGE
// ========================================

document
    .getElementById("addImage")
    .addEventListener(
        "click",
        () => {

            const file =
                document.getElementById(
                    "imageInput"
                ).files[0];


            const title =
                document.getElementById(
                    "imageTitle"
                ).value.trim();


            const category =
                document.getElementById(
                    "imageCategory"
                ).value;


            if (!file) {

                alert(
                    "Please choose an image."
                );

                return;

            }


            if (!title) {

                alert(
                    "Please enter an image title."
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload = event => {

                const newImage = {

                    id: Date.now(),

                    title: title,

                    category: category,

                    url:
                        event.target.result,

                    favorite: false

                };


                images.push(
                    newImage
                );


                saveUploadedImages();

                renderGallery();


                uploadModal.classList.remove(
                    "show"
                );


                document.getElementById(
                    "imageInput"
                ).value = "";


                document.getElementById(
                    "imageTitle"
                ).value = "";


                alert(
                    "Image added successfully!"
                );

            };


            reader.readAsDataURL(file);

        }
    );


// ========================================
// SAVE UPLOADED IMAGES
// ========================================

function saveUploadedImages() {

    const uploaded =
        images.filter(
            image => image.id > 100
        );


    localStorage.setItem(
        "uploadedImages",
        JSON.stringify(uploaded)
    );

}


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            !lightbox.classList.contains(
                "show"
            )
        ) {

            return;

        }


        if (event.key === "Escape") {

            closeLightbox();

        }


        if (event.key === "ArrowRight") {

            nextImage();

        }


        if (event.key === "ArrowLeft") {

            previousImage();

        }


        if (event.key === "+") {

            zoomLevel += .2;

            if (zoomLevel > 3)
                zoomLevel = 3;

            updateLightbox();

        }


        if (event.key === "-") {

            zoomLevel -= .2;

            if (zoomLevel < .5)
                zoomLevel = .5;

            updateLightbox();

        }

    }
);


// ========================================
// INITIAL LOAD
// ========================================

renderGallery();
window.addEventListener("scroll", () => {

    if (window.scrollY > 100) {
        document.body.classList.add("scrolled");
    } else {
        document.body.classList.remove("scrolled");
    }

});
