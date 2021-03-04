/*
Javascript for the Index Page - Encrypted Diary Management
*/

// Adding the functionality to the diary-entry-reset-btn
const diaryEntryResetBtn = document.getElementById('diary-entry-reset-btn');
diaryEntryResetBtn.addEventListener('click', (e) => {
	/* When the user clicks on the diary-entry-reset-btn, the form will get reseted automatically and all the data written on it are changed to the blank inputs  */

	e.preventDefault();

	// Getting the form HTML elements
	// let diaryEntryTitle = document.querySelector('input[name="diary-entry-title"]');
	// let diaryEntryDay = document.querySelector('select[name="diary-entry-day"]');
	// let diaryEntryMonth = document.querySelector('select[name="diary-entry-month"]');
	// let diaryEntryYear = document.querySelector('select[name="diary-entry-year"]');
	// let diaryEntryContent = document.querySelector('textarea[name="diary-entry-content"]');

	// Getting the latest date and time
	let date = new Date();

	// Reseting the values of the form HTML elements
	document.querySelector('input[name="diary-entry-title"]').value = '';
	document.querySelector('select[name="diary-entry-day"]').value = date.getDate();
	document.querySelector('select[name="diary-entry-month"]').value = '-month-';
	document.querySelector('select[name="diary-entry-year"]').value = date.getFullYear();
	document.querySelector('textarea[name="diary-entry-content"]').value = '';
	document.querySelector('input[name="password"]').value = '';
});

// Adding the onclick form submit functionality to the diary-entry-save-btn
const diaryEntrySaveBtn = document.getElementById('diary-entry-save-btn');
diaryEntrySaveBtn.addEventListener('click', (e) => {
	/* When the user clicks on the diary-entry-save-btn, the form will get submitted before the checking of the data. This function sends a POST request to the server and saves the diary entry to the application database. */

	e.preventDefault();

	// Getting the form inputs
	let diaryEntryTitle = document.querySelector('input[name="diary-entry-title"]').value;
	let diaryEntryDay = document.querySelector('select[name="diary-entry-day"]').value;
	let diaryEntryMonth = document.querySelector('select[name="diary-entry-month"]').value;
	let diaryEntryYear = document.querySelector('select[name="diary-entry-year"]').value;
	let diaryEntryContent = document.querySelector('textarea[name="diary-entry-content"]').value;
	let password = document.querySelector('input[name="password"]').value;

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

				showAlert('success', 'Success', 'The new diary entry has been saved at the backend of the application, you can access it on the diary entry page.');

				// Getting the latest date and time
				let date = new Date();

				// Reseting the values of the form HTML elements
				document.querySelector('input[name="diary-entry-title"]').value = '';
				document.querySelector('select[name="diary-entry-day"]').value = date.getDate();
				document.querySelector('select[name="diary-entry-month"]').value = '-month-';
				document.querySelector('select[name="diary-entry-year"]').value = date.getFullYear();
				document.querySelector('textarea[name="diary-entry-content"]').value = '';
				document.querySelector('input[name="password"]').value = '';
			} else {
				// if the response from the server states anything else than 'success', then we raise the error back to the user

				showAlert('error', 'Failure', `${response}`);
			}
		}).catch(error => showAlert('error', 'Failure', `${error}`));
	}
});