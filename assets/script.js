// Get elements from the DOM
var searchForm = document.querySelector('#searchForm');
var searchInput = document.querySelector('#searchInput');
var formatSelect = document.querySelector('#formatSelect');
var resultsContainer = document.querySelector('#resultsContainer');

// Function to handle form submission
var formSubmitHandler = function(event) {
    event.preventDefault();

    // Get the values of the input and select form controls
    var searchQuery = searchInput.value.trim();
    var formatQuery = formatSelect.value;

    if (!searchQuery) {
        alert('Please enter a search query.');
        return;
    }

    // Generate the API URL based on whether a format was selected
    var apiUrl;
    if (!formatQuery) {
        apiUrl = 'https://www.loc.gov/search/?fo=json&q=' + encodeURIComponent(searchQuery);
    } else {
        apiUrl = 'https://www.loc.gov/' + encodeURIComponent(formatQuery) + '/?fo=json&q=' + encodeURIComponent(searchQuery);
    }

    // Fetch data from the API
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayResults(data.results);
                console.log(data)
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    }).catch(function(error) {
        alert('Unable to connect to Library of Congress');
    });
};

var displayResults = function(results) {
    // Clear any existing results
    resultsContainer.innerHTML = '';

    results.forEach(function(result) {
        if (Array.isArray(result.aka) && result.aka.length > 0) {
            // Create a new anchor element for the first URL in the 'aka' array
            var url = result.aka[0]; 
            var resultLink = document.createElement('a');
            resultLink.href = url;
            resultLink.textContent = url;
            resultLink.target = "_blank";

            var resultTitle = document.createElement('p');
            if(result.title){
                resultTitle.textContent = 'Title: ' + result.title;
            } else {
                resultTitle.textContent = 'No title available';
            }
            
            resultsContainer.appendChild(resultLink);
            resultsContainer.appendChild(resultTitle); // append the title after the link
            resultsContainer.appendChild(document.createElement('br'));
        }
    });
};


searchForm.addEventListener('submit', formSubmitHandler);
