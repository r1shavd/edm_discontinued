/*
Encrypted Diary Management (web application version)

Author : Rishav Das
Programming language used : JavaScript (for backend), HTML and CSS (for frontend)
Technologies used : NodeJs
*/

// Importing the required modules into our application's main file
const FS = require('fs');
const EXPRESS = require('express');
const SESSION = require('express-session');
const BODY_PARSER = require('body-parser');

// Defining some functions required for the proper functioning of the application
const encrypt = (text, password) => {
	/* The function to encrypt a plain text to a cipher format using password protection, the text / strings encrypted using a specific password can only be decrypted using that original password and also you need the decrypt() function defined by the same script. The function takes two arguments as an input, they are "text" and "password" and returns the encrypted text. */

	// First generating the key for the encryption
	let key = 0, n = 0;
	for (let i of password) {
		// Iterating through each characters of the password in order to create the key sum

		if (n % 2 == 0) {
			key += i.charCodeAt();
		} else {
			key -= i.charCodeAt();
		}
		n += 1;
	}
	// Making the key possitive if it is negative ( We simply multiply it by -1 ;-) )
	if (key < 0) {
		key = key * (-1);
	}
	// Adding up the password length to the key integer
	key += password.length;

	// Now converting each plain character to the jumbled format
	let encryptedText = ``;
	text.split('').forEach((element, index) => {
		// Shifting the char code
		encryptedText += String.fromCharCode((element.charCodeAt() + key) % 256);
	});

	// Encoding the jumbled character to the base64
	encryptedText = Buffer.from(encryptedText, 'utf-8').toString('base64');

	// Returning back the cipher text
	return encryptedText;
}
//
const decrypt = (text, password) => {
	/* The function to decrypt the cipher text already encrypted using the encrypt() function and the function requires the original password used to encrypt the original string. The function takes two arguments as an input, they are "text" and "password". The "text" is the string which needs to be decrypted and "password". The function returns the decrypted string.*/

	// First generating the key for the decryption
	let key = 0, n = 0;
	for (let i of password) {
		// Iterating through each characters of the password in order to create the key sum

		if (n % 2 == 0) {
			key += i.charCodeAt();
		} else {
			key -= i.charCodeAt();
		}
		n += 1;
	}
	// Making the key possitive if it is negative ( We simply multiply it by -1 ;-) )
	if (key < 0) {
		key = key * (-1);
	}
	// Adding up the password length to the key integer
	key += password.length;

	// Now converting each cipher jumped character to the original form
	let decryptedText = ``;
	text = Buffer.from(text, 'base64').toString('utf-8');  // Decoding the cipher text from base64 format back to the ASCII format
	text.split('').forEach((element, index) => {
		// Shifting the char code
		decryptedText += String.fromCharCode((element.charCodeAt() - key) % 256);
	});

	// Returning back the cipher text
	return decryptedText;
}
//
const hash = (password) => {
	/* The function to hashify a string password into a cipher format which can be only decryptable if we know the real password, this is the secure way of storing the passwords in the server databases. */

	// First generating the key for the encryption (hashing)
	let key = 0, n = 0;
	for (let i of password) {
		// Iterating through each characters of the password in order to create the key sum

		if (n % 2 == 0) {
			key += i.charCodeAt();
		} else {
			key -= i.charCodeAt();
		}
		n += 1;
	}
	// Making the key possitive if it is negative ( We simply multiply it by -1 ;-) )
	if (key < 0) {
		key = key * (-1);
	}
	// Adding up the password length to the key integer
	key += password.length;

	// Now converting each plain character to the jumbled format
	let hash = ``;
	password.split('').forEach((element, index) => {
		// Shifting the char code
		hash += String.fromCharCode((element.charCodeAt() + key) % 256);
	});

	// Encoding the jumbled character to the base64
	hash = Buffer.from(hash, 'utf-8').toString('base64');

	// Returning back the hashed format of the password
	return hash;
}

// Creating the express app (object)
const app = EXPRESS();

