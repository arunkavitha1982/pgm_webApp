document.addEventListener('click', function (event) {
    // Check if the click is outside the element with id 'toggle'
    const toggleElement = document.getElementById('left');
    const open = document.getElementById('sidebarToggle');
    if (open.contains(event.target)) {
        open.classList.add('active');
    }
    else {
        // If the clicked element is outside the 'left' element, remove 'active' from the current active element
        if (toggleElement && !toggleElement.contains(event.target)) {
            toggleElement.classList.remove('active');
            document.body.className = ''

        }
    }
});