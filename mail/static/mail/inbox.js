document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  load_mailbox('inbox');


  document.querySelector('#compose-form').onsubmit = function(event) {
    event.preventDefault();
 
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body
        })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);  
    
      if (result.error) {
        alert("Error: " + result.error); 
      } else {
        alert(result.message);           
        load_mailbox('sent');         
      }
    });
  };
});

function compose_email() {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch ('/emails/' + mailbox, { method: 'GET' })
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {
      const emailElement = document.createElement('div');
      emailElement.className = 'email-item';
      emailElement.innerHTML = `<a href="/emails/${email.id}" style="color: black">  <strong>${email.sender}</strong> <==|==> ${email.subject} <==|==> <span class="date">${email.timestamp}</span></a>`;
      emailElement.style.backgroundColor = email.read ? 'gray' : 'white';
      emailElement.style.padding = '10px';
      emailElement.style.marginBottom = '10px';
      emailElement.addEventListener('click', () => view_email(email.id));
      document.querySelector('#emails-view').appendChild(emailElement);
    });
  });
}
