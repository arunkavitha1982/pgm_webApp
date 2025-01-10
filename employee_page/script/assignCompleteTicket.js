$(document).ready(function () {
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");
    document.getElementById("Clogo").src = localStorage.getItem("Clogo");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employees/pending_tickets/${cid}/${eid}`;
    let rowDetails = [];
    const CName = localStorage.getItem("CName")
    document.getElementById("e_name").innerHTML = localStorage.getItem("e_name");
    document.getElementById("CName").innerHTML = CName;
    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let index = 0;
            loadingIndicator.style.display = 'none';
            data.forEach(ticket => {
                rowDetails.push(ticket);
                addTicket(ticket);
                addCard(ticket);
                index++;
            });
        })
        .catch(error => {
            console.error('Error fetching tickets:', error);
            loadingIndicator.style.display = 'none'; // Hide loading indicator in case of an error
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
        const rowNode = table.row.add([
            `<span></span>`, // Control for expanding the row
            ticket.ticket_id,
            `<div class="issue-type ${ticket.ticket_type}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city
        ],
            '').draw(false).node();

        $(rowNode).find('td:first').addClass('details-control');
    }

    // Format the row details
    function format(rowData) {
        //  console.log(rowData)
        return `
            <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                        <div class="col-md-4 box1">
                            <strong class="d-flex justify-content-left">Customer Address</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
                                ${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}
                            </p>
                        </div>
                        <div class="col-md-2"></div>
                     
                        <div class="col-md-6 box2">
                            <strong>Description:</strong>
                            <p class="description">${rowData.description}</p>
                        
                                <div class="image-gallery row g-2 ">
                            <!-- Upload 1 -->
                            
                                     ${rowData.ti_photo_1 ? `
                                              <div class="col-5 col-sm-4 col-md-3">
                                    <div class="uploads position-relative border">
                                        <img 
                                            id="image-preview1-${rowData.ticket_id}-${rowData.id}" 
                                            src="${rowData.ti_photo_1}" 
                                            alt="Uploaded Image" 
                                            class="responsive-image" 
                                        />
                                    </div>
                                </div>
                                        ` : `
            
                                    `}
                                <!-- Upload 2 -->
        
                                    ${rowData.ti_photo_2 ? `
                                       <div class="col-5 col-sm-4 col-md-3">
                                    <div class="uploads position-relative border">
                                        <img 
                                            id="image-preview1-${rowData.ticket_id}-${rowData.id}" 
                                            src="${rowData.ti_photo_2}" 
                                            alt="Uploaded Image" 
                                            class="responsive-image" 
                                        />
                                    </div>
                                </div>
                                ` : `  `}
                        
                                    <!-- Upload 3 -->
                        
                                    ${rowData.ti_photo_3 ? `
                                       <div class="col-5 col-sm-4 col-md-3">
                                    <div class="uploads position-relative border">
                                        <img 
                                            id="image-preview1-${rowData.ticket_id}-${rowData.id}" 
                                            src="${rowData.ti_photo_3}" 
                                            alt="Uploaded Image" 
                                            class="responsive-image" 
                                        />
                                    </div>
                                </div>
                                ` : ` `} 

                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="justify-content-center align-items-center ">
                            <input type="text" placeholder="Reason" class="input-bottom-reason mt-3" id="reason-${rowData.ticket_id}" style="display:none;width:100%;border: none !important;background-color: transparent;outline: none;
        border-bottom: 1px solid #9e9e9e !important;">
        <div class="error-text pt-2" id="error" style="display: none;color: red;">
                                                Please fill the field</div>
                        </div>
                    </div>
                <div class="row mt-2" id="acceptButton-${rowData.ticket_id}">
                    <div class="col-6">
                       <button class="form-control mt-2 employee-select comform" 
                            style="width:100%" 
                            onclick="acceptClick('${rowData.id}')" 
                            id="completed">Accept</button>
                    </div>
                    <div class="col-6">
                        <button class="form-control mt-2 employee-select cancel" style="width:100%" onclick="reason('${rowData.ticket_id}')" id="cancel">Reject</button>
                    </div>
                </div>

                <div class="row" id="comformButton-${rowData.ticket_id}" style="display:none">
                       <div class="col-6">
                            <button class="form-control mt-2 employee-select comform" onclick="rejectedTicket('${rowData.company_id}','${rowData.ticket_id}','${rowData.employee_id}')" style="width:100%" id="completed">Confirm</button>
                        </div>
                       <div class="col-6">
                            <button class="form-control mt-2 employee-select cancel" style="width:100%" onclick="cancel('${rowData.ticket_id}')"  id="cancel">Cancel</button>
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

    // Function to create and append the card for mobile view
    function addCard(employee) {
        //  console.log(employee)
        const cardHtml = `
        <div class="card mb-3" id="card-${employee.ticket_id}">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Emp ID</strong>: ${employee.ticket_id}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Issue Type</strong>: ${employee.ticket_type}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Emp Name</strong>: ${employee.name}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Phone</strong>: ${employee.phone_number}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Date</strong>: ${employee.complain_raised_date}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Location</strong>: ${employee.city}</p>
                    </div>
                </div>

                <p class="text-center mb-2 showMoreButton">Show more ⮟</p>
                <div class="show-more" style="display:none">
                <div class="row">
                    <div class="col-12">
                        <p><strong>Address</strong>: ${employee.address}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <p><strong>Description</strong>: ${employee.description}</p>
                    </div>
                </div>
                 <div class="image-gallery d-flex flex-row justify-content-center">
                        <div class="image-container d-flex flex-row justify-content-center">

                         ${employee.ti_photo_1 ? ` <img src="${employee.ti_photo_1}" alt="Image 1" class="p-2" width="100px">` : ``}   
                           ${employee.ti_photo_2 ? ` <img src="${employee.ti_photo_2}" alt="Image 1" class="p-2" width="100px">` : ``} 
                           ${employee.ti_photo_3 ? ` <img src="${employee.ti_photo_3}" alt="Image 1" class="p-2" width="100px">` : ``} 
                        </div>
                </div>
                <div class="row">
                    <div class="d-flex justify-content-center align-items-center">
                        <input type="text" placeholder="Reason" class="input-bottom-reason mt-3" id="reason-${employee.ticket_id}" style="display:none;width:100%;background-color: transparent;outline: none;border-bottom:1px solid #9e9e9e !important;border:none">
                    </div>
                </div>
                <div class="row mt-2" id="acceptButton-${employee.ticket_id}">
                    <div class="col-6">
                        <button class="form-control mt-2 employee-select comform" style="width:100%" onclick="acceptClick('${employee.id}')"  id="completed">Accept</button>
                    </div>
                    <div class="col-6">
                        <button class="form-control mt-2 employee-select cancel" style="width:100%" onclick="reason('${employee.ticket_id}')" id="cancel">Reject</button>
                    </div>
                </div>
               

                <div class="row" id="comformButton-${employee.ticket_id}" style="display:none">
                       <div class="col-6">
                            <button class="form-control mt-2 employee-select comform" style="width:100%" onclick="rejectedTicket('${employee.company_id}','${employee.ticket_id}','${employee.employee_id}')" id="completed">Confirm</button>
                        </div>
                       <div class="col-6">
                            <button class="form-control mt-2 employee-select cancel" style="width:100%;border:1px solid #006103 !important" onclick="cancel('${employee.ticket_id}')"  id="cancel">Cancel</button>
                        </div>
                    </div>
                
                <p class="text-center pt-3 mb-2 showLessButton">Show less ⮝</p>
                </div>  
            </div>
        </div>
    `;
        $('#card-container').append(cardHtml);

        // Show more functionality with event delegation
        $(document).on('click', '.showMoreButton', function () {
            const cardBody = $(this).closest('.card-body');
            cardBody.find('.show-more').slideDown(); // Slide down the content
            $(this).hide(); // Hide "show more" button
        });

        $(document).on('click', '.showLessButton', function () {
            const cardBody = $(this).closest('.card-body');
            cardBody.find('.show-more').slideUp(); // Slide up the content
            cardBody.find('.showMoreButton').show(); // Show "show more" button
        });
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
        var select = document.querySelector(".employee-select")
        sidebar.classList.toggle('collapsed');
        content.classList.toggle("container-sty-collapsed")

        tableOddRows.forEach(row => {
            row.classList.toggle("table-row-collapsed")
        })
        tableEvenRows.forEach(row => {
            row.classList.toggle("table-row-collapsed")
        })
        issueType.forEach(row => {
            row.classList.toggle("table-row-collapsed")
        })
        mainContents.forEach(content => {
            content.classList.toggle("card-collapsed")
        })

        tHead.classList.toggle("table-head")
        tHeadCells.forEach(cell => {
            cell.classList.toggle("table-head")
        })
    })
});

// Simplified reason and cancel functions for debugging
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
    }
}
function getUTCDateString() {
    const now = new Date();
    const isoString = now.toISOString();
    const utcDate = isoString.split('T')[0];
    return utcDate;
}


function rejectedTicket(cid, tic_id, eid) {
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex'; // Show loading before fetch
    let rejected_reason = document.getElementById(`reason-${tic_id}`).value
    document.getElementById("error").style.display = "none"
    if (!rejected_reason) {
        loadingIndicator.style.display = 'none';
        
        return document.getElementById("error").style.display = "block";
    }

    let data = {
        company_id: cid,
        ticket_id: parseInt(tic_id),
        employee_id: eid,
        rejected_reason: rejected_reason,
        rejected_date: getUTCDateString()
    }

    fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee_rejected_ticket`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {

            if (data.error) {
                loadingIndicator.style.display = 'none';
                console.error("Error in response:", data.error);
            }
            else {
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                    window.location.href = 'AssignedTickets.html';
                }, 1000);
            }
        })
        .catch((error) => {
            loadingIndicator.style.display = 'none';
            console.error("Error in response:", error);
        });
}

function cancel(ticketID) {
    const reasonInput = document.getElementById(`reason-${ticketID}`);
    const acceptButton = document.getElementById(`acceptButton-${ticketID}`);
    const confirmButton = document.getElementById(`comformButton-${ticketID}`);

    if (reasonInput && acceptButton && confirmButton) {
        reasonInput.style.display = 'none';
        acceptButton.style.display = 'flex';
        confirmButton.style.display = 'none';

    } else {
        console.error(`Elements not found for ticketID: ${ticketID}`);
    }
}

function acceptClick(token) {
    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch

    fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee_accept_ticket/${token}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {

            if (data.error) {
                loadingIndicator.style.display = 'none';
                console.error("Error in response:", data.error);
            }
            else {
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                    window.location.href = 'inProcessTicket.html';
                }, 1000);
            }
        })
        .catch((error) => {
            loadingIndicator.style.display = 'none';
            console.error("Error in response:", data.error);
        });

}