// Setting the static directory for our express powered application
app.use(EXPRESS.static('scripts'));
// Setting the media directory for our express powered application
app.use(EXPRESS.static('media'));

// Setting the template type (view engine) of the app to the ejs
app.set('view engine', 'ejs');

// Defining some of the properties for the POST requests and other body parser properties
app.use(BODY_PARSER.urlencoded({ extended: true }));
app.use(BODY_PARSER.json());
app.use(SESSION({secret: '15265126735vdfghdsf35hgdfhgsdf53624', resave: true, saveUninitialized: true}));

// DEFINING THE ENDPOINTS OF THE APPLICATION HERE
//
// Index (/) endpoint
app.get('/', (request, response) => {
	/* The function which serves the response when there is a GET request on the '/' URL of the app. Here, we will render the home page only if the user is logged in. */

	// Checking wheter the user is logged in or not
	if (request.session.loggedIn) {
		// If the user is logged in already

		try {
			// Getting the homepage data from the datafiles
			homepageData = JSON.parse(FS.readFileSync(__dirname + '/datafiles/homepage_data'));

			// Setting the random welcome thought choice for the homepage
			homepageData.welcome_thoughts = homepageData.welcome_thoughts[Math.floor((Math.random() * 10) + 1) % 9];

			// Getting the amount of years for diary entry year date (for the new diary entry form at the frontend)
			homepageData.years = [];
			let date = new Date();
			n = date.getFullYear();
			while (n >= 1990) {
				homepageData.years.push(n);
				n -= 1;
			}

			// Reading the already existing diary entries from the server
			data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/diary'));
			homepageData.diary = [];
			for (let item of data) {
				// Iterating through each diary entry

				homepageData.diary.push({
					id : item.id,
					title : item.title,
					datetime : item.datetime,
				});
			}
		} catch(error) {
			return response.render('error/server-failure', {error : error});
		}

		// Rendering the index.ejs file back to the client side
		return response.render('index', {username : request.session.username, homepage_data : homepageData});
	} else {
		// If the user is not logged in, then we redirect the client to the login page

		return response.redirect('/login');
	}
});
//
app.post('/', (request, response) => {
	/* The function which serves the response when there is a POST request on the '/' URL of the app. Here, we will execute the following tasks as per requested by the POST request data :
	1. Insert a new diary entry */

	// Checking wheter the user is logged in or not
	if (request.session.loggedIn)  {
		// If the user is logged in already, then we continue to execute the task specified

		// Getting the POST request data
		let task = request.body.task;

		// Checking the task requested by the POST request
		if (task == 'new-diary-entry') {
			// If the task is to insert a new diary entry for the currently logged in users, then we continue the process

			// Authenticating the user on the basis of the password entered on the client-side form
			let password = request.body.password;
			console.log(password, hash(password));
			try {
				// Getting the users data
				data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/users'));
				for (let user of data) {
					// Iterating through each user item

					if (user.username == request.session.username) {
						if (user.password == hash(password)) {
							// If the password matches for the currently logged in user, then we continue the process

							// Getting the user entered data via the POST request
							let title = request.body.title;
							let content  = request.body.content;
							let day = request.body.day;
							let month = request.body.month;
							let year = request.body.year;

							// Getting the timestamp for the new diary entry
							let date = new Date(year, month, day);
							let timestamp = date.valueOf();

							// Encrypting the contents of the diary entry
							content = encrypt(content, password);

							// Saving the diary entry to the diary file
							data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/diary'));
							// Generating the Id for the new diary entry
							if (data.length == 0) {
								id = 1;
							} else {
								id = data[data.length - 1].id + 1;
							}

							data.push({
								id : id,
								username : request.session.username,
								title : title,
								content : content,
								datetime : `${day}-${month+1}-${year}`,
								timestamp : timestamp,
							});
							FS.writeFileSync(__dirname + '/datafiles/diary', JSON.stringify(data));

							// If the process is executed without any error until now, then we return the success message back to the user
							return response.send('success');
						} else {
							// If the password does not matches for the currently logged in user, then return an error back to the client

							return response.send('Incorrect password');
						}
					}
				}
			} catch(error) {
				// If we encounter an error during the process, then we return the error message back to the client

				return response.send(`${error.message}`);
			}
		} else {
			// If the POST request does define any valid task to execute, then we return an improper data error message back to the user

			return response.send('Improper data sent. Task to be executed not defined by the request.');
		}
	} else {
		// If the user is not logged in then we redirect the user to the login page

		return response.redirect('/login');
	}
});

