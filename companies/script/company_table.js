document.addEventListener('DOMContentLoaded', viewcompanydetails);

function viewcompanydetails() {
    document.getElementById('l').style.display = 'flex';

    const tableBody = document.getElementById("tBody");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company/getall`;

    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loadingIndicator.style.display = 'none'; // Hide loading after response is received
            employeesData = data;
            tableBody.innerHTML = ''; // Clear any previous rows
           //  console.log(data);
            // Populate the table
            employeesData.forEach(element => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td class="pin-column">${element.company_name}</td>
                    <td class="name-column">${element.first_name}</td>
                    <td class="phone-column">${element.phone_number}</td>
                    <td class="isAdmin">${element.email}</td>
                    <td>
                        <div>
                            <span class="icon edit-icon" title="Edit" style="cursor: pointer;">
                                <i class="fa fa-pencil" aria-hidden="true" style="color: #006103;"></i>
                            </span>
                            <span class="icon delete-icon" title="Delete" style="cursor: pointer; margin-left: 10px;" 
                                data-id="${element.company_id}" email-id="${element.email}" delete-comp="${element.company_name}">
                                <i class="fa fa-trash" aria-hidden="true" style="color: #006103;"></i>
                            </span>
                        </div>
                    </td>
                    <td>
                        <button id="send" class="${element.status === "Accepted" ? "" : "re-send"}" 
                            companyIdSends="${element.company_id}" 
                            companyNameForsend="${element.company_name}"
                            phnNo="${element.phone_number}"
                            fName="${element.first_name}"
                            lName="${element.last_name}"
                            mail="${element.email}"
                            style="border:none; background:transparent"
                            ${element.status === "Accepted" ? "disabled" : ""}>
                            <img src="${element.status === "Accepted" ? "../icon/sendDiasable.png" : "../icon/icons8-forward-message-20.png"}">
                        </button>
                    </td>
                `;

                tableBody.appendChild(newRow);

                addCard({
                    company_id: element.company_id,
                    company_name: element.company_name,
                    first_name: element.first_name,
                    last_name: element.last_name,
                    phone_number: element.phone_number,
                    email: element.email,
                    status: element.status
                });
            });

            // Initialize DataTable after populating data
            $(document).ready(function () {
                $('#ticketTable').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true,
                });
            });


           


            // Event listeners
            tableBody.addEventListener('click', function (event) {
                if (event.target.closest('#send')) {
                    const resendButton = event.target.closest('#send');
                    const companyIdSends = resendButton.getAttribute('companyIdSends');
                    const companyNameForsend = resendButton.getAttribute('companyNameForsend');
                    const phnNo = resendButton.getAttribute('phnNo');
                    const fName = resendButton.getAttribute('fName');
                    const lName = resendButton.getAttribute('lName');
                    const mail = resendButton.getAttribute('mail');

                    loadingIndicator.style.display = 'flex'; // Show loading for resend operation
                    const mainContent = document.getElementById('mainContent');
                    mainContent.classList.add('blur-background');
                    loadingIndicator.style.display = 'flex'; // Show loading before fetch

                    // Call the resend API
                    fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company_mail/resend`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            company_id: companyIdSends,
                            company_name: companyNameForsend,
                            phone_number: phnNo,
                            first_name: fName,
                            last_name: lName,
                            email: mail
                        })
                    })
                        .then(response => {
                            loadingIndicator.style.display = 'none'; // Hide loading after resend response
                            if (!response.ok) {
                                throw new Error(`Error: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            // SuccessModal
                            popupModal.style.display = 'block';
                            mainContent.classList.add('blur-background');
                            closePopup.addEventListener('click', function () {
                                window.location.href = 'company.html';
                            });
                        })
                        .catch(error => {
                            loadingIndicator.style.display = 'none'; // Hide loading on error
                            console.error('Error:', error);
                        });
                }

                // Event listener for deleting a company
                if (event.target.closest('.delete-icon')) {
                    const deleteIcon = event.target.closest('.delete-icon');
                    const companyId = deleteIcon.getAttribute('data-id');
                    const rowToDelete = deleteIcon.closest('tr');
                    const email = deleteIcon.getAttribute('email-id');
                    const CompName = deleteIcon.getAttribute('delete-comp');

                    document.getElementById("CompName").innerHTML = `Are you want to Delete ${CompName} Company`;
                    showConfirmModal(() => {
                        // If confirmed, proceed with delete
                        loadingIndicator.style.display = 'flex'; // Show loading before fetch

                        fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company/delete/${companyId}/${email}`, {
                            method: 'PUT',
                        })
                            .then(response => {
                                loadingIndicator.style.display = 'none';
                                if (!response.ok) {
                                    throw new Error(`Error: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(() => {
                                rowToDelete.remove();
                            })
                            .catch(error => {
                                console.error('Delete error:', error);
                                loadingIndicator.style.display = 'none';
                                showalert('Failed to delete the company.');
                            });
                    });
                }
            });
        })
        .catch(error => {
            loadingIndicator.style.display = 'none'; // Hide loading on error
            console.error('Fetch error:', error);
            showalert('Failed to load company details.');
        });

}

