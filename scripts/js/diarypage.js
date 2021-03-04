/*
The Javascript file for the Diary Page - Encrypted Diary Management
*/

// Adding the onclick event listener to the decrypt-btn
const decryptBtn = document.getElementById('decrypt-btn');
if (decryptBtn != null) {
	// If the decryptBtn is not null (i.e., the decrypt button is available on the HTML page)

	decryptBtn.addEventListener('click', (e) => {
		/* When the user clicks on the decrypt-btn, then we send a POST request to the '/diary' with speicifying the task of decryption of the currently displayed diary entry. We also require the password of the user in order to send proper data for the successfull decryption of the diary-content. */

		e.preventDefault();

		// Getting the password entered by the user and the required diary-content
		let password = document.querySelector('input[name="diary-entry-password"]').value;

		// Creating the data for the POST request
		let data = JSON.stringify({
			task : 'decrypt-diary-content',
			content : content,
			password : password,
		});

		// Sending the POST request to the backend
		fetch('/diary', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
			// Checking the response after it is recieved

			try {
				// Parsing the JSON format data returned from the backend
				response = JSON.parse(response);

				// Setting the diary-content on the web page
				document.querySelector('.diary-content').innerText = response.content;
				content = response.content;

				// Hiding the decrypt-btn as it has now no use, and at the same time displaying the edit-btn on the web page
				decryptBtn.style.display = 'none';
				editBtn.style.display = 'block';

				// Reseting the password input box and hiding it
				document.querySelector('input[name="diary-entry-password"]').value = '';
				document.querySelector('input[name="diary-entry-password"]').style.display = 'none';
			} catch(error) {
				// If the response is not a JSON data, then the server must have returned an error message. Now, we will display the error message to the user

				showAlert('error', 'Failure', `${response}`);
			}
		}).catch(error => showAlert('error', 'Failure', `${error.message}`));
	});
}

// Adding the onclick event listener to the edit-btn
const editBtn = document.getElementById('edit-btn');
if (editBtn != null) {
	// If the editBtn is not null (i.e., the edit button is available on the HTML page)

	editBtn.addEventListener('click', (e) => {
		/* When the user clicks on the edit-btn, then we change the structure of the web page from the diary-entry display mode to the diary entry editing option, and some items (like pre.diary-entry, and decrypt, edit buttons) are hidden from the display. In the same time, the HTML elements like editing text box for diary entry and update button are displayed on the web page. */

		e.preventDefault();

		try {
			// Getting the requried HTML elements
			let diaryContentDisplay = document.querySelector('.diary-content');
			let diaryContentEdit = document.querySelector('textarea[name="diary-content"]');
			let passwordEntry = document.querySelector('input[name="diary-entry-password"]');
			let deleteBtn = document.getElementById('delete-btn');

			// Displaying the diary content editing box, password input box and update buttons on the screen
			diaryContentEdit.style.display = 'block';
			diaryContentEdit.value = content;
			updateBtn.style.display = 'block';
			deleteBtn.style.display = 'block';
			passwordEntry.style.display = 'block';

			// Hiding the diary-entry display elements
			diaryContentDisplay.style.display = 'none';
			decryptBtn.style.display = 'none';
			editBtn.style.display = 'none';
		} catch(error) {
			// If we encounter any errors during the process, then we display the error message back to the user

			showAlert('error', 'Web handling error', 'There are some errors faced during processing the task requested. Refresh the page and check again. If the problem persists, then kindly file a report in the contact section.');
			return 0;
		}
	});
}

// Adding the onclick event listener to the update-btn
const updateBtn = document.getElementById('update-btn');
if (updateBtn != null) {
	// If the updateBtn is not null (i.e., the update-btn is available on the HTML page)

	updateBtn.addEventListener('click', (e) => {
		/* When the user clicks on the update-btn, then we read the user updated diary entry content and the password entered, then we proceed to send a POST request to the backend endpoint of '/diary', specifying the task of updating the diary entry content. */

		e.preventDefault();

		// Getting the user entered inputs
		let password = document.querySelector('input[name="diary-entry-password"]').value;
		let updatedContent = document.querySelector('textarea[name="diary-content"]').value;

		console.log(updatedContent);

		// Verifying the user entered inputs
		if (password.length < 5) {
			// If the password length is smaller than 5 characters, then we display an error message to the user

			showAlert('error', 'Incorrect credentials', 'Please enter correct password for your account.');
		} else if (updatedContent == content) {
			// If the user entered updated content and the original content are the same, then we display the error on the screen

			showAlert('error', 'No changed made', 'There are no changes made in the diary entry content. The updated content to be sent is same as the original diary entry content.');
		} else {
			// if all the password and diary entry contents are valid to be sent for the updating process, then we should continue the process

			// Creating the POST request data
			let data = JSON.stringify({
				task : 'update-diary-content',
				id : id,
				content : updatedContent,
				password : password,
			});

			// Sending the POST request
			fetch('/diary', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
				// Checking the response after it is recieved

				if (response == 'success') {
					// If the resposne from the server states the message 'success', then we can assume that the task has been executed successfully. Now, we display the success message to the user.

					showAlert('success', 'Diary entry updated successfully', 'The current contents of the diary entry are updated with the new user entered content. Task executed without any errors.');

					// Reseting the password input field
					document.querySelector('input[name="diary-entry-password"]').value = '';
				} else {
					// If the response from the server states any else message other than 'success', then we assume that the task has been failed to execute. Now, we display an error message to the user.

					showAlert('error', 'Failure', `${response}`);
				}
			}).catch(error => showAlert('error', 'Failure', `${error.message}`));
		}
	});
}

