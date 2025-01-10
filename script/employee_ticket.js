$(document).ready(function () {
    let cid = localStorage.getItem("cid");
    document.getElementById("Clogo").src = localStorage.getItem("Clogo");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employees/${cid}`;
    let rowDetails = [];
    let index = 1;
    const CName = localStorage.getItem("CName")


    document.getElementById("CName").innerHTML = CName;
    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            

            data.forEach(ticket => {
                console.log(ticket)
                rowDetails.push(ticket);
                addTicket(ticket);
                addCard(ticket, index); // Pass index for unique IDs
                index++;
            });

            loadingIndicator.style.display = 'none';
        })
        .catch(error => {
            loadingIndicator.style.display = 'none'; // Hide loading indicator in case of an error
        });

    // Show more/less functionality
    $(document).on('click', '.show-more-toggle', function () {
        const index = $(this).data('index');
        $(`#showMoreButton-${index}`).hide();
        $(`#showMoreContent-${index}`).slideDown();
    });

    $(document).on('click', '.show-less-toggle', function () {
        const index = $(this).data('index');
        $(`#showMoreContent-${index}`).slideUp(function () {
            $(`#showMoreButton-${index}`).show();
        });
    });

    // Initialize DataTable
    const table = $('#ticketTable').DataTable({
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        responsive: true
    });

    // Function to add a ticket to the DataTable
    function addTicket(ticket) {
        console.log(ticket)
        // Clean the string by replacing curly quotes with straight quotes
        const cleanedSpecialization = ticket.specialization.replace(/[“”]/g, '"');

        // Parse the cleaned string into an array
        const specializationArray = JSON.parse(cleanedSpecialization);

        // Destructure the array into separate variables
        const [ac, Refrigerator = "rc"] = specializationArray;

        const deleteButton = `<button class="delete-btn btn" onclick="showDeleteEmployeeModal('${ticket.employee_id}')">Delete</button>`;

        // Log the values
        // console.log(ac, Refrigerator); // Output: "Refrigerator"

        const rowNode = table.row.add([
            `${ticket.first_name} ${ticket.last_name}`,
            ticket.phone_number,
            `<div class="issue-type ${ac}"><span class="circle"></span>${ac}</div>
             <div class="issue-type ${Refrigerator} margin"><span class="circle"></span>${Refrigerator}</div>`,
            ticket.email,
            ticket.assigned_locations,
            ticket.employee_no_of_completed_work,
            ticket.no_of_pending_works,
            deleteButton // Add the delete button to the row
        ]).draw(false).node();
    }

    // Function to create and append the card for mobile view
    function addCard(employee, index) {
        const cleanedSpecialization = employee.specialization.replace(/[“”]/g, '"');

        // Parse the cleaned string into an array
        const specializationArray = JSON.parse(cleanedSpecialization);

        // Destructure the array into separate variables
        const [ac, Refrigerator = "rc"] = specializationArray;

        // Log the values
        // console.log(ac, Refrigerator); // Output: "Refrigerator"
        const cardHtml = `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Emp ID :</strong>  00${index}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Phone Number :</strong>  ${employee.phone_number}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Emp Name :</strong>  ${employee.first_name}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Specialization :</strong>  ${ac} <span id="${Refrigerator}">${Refrigerator}</span></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Email:</strong> ${employee.email}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>City:</strong> ${employee.assigned_locations}</p>
                    </div>
                </div>
                <p class="text-center mb-2 show-more-toggle" data-index="${index}" id="showMoreButton-${index}">Show more ⮟</p>
                <div class="show-more" id="showMoreContent-${index}" style="display:none">
                    <div class="row">
                        <div class="col-6">
                            <p><strong>Completed </strong>  ${employee.employee_no_of_completed_work}</p>
                        </div>
                        <div class="col-6">
                            <p><strong>Pending </strong>  ${employee.no_of_pending_works}</p>
                        </div>
                    </div>
                    <button class="delete-btn btn" style="width:100%" onclick="showDeleteEmployeeModal('${employee.employee_id}')">Delete</button>
                    <p class="text-center pt-3 mb-2 show-less-toggle" data-index="${index}">Show less ⮝</p>          
                </div>
            </div>
        </div>
        `;
        // Append the card to the card container for mobile view
        $('#card-container').append(cardHtml);
    }

});

