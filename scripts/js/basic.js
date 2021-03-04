/*
Encrypted Diary Management - Basic JavaScript File

Author : Rishav Das
*/

// Getting the sidebar menu toggle buttons and assigning them the function for which the sidebar is shown
Array.from(document.getElementsByClassName('menu-toggle-btn')).forEach((element, index) => {
	// Configuring each of the menu toggle bars with the same functions

	let sidebar = document.getElementsByClassName('sidebar')[index];
	element.addEventListener('click', (e) => {
			// When the user clicks on the toggle menu button, we toggle the classname with the active class to display the sidebar on the screen
			
			e.preventDefault();
			sidebar.classList.toggle('active');
			element.classList.toggle('active');
		});
});
// Getting the nav-item and assigning them a link function
Array.from(document.getElementsByClassName('nav-item')).forEach((element, index) => {
// Setting the same onclick event for all such nav items
	
	let classList = Array.from(element.classList);
	if (classList.includes('modal-show-btn') || classList.includes('other')) {
		// If the nav-item is a modal show button or has other class in it, then we pass the function
	
		return false;
	}

	element.addEventListener('click', (e) => {
		// When the user clicks on the nav-item, we redirect the user 

		e.preventDefault();
		try {
			let targetLocation = e.target.getAttribute('href');
			location.href = targetLocation;
		} catch(error) {}
	});
});
Array.from(document.getElementsByClassName('link-btn')).forEach((element, index) => {
	element.addEventListener('click', (e) => {
		// If the user clicks on a link-btn, then we redirect the page to the href location specified in the button
		e.preventDefault();
		targetLocation = e.target.getAttribute('href');
		location.href = targetLocation;
	}); 
});
// Displaying the alert when function is called
const showAlert = (type, title, message) => {
	// The function for the showing of an alert modal on the window of the user

	let alert = document.querySelector('div.modal-dialog.alert');
	let alertBox = alert.getElementsByClassName('alert-box')[0];
	alertBox.classList.remove('success');
	alertBox.classList.remove('error');
	alertBox.classList.add(type)
	alert.getElementsByClassName('head')[0].innerHTML = `${title}<span class="alert-close-btn" onclick="closeAlert(this);">&times;</span>`;
	alert.getElementsByClassName('body')[0].innerHTML = message;
	alert.style.display = 'block';
	return true;
}
// Closing an alert when the alert-close-btn is clicked
const closeAlert = (element) => {
	// When the user clicks on the close alert box button, then we close the parentNode modal-dialog (in fact removing it from the HTML DOM)

	let alert = document.querySelector('div.modal-dialog.alert');
	alert.style.display = 'none';
	return true;
}
// Displaying the modals when the user clicks on the element with the class modal-show-btn
Array.from(document.getElementsByClassName('modal-show-btn')).forEach(function(element, index) {
	// Adding the listening event for each such element btn

	element.addEventListener('click', function(e) {
		// First we get the modal id via the href attribute of the button

		e.preventDefault();
		let modal = document.querySelector(e.target.getAttribute("href"));
		modal.style.display = 'block';
	});
});
// Hiding the modal when the user clicks the close modal btn
Array.from(document.getElementsByClassName('modal-dialog')).forEach(function(element, index) {
	if (element.className.includes('alert')) {
		// If the current modal element is actually the alert box, then we skip the process here
		//pass
	} else {
		let modalCloseBtn = element.getElementsByClassName('modal-close-btn')[0];
		modalCloseBtn.addEventListener('click', function(e) {
			e.preventDefault();
			element.style.display = 'none';
		});
	}
});