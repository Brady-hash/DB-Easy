document.addEventListener('DOMContentLoaded', () => {
    // Close modal
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Attach click event listeners to each link
    document.querySelectorAll('.user-name, .dog-name, .event-name').forEach(link => {
        link.addEventListener('click', event => {
            console.log('Link clicked', event.target);
            event.preventDefault();
            const type = link.classList.contains('user-name') ? 'user' :
                         link.classList.contains('dog-name') ? 'dog' :
                         link.classList.contains('event-name') ? 'event' : 
                         null;
            // Correctly extract the ID for the clicked link
            const id = link.dataset.userId || link.dataset.dogId || link.dataset.eventId;
            detailsModals(type, id);
        });
    });
});

function detailsModals(type, id) {
    let url;
    switch (type) {
        case 'user':
            url = `/api/admin/users/${id}`;
            break;
        case 'dog':
            url = `/api/admin/dogs/${id}`;
            break;
        case 'event':
            url = `/api/admin/events/${id}`;
            break;
        default:
            console.error('Invalid type');
            return;
    }

    fetch(url, {
        method: 'GET', 
        headers: {
            
        },
        credentials: 'include', 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const modal = document.getElementById('userModal');
        const modalBody = modal.querySelector('.modal-body');

        // Populate modal based on type
        modalBody.innerHTML = generateModalContent(type, data); 

        // Show the modal
        modal.style.display = 'block';
    })
    .catch(error => {
        console.error('Error fetching details:', error);

        const modalBody = document.getElementById('userModal').querySelector('.modal-body');
        modalBody.innerHTML = `<p>Error fetching details: ${error.message}</p>`;
        document.getElementById('userModal').style.display = 'block'; 
    });
}


function generateModalContent(type, data) {
    let htmlContent = '';
    switch (type) {
        case 'user':
            htmlContent = `
                <h4>${data.first_name} ${data.last_name}</h4>
                <p>Email: ${data.email}</p>
                <p>Phone: ${data.phone}</p>
            `;
            break;
        case 'dog':
            htmlContent = `
                <h4>${data.name}</h4>
                <p>Breed: ${data.breed}</p>
                <p>Age: ${data.age}</p>
                <p>Weight: ${data.weight}</p>
            `;
            break;
        case 'event':
            htmlContent = `
                <h4>Scheduled event: ${format_full_date(data.date)}</h4>
                <p>Type: ${data.event_type}</p>
            `;
            break;
        default:
            htmlContent = '<p>No information available</p>';
    }
    return htmlContent;
}

    

function closeModal() {
    const modal = document.getElementById('userModal');
    modal.style.display = 'none';
}

function format_full_date(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
