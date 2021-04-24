/*
The JavaScript file for the WhatsApp Chats Backup Manager service - Encrypted Diary Management
*/

// Adding the onclick event listener to the new people form submit button
const newPeopleFormBtn = document.getElementById('new-people-form-btn');
newPeopleFormBtn.addEventListener('click', (e) => {
	/* When the user clicks on the new people form submit button, then we first read all the user inputs and then we send a POST request to the backened requesting to execute the task. */

	e.preventDefault();

	// Getting the form input elements from which we can get the user entered inputs
	let peopleName = document.querySelector('input[name="people-name"]');
	let peopleDescription = document.querySelector('textarea[name="people-description"]');
	let password = document.querySelector('input[name="new-people-form-password"]');

	// Validating the user entered inputs before proceeding into the task
	if (/^[a-zA-Z ]{5,25}$/.test(peopleName.value)) {
		// If the user entered people-name is valid, then we continue for validation of the description

		if (/^[a-zA-Z0-9.!-:,; ]{5,251}$/.test(peopleDescription.value)) {
			// If the user entered people-description is valid, then we continue to validate the password entry by the user

			if (password.value.length >= 8) {
				// If the user entered password field input is valid (i.e., it is of length more than or equal to 8), then we continue to complete the task

				// Creating the form data for the POST request
				let data = JSON.stringify({
					task : 'new-people',
					name : peopleName.value,
					description : peopleDescription.value,
					password : password.value,
				});

				// Sending the POST request
				fetch('/wcbm', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
					// After we get a response of the POST request that we sent, then we check the response wheter the task has been executed successfully or not

					if (response == 'success') {
						// If the response from the backend states success, then we can say that our task has been executed successfully and we display the success message to the user

						showAlert('success', 'New people created', 'The new people chat head has been created at this application with your specified informaiton. You can check it out at the people cards panel.');
					} else {
						// If the response from the backend is anything else than 'success', then we assume that it states error message and we display that error message to the user

						showAlert('error', 'Failure', `${response}`);
					}
				}).catch(error => showAlert('error', `Failure`, `${error.message}`))
			} else {
				// If the user entered password input is invalid (i.e., it is not of length more than or equal to 8), then we display the error to the user

				showAlert('error', 'Invalid input', `Please enter a proper password input of length either equal to 8 or more than 8 characters.`);
			}
		} else {
			// If the user entered people-description is not valid, then we display an error to the user

			showAlert('error', 'Invalid input', `Please enter a proper people-description in order to attain a successfull creation of the new people entry. The people-description should not contain any special characters, it should just contain english alphabets and numbers. The length of the description should be within the range 5 to 250 characters.`);
		}
	} else {
		// If the user entered people-name is not valid, then we display an error to the user

		showAlert('error', 'Invalid input', `Please enter a proper people-name in order to attain a successfull creation of the new people entry. The people-name should not contain any special characters or any numeric characters. The name should just contain the english alphabets and also the length of the name should be within 5 to 25 characters.`);
	}
});

// Adding the onclick event listener to the new chatlog entry form submit button
const newChatlogFormBtn = document.getElementById('new-chatlog-form-btn');
newChatlogFormBtn.addEventListener('click', (e) => {
	/* When the user clicks on the submit ('continue') button of the new chatlog form, then we continue to execute the task of inserting the new chatlog entry to the user requested people item (chat head). Before executing the task, we first check for the validation of the user entered values on the frontend form. */

	e.preventDefault();

	// Getting the user entered inputs
	let id = document.querySelector('input[name="people-id"]').value;
	let month = document.querySelector('select[name="chatlog-entry-month"]').value;
	let year = document.querySelector('select[name="chatlog-entry-year"]').value;
	let description = document.querySelector('textarea[name="chatlog-entry-description"]').value;
	let password = document.querySelector('input[name="new-chatlog-form-password"]').value;

	// Getting the user attached file to the form
	let file = document.querySelector('input[name="chatlog-entry-file"]').files[0];

	// Validating the user entered form inputs
	if (/[0-9]{0,2000}/.test(id)) {
		// If the Id entered by the user is a correct numeric input, then we continue for futher validation

		if (month != 'Month' && year != 'Year') {
			// If the user entered value for the month and year input is not the default value itself, then we continue

			if (/[a-zA-Z0-9]{0,500}/.test(description)) {
				// If the user entered description is valid, then we continue for further process

				// Reading the file's content   
				let contents = ``;       
      			try {
      				let reader = new FileReader();
       				reader.onload = function(e) {
         				file += e.target.result;

						// Creating the POST request data
						data = JSON.stringify({
							task : 'new-chatlog',
							id : id,
							month : month,
							year : year,
							description : description,
							file : file,
							password : password,
						});

						// Sending the POST request
						fetch('/wcbm', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
							// Checking the response from the server

							if (response == 'success') {
								// If the response states 'success', then we assume that our task is executed without any errors and we display the success message to the user

								showAlert('success', 'Chatlog entry uploaded', 'The requested chatlog entry was uploaded to the specified people-id. You can now check the history logs or the people-head to verify wheter the upload was successfull or not.');
							} else {
								// If the response is anything else, then we display the error message to the user

								showAlert('error', 'Failure', `${response}`);
							}
						}).catch(error => showAlert('error', 'Failure', `${error.message}`));
      				}
     				reader.readAsText(file);
     			} catch(error) {
     				// If there are any errors encountered during the process, then we display the error message to the user

     				showAlert('error', 'Failure', 'Failed to read the file specified. Please try again, or do it with other file. If the problem persists, then contact the admin as soon as possible in order to fix this error.');
     			}
			} else {
				// If the user entered description is invalid, then we display the error to the user

				showAlert('error', 'Invalid input', `Please provide us with proper description for this chatlog entry. The description should not comprise of any special characters, just the alphabets and the numbers. Also the length of the description should be between 0 to 500.`);
			}
		} else {
			// If the user entered month or year input is invalid (i.e., set to default), then we display the error to the user

			showAlert('error', 'Invalid input', `Please provide with proper month and year input, to ensure proper chatlog backup entry.`);
		}
	} else {
		// If the Id entered by the user is not a correct numeric input, then we display this error to the user

		showAlert('error', 'Invalid input', `Please provide us with proper people Id. ${id} is an invalid input for people-id.`);
	}
});