const loginFormHandler = async (event)=> {	
    event.preventDefault();	

    const email = document.querySelector('#email').value.trim();	
    const password = document.querySelector('#password').value.trim();	

    if (email && password) {	
        const response = await fetch('/api/user/login', {	
            method: 'POST',	
            body: JSON.stringify({email, password}),	
            headers: { 'Content-Type': 'application/json'},	
        });	

        if(response.ok) {	
            document.location.replace('/homepage');	
        } else {	
            alert(response.statusText)	
        }	
    }	
};	

const signupFormHandler = async (event) => {	
    event.preventDefault();	

    const role = document.querySelector('#role').value;
    const firstName = document.querySelector('#firstname-signup').value.trim();	
    const lastName = document.querySelector('#lastname-signup').value.trim();	
    const email = document.querySelector('#email-signup').value.trim();	
    const password = document.querySelector('#password-signup').value.trim();	

    if (firstname && lastName && email && password) {	
      const response = await fetch('/api/user/signup', {	
        method: 'POST',	
        body: JSON.stringify({ firstName, lastName, email, password }),	
        headers: { 'Content-Type': 'application/json' },	
      });	

      if (response.ok) {	
        document.location.replace('/login');	
      } else {	
        alert(response.statusText);	
      }	
    }	
  };	

  document	
  .querySelector('.login-form')	
  .addEventListener('submit', loginFormHandler);	

document	
  .querySelector('.signup-form')	
  .addEventListener('submit', signupFormHandler);