function showDeleteEmployeeModal(eid) {
    // Create modal elements
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = 'deleteModal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'deleteModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', 'custom-modal-content');

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header', 'justify-content-center');
    modalHeader.textContent = "Confirm Employee Deletion";
    const modalTitle = document.createElement('h5');
    modalTitle.classList.add('modal-title');
    modalTitle.id = 'deleteModalLabel';
    modalTitle.textContent = 'Delete';


    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body', 'custom-modal-body');
    modalBody.textContent = 'You want to delete the employee?';

    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer', 'custom-modal-footer');

    const btnYes = document.createElement('button');
    btnYes.type = 'button';
    btnYes.classList.add('btn-yes');
    btnYes.textContent = 'Yes';
    btnYes.onclick = function () {
        // Handle delete logic
        deleteEmp(eid)
        modal.remove();
        modalInstance.hide();
    };

    const btnNo = document.createElement('button');
    btnNo.type = 'button';
    btnNo.classList.add('btn-no');
    btnNo.setAttribute('data-bs-dismiss', 'modal');
    btnNo.textContent = 'No';
    btnNo.onclick = function () {
        modal.remove();
        modalInstance.hide();
    };

    // Append elements to create the full modal structure
    modalFooter.appendChild(btnYes);
    modalFooter.appendChild(btnNo);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    // Append the modal to the body and show it
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}



document.getElementById('sidebarToggle').addEventListener('click', function () {
    var sidebar = document.getElementById('left');
    var body = document.body;
    var mainContents = document.querySelectorAll(".card");
    var content = document.querySelector(".container-sty");
    var tableOddRows = document.querySelectorAll("tr");
    var tableEvenRows = document.querySelectorAll("tr.even");
    var issueType = document.querySelectorAll(".issue-type");
    var tHead = document.querySelector("thead");
    var tHeadCells = document.querySelectorAll("thead th");

    var input = document.querySelectorAll(".input-bottom-border")

    sidebar.classList.toggle('active');

    if (sidebar.classList.contains('active')) {
        // Sidebar is open, apply transparency
        body.classList.add('no-scroll');
        body.classList.add('body-overlay');

        content.style.backgroundColor = "transparent";
        mainContents.forEach(function (mainContent) {
            mainContent.style.backgroundColor = "transparent";
        });
        tableOddRows.forEach(function (row) {
            row.style.cssText = "background-color: transparent !important;"; // Adds !important
        });



        if (tHead) {
            tHead.style.cssText = "background-color: transparent !important;";
        }

        // Apply transparency to each table head cell
        tHeadCells.forEach(function (cell) {
            cell.style.cssText = "background-color: transparent !important;";
        });

        issueType.forEach(function (row) {
            row.style.cssText = "background-color: transparent !important;"; // Adds !important
        });
    } else {
        // Sidebar is closed, reset colors
        body.classList.remove('no-scroll');
        body.classList.remove('body-overlay');

        content.style.backgroundColor = "";
        mainContents.forEach(function (mainContent) {
            mainContent.style.backgroundColor = "";
        });

        tableOddRows.forEach(function (row) {
            row.style.backgroundColor = ""; // Reset odd row background
        });

        tableEvenRows.forEach(function (row) {
            row.style.backgroundColor = ""; // Reset even row background
        });

        if (tHead) {
            tHead.style.backgroundColor = ""; // Reset thead background
        }


        // Reset the background of each table head cell
        tHeadCells.forEach(function (cell) {
            cell.style.backgroundColor = ""; // Reset th background
        });
    }
});



