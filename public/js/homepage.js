document.getElementById('addDogButton').addEventListener('click', function () {
    var dogName = prompt("Enter the dog's name:");
    var dogBreed = prompt("Enter the dog's breed:");

    // Encode the breed for the URL, replacing spaces with underscores
    var encodedBreed = encodeURIComponent(dogBreed.toLowerCase());

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.thedogapi.com/v1/breeds/search?q=${encodedBreed}`, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (data.length > 0) {
                var breedId = data[0].id;

                // Fetch a random image for the breed using the retrieved breed ID
                fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${breedId}`)
                    .then(response => response.json())
                    .then(imageData => {
                        var imageUrl = imageData[0].url;

                        var dogButton = createDogButton(dogName, imageUrl);

                        document.getElementById('dogContainer').appendChild(dogButton);
                    })
                    .catch(error => console.error('Failed to fetch dog image:', error));
            } else {
                console.error('Breed not found:', dogBreed);
            }
        } else {
            console.error('Failed to fetch breed information:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Network error while fetching breed information.');
    };

    xhr.send();
});

function createDogButton(dogName, imageUrl) {
    var deleteIcon = '<span class="deleteIcon">&#10006;</span>';
    var dogButton = document.createElement('button');
    dogButton.className = 'dogButton';

    dogButton.innerHTML = `<img src="${imageUrl}" alt="${dogName}" class="dogImage">${deleteIcon}<span class="dogName">${dogName}</span>`;

    dogButton.querySelector('.deleteIcon').addEventListener('click', function () {
        dogButton.remove();
    });

    return dogButton;
};
