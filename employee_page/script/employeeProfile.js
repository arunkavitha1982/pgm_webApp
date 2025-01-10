
let profileData; // Variable to hold the profile data
let getCustomerDatasFromDb;

document.addEventListener("DOMContentLoaded", function () {
    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch

    document.getElementById("Clogo").src = localStorage.getItem("Clogo");

    // Check if profile data is already loaded
    if (profileData) {

        // Use the already loaded data
        populateProfileData(profileData);

    } else {
        // Load data from API
        loadProfileDataFromAPI();
    }
});

// Function to load profile data from the API
async function loadProfileDataFromAPI() {
    const loadingIndicator = document.getElementById('l');
    const eid = localStorage.getItem("eid");
    const url = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/get/${eid}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        profileData = await response.json();
        
        populateProfileData(profileData);
        IsActive(profileData.available);
        EmpStatus(profileData.employee_status);
       // //  console.log("Ak")
        checkbox(profileData.specialization);
    } catch (error) {
        loadingIndicator.style.display = 'none';

    }

}

// Function to populate profile data into the form fields
function populateProfileData(data) {

    console.log(data)

    // Company datas 
    document.getElementById('first_name').value = data.first_name || '';
    document.getElementById('last_name').value = data.last_name || '';

    document.getElementById("logoPreview").src = data.photo || '';

    document.getElementById('email').value = data.email || '';
    document.getElementById('phone_number').value = data.phone_number || '';


    document.getElementById('areas_covered').value = data.areas_covered || '';
    document.getElementById('assigned_locations').value = data.assigned_locations || '';

    document.getElementById('qualification').value = data.qualification || '';
    document.getElementById('experience').value = data.experience || '';

    document.getElementById('street').value = data.street || '';
   
    document.getElementById('driving_license').value = data.driving_license || '';

    document.getElementById('city').value = data.city || '';
    document.getElementById('zip').value = data.zip || '';

    


    document.getElementById('status').value = data.employee_status || '';
    document.getElementById('skills').value = data.skills || '';

    document.getElementById('availability').value = data.available === 1 ? 'Yes' : 'No';

    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'none';


}

// Ensure the DOM is fully loaded before executing the script
function checkbox(value) {
    const specialization = JSON.parse(value).join(',');

    if (specialization == "AC") {
        document.getElementById("ac").checked = true;
        document.querySelector('.multi-select-input3').value = specialization;
    }
    if (specialization == "Refrigerator") {
        document.getElementById("refrigerator").checked = true;
        document.querySelector('.multi-select-input3').value = specializationp;
    }
    else if (specialization == null) {
        document.getElementById("ac").checked = false;
        document.getElementById("refrigerator").checked = false;
        document.querySelector('.multi-select-input3').value = specialization;
    }
    else {
        document.getElementById("ac").checked = true;
        document.getElementById("refrigerator").checked = true;
        document.querySelector('.multi-select-input3').value = "AC,Refrigerator";
    }
    

}

function IsActive(isActive) {
    document.getElementById(isActive === 1 ? "Yes" : "No").checked = true;
}


function EmpStatus(empStatus) {
   // //  console.log(empStatus)
    document.getElementById(empStatus === "Active" ? "isAvailable" : "IsNotAvailable").checked = true;
}


// Function to save form data to localStorage on submission
function saveFormDataToLocalStorage() {
    const fields = [
        'first_name', 'last_name', 'phone_number', 'street', 'addressLine', "driving_license", 'email', 'Specialization', 'zip', 'experience', 'availability', 'qualification', 'skills', 'employee_status', 'assigned_locations', 'areas_covered'
    ];

    fields.forEach(field => {
        localStorage.setItem(field, document.getElementById(field).value);
    });
}

function getFieldValue(id) {
    const value = document.getElementById(id).value;
    return value === "" ? null : value;
}


