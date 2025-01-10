function onclick() {
    const overlay = document.querySelector('.overlay');
    const additionalImages = document.getElementById('additional-images');

    overlay.addEventListener('click', function () {
        if (additionalImages.style.display === "none" || additionalImages.style.display === "") {
            additionalImages.style.display = "flex"; // Show the additional images
            document.querySelector(".overlay").textContent = " "
            document.querySelector(".overlay").style.opacity = "0";
        } else {
            additionalImages.style.display = "none"; // Hide the additional images
            document.querySelector(".overlay").textContent = "+3"
            document.querySelector(".overlay").style.opacity = "1";
        }
    });
};
onclick();