// Function to show the confirmation modal
function showConfirmModal(onConfirm) {
    const confirmModal = document.getElementById('confirmModal');
    const confirmYesBtn = document.getElementById('confirmYesBtn');
    const confirmNoBtn = document.getElementById('confirmNoBtn');
    const confirmCBtn = document.getElementById('confirmCBtn');
    if (!confirmModal || !confirmYesBtn || !confirmNoBtn) {
        console.error('Confirm modal elements are not found in the DOM.');
        return;
    }

    confirmModal.style.display = 'block';

    confirmYesBtn.onclick = () => {
        onConfirm();
        confirmModal.style.display = 'none';
    };

    confirmNoBtn.onclick = () => {
        confirmModal.style.display = 'none';
    };
    confirmCBtn.onclick = () => {
        confirmModal.style.display = 'none';
    };
}

// Function to show the alert modal
function showalert(message) {
    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkBtn = document.getElementById('alertOkBtn');

    alertMessage.innerText = message;
    alertModal.style.display = 'block';

    alertOkBtn.onclick = () => {
        alertModal.style.display = 'none';
    };
}


function addCard(employee) {
    const cardHtml = `
        <div class="card mb-3" id="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Company Name </strong>  ${employee.company_name}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Name  </strong>  ${employee.first_name}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Phone </strong>  ${employee.phone_number}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Email </strong>  ${employee.email}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="d-flex justify-content-center">
                            <span class="icon" title="Edit" style="cursor: pointer;">
                                <i class="fa fa-pencil" aria-hidden="true" style="color: #006103;"></i>
                            </span>
                            <span class="icon delete-icon" title="Delete" style="cursor: pointer; margin-left: 10px;" 
                                data-id="${employee.company_id}" 
                                email-id="${employee.email}" 
                                delete-comp="${employee.company_name}">
                                <i class="fa fa-trash" aria-hidden="true" style="color: #006103;"></i>
                            </span>
                        </div>
                    </div>
                    <div class="col-6">
                        <p class="d-flex justify-content-center">
                            <button id="send" class="${employee.status === "Accepted" ? "" : "re-send"}" 
                                companyIdSends="${employee.company_id}" 
                                companyNameForsend="${employee.company_name}"
                                phnNo="${employee.phone_number}"
                                fName="${employee.first_name}"
                                lName="${employee.last_name}"
                                mail="${employee.email}"
                                style="border:none; background:transparent" 
                                ${employee.status === "Accepted" ? "disabled" : ""}>
                                <img src="${employee.status === "Accepted" ? "../icon/sendDiasable.png" : "../icon/icons8-forward-message-20.png"}">
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
    $('#card-container').append(cardHtml);
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





