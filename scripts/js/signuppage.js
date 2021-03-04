/*
Javascript for the Sign Up page - Encrypted Diary Management
*/

// Getting the sign up button HTML element
const signupBtn = document.getElementById('signup-btn');

// Adding an onclick event listener to the sign up button
signupBtn.addEventListener('click', (e) => {
	/* The function which is called when the user presses the signup button. The function first reads the user specified input from the form elements and then sends a POST request to the server. */

	e.preventDefault();

	// Reading the username and password from the input boxes
	username = document.querySelector('input[name="username"]').value;
	password = document.querySelector('input[name="password"]').value;

	// Checking wheter the entries are valid (w.r.t. character length and whitespaces)
	if (username.length < 5 || password.length < 7) {
		// If the user enters either the username or the password of less characters than the valid, then we open up an alert box

		showAlert('error', 'Unfilled Credentials', 'Please enter a proper and valid username or password to continue further.');
	} else {
		// If the user enters proper username and password, then we create a POST request to the same '/signup' and request to create a new user

		// Creating the POST request data
		let data = JSON.stringify({username, password});

		// Sending the POST request using the fetch methods
		fetch('/signup', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
			// We will check here the response from the backened (wheter authentication success or failed)

			if (response == 'success') {
				// If the response from the server shows success, then we alert the user that the new account has been created

				showAlert('success', 'Sign Up Success!', `Successfully created new user account. You can now login with the specified password and username : ${username}`);
			} else {
				// If the response from the server is anything other than 'success', then we raise an error

				showAlert('error', 'Failure', response)
			}
		}).catch(error => showAlert('error', 'Sign Up Failed', `The log in attempt resulted in a failure, reason is ${error}.`));
	}
});