// Login (/login) endpoint
app.get('/login', (request, response) => {
	/* The function which serves the response when there is a GET request on the '/login' URL of the app. Here, we will further render the login page only if the user is not logged in */

	// Checking wheter the user is logged in or not
	if (request.session.loggedIn) {
		// If the user is logged in already, then we redirect the user to the /home

		return response.redirect('/');
	} else {
		// If the user is not logged in, then we render the login page

		return response.render('login');
	}
});
//
app.post('/login', (request, response) => {
	/* The function which serves the response when there is a POST request on the '/login' URL of the app. The function first checks wheter the user is logged in or not, then proceeds to verify the user authentication using the POST parameter data. */

	// Checking wheter the user is logged in or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we redirect the user to the index page

		return response.redirect('/');
	} else {
		// If the user is not logged in, then we continue the process

		// Getting the POST request data
		username = request.body.username;
		username = username.toLowerCase(); // Converting the entire username string to all lower case character in order to stop confusion between similar characters
		password = request.body.password;
		password = hash(password);  // Hashing the password

		try {
			// Verifying the user in the database
			data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/users'));
			for (let item of data) {
				// Iterating through each data item

				if (item.username == username) {
					// If the same username matches on the users data, then we proceed to verify the password

					if (item.password == password) {
						// If the user specified password matches the password for the user in the database, then we login the user and return success message back to the client

						request.session.loggedIn = true;
						request.session.username = username;
						return response.send('success');
					} else {
						// If the user specified password does not matches the password for the user in the database, then we return incorrect password error message back to the client

						return response.send(`Incorrect password for the user ${item.username}`);
					}
				}
			}

			// If we are out of the loop, that means no user accounts exists with the user specified username, So now we return error
			return response.send(`No such user ${username}`)
		} catch(error) {
			// If there are any errors encountered during the process, then we return it back to the client

			return response.send(error.message)
		}
	}
});

// Signup (/signup) endpoint
app.get('/signup', (request, response) => {
	/* The function which serves the response when there is a GET request on the '/signup' URL of the web app. The function first checks wheter the user is logged in or not, then it simply renders the signup.ejs file. */

	// Checking wheter the user is logged in or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we redirect the user to the home (index) page

		return response.redirect('/');
	} else {
		// If the user is not logged in, then we render the signup.ejs file

		return response.render('signup');
	}
});
//
app.post('/signup', (request, response) => {
	/* The function which serves the response when there is a POST request on the '/signup' URL of the web app. The function first checks wheter the user is logged in or not, then it completes the signup backend process. */
	
	// Checking wheter the user is logged in or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we redirect the user to the index page

		return response.redirect('/');
	} else {
		// If the user is not logged in, then we continue the signup backend process

		// Getting the POST request data
		username = request.body.username;
		username = username.toLowerCase();  // Converting the entire username string to all lower case character in order to stop confusion between similar characters
		password = request.body.password;

		try {
			// Fetching the data from users file
			data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/users'));

			// Checking another user account with same username exists or not
			for (let item of data) {
				if (item.username == username) {
					// If another user account with same username exists in the database, then we return error message back to the client

					return response.send('Another user account with same username already exists');
				}
			}

			// If we are out of the loop, we can assume that no any user account already exists with same username
			// Hashing the password specified by the user in order to have a safe storage of user credentials in the web app database
			password = hash(password);

			// Saving the new user account credentials back to the database
			data.push({username : username, password : password})
			FS.writeFileSync(__dirname + '/datafiles/users', JSON.stringify(data));

			// If the new user has been added to the web app database, then we return an success message back to the client
			return response.send('success');
		} catch(error) {
			// If there are any errors encountered during the process, then we return the error message back to the client

			return response.send(error.message);
		}
	}
});

