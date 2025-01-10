var emp_details_map;

const cid = localStorage.getItem("cid");
document.getElementById("Clogo").src = localStorage.getItem("Clogo");
$(document).ready(function () {

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/unassigned/${cid}`;
    let rowDetails = [];
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex';
    const CName = localStorage.getItem("CName")
    document.getElementById("CName").innerHTML = CName;
    // Fetch employee data for the select options
    const employeeUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee_based_pending_works_count/${cid}`;
    fetch(employeeUrl)
        .then(response => response.json())
        .then(data => {
            // Populate global employeeOptions for use in both addCard and format
            emp_details_map = data;

        })
        .catch(error => console.error('Error fetching employees:', error));

    // Fetch tickets
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loadingIndicator.style.display = 'none';
            data.forEach(ticket => {
                rowDetails.push(ticket);
                addTicket(ticket);
                addCard(ticket); // Use employeeOptions in addCard
            });
        })
        .catch(error => {
            console.error('Error fetching tickets:', error);
            loadingIndicator.style.display = 'none';
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
        const rowNode = table.row.add([
            `<span></span>`,
            ticket.ticket_id,
            `<div class="issue-type ${ticket.ticket_type}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city,
        ]).draw(false).node();

        $(rowNode).find('td:first').addClass('details-control');
    }

    // Function to format each row with expandable details
    function format(rowData) {

        return ` <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                       
                        <div class="col-md-4 box1" >
                            <strong class="d-flex justify-content-left">Customer Address</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
    ${(rowData?.street || 'N/A')}, 
    ${(rowData?.city || 'N/A')}, 
    ${(rowData?.zip || 'N/A')}, 
    ${(rowData?.state || 'N/A')}
</p>

                            
                           <label>Employee Name</label>
   <select class="form-select employee-select mt-2" 
            id="employee-select-${rowData.ticket_id}" 
            onchange="clearEmployeeError(${rowData.ticket_id})" 
            required>
        <option value="" disabled selected>Select</option>
        ${employee_det_options_get(rowData.ticket_type)}
    </select>
    <small id="employee-error-${rowData.ticket_id}" style="color: red; display: none;">Please select an employee.</small>
    <small><label id="pending-text-${rowData.ticket_id}"></label><span id="pending-count-${rowData.ticket_id}"></span></small>                         
                        </div>
                        <div class="col-md-2"></div>
                       
                        <div class="col-md-6 box2">
                            <strong>Description:</strong>
                            <p class="description">${rowData.description}</p>
                          <div class="image-gallery row g-2 justify-content-center">
                            <!-- Upload 1 -->
                            
                                     ${rowData.ti_photo_1 ? `
                                           <div class="col-5 col-sm-4 col-md-3">
                                            <div class="uploads position-relative border" style="width: 100%; height: 100px;">
                                            <img id="image-preview1-${rowData.ticket_id}-${rowData.id}" src="${rowData.ti_photo_1}"  alt="" class="w-100 h-100" 
                                                style="object-fit: cover;" />
                                            </div>
                                            </div>
                                        ` : `
            
                                    `}
                                <!-- Upload 2 -->
        
                                    ${rowData.ti_photo_2 ? `
                                    <div class="col-5 col-sm-4 col-md-3">
                                    <div class="uploads position-relative border" style="width: 100%; height: 100px;">
                                    <img id="image-preview2-${rowData.ticket_id}-${rowData.id}" src="${rowData.ti_photo_2}" alt="" class="w-100 h-100" 
                                    style="object-fit: cover;" />
                                    </div>
                                    </div>
                                ` : `  `}
                        
                                    <!-- Upload 3 -->
                        
                                    ${rowData.ti_photo_3 ? `
                                    <div class="col-5 col-sm-4 col-md-3">
                                    <div class="uploads position-relative border" style="width: 100%; height: 100px;">
                                    <img id="image-preview3-${rowData.ticket_id}-${rowData.id}"src="${rowData.ti_photo_3}" 
                                    alt=" " class="w-100 h-100" style="object-fit: cover;"/>
                                    </div>
                                    </div>
                                ` : ` `} 
                            
                             
                        </div>

                        
                        <div class="mt-3 mb-3">
                            <div class="row">
                                <div class="d-flex flex-column justify-content-center align-items-center">
                                    <input type="text" placeholder="Reason" 
                                        class="input-bottom-reason mt-3" 
                                        id="reason-${rowData.ticket_id}" 
                                        style="width:100%;border: none !important;background-color: transparent;outline: none; 
                                                border-bottom: 1px solid #9e9e9e !important;display:none">
                                    <small id="error-message-${rowData.ticket_id}" 
                                        style="color: red; display: none;">Reason is required.</small>
                                </div>
                            </div>
                            <div class="row mt-2" id="acceptButton-${rowData.ticket_id}">
                                <div class="col-6">
                                    <button type="submit" class="btn-yes" 
                                            style="width:100%" 
                                            onclick="handleAssign('${cid}', ${rowData.ticket_id})">Assign</button>
                                </div>
                                <div class="col-6">
                                    <button class="form-control employee-select cancel btn-no" 
                                            style="width:100%" 
                                            onclick="reason('${rowData.ticket_id}')" 
                                            id="cancel">Reject</button>
                                </div>
                            </div>

                            <div class="row" id="comformButton-${rowData.ticket_id}" style="display:none">
                                <div class="col-6">
                                    <button class="form-control mt-2 employee-select btn-yes comform" 
                                            onclick="handleReject(${rowData.ticket_id})" 
                                            style="width:100%" 
                                            id="completed">Confirm</button>
                                </div>
                                <div class="col-6">
                                    <button class="form-control mt-2 employee-select cancel" 
                                            style="width:100%" 
                                            onclick="cancel('${rowData.ticket_id}')"  
                                            id="cancel">Cancel</button>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </td>
            </tr>`;
    }



    // Expand row details on click
    $('#ticketTable tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = table.row(tr);
        const ticket_id = tr.find('td:nth-child(2)').text();
        const details = rowDetails.find(detail => detail.ticket_id == ticket_id);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        } else {
            row.child(format(details)).show();
            tr.addClass('shown');
        }
    });


    $(document).on('change', '.employee-select', function () {
        const selectedOption = $(this).find(':selected');
        const pendingWork = selectedOption.attr('pending');
        const ticketId = $(this).attr('id').split('-')[2]; 
        $(`#pending-text-${ticketId}`).text(`Pending work : `);
        $(`#pending-count-${ticketId}`).text(`${pendingWork || 'N/A'}`);
    });

    // Function to create and append the card for mobile view
    function addCard(employee) {
        console.log(employee)
        const cardHtml = `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Name:</strong> ${employee.name}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Ticket ID:</strong> ${employee.ticket_id}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Issue Type:</strong> ${employee.ticket_type}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Date:</strong> ${employee.complain_raised_date}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Phone:</strong> ${employee.phone_number}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>City:</strong> ${employee.city}</p>
                    </div>
                </div>
                <p class="text-center mb-2 showMoreButton">Show more ⮟</p>
                <div class="show-more" style="display:none">
                    <p><strong>Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
                   <p><strong>Employee Name:</strong>
                        <select class="form-select employee-select mt-2" 
            id="employee-select-${employee.ticket_id}" 
            onchange="clearEmployeeError(${employee.ticket_id})" 
            required>
        <option value="" disabled selected>Select</option>
        ${employee_det_options_get(employee.ticket_type)}
    </select>
    <small id="employee-error-${employee.ticket_id}" style="color: red; display: none;">Please select an employee.</small>
   
                    </p>
                    <p><strong id="pending-text-${employee.ticket_id}"></strong>
                          <small id="pending-count-${employee.ticket_id}"></small>
                    </p>
                      <div class="image-gallery d-flex justify-content-center mt-3">
                          

                         ${employee.ti_photo_1 ? ` <div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.ti_photo_1}" alt="Image 1" class="p-2" width="100px"> </div>` : `<p id="empty"></p>`}   
                           ${employee.ti_photo_2 ? `<div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.ti_photo_2}" alt="Image 1" class="p-2" width="100px"> </div>` : `<p id="empty"></p>`} 
                           ${employee.ti_photo_3 ? `<div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.ti_photo_3}" alt="Image 1" class="p-2" width="100px"> </div>` : `<p id="empty"></p>`} 
                        </div>

                         <div class="row">
                                <div class="d-flex justify-content-center align-items-center">
                                    <input type="text" placeholder="Reason" class="input-bottom-reason mt-3" id="reason-${employee.ticket_id}" style="width:100%;border: none !important;background-color: transparent;outline: none;
                border-bottom: 1px solid #9e9e9e !important;display:none">
                                </div>
                            </div>
                  
                  <div class="row mt-2" id="acceptButton-${employee.ticket_id}">
                                <div class="col-6">
                               <button type="button" class="btn-yes" style="width:100%;    padding-top: 5px !important;
    padding-bottom: 5px !important;" onclick="handleAssign('${cid}', ${employee.ticket_id})">Assigned</button>
                                </div>
                                <div class="col-6">
                                    <button class="form-control employee-select cancel btn-no" style="width:100%" onclick="reason('${employee.ticket_id}')" id="cancel">Reject</button>
                                </div>
                            </div>
                            <div class="row" id="comformButton-${employee.ticket_id}" style="display:none">
                       <div class="col-6">
                            <button class="form-control mt-2 employee-select btn-yes comform" onclick="handleReject(${employee.ticket_id})" style="width:100%;    padding-top: 5px !important;
    padding-bottom: 5px !important;" id="completed">Confirm</button>
                        </div>
                       <div class="col-6">
                            <button class="form-control mt-2 employee-select cancel" style="width:100%" onclick="cancel('${employee.ticket_id}')"  id="cancel">Cancel</button>
                        </div>
                    </div>
                    <p class="text-center pt-3 mb-2 showLessButton">Show less ⮝</p>
                </div>
            </div>
        </div>`;

        $('#card-container').append(cardHtml);
    }

    // Show more functionality
    $(document).on('click', '.showMoreButton', function () {
        $(this).closest('.card-body').find('.show-more').slideDown();
        $(this).hide();
    });

    $(document).on('click', '.showLessButton', function () {
        $(this).closest('.card-body').find('.show-more').slideUp();
        $(this).closest('.card-body').find('.showMoreButton').show();
    });
});
function clearEmployeeError(ticketId) {
    const employeeError = document.getElementById(`employee-error-${ticketId}`);
    employeeError.style.display = 'none'; // Hide the error message when a valid option is selected
}
function reason(ticketID) {
    const reasonInput = document.getElementById(`reason-${ticketID}`);
    const acceptButton = document.getElementById(`acceptButton-${ticketID}`);
    const confirmButton = document.getElementById(`comformButton-${ticketID}`);

    if (reasonInput && acceptButton && confirmButton) {
        reasonInput.style.display = 'block';
        acceptButton.style.display = 'none';
        confirmButton.style.display = 'flex';

    } else {
        console.error(`Elements not found for ticketID: ${ticketID}`);
        reasonInput.style.display = 'block';
        acceptButton.style.display = 'none';
        confirmButton.style.display = 'flex';
    }
}
function cancel(ticketID) {
    const reasonInput = document.getElementById(`reason-${ticketID}`);
    const acceptButton = document.getElementById(`acceptButton-${ticketID}`);
    const confirmButton = document.getElementById(`comformButton-${ticketID}`);

    if (reasonInput && acceptButton && confirmButton) {
        reasonInput.style.display = 'none';
        acceptButton.style.display = 'flex';
        confirmButton.style.display = 'none';
        document.getElementById(`error-message-${ticketID}`).style.display='none';

    } else {
        console.error(`Elements not found for ticketID: ${ticketID}`);
    }
}

async function assignedEmployee(cid, employee_id, ticket_id) {

    if (!employee_id) {
        alert("fjkfha")
        return;
    }
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex';
    const assignAPI = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/approve_ticket/${cid}/${ticket_id}/${employee_id}`;

    try {
        const response = await fetch(assignAPI, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} - ${errorMessage}`);

        }
        const data = await response.json();
        loadingIndicator.style.display = 'none';
        window.location.href = 'In-Progress.html';

    } catch (error) {
        console.error("Failed to assign employee:", error.message);
        loadingIndicator.style.display = 'none';
    }
}



// Function to handle assignment
function handleAssign(cid, ticketId) {
    const selectElement = document.getElementById(`employee-select-${ticketId}`);
    const selectedValue = selectElement.value;

    const employeeSelect = document.getElementById(`employee-select-${ticketId}`);
    const employeeError = document.getElementById(`employee-error-${ticketId}`);

    if (!employeeSelect.value) {
        employeeError.style.display = 'block'; // Show error if no selection
        employeeSelect.focus();
        return;
    }

    // Ensure ticketId is a number, if not, convert it to a valid format
    const ticketIdInt = parseInt(ticketId, 10);
    if (isNaN(ticketIdInt)) {
        console.error(`Invalid ticket ID: ${ticketId}`);
        return; // Prevent the function from proceeding
    }

    assignedEmployee(cid, selectedValue, ticketIdInt);
}


async function handleReject(ticketid) {

    const reasonInput = document.getElementById(`reason-${ticketid}`);
    const reason = reasonInput.value.trim();
    const errorMessage = document.getElementById(`error-message-${ticketid}`);

    if (!reason) {
        errorMessage.style.display = 'block'; // Show the error message
        reasonInput.focus();
        return;
    }
    // Show loading indicator
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex';

    // Get today's date in "YYYY-MM-DD" format
    const today = new Date().toISOString().split('T')[0];


    // Define the body content to send, including row details
    const requestBody = {
        rejected_reason: document.getElementById(`reason-${ticketid}`).value,
        rejected_date: today
    };

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/admin_reject_ticket/${ticketid}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();

        loadingIndicator.style.display = 'none';
        window.location.href = 'Unassigned.html';



    } catch (error) {
        console.error("Failed to reject ticket:", error.message);
        loadingIndicator.style.display = 'none';
    }
}
function employee_det_options_get(ticketType) {
    if (!emp_details_map || !emp_details_map[ticketType]) {
        console.error(`Invalid ticketType: ${ticketType}`);
        return `<option disabled>No employees available for ${ticketType}</option>`;
    }

    var employeeOptions = emp_details_map[ticketType].map(employee =>
        `<option pending="${employee.no_of_pending_works}" value="${employee.employee_id}" ${employee.no_of_pending_works > 5 ? 'disabled' : ''}>
            ${employee.employee_name}
        </option>`
    ).join("");

    return employeeOptions;
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


