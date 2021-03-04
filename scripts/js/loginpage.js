/*
Login Page JavaScript - Encrypted Diary Management
*/

// Getting the login button
const logInBtn = document.getElementById('login-btn');

// Handling the event when someone clicks the logInBtn
logInBtn.addEventListener('click', (e) => {
	/* The function to be executed when the user clicks on the logInBtn, here we we will prevent the default action from happening and then we will read the username and password as per the user enters and then we will send the username and password for the verfication ;-) */

	e.preventDefault();

	// Reading the username and password from the input boxes
	username = document.querySelector('input[name="username"]').value;
	password = document.querySelector('input[name="password"]').value;

	// Checking wheter the entries are valid (w.r.t. character length and whitespaces)
	if (username.length < 5 || password.length < 7) {
		// If the user enters either the username or the password of less characters than the valid, then we open up an alert box

		showAlert('error', 'Unfilled Credentials', 'Please enter a proper and valid username or password to continue further.');
	} else {
		// If the user enters proper username and password, then we create a POST request to the same '/login' URL and authenticate the user

		// Creating the POST request data
		let data = JSON.stringify({username, password});

		// Sending the POST request using the fetch methods
		fetch('/login', {body : data, method : 'post', headers : {'Accept': 'application/json', 'Content-Type' : 'application/json'}}).then(response => response.text()).then(response => {
			// We will check here the response from the backened (wheter authentication success or failed)

			if (response == 'success') {
				// If the authentication returns true, then we redirect the user to the home page

				location.href = '/';
			} else {
				// If the authentication returns any other value other than true, then we pop an alert box indicating the user has failed the login attempt

				showAlert('error', 'Log in failed!', response);
			}
		}).catch(error => showAlert('error', 'Log in failed', `The log in attempt resulted in a failure, reason is ${error}.`));
	}
});