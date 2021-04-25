/*
The JavaScript file for the chatlogs tab of the WCBM service - Encrypted Diary Management
*/

try {
	// Adding the onclick event listener to the decrypt-info-btn
	const decryptInfoBtn = document.getElementById('decrypt-info-btn');
	decryptInfoBtn.addEventListener('click', (e) => {
		/* When the user clicks on the decrypt-info-btn, then this function is called. The functions first reads the user entered password and then sends a POST request in order to decrypt all the required information displayed on the web page. */

		e.preventDefault();

		// Getting the user entered password
		let password = document.querySelector('input[name="decrypt-info-password"]').value;

		// Validating the user entered password
		if (password.length != 0) {
			// If the user entered password is not empty, then we continue the process

			// Hiding the button on the screen
			document.querySelector('button[href="#decrypt-info-form"]').style.display = 'none';

			// Decrypting each and every chatlogs description
			let chatlogDescriptions = document.getElementsByClassName('chatlog-description');
			for (let description of chatlogDescriptions) {
				// Iterating over each chatlog's description in order to decrypt it

				// Creating the POST request data
				data = JSON.stringify({
					text : description.innerText,
					password : password,
				});

				// Sending the POST request
				fetch('/decrypt', {body : data, method : 'post', headers : {'Accept' : 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
					// After recieving the response from the server, we set the chatlog description with its decrypted form of data

					description.innerText = response;
				}).catch(error => showAlert('error', 'Failure', `${error.message}`));
			}

			// Displaying the search bar on the screen and also hiding the modal for decryption
			document.querySelector('.entries-logs-container .search-bar').style.display = 'block';
			document.getElementById('decrypt-info-form').style.display = 'none';
		} else {
			// If the user entered password field is empty, then we display an error to the user
			
			showAlert('error', 'Invalid password input', 'Please enter a proper password for the decryption process.');
		}
	});
} catch(error) {
	// If there are any errors, then we skip them (MAINLY, WHEN THE BUTTON IS NOT DEFINED ON THE WEBPAGE)
}

try {
	// Adding the on write event listener to the search-bar textbox of the chatlogs history container of the webpage
	const searchChatlogsInputBox = document.querySelector('.search-bar input[name="search-query"]');
	searchChatlogsInputBox.addEventListener('change', (e) => {
		/* When the user changes the value at the search chatlogs input box, or simply types there, then this function is called. The functions reads the user entered search query, and then filters the specific chatlogs. */

		e.preventDefault();

		// Reading the user entered search query
		let searchQuery = searchChatlogsInputBox.value;
		searchQuery = searchQuery.toLowerCase();  // Converting the search query characters to all into lower case alphabets

		// Validating the user entered search query
		if (searchQuery.length != 0) {
			// If the user entered search query is not empty, then only we continue the process of searching and filtering

			// Getting all the chatlog HTML elements
			chatlogs = document.getElementsByClassName('log-info');

			// Filtering the chatlogs elements as per the search query
			let noOfLogsDisplayed = 0;
			for (let log of chatlogs) {
				// Iterating through each chatlog item

				description = log.querySelector('.chatlog-description').innerText.toLowerCase();
				if (description.includes(searchQuery)) {
					// If the description of the chatlog contains the user entered search query, then we display the specific chatlog element

					log.style.display = 'block';
					noOfLogsDisplayed += 1;
				} else {
					// If the user entered search query is not included in the currently iterated chatlog item, then we hide it from the webpage

					log.style.display = 'none';
				}
			}

			// Checking if there are no chatlog elements being displayed, then we display the message there that "Search results : No such chatlogs found as per search query."
			// document.querySelector('.container.entries-logs-container').innerHTML = `<h3>History of chatlogs</h3><div class="search-bar" style="display: block;"><input type="text" name="search-query" placeholder="Search for logs"></div><p>Search results : No such chatlogs found as per search query.</p>`;
		} else {
			// If the user entered search query is blank, then we display every chatlog elements unbiased

			// Getting all the chatlog HTML elements
			chatlogs = document.getElementsByClassName('log-info');
			
			// Displaying all the chatlogs on the webpage
			for (let log of chatlogs) {
				log.style.display = 'block';
			}
		}
	});
} catch(error) {
	// If there are any errors encountered in the process, then we skip them (Mainly, if the search input box is not defined on the webpage)
}