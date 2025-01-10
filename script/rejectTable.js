$(document).ready(function () {
    const cid = localStorage.getItem("cid");
    console.log(cid)
    document.getElementById("Clogo").src = localStorage.getItem("Clogo");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/rejected/${cid}`
    let rowDetails = [];
    const CName = localStorage.getItem("CName")
    

    document.getElementById("CName").innerHTML = CName;
    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            loadingIndicator.style.display = 'none';
            data.forEach(ticket => {
                console.log(ticket)
                rowDetails.push(ticket);
                addTicket(ticket);
                addCard(ticket); // Pass index for unique IDs
                
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
        const rowNode = table.row.add([
            `<span></span>`, // Control for expanding the row
            ticket.ticket_id,
            `<div class="issue-type ${ticket.ticket_type}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city
        ]).draw(false).node(); // Get the row node after adding

        $(rowNode).find('td:first').addClass('details-control');
    }

    // Format the row details
    function format(rowData) {
        
        // const workStartedTime = new Date(rowData.work_started_time).toISOString().split('T')[0];
        const tickerRejectDate = new Date(rowData.rejected_date).toISOString().split('T')[0];
        return `
             <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                    
                        <div class="col-md-4 box1">
                            <strong>Customer Address</strong>
                           
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
                                ${(rowData?.street || '')}, 
                                ${(rowData?.city || '')}, 
                                ${(rowData?.zip || '')}, 
                                ${(rowData?.state || '')}
                            </p>
                            <strong class="d-flex justify-content-left">Reason :</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
                                ${rowData.rejected_reason}
                            </p>
                           <strong> <label class="mt-3 d-flex justify-content-left">Reject Date :</label></strong>
                            <div class="input-container" style="text-align:left !important">
                               <input type="date" class="input-bottom-border"
                                    id="start-time-${rowData.ticket_id}" 
                                    value="${rowData.rejected_date}" disabled>                           
                            </div>
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
                                            alt="" 
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
                                            alt="" 
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
                                            alt="" 
                                            class="responsive-image" 
                                        />
                                    </div>
                                </div>
                                ` : ` `} 
                            
                             
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

    // Function to create and append the card for mobile view
    function addCard(employee) {
        
       //  console.log(employee)
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
                    <p class="text-left"><strong >Reason : </strong>${employee.rejected_reason}</p>
                    <p class="text-left"><strong>Reject Date : </strong>${employee.rejected_date}</p>
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
        cardBody.find('.showMoreButton').show(); // Show "show more" button again
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

            document.querySelector(".overlay").textContent = "+3"
            document.querySelector(".overlay").style.opacity = ".2";
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
            select.disabled = false;
        }
    });
});


