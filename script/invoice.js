
$(document).ready(function () {
    let cid = localStorage.getItem("cid");
    document.getElementById("Clogo").src = localStorage.getItem("Clogo");
   //  console.log(cid)
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/invoice/${cid}`;
    let rowDetails = [];
    const CName = localStorage.getItem("CName")


    document.getElementById("CName").innerHTML = CName;
    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
           //  console.log(data);
            loadingIndicator.style.display = 'none';
            if (!(data.detail)) {
               //  console.log("yes")
                data.forEach(ticket => {
                    rowDetails.push(ticket);
                    addTicket(ticket);
                    addCard(ticket); // Add the card for mobile view
                });

            }
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
        const rowNode = table.row.add([
            `<span></span>`, // Control for expanding the row
            ticket.ticket_id,
            `<div class="issue-type ${ticket.ticket_type}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city,
            `<span class="assigned-employee">${ticket.first_name} ${ticket.last_name}</span>` // Assigned employee
        ]).draw(false).node(); // Get the row node after adding

        $(rowNode).find('td:first').addClass('details-control');
    }

    // Function for toggle arrow 
    $(document).on('click', 'td.details-control', function () {
        $(this).toggleClass('active');
    });

    // Format the row details
    function format(rowData) {


        return `
            <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                        
                        <div class="col-md-4" >
                            <strong class="d-flex justify-content-left">Customer Address</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
                                ${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}
                            </p>
                            
                            <div class="input-container mt-3" style="text-align:left !important; padding:0 !important">
                                <label for="start-time">Work started time:</label>
                             <input type="datetime-local" class="input-bottom-border mt-2" style="background:transparent"
                                    id="start-time-${rowData.ticket_id}" 
                                    value="${rowData.work_started_time}" disabled>
                            </div>


                            <div class="input-container mt-3" style="text-align:left !important;padding:0 !important">
                                <label for="end-time">Work ended time :</label>
                                <input type="datetime-local" class="input-bottom-border mt-2" style="background:transparent"
                                    id="start-time-${rowData.ticket_id}" 
                                    value="${rowData.work_ended_time}" disabled>                                
                            </div> 
                             <strong class="d-flex justify-content-left mt-3">Employee Notes :</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
                                ${rowData.employee_notes}
                            </p>
                        </div>
                        <div class="col-md-2"></div>
                       <div class="col-md-6 box2">
                            <strong>Description:</strong>
                            <p class="description">${rowData.description}</p>
                             <div class="image-gallery row g-2 ">
                            <!-- Upload 1 -->
                            
                                     ${rowData.photo_1 ? `
                                            <div class="col-5 col-sm-4 col-md-3">
                                            <div class="uploads position-relative" style="width: 100%; height: 100px;">
                                            <img id="image-preview1-${rowData.ticket_id}-${rowData.id}" src="${rowData.photo_1}"  alt="Uploaded Image"  style="width:50px;heigth:50px " 
                                                style=" " />
                                            </div>
                                            </div>
                                        ` : `
            
                                    `}
                                <!-- Upload 2 -->
        
                                    ${rowData.photo_2 ? `
                                   <div class="col-5 col-sm-4 col-md-3">
                                    <div class="uploads position-relative" style="width: 100%; height: 100px;">
                                    <img id="image-preview2-${rowData.ticket_id}-${rowData.id}" src="${rowData.photo_2}" alt="Uploaded Image"  style="width:50px;heigth:50px " 
                                    style=" " />
                                    </div>
                                    </div>
                                ` : `  `}
                        
                                    <!-- Upload 3 -->
                        
                                    ${rowData.photo_3 ? `
                                    <div class="col-5 col-sm-4 col-md-3">
                                    <div class="uploads position-relative" style="width: 100%; height: 100px;">
                                    <img id="image-preview3-${rowData.ticket_id}-${rowData.id}"src="${rowData.photo_3}" 
                                    alt="Uploaded Image"  style="width:50px;heigth:50px " style=" "/>
                                    </div>
                                    </div>
                                ` : ` `} 
                            
                             
                            </div>
                            <br>
                               <button type="button" class="btn-yes btn-reassign" style="width:100% !important" data-bs-toggle="modal" data-bs-target="#InvoiceModal"
    onclick="openModal('${rowData.id}','${rowData.ticket_id}','${rowData.employee_id}')">
    <!-- Pass the ticketID dynamically -->
    Generate Invoice
</button>
                            
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
        const cardHtml = `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Name </strong>  ${employee.name}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Ticket ID </strong>  ${employee.ticket_id}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Issue type </strong>  ${employee.ticket_type}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Date </strong>  ${employee.complain_raised_date}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Phone </strong> ${employee.phone_number}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>City:</strong> ${employee.city}</p>
                    </div>
                </div>
                <p class="text-center mb-2 showMoreButton">Show more ⮟</p>
                <div class="show-more" style="display:none">
                    <p><strong>Customer Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
                     <p><strong>Employee notes:</strong> ${employee.employee_notes || ''}</p>
                    <div class="input-container mt-3" style="text-align:left !important">
                                <label for="start-time">Work started time:</label>
                                <input type="datetime-local" class="input-bottom-border"
                                    id="start-time-${employee.ticket_id}" 
                                    value="${employee.work_started_time}" disabled>
                            </div>
                            <div class="input-container mt-3" style="text-align:left !important">
                                <label for="end-time">Work ended time :</label>
                                <input type="datetime-local" class="input-bottom-border"
                                    id="start-time-${employee.ticket_id}" 
                                    value="${employee.work_started_time}" disabled>
                            </div>
                            <div class="image-gallery d-flex justify-content-center mt-3">
                          

                         ${employee.ti_photo_1 ? ` <div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.ti_photo_1}" alt="Image 1" class="p-2" width="100px"> </div>` : `<p id="empty"></p>`}   
                           ${employee.ti_photo_2 ? `<div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.ti_photo_2}" alt="Image 1" class="p-2" width="100px"> </div>` : `<p id="empty"></p>`} 
                           ${employee.ti_photo_3 ? `<div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.ti_photo_3}" alt="Image 1" class="p-2" width="100px"> </div>` : `<p id="empty"></p>`} 
                        </div>
                     <button type="button" class="btn-yes btn-reassign" style="width:100% !important" data-bs-toggle="modal" data-bs-target="#InvoiceModal"
    onclick="openModal('${employee.id}','${employee.ticket_id}','${employee.employee_id}')">
    <!-- Pass the ticketID dynamically -->
    Generate Invoice
</button>
                    <p class="text-center pt-3 mb-2 showLessButton">Show less ⮝</p>       
                </div>
            </div>
        </div>
        `;

        // Append the card to the card container for mobile view
        $('#card-container').append(cardHtml);
    }

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

});


function openModal(tockenID, ticketID, eid) {
    // Remove existing modal if it exists
    const existingModal = document.getElementById('dynamicModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create the modal structure dynamically
    const modalHTML = `
        <div class="modal fade" id="dynamicModal" tabindex="-1" aria-labelledby="dynamicModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered"> <!-- Centered modal -->
            <div class="modal-content custom-modal-content">
                <div class="modal-header">
                    <h5 class="modal-title w-100 text-center" id="dynamicModalLabel" style="font-weight: 600;">
                        Generate Invoice
                    </h5>
                </div>

       
                    <div class="modal-body custom-modal-body">
                        <textarea placeholder="Payment Notes" id="description" class="input-bottom-border mb-4 mt-4"
                            style="background-color: transparent;" rows="1"></textarea>
                        <input 
                            id="amountInput" 
                            placeholder="Amount" 
                            type="number" 
                            class="input-bottom-border mb-4" 
                            style="background-color: transparent;" />
        <select 
            id="is-paid-${ticketID}" 
            class="mt-4  input-bottom-border mb-4 input-bottom-border .payment-input" 
            onchange="handleFileSelect4(${ticketID})" 
            style="background:transparent; border-radius: 0;">
            <option value="no">Is Paid</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
        </select>

                       
                           
                            <select id="payment-mode-${ticketID}" class="mt-4  input-bottom-border mb-4 input-bottom-border color: black; " disabled style="background:transparent;border-radius: 0;">
                                <option value="" selected disabled>Select Payment Mode</option>
                                <option value="cash"}>Cash</option>
                                <option value="credit card"}>Credit Card</option>
                                <option value="debit card"}>Debit Card</option>
                                <option value="paypal"}>Paypal</option>
                                <option value="others"}>Others</option>
                            </select>
                        


                        <div class="d-flex justify-content-center mt-2 mb-4">
                            <button type="submit" class="btn-green btn btn-reassign" style="width: 90% !important;background: #004102 !important;
                                color: white !important;
                                padding: 6px !important;
                                border-radius: 10px !important;
                                font-size: medium !important;" 
                                onclick="handlePayment('${tockenID}','${ticketID}','${eid}')">Pay</button>
                        </div>
                    
                </div>
              
            </div>
          </div>
        </div>
    `;

    // Append the modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show the modal
    const myModal = new bootstrap.Modal(document.getElementById('dynamicModal'));
    myModal.show();
}

function handleFileSelect4(ticketID) {
    const isPaidSelect = document.getElementById(`is-paid-${ticketID}`);
    const paymentModeSelect = document.getElementById(`payment-mode-${ticketID}`);

    if (isPaidSelect && paymentModeSelect) {
        // Enable Payment Mode dropdown only if "Yes" is selected
        paymentModeSelect.disabled = isPaidSelect.value !== "yes";
        if (isPaidSelect.value !== "yes") {
            paymentModeSelect.value = ""; // Reset Payment Mode dropdown
        }
    }
}

async function handlePayment(tokenID, ticket_id, eid) {
    try {
        // Retrieve and hide the dynamic modal
        const modalElement = bootstrap.Modal.getInstance(document.getElementById("dynamicModal"));
        if (modalElement) modalElement.hide();

        // Prepare success and failure modals
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        const failureModal = new bootstrap.Modal(document.getElementById('failureModal'));

        // Get user inputs
        const description = document.querySelector("#dynamicModal textarea").value.trim();
        const amount = getAmountAsInteger(); 
        const isPaid = document.getElementById(`is-paid-${ticket_id}`).value == "yes" ? 1 : 0
        const payment_mode = document.getElementById(`payment-mode-${ticket_id}`).value
        

        // Validate inputs
        if (!description || !amount) {
            alert("Please fill in all fields.");
            return;
        }

        const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
        loadingIndicator.style.display = 'flex'; // Show loading before fetch

        // Prepare the data payload
        const payment = parseInt(amount, 10); // Ensure the amount is treated as a number
        const paymentDescription = description;

        const datas = {
            payment_description: paymentDescription,
            status: 4,
        };

        const requestBody = {
            ispaid: isPaid,
            amount: amount || null,
            payment_type: payment_mode || null
        };

        // Define the API URL
        const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket/update/${ticket_id}`;

        // Make the API call
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datas),
        });
        loadingIndicator.style.display = 'none'; 
        // Handle API response
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        await invoiceDataUpload(requestBody, tokenID);


        // Show success modal and add event listener for redirection
        
    } catch (error) {
        loadingIndicator.style.display = 'none'; 
        const failureModal = new bootstrap.Modal(document.getElementById('failureModal'));
        failureModal.show();
    }
}