document.addEventListener("DOMContentLoaded", () => {
    const loadingIndicator = document.getElementById('l');

    // Function to update the input field based on selected checkboxes
    function updateSelection(dropdownSelector, inputSelector) {
        const checkboxes = document.querySelectorAll(`${dropdownSelector} input[type='checkbox']`);
        const selectedValues = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)  // Only include checked checkboxes
            .map(checkbox => checkbox.value.trim());  // Get the value of each checked checkbox

        // Update the input field with the display format: "AC, Refrigerator"
        const inputField = document.querySelector(inputSelector);

        if (selectedValues.length > 0) {
            inputField.value = selectedValues.join(', ');  // Comma-separated list for display
        } else {
            // Fetch the previously saved value (old value), you could get this from localStorage, or an API.
            const oldValue = localStorage.getItem('specialization') || '';  // Example of fetching old value
            inputField.value = oldValue;  // Set to old value if no specialization is selected
        }

        // Set the hidden field for API submission (escaped format)
        const apiFormatField = document.querySelector("#specialization-api-format");
        apiFormatField.value = JSON.stringify(selectedValues);  // Converts array to JSON string
    }

    // Add event listeners to all checkboxes in the dropdown
    document.querySelectorAll(".multi-select-option3 input").forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelection(".multi-select-dropdown3", ".multi-select-input3");

            // Save selected specialization to localStorage
            const selectedValues = Array.from(document.querySelectorAll(".multi-select-option3 input:checked"))
                .map(checkbox => checkbox.value.trim());

            // If no specializations are selected, use the old value (stored in localStorage)
            if (selectedValues.length === 0) {
                const oldValue = localStorage.getItem('specialization') || ''; // Fallback to old value
                localStorage.setItem('specialization', oldValue); // Keep the old value if no selection is made
            } else {
                localStorage.setItem('specialization', selectedValues.join(', '));  // Store as a comma-separated string
            }
        });
    });

    // Optional: call updateSelection initially in case some checkboxes are pre-checked
    updateSelection(".multi-select-dropdown3", ".multi-select-input3");



    // Example of form submission (if needed)
    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", (e) => {
        //// //  console.log(localStorage.getItem("specialization"))
        const specialization = localStorage.getItem("specialization");
       // //  console.log(specialization)

        // Check if the value is a string and split it manually if needed
        let parsedSpecialization;

        if (specialization) {
            // If it's a simple comma-separated string, split it into an array
            parsedSpecialization = specialization.split(",").map(item => item.trim());
        }

        // Now print the result in the exact format you want with escaped quotes
        const SpecializationFinal = JSON.stringify(parsedSpecialization); // Convert to JSON string


        loadingIndicator.style.display = 'flex';
        e.preventDefault();
        const cid = localStorage.getItem("cid");
        const eid = localStorage.getItem("eid");
        const updateApiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/update/${eid}`;

        // Get the specialization values (in API format)
        const specializationApiFormatInput = document.querySelector("#specialization-api-format");

        // Build the profileData object
        const profileData = {
            company_id: cid,
            first_name: getFieldValue("first_name"),
            last_name: getFieldValue("last_name"),
            street: getFieldValue("street"),
            zip: getFieldValue("zip"),
            specialization: SpecializationFinal,  // This now holds the API format
            city: getFieldValue("city"),
            email: getFieldValue("email"),
            phone_number: getFieldValue("phone_number"),
            areas_covered: getFieldValue("areas_covered"),
            assigned_locations: getFieldValue("assigned_locations"),
            employee_status: getFieldValue("status"),
            available: getFieldValue("availability") == "Yes" ? 1 : 0,
            skills: getFieldValue("skills"),
            driving_license: getFieldValue("driving_license"),
            qualification: getFieldValue("qualification"),
            experience: getFieldValue("experience"),
        };

        loadingIndicator.style.display = 'none'
        // Example API submission (use your actual API endpoint)
        fetch(updateApiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        })
            .then(response => {
                loadingIndicator.style.display = 'none';
                if (!response.ok) throw new Error(`Error: ${response.status}`);

                window.location.href = "employeeProfile.html";
                return response.json();
            })
            .catch(error => loadingIndicator.style.display = 'none');
    });
});


// When I click Logo go to home page 

function homePage() {
    const modalElement = document.getElementById('homePageModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}



async function handleFileSelect(event) {
    const file = event.target.files[0]; // Get the selected file
    if (!file) {
        // alert("No file selected.");
        return;
    }

    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex'; // Show loading before fetch

    // Convert file to Base64 format
    const reader = new FileReader();
    reader.onload = async function (e) {
        const base64Data = e.target.result.split(",")[1]; // Extract Base64 portion
        const fileName = file.name;

        let imagePreview = document.getElementById(`logoPreview`);
        if (!imagePreview) {
            // Dynamically create an <img> element if it doesn't exist
            imagePreview = document.createElement('img');
            imagePreview.id = `logoPreview`;
            imagePreview.style.objectFit = 'cover';

            // Replace the label with the newly created <img> element
            const label = document.querySelector(`label[for="upload2-${ticketId}-${ticketToken}"]`);
            if (label) {
                label.parentNode.replaceChild(imagePreview, label);
            }
        }

        // Update the image preview's `src` attribute
        imagePreview.src = e.target.result;

        try {
            // Send Base64 data to the server
            const response = await fetch("https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company_logo_upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_name: fileName,
                    file_data: base64Data,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // alert("Upload succeeded: " + data.file_url);
                updateLink(data.file_url); // Update UI with the uploaded file URL
            } else {
                // alert("Upload failed: " + data.detail);
                loadingIndicator.style.display = 'none';
            }
        } catch (error) {
            console.error("Error:", error);
            loadingIndicator.style.display = 'none';
            // alert("An error occurred during the upload. Please try again.");
        }
    };

    reader.readAsDataURL(file); // Read file as Base64
}

async function updateLink(url) {
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex'; // Show loading before fetch
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/update/${eid}`;
    const payload = {
        company_id: cid,
        photo: url
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        loadingIndicator.style.display = 'none';
        if (response.ok) {

        } else {
            // alert('Error updating link.');
        }
    } catch (error) {
        loadingIndicator.style.display = 'none';
        console.error('Error updating link:', error);
        // alert('Error updating link. Check console for details.');
    }
}