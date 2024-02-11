
function detailsModals(type, id) {
    let url;
    switch (type) {
        case 'user':
            url = `/api/user/${id}`;
            break;
        case 'dog':
            url = `/api/dog/${id}`;
            break;
        case 'event':
            url = `/api/event/${id}`;
            break;
        default:
            console.error('Invalid type');
            return;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network Error');
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
            // Handle error display to the user
        });
}

function generateModalContent(type, data) {
    switch (type) {
        case 'user':
            return `<h4>User Details</h4>
                    <p>First name: ${data.first_name}</p>
                    <p>Last name: ${data.last_name}</p>
                    <p>Email: ${data.email}</p>
                    <p>Phone: ${data.phone}</p>`;
        case 'dog':
            return `<h4>Dog Details</h4>
                    <p>Name: ${data.name}</p>
                    <p>Breed: ${data.breed}</p>
                    <p>Sex: ${data.sex}</p>
                    <p>Age: ${data.age}</p>
                    <p>Weight: ${data.weight}</p>
                    <p>Spay/ Neuter: ${data.spay_neuter}</p>
                    <p>Vaccinations: ${data.vaccinations}</p>
                    <p>Address: ${data.address}</p>`;
        case 'event':
            return `<h4>Event Details</h4>
                    <p>Event: ${data.event_type}</p>
                    <p>Date: ${data.date}</p>`;
        default:
            return 'Not available';
    }
}

function closeModal() {
    const modal = document.getElementById('userModal');
    modal.style.display = 'none';
}

// Add event listener for the modal close button
document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
});