async function invoiceDataUpload(requestBody, tockenID)
{
    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
        loadingIndicator.style.display = 'flex';
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        const failureModal = new bootstrap.Modal(document.getElementById('failureModal'));
    try {
        const response = await fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket_status/save/${tockenID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        if (data.message) {
            loadingIndicator.style.display = 'none';
            successModal.show();
            document.getElementById('success-modal-ok').addEventListener('click', function () {
                window.location.href = 'invoice.html';
            });
        }
        else {
            loadingIndicator.style.display = 'none';
        }
    } catch (error) {
        loadingIndicator.style.display = 'none';
        console.error("Failed to mark ticket as completed:", error.message);
    }
}

async function updateLink(url, id, ticketId, ticketToken) {
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket_status/update/${ticketToken}`;
    const payload = id == 1 ? {
        company_id: cid,
        employee_id: eid,
        ticket_id: parseInt(ticketId),
        photo_1: url
    } : id == 2 ? {
        company_id: cid,
        employee_id: eid,
        ticket_id: parseInt(ticketId),
        photo_2: url
    } : {
        company_id: cid,
        employee_id: eid,
        ticket_id: parseInt(ticketId),
        photo_3: url
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("link data updated")
        } else {
            alert('Error updating link.');
        }
    } catch (error) {
        console.error('Error updating link:', error);
        alert('Error updating link. Check console for details.');
    }
}



// Function to convert the Amount to an integer
function getAmountAsInteger() {
    const inputElement = document.getElementById("amountInput");
    const amount = inputElement.value.trim(); // Get value and remove extra spaces

    // Convert to integer, or return null if not valid
    // const amount = parseInt(value, 10);

    if (isNaN(amount)) {
        alert("Please enter a valid number.");
        return null; // Return null for invalid input
    }

    return amount;
}



// Example usage
// createInvoiceModal("12345");
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
        input.forEach(function (row) {
            row.disabled = true;
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
        input.forEach(function (row) {
            row.disabled = false;
        });
    }
});