// Logout (/logout) endpoint
app.get('/logout', (request, response) => {
	/* The function to serve the response when there is a GET request on the '/logout' URL of the web app. The function first check wheter the user is logged in or not, then logs out the user out of the current session else redirects to index page */

	// Checking wheter the user is logged in or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we first log out the user from the current session and then redirect the client side to the '/login' URL of the web app

		request.session.loggedIn = false;
		request.session.username = undefined;
		return response.redirect('/login');
	} else {
		// If the user is not logged in, then we redirect the user back to the index page

		return response.redirect('/');
	}
});

// DEFINING THE MAIN ENDPOINTS FOR THE DIARY PART OF THE APPLICATION HERE
// Diary (/diary) endpoint
app.get('/diary', (request, response) => {
	/* The function which serves the response when there is a GET request on the '/diary' URL of the app. Here, we will first fetch the already saved diary entries by the currently logged in user, and then we start fetching the particular diary entry as per specified by the GET request data (URL parameters). */

	// Checking wheter the user is logged in or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we continue the process

		try {
			// Fetching the diary file data
			data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/diary'));

			// Getting the GET request data (URL parameters)
			let id = request.query.id;
			diary = [];
			if (id === undefined) {
				// If the Id for the diary entry is not specified, then we continue to render all the saved diary entries by the currently logged in user

				for (let item of data) {
					// Iterating through each diary entries

					if (item.username == request.session.username) {
						diary.push({
							id : item.id,
							title : item.title,
							content : item.content,
							datetime : item.datetime,
							timestamp : item.timestamp,
						});
					}
				}
			} else {
				// If the Id for the diary entry is specified, then we continue to return the data for the specific diary data

				// Getting the specified diary entry by its Id
				for (let item of data) {
					// Iterating through each diary entry

					if (item.id == id) {
						// If the diary entry matches the user requested diary entry Id

						if (item.username == request.session.username) {
							// If the item fetched belongs to the currently logged in user, then we continue to render the fetched informaton 

							diary.push({
								id : item.id,
								title : item.title,
								content : item.content,
								datetime : item.datetime,
								timestamp : item.timestamp,
							});
						} else {
							// If the item fetched does not belongs to the currently logged in user, then we render the 404 not found error page back to the user

							return response.send('error/404');
						}
					}
				}
			}

			// Creating some other required data for the page
			data = {}
			data.years = [];
			let date = new Date();
			n = date.getFullYear();
			while (n >= 1990) {
				data.years.push(n);
				n -= 1;
			}

			// After the requested diary data has been fetched, then we continue to render the diary.ejs page with the diary data
			return response.render('diary', {username : request.session.username, diary : diary, data : data});
		} catch(error) {
			// If there are any errors encountered during the process, then we render the error message to the user with the server-failure page

			return response.render('error/server-failure', {error : error});
		}
	} else {
		// If the user is not logged in, then we redirect the user to the login page

		return response.redirect('/login')
	}
});
//
app.post('/diary', (request, response) => {
	/* The function which serves the response when there is a POST request on the '/diary' URL of the app. The function execute the task as per specified in the POST request data (parameters).
	The task that are performed by this endpoint functions are :
	1. Decrypting the diarry entry's content
	2. Updating the diary entry's content */

	// Checking wheter the user is logged in or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we continue the process
 
		// Getting the detail of the task to be performed
		let task = request.body.task;	
		if (task == 'decrypt-diary-content') {
			// If the POST request specifies the task of decrypting the diary contents, then we proceed for it

			// Getting the POST request data
			let content = request.body.content;
			let password = request.body.password;

			try {
				// Verifying the password entered as compared to the currently logged in user
				data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/users'));
				for (let user of data) {
					if (user.username == request.session.username) {
						if (user.password == hash(password)) {
							// If the passwords are matched, then we continue the process

							// Decrypting the specifed diary content
							content = decrypt(content, password);
							return response.send(JSON.stringify({content : content}))
						} else {
							// If the passwords donot match, then we return the incorrect password error back to the client

							return response.send('Incorrect password');
						}
					}
				}
			} catch(error) {
				// If there are any errors encountered by you during the process, then we return the error message back to the client

				return response.send(`${error.message}`);
			}
		} else if (task == 'update-diary-content') {
			// If the POST request specifies the task of updating the diary content of an existing diary entry, then we proceed for it

			// Getting the POST request data
			let id = request.body.id;
			let content = request.body.content;
			let password = request.body.password;

			try {
				// Verifying the password entered as compared to the currently logged in user
				data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/users'));
				for (let user of data) {
					if (user.username == request.session.username) {
						if (user.password == hash(password)) {
							// If the passwords are matched, then we continue the process

							// Encrypting the specifed diary content
							content = encrypt(content, password);
							
							// Saving the diary content to the specified diary entry Id
							data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/diary'));
							for (let item of data) {
								// Iterating through each diary entry

								if (item.id == id) {
									item.content = content;
								}
							}
							FS.writeFileSync(__dirname + '/datafiles/diary', JSON.stringify(data));

							// If the task is completed upto here without any error, then we return the 'success' message back to the user
							return response.send('success');
						} else {
							// If the passwords donot match, then we return the incorrect password error back to the client

							return response.send('Incorrect password');
						}
					}
				}
			} catch(error) {
				// If there are any errors encountered by you during the process, then we return the error message back to the client

				return response.send(`${error.message}`);
			}
		} else if (task == 'delete-diary-entry') {
			// If the POST request specifies the task of deleting the diary entry as per specified in the POST request data

			// Getting the POST request data
			let id = request.body.id;

			try {
				// Parsing the diary data in order to delete the requested diary entry
				data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/diary'));
				diary = [];
				for (let item of data) {
					// Iterating through each diary entries

					if (item.id == id) {
						// If the current item is the one that is requested to be deleted, then we skip the loop and donot add it to the new diary entries list

						continue;
					} else {
						// If the current item is not the one requested to be deleted, then we can add it to the new diary data list

						diary.push(item);
					}
				}

				// Updating the diary file with the new diary data list
				FS.writeFileSync(__dirname + '/datafiles/diary', JSON.stringify(diary));

				// If the process has been executed without any errors till here, then we return the success message back to the client stating that the task has been executed successfully
				return response.send('success');
			} catch(error) {
				// If there are any errors encountered during the process, then we return the error message back to the client

				return response.send(`${error.message}`);
			}
		} else {
			// If the POST request specified no any valid task, then we return the error message

			return response.send('Improper data given, task to be executed is not specified.');
		}
	} else {
		// If the user is not logged in, then we redirect the user to the '/login page'

		return response.redirect('/login');
	}
});

