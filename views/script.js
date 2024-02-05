document.getElementById('addDogButton').addEventListener('click', function () {
    var dogName = prompt("Enter the dog's name:");
    var dogBreed = prompt("Enter the dog's breed:");

    // Encode the breed for the URL
    var encodedBreed = encodeURIComponent(dogBreed.toLowerCase());

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `https://dog.ceo/api/breed/${encodedBreed}/images/random`, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            var imageUrl = data.message;

            var deleteIcon = '<span class="deleteIcon">&#10006;</span>';
            var dogButton = document.createElement('button');
            dogButton.className = 'dogButton';

            dogButton.innerHTML = `<img src="${imageUrl}" alt="${dogName}" class="dogImage">${deleteIcon}${dogName}`;

            document.getElementById('dogContainer').appendChild(dogButton);

            dogButton.querySelector('.deleteIcon').addEventListener('click', function () {
                dogButton.remove();
            });
        } else {
            console.error('Failed to fetch dog image:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Network error while fetching dog image.');
    };

    xhr.send();
});
