
$(document).ready(function () {
    let cid = localStorage.getItem("cid");
    document.getElementById("Clogo").src = localStorage.getItem("Clogo");

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/completed/${cid}`;
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
            `<span class="assigned-employee">$${ticket.amount}</span>` 
        ]).draw(false).node(); // Get the row node after adding

        $(rowNode).find('td:first').addClass('details-control');
    }

    // Function for toggle arrow 
    $(document).on('click', 'td.details-control', function () {
        $(this).toggleClass('active');
    });

    // Format the row details
    function format(rowData) {
        console.log(rowData)
        return `
           <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                       
                        <div class="col-md-4 box1" >
                            <strong class="d-flex justify-content-left">Customer Address</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
                                ${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}
                            </p>
                            
                            <div class="input-container mt-3" style="text-align:left !important;padding:0  !important">
                                <label for="start-time">Work started time:</label>
                                <input type="datetime-local" class="input-bottom-border mt-2" style="background:transparent"
                                    id="start-time-${rowData.ticket_id}" 
                                    value="${rowData.work_started_time}" disabled>
                            </div>


                            <div class="input-container mt-3" style="text-align:left !important;padding:0  !important">
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
                            <strong style="text-align:left !important">Description:</strong>
                            <p class="description">${rowData.description}</p>
                            <div class="image-gallery row g-2 mb-4">
                            <!-- Upload 1 -->
                            
                                     ${rowData.photo_1 ? `
                                          <div class="col-5 col-sm-4 col-md-3">
                                    <div class="uploads position-relative border" >
                                        <img 
                                            id="image-preview1-${rowData.ticket_id}-${rowData.id}" 
                                            src="${rowData.photo_1}" 
                                            alt="" 
                                            class="responsive-image" 
                                        />
                                    </div>
                                </div>
                                        ` : `
            
                                    `}
                                <!-- Upload 2 -->
        
                                    ${rowData.photo_2 ? `
                                   <div class="col-5 col-sm-4 col-md-3">
                                    <div class="uploads position-relative border">
                                        <img 
                                            id="image-preview1-${rowData.ticket_id}-${rowData.id}" 
                                            src="${rowData.photo_2}" 
                                            alt="" 
                                            class="responsive-image" 
                                        />
                                    </div>
                                </div>
                                ` : `  `}
                        
                                    <!-- Upload 3 -->
                        
                                    ${rowData.photo_3 ? `
                                   <div class="col-5 col-sm-4 col-md-3">
                                    <div class="uploads position-relative border">
                                        <img 
                                            id="image-preview1-${rowData.ticket_id}-${rowData.id}" 
                                            src="${rowData.photo_3}" 
                                            alt="" 
                                            class="responsive-image" 
                                        />
                                    </div>
                                </div>
                                ` : ` `} 
                            
                             
                            </div>
                            <strong class="mt-5">Invoiced : </strong>
                            <h6>$${rowData.amount}</h6>
                            <strong class="d-flex justify-content-left mt-3">Payment type:</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
                                ${rowData.payment_type}
                            </p>  

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
        const workStartedTime = new Date(employee.work_started_time).toISOString().split('T')[0];
        const workEndedTime = new Date(employee.work_ended_time).toISOString().split('T')[0];
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
                        <p><strong class="mt-4">Invoiced :  </strong>$${employee.amount} </p>
                    </div>
                    <div class="col-6">
                        
                    </div>
                </div>
                <p class="text-center mb-2 showMoreButton">Show more ⮟</p>
                <div class="show-more" style="display:none">
                    <p><strong>Customer Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
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
                          

                         ${employee.ti_photo_1 ? ` <div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.ti_photo_1}" alt="Image 1" class="p-2" width="100px"> </div>`: `<p id="empty"></p>`}   
                           ${employee.ti_photo_2 ? `<div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.ti_photo_2}" alt="Image 1" class="p-2" width="100px"> </div>`: `<p id="empty"></p>`} 
                           ${employee.ti_photo_3 ? `<div class="image-container d-flex flex-row justify-content-center"> <img src="${employee.ti_photo_3}" alt="Image 1" class="p-2" width="100px"> </div>`: `<p id="empty"></p>`} 
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