// Adding the onclick event listener to the confirm-delete-btn
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
if (confirmDeleteBtn != null) {
	// Defining the onclick listener only if the confirm-delete-btn is not null (i.e., it is available on the HTML page)

	confirmDeleteBtn.addEventListener('click', (e) => {
		/* When the user clicks on this confirm-delete-btn, then we send a POST request to the '/diary' endpoint at the backend, specifying the task of deleting the currently displayed diary entry.  */

		// Creating the data for POST request
		let data = JSON.stringify({
			task : 'delete-diary-entry',
			id : id,
		});

		// Sending the POST request
		fetch('/diary', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
				// Checking the response after it is recieved

				if (response == 'success') {
					// If the response from the server states 'success', then we display the success message to the user stating that the requested diary entry has been deleted from the database successfully

					showAlert('success', 'Deleted successfully!', `The requested diary entry has been deleted successfully. Please refresh the page for seeing the results.`);
				} else {
					// If the response from the server is anything else than the success, then we assume that we are recieved with an error message and we display it to the user

					showAlert('error', 'Failure', `${response}`);
				}
			}).catch(error => showAlert('error', 'Failure', `${error.message}`));
	});
}

// Adding the onclick event listener to the new-entry-btn
const newEntryBtn = document.getElementById('new-entry-btn');
if (newEntryBtn != null) {
	// Defining the onclick event listener for the new-entry-btn only if the button actually exists on the HTML page and is not null, in order to prevent error messages.

	newEntryBtn.addEventListener('click', (e) => {
		/* When the user clicks on the newEntryBtn, then we define the onclick event listener to the save-btn for the new-diary-entry modal form. */

		const saveBtn = document.getElementById('diary-entry-save-btn');
		if (saveBtn != null) {
			// Defining the onclick event listener only if the save-btn actually exists on the HTML page and is not null

			saveBtn.addEventListener('click', (e) => {
				/* When the user clicks on the save-btn, then we read the user input and then proceed to send a POST request to the backend in order to save the new diary entry with the user entered contents. */

				e.preventDefault();

				// Reading the user entered inputs
				let diaryEntryTitle = document.querySelector('input[name="diary-entry-title"]').value;
				let diaryEntryDay = document.querySelector('select[name="diary-entry-day"]').value;
				let diaryEntryMonth = document.querySelector('select[name="diary-entry-month"]').value;
				let diaryEntryYear = document.querySelector('select[name="diary-entry-year"]').value;
				let diaryEntryContent = document.querySelector('textarea[name="diary-entry-content"]').value;
				let password = document.querySelector('input[name="new-diary-entry-password"]').value;

				// Validating the user entered inputs before sending the POST request
				if (diaryEntryTitle.length < 5) {
					// If the user entered diary entry title is of lesser length than 5, then we display an error to the user

					showAlert('error', 'Invalid inputs', 'Please enter a proper diary entry title with length over 5 characters.');
				} else if (diaryEntryContent.length < 10) {
					// If the user entered diary entry content is of lesser length than 5, then we display an error to the user

					showAlert('error', 'Invalid inputs', 'Please enter a proper diary entry content with length over 10 characters.');
				} else if (diaryEntryDay == '-day-') {
					// If the user entered diary entry day is not a valid input, then we display an error to the user

					showAlert('error', 'Invalid inputs', 'Please enter a valid diary entry date.')
				} else if (diaryEntryMonth == '-month-') {
					// If the user entered diary entry month is not a valid input, then we display an error to the user

					showAlert('error', 'Invalid inputs', 'Please enter a valid diary entry date.')
				} else if (diaryEntryYear == '-year-') {
					// If the user entered diary entry year is not a valid input, then we display an error to the user

					showAlert('error', 'Invalid inputs', 'Please enter a valid diary entry date.')
				} else {
					// If the user entered diary entry fields are valid for upload, then we send a POST request to the backend

					// Converting the month from string to indexing of the months
					months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
					diaryEntryMonth = months.indexOf(diaryEntryMonth.toLowerCase());

					// Creating the data for the POST request
					let data = JSON.stringify({
						task : 'new-diary-entry',
						title : diaryEntryTitle,
						content : diaryEntryContent,
						day : diaryEntryDay,
						month : diaryEntryMonth,
						year : diaryEntryYear,
						password : password,
					});

					// Sending the POST request
					fetch('/', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
						// We will check here the response from the backened (wheter authentication success or failed)

						if (response == 'success') {
							// If the response from the server states success, then we tell the user that the new diary entry has been uploaded and then proceed to clearing all the user inputs on the form element

							showAlert('success', 'Success', 'The new diary entry has been saved at the backend of the application, you can check it by refreshing the page.');

							// Getting the latest date and time
							let date = new Date();

							// Reseting the values of the form HTML elements
							document.querySelector('input[name="diary-entry-title"]').value = '';
							document.querySelector('select[name="diary-entry-day"]').value = date.getDate();
							document.querySelector('select[name="diary-entry-month"]').value = '-month-';
							document.querySelector('select[name="diary-entry-year"]').value = date.getFullYear();
							document.querySelector('textarea[name="diary-entry-content"]').value = '';
							document.querySelector('input[name="new-diary-entry-password"]').value = '';

							// Hiding the new-diary-entry-modal
							document.querySelector('#new-diary-entry-modal').style.display = 'none';
						} else {
							// if the response from the server states anything else than 'success', then we raise the error back to the user

							showAlert('error', 'Failure', `${response}`);
						}
					}).catch(error => showAlert('error', 'Failure', `${error}`));
				}
			});
		}
	});
}