function deleteEmp(eid) {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const failureModal = new bootstrap.Modal(document.getElementById('failureModal'));
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex';


    fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/delete/${eid}`, {
        method: 'PUT'
    })
        .then(response => {
            loadingIndicator.style.display = 'none';
            if (!response.ok) {
                throw new Error('Failed to delete ticket');
            }
            else {
                document.getElementById("success_content").textContent = "Employee deleted successfuly"
                successModal.show();

                document.querySelector(".btn-success").addEventListener("click", function () {
                    window.location = "employee_ticket.html"
                }
                )
            }

        })
        .catch(error => {
            document.getElementById("failure-content").textContent = "Employee Deletion Failed!!!!"
            // alert('Failed to delete ticket. Please try again.');
            failureModal.show()
        });
    // addTicket(data);

}





const successModal = new bootstrap.Modal(document.getElementById('successModal'));
const failureModal = new bootstrap.Modal(document.getElementById('failureModal'));
const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/create`;
const cid = localStorage.getItem("cid");

function createEmployee() {
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex';
    const firstName = document.querySelector("input[placeholder='First Name']").value.trim();
    const lastName = document.querySelector("input[placeholder='Last Name']").value.trim();
    const email = document.querySelector("input[placeholder='Email']").value.trim();
    const phone = document.querySelector("input[placeholder='Phone Number']").value.trim();
    const location = document.querySelector("input[placeholder='Assigned Location']").value.trim();
    const specialization = Array.from(document.querySelectorAll("#dropdownOptions input[type='checkbox']:checked"))
        .map(option => option.value);



    // Convert the array to a string with curly quotes
    const formattedOutputOfspecialization = `["${specialization.join('","').replace(/"/g, '“').replace(/"/g, '”')}"]`;

    // Input validation
    if (!firstName || !lastName || !email || !phone || specialization.length === 0) {
        document.getElementById("failure-content").textContent = "Validation failed: Missing required fields";
        loadingIndicator.style.display = 'none';
        // failureModal.show();
        return;
    }
    else {

        const employeeObject = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phone,
            specialization: formattedOutputOfspecialization,
            assigned_locations: location,
            company_id: cid
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeObject)
        }).then(response => {

            if (!response.ok) {
                loadingIndicator.style.display = 'none';
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
            .then(data => {
                if (data.error) {
                    document.getElementById("failure-content").textContent = data.error;
                    loadingIndicator.style.display = 'none';
                    failureModal.show();
                    console.error('Error:', error.message);
                    document.getElementById("failed_ok_button").addEventListener("click", function () {
                        window.location.href = "employee_ticket.html"
                    })

                }
                else {
                    loadingIndicator.style.display = 'none';
                    successModal.show();
                    document.getElementById("success-modal-ok").addEventListener("click", function () {
                        window.location.href = "employee_ticket.html"
                    })
                }
            })
            .catch(error => {
                console.error('Error:', error.message);
                document.getElementById("failure-content").textContent = "Your Email Id is already register."
                failureModal.show();
            });
    }
}

// Function to add employee to the table
function addEmployeeToTable(employee) {
    const tbody = document.getElementById("tBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${employee.firstName} ${employee.lastName}</td>
        <td>${employee.phone}</td>
        <td>${employee.specialization}</td>
        <td>${employee.email}</td>
        <td>${employee.location || "Location TBD"}</td>
        <td>${employee.completedWork || 0}</td>
        <td>${employee.pendingWork || 0}</td>
    `;

    tbody.appendChild(newRow);
}

// Reset form function
function resetForm() {
    document.querySelector("input[placeholder='First Name']").value = "";
    document.querySelector("input[placeholder='Last Name']").value = "";
    document.querySelector("input[placeholder='Email']").value = "";
    document.querySelector("input[placeholder='Phone Number']").value = "";
    document.querySelector("input[placeholder='Assigned Location']").value = "";
    document.getElementById("dropdownButton").textContent = "Specialization";

  // Hide the input fields
}

function show() {
    const inputElements = document.querySelectorAll(".input-bottom-border");

    inputElements.forEach(element => {
        element.style.display = "inline";
    });
    document.getElementById("cancel").style.display = "inline";
    document.getElementById("addEmployee2").style.display = "none";
    document.getElementById("addEmployee").style.display = "inline";
}

// Hide the input fields when "Cancel" button is clicked
function cancel() {
    resetForm();
    const error = document.querySelectorAll('.error-text');
    error.forEach(element => {
        element.style.display = "none";
    });
    const inputElements = document.querySelectorAll(".input-bottom-border");

    // Loop through each element and set the display style to "none"
    inputElements.forEach(element => {
        element.style.display = "none";
    });
    document.getElementById("cancel").style.display = "none";
    document.getElementById("addEmployee2").style.display = "inline";
    document.getElementById("addEmployee").style.display = "none";
    
}

const MAX_SELECTION = 3;

function toggleDropdown(event) {
    const dropdownOptions = document.getElementById("dropdownOptions");
    dropdownOptions.style.display = dropdownOptions.style.display === "block" ? "none" : "block";
    event.stopPropagation();
}

function updateButton(checkbox) {
    const checkboxes = document.querySelectorAll("#dropdownOptions input[type='checkbox']");
    const selectedOptions = Array.from(checkboxes).filter(checkbox => checkbox.checked);

    // Limit selection to MAX_SELECTION
    if (selectedOptions.length > MAX_SELECTION) {
        checkbox.checked = false;
        alert(`You can select up to ${MAX_SELECTION} options only.`);
        return;
    }

    const selectedValues = selectedOptions.map(option => option.value);
    const dropdownButton = document.getElementById("dropdownButton");
    dropdownButton.textContent = selectedValues.length > 0
        ? selectedValues.join(", ")
        : "Specialization";
}

// Close the dropdown if the user clicks outside of it
window.onclick = function () {
    const dropdownOptions = document.getElementById("dropdownOptions");
    dropdownOptions.style.display = "none";
};

document.getElementById("success-model-ok").addEventListener('click', function () {
    window.location.href = "employee_ticket.html";
})



