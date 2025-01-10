$(document).ready(function () {
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");
    const CName = localStorage.getItem("CName")
    document.getElementById("Clogo").src = localStorage.getItem("Clogo");
    document.getElementById("CName").innerHTML = CName;
    document.getElementById("e_name").innerHTML = localStorage.getItem("e_name");

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employees/completed_tickets/${cid}/${eid}`;
    let rowDetails = [];
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex'; // Show loading before fetch

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            rowDetails.push(...data);
            data.forEach(ticket => {
                addTicket(ticket);
                addCard(ticket);
            });
            loadingIndicator.style.display = 'none'; // Hide loading after processing
        })
        .catch(error => {
            console.error('Error fetching tickets:', error);
            loadingIndicator.style.display = 'none'; // Hide loading on error
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
            `<span id="ticketId">${ticket.ticket_id}</span>`,
            `<div class="issue-type ${ticket.ticket_type}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city,
            `<span class="assigned-employee" data-old-emp="${ticket.employee_id}">${ticket.name}</span>`
        ]).draw(false).node();
        $(rowNode).find('td:first').addClass('details-control');
    }


    function format(rowData) {
        console.log(rowData)
        return `
            <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                    
                        <div class="col-md-4 box1">
                            <strong>Customer Address</strong>
                            <p>${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}</p>
                           
                         <div class="input-container mt-3" style="text-align:left !important; padding:0 !important">
                                <label for="start-time">Work started time:</label>
                                <input type="datetime-local" class="input-bottom-border mt-1" style="background:transparent; "
                                    id="start-time-${rowData.ticket_id}" 
                                    value="${rowData.work_started_time}" disabled>
                            </div>

                             <div class="input-container mt-2" style="text-align:left !important;  padding:0 !important">
                                <label for="end-time">Work ended time :</label>
                                <input type="datetime-local" class="input-bottom-border mt-1" style="background:transparent"
                                    id="end-time-${rowData.ticket_id}" 
                                    value="${rowData.work_ended_time}" disabled>                                
                            </div>  
                             <div class="mt-2">
                            <strong class="d-flex justify-content-left mt-3">Employee Notes :</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
                                ${rowData.employee_notes}
                            </p>
                        </div>
                           
                            </div>
                       <div class="col-md-2"></div>
                       
                        <div class="col-md-6 box2">
                            <strong>Description:</strong>
                            <p>${rowData.description}</p>
                            
                       <div class="image-gallery row g-2 ">
                                         <!-- Upload 1 -->
                                        <div class="col-5 col-sm-4 col-md-4">
                                                <div class="uploads position-relative border" style="width: 100%; height: 100px;">
                                                    <input type="file" id="upload1-${rowData.ticket_id}-${rowData.id}"  
                                                            accept="image/*" 
                                                            onchange="handleFileSelect1(event)"
                                                            class="position-absolute top-0 start-0 w-100 h-100 opacity-0" disabled
                                                        />
                                                    ${rowData.photo_1 ? `
                                                    <img 
                                                        id="image-preview1-${rowData.ticket_id}-${rowData.id}" 
                                                        src="${rowData.photo_1}" 
                                                        alt="Uploaded Image" 
                                                        style="width:95%;height:95px " 
                                                        style=" " 
                                                    />
                                                  ` : `
                                                    <label 
                                                        for="upload1-${rowData.ticket_id}-${rowData.id}"  
                                                        class="d-flex align-items-center justify-content-center w-100 h-100 fw-bold text-success" 
                                                        style="cursor: pointer; font-size: 24px;">
                                                        +
                                                    </label>
                                                    `}
                                              </div>
                                        </div>

                                            <!-- Upload 2 -->
                                        <div class="col-5 col-sm-4 col-md-4">
                                                <div class="uploads position-relative border" style="width: 100%; height: 100px;">
                                                    <input  disabled
                                                        type="file" 
                                                        id="upload2-${rowData.ticket_id}-${rowData.id}"  
                                                        accept="image/*" 
                                                        onchange="handleFileSelect2(event)"
                                                        class="position-absolute top-0 start-0 w-100 h-100 opacity-0" 
                                                    />
                                                    ${rowData.photo_2 ? `
                                                    <img 
                                                        id="image-preview2-${rowData.ticket_id}-${rowData.id}" 
                                                        src="${rowData.photo_2}" 
                                                        alt="Uploaded Image" 
                                                        style="width:95%;height:95px " 
                                                        style=" " 
                                                    />
                                                    ` : `
                                                    <label 
                                                        for="upload2-${rowData.ticket_id}-${rowData.id}"  
                                                        class="d-flex align-items-center justify-content-center w-100 h-100 fw-bold text-success" 
                                                        style="cursor: pointer; font-size: 24px;">
                                                        +
                                                    </label>
                                                    `}
                                                </div>
                                            </div>

                                    <!-- Upload 3 -->
                                    <div class="col-5 col-sm-4 col-md-4">
                                        <div class="uploads position-relative border" style="width: 100%; height: 100px;">
                                            <input disabled
                                                type="file" 
                                                id="upload3-${rowData.ticket_id}-${rowData.id}" 
                                                accept="image/*" 
                                                onchange="handleFileSelect3(event)"
                                                class="position-absolute top-0 start-0 w-100 h-100 opacity-0" 
                                            />
                                            ${rowData.photo_3 ? `
                                            <img 
                                                id="image-preview3-${rowData.ticket_id}-${rowData.id}" 
                                                src="${rowData.photo_3}" 
                                                alt="Uploaded Image" 
                                                style="width:95%;height:95px " 
                                                style=" " 
                                            />
                                            ` : `
                                            <label 
                                                for="upload3-${rowData.ticket_id}-${rowData.id}"  
                                                class="d-flex align-items-center justify-content-center w-100 h-100 fw-bold text-success" 
                                                style="cursor: pointer; font-size: 24px;">
                                                +
                                            </label>
                                            `}
                                        </div>
                                    </div>
                        </div>

                        
                        <div class="mt-3">
                            <label for="payment-amount-${rowData.ticket_id}">Payment Amount:</label>
                            <input type="number" disabled id="payment-amount-${rowData.ticket_id}" class="form-control mt-2 input-bottom-border  payment-input"  min="0" placeholder="Payment amount" style="background:transparent;border-radius: 0;" value="${rowData.amount}">
                        </div>
                        <div class="mt-4" style="display: flex; align-items: center;">
   <label for="is-paid-${rowData.ticket_id}" style="margin-right: 10px;">Is Paid:</label>
<input 
    type="checkbox" 
    id="is-paid-${rowData.ticket_id}" 
    readonly 
    onchange="handleFileSelect4(${rowData.ticket_id})" 
    ${rowData.ispaid == 1 ? 'checked' : ''}
>
</div>
                        <div class="mt-3" id="payment-mode-container-${rowData.ticket_id}" >
                            <label for="payment-mode-${rowData.ticket_id}">Payment Mode:</label>
<select id="payment-mode-${rowData.ticket_id}" class="form-control mt-2 input-bottom-border" disabled style="background:transparent;border-radius: 0;">
    <option value="" ${!rowData.payment_type ? 'selected' : ''} disabled>Payment Mode</option>
    <option value="cash" ${rowData.payment_type === 'cash' ? 'selected' : ''}>Cash</option>
    <option value="credit card" ${rowData.payment_type === 'credit card' ? 'selected' : ''}>Credit Card</option>
    <option value="debit card" ${rowData.payment_type === 'debit card' ? 'selected' : ''}>Debit Card</option>
    <option value="paypal" ${rowData.payment_type === 'paypal' ? 'selected' : ''}>Paypal</option>
    <option value="others" ${rowData.payment_type === 'others' ? 'selected' : ''}>Others</option>
</select>
                        </div>

                             </div>
                             
                        </div>

                    </div>
                </td>
            </tr>`;
    }
    

    // Toggle arrow
    $(document).on('click', 'td.details-control', function () {
        $(this).toggleClass('active');
    });

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

    // Handle the reassign button click
    $('#ticketTable tbody').on('click', '.btn-reassign', async function () {
        const detailsRow = $(this).closest('.details-row');
        const ticketID = detailsRow.closest('tr').prev().find('#ticketId').text();
        const newEmployeeID = detailsRow.find('.employee-select').val();
        const oldEmployeeID = detailsRow.closest('tr').prev().find('.assigned-employee').data('old-emp');

        const requestBody = {
            ticket_id: ticketID,
            assigned_employee: newEmployeeID,
            old_employee: oldEmployeeID
        };

        try {
            const response = await fetch(`https://your-api-url.com/update_assigned_employee/${ticketID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            detailsRow.find('.assigned-employee').text(newEmployeeID);
        } catch (error) {
            console.error("Failed to reassign employee:", error.message);
        }
    });

// card part
    // Function to create and append the card for mobile view
    function addCard(employee) {
       //  console.log(employee)
        const cardHtml = `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Name:</strong>  ${employee.name}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Ticket ID:</strong>  ${employee.ticket_id}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Issue type:</strong>  ${employee.ticket_type}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Date:</strong>  ${employee.complain_raised_date}</p>
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
                    <p><strong>Customer Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
<p><strong>Employee notes:</strong> ${employee.employee_notes || ''}</p>
<p><strong>Payment mode:</strong> ${employee.payment_type || ''}</p>
 <strong><label for="is-paid-${employee.ticket_id}" style="margin-right: 10px;">Is Paid:</label></strong>
    <input 
        type="checkbox" 
        id="is-paid-${employee.ticket_id}" 
        onchange="handleFileSelect4(${employee.ticket_id})" 
        ${employee.ispaid == 1 ? 'checked' : ''}
    >

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
                                    value="${employee.work_ended_time}" disabled>
                            </div>
                   
                    <div class="image-gallery d-flex justify-content-center mt-3">
                          

                         ${employee.photo_1 ? ` <div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.photo_1}" alt="Image 1" class="p-2" width="100px"> </div>`: `<p id="empty"></p>`}   
                           ${employee.photo_2 ? `<div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.photo_2}" alt="Image 1" class="p-2" width="100px"> </div>`: `<p id="empty"></p>`} 
                           ${employee.photo_3 ? `<div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.photo_3}" alt="Image 1" class="p-2" width="100px"> </div>`: `<p id="empty"></p>`} 
                        </div>
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


function disable(ticket_id) {
    document.getElementById(`reassign-${ticket_id}`).style.display = "none";
    document.querySelector(`.employee-select-${ticket_id}`).disabled = false;
    document.getElementById(`conform-${ticket_id}`).style.display = "block";
}