// Diary Statistics (/diary/statistics) endpoint
app.get('/diary/statistics', (request, response) => {
	/* The function which serve the response when there is a GET request on the '/diary/statistics' URL of the app. The function filters all the diary data and then create the statistics and results that are rendered with the diary_stats file. */

	// Checking if the user is already logged in or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we continue to fetch the required details and then rendering the diary_stats.ejs file

		try {
			// Fetching the diary entries by the currently logged in user
			data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/diary'));

			// Filterting the diary entries of the currently logged in user
			diary = [];
			for (let item of data) {
				// Iterating through each diary entry

				if (item.username == request.session.username) {
					// If the currently iterated diary entry belongs to the currently logged in user, then we add it to the filtered diary array object

					diary.push(item);
				} else {
					// If the currently iterated diary entry does not belong to the currently logged in user, then we skip this loop

					continue;
				}
			}

			// Creating the blank data object for further data filling
			data = {}
			data.total_entries = diary.length;  // The amount of diary entries in overall history by the current user

			// Splitting the diary entries as per the month timestamps
			data.months = [];
			for (let item of diary) {
				// Iterating through each diary entry in order to split them according to the month timestamps

				month = item.datetime.split('-')[1] + '-' + item.datetime.split('-')[2];
				append = false;
				index = 0;
				for (let i of data.months) {
					if (i.month == month) {
						append = true;
						index = data.months.indexOf(i);
						break;
					} else {
						continue;
					}
				}

				if (append) {
					// If the month timestamp already exists in the months list, then we add the entry upto it

					data.months[index].entries.push({id : item.id, title : item.title, datetime : item.datetime});
				} else {
					// If the month timestamp does not exists, then we add up a new diary entry

					data.months.push({
						month : month,
						entries : [item],
					});
				}
			}
			// Making the months and year as per words in the months array
			for (item of data.months) {
				// Iterating through each month timestamps

				months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];  // The months array
				month = months[item.month.split('-')[0] - 1];
				year = item.month.split('-')[1];

				// Updating the months and year information in the months timestamps list
				item.month = month;
				item.year = year;
			}

			return response.render('diary_stats', {data : data, diary : diary});
		} catch(error) {
			// If there are any errors encountered during the process, then we return the error page back to the client through the server-failure page

			return response.render('error/server-failure', {error : error});
		}
	} else {
		// If the user is not logged in, then we redirect the user to login page

		return response.redirect('/login');
	}
});

// Diary Search (/diary/search) endpoint
app.get('/diary/search', (request, response) => {
	/* The function which serves the response when there is a GET request on the '/diary/search'. The function first gets the URL parameters and then filters the diary data. Then the data is served to the user through rendering the diary_search.ejs file. */

	// Checking wheter the user logged in or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we continue the process

		try {
			// Getting the URL parameters (GET request data)
			let query = request.query.q;
			let month = request.query.month;
			let year = request.query.year;

			// Converting each data parameters to all lowercase characters in order for better search
			query = query.toLowerCase();
			month = month.toLowerCase();
			year = year.toLowerCase();
			
			// Getting the month index number
			const months = ['m', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
			month = months.indexOf(month);

			// Fetching the data from the diary file
			data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/diary'));

			// Filtering the diary data as per the user entered queries, months and years
			diary = [];
			for (let item of data) {
				// Iterating through each diary entry item

				// Extracting the some data of the currently iterated diary entry (title in all lower characters, month and year created at)
				itemTitle = item.title.toLowerCase();
				itemMonth = item.datetime.split('-')[1];
				itemYear = item.datetime.split('-')[2];

				if (itemTitle.includes(query) || query.includes(itemTitle)) {
					// If the title and the query matches somehow, then we check further filtering

					if (month == 0) {
						// If the user has not mentioned any month for filtering the data, then we continue to filter for the year

						if (itemYear == year) {
							// If the user specified year matches the year of the currently iterated diary entry item, then we continue to append the item to the filtered data array.

							diary.push(item);
						} else if (year == 'y') {
							// If the user didn't specify any year. So, we continue to append the diary entry item irrespective of the year

							diary.push(item);
						} else {
							// If the user specified year does not matches the year of the currently iterated diary entry item, then we skip the currently iterated item.

							continue;
						}
					} else {
						// If the user specified a month for filtering the diary entry search results, then we continue to filter according to the months

						if (itemMonth == month) {
							// If the month specified by the user matches the currently iterated diary entry item, then we continue to check for the year

							if (itemYear == year) {
								// If the user specified year matches the year of the currently iterated diary entry item, then we continue to append the item to the filtered data array.

								diary.push(item);
							} else if (year == 'y') {
								// If the user didn't specify any year. So, we continue to append the diary entry item irrespective of the year

								diary.push(item);
							} else {
								// If the user specified year does not matches the year of the currently iterated diary entry item, then we skip the currently iterated item.

								continue;
							}
						} else {
							// If the month specified by the user during the search does not matches the currently iterated diary entry item, then we skip the currently iterated item.

							continue;
						}
					}
				} else {
					// If the user specified search query does not matches with the title of the currently iterated diary entry item, then we skip the currently iterated item.

					continue;
				}
			}

			// Creating the data object for storing other required information to be rendered on the client side
			data = {
				search_query : query,
			}

			// Creating the years list for the search form dropdown options
			data.years = [];
			let date = new Date();
			n = date.getFullYear();
			while (n >= 1990) {
				data.years.push(n);
				n -= 1;
			}

			// Rendering the diary_search page with the filtered diary entries data
			return response.render('diary_search', {diary : diary, data : data});
		} catch(error) {
			// If there are any errors encountered during the process, then we return the error back to the client through rendering the server-failure.ejs file

			return response.render('error/server-failure', {error : error});
		}
	} else {
		// If the user is not logged in, then we redirect the user to the login page

		return response.redirect('/login');
	}
});

// Profile (/profile) endpoint
app.get('/profile', (request, response) => {
	/* The function which serves the response when there is a GET request on the '/' URL of the app. Here, we will first fetch some required data and then render the profile.ejs with some fetched data and analytics. Before serving the information, we will also check wheter the user is logged in or not. */

	// Checking wheter the user is logged in or not
	if (request.session.loggedIn) {
		// If the user is already logged in, then we continue the process

		// Getting the information related to the user
		let username = request.session.username;
		try {
			// Fetching the information from the users file

			let data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/users'));
			let profileData;
			for (let item of data) {
				if (item.username == username) {
					// If the currently iterated item matches that of the username

					profileData = item;
				}
			}

			// Fetching the diary entries for the currently logged in user
			data = JSON.parse(FS.readFileSync(__dirname + '/datafiles/diary'));
			profileData.diary = [];
			for (let item of data) {
				if (item.username == username) {
					// If the currently iterated diary data item is of the currently logged in user, then we add up the data to the filtered data array post decrypting it ;-)

					profileData.diary.push({
						id : item.id,
						title : item.title,
						content : item.content,
						datetime : item.datetime,
					});
				}
			}
			
			// Checking the information of the user and rendering it to the client
			return response.render('profile', {username : request.session.username, data : profileData});
		} catch(error) {
			// If there are any errors encountered during the process, then we render the error page to the client

			return response.render('error/server-failure', {error : error});
		}
	} else {
		// If the user is not logged in, then we redirect the client to the login page

		return response.redirect('/login');
	}
});

// Casual Endpoints
//
// Encrypt (/encrypt) endpoint
app.post('/encrypt', (request, response) => {
	/* The function which serves the response when there is a POST request on the '/encrypt' URL of the app. The function takes in the text and password for encryption as the POST request parameters (data), and then returns the encrypted form of the data, else returns a blank string. The endpoint does not requires any user to be logged in with the currently running session. */

	// Getting the POST request data (parameters)
	let text = request.body.text;
	let password = request.body.password;

	// Checking the parameters
	if (text == undefined || password == undefined) {
		// If any of either text or password is undefined, then we return a blank string as a response

		return response.send('');
	} else {
		// If none of text or password is undefined, then we continue to encrypt the string and return the result as a response

		try {
			// Encrypting the specified text with the password
			text = encrypt(text, password);
			return response.send(text);
		} catch(error) {
			// If there are any errors encountered during the process, then we return a blank string

			return response.send('');
		}
	}
});
//
app.post('/decrypt', (request, response) => {
	/* The function which serves the response when there is a POST request on the '/encrypt' URL of the app. The function takes in the text and password for decryption as the POST request parameters (data), and then returns the decrypted form of the data, else returns a blank string. The endpoint does not requires any user to be logged in with the currently running session. */

	// Getting the POST request data (parameters)
	let text = request.body.text;
	let password = request.body.password;

	// Checking the parameters
	if (text == undefined || password == undefined) {
		// If any of either text or password is undefined, then we return a blank string as a response

		return response.send('');
	} else {
		// If none of text or password is undefined, then we continue to decrypt the string and return the result as a response

		try {
			// Encrypting the specified text with the password
			text = decrypt(text, password);
			return response.send(text);
		} catch(error) {
			// If there are any errors encountered during the process, then we return a blank string

			return response.send('');
		}
	}
});

// Our application will be serving at localhost:8000
app.listen(8000, () => {
	console.log('EDM application serving at port 8000');  // Writing a console message indicating that the server is running on the port 8000
});