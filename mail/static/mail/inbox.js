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
  document.querySelector
});

function render_Email(email_id) {
  fetch('/emails/' + email_id, { method: 'GET' })
  .then(response => response.json())
  .then(email => {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    
    const emailView = document.querySelector('#email-view');
    emailView.style.display = 'block';
    
    emailView.innerHTML = `
      <h3>${email.subject}</h3>
      <p><strong>From:</strong> ${email.sender}</p>
      <p><strong>To:</strong> ${email.recipients.join(', ')}</p>
      <p><strong>Timestamp:</strong> ${email.timestamp}</p>
      <hr>
      <p>${email.body}</p>
    `;
    
    if (!email.read) {
      fetch('/emails/' + email_id, {
        method: 'PUT',
        body: JSON.stringify({ read: true })
      });
    }
  });

}

function compose_email() {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch ('/emails/' + mailbox, { method: 'GET' })
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {
      const emailElement = document.createElement('div');
      emailElement.className = 'email-item';
      
      emailElement.innerHTML = `
        <a href="#" style="color: black" id="email-${email.id}">
          <strong>${email.sender}</strong> <==|==> ${email.subject} <==|==> 
          <span class="date">${email.timestamp}</span>
        </a>
      `;
      emailElement.addEventListener('click', () => {
        render_Email(email.id); 
      });

      emailElement.style.backgroundColor = email.read ? 'gray' : 'white';
      emailElement.style.padding = '10px';
      emailElement.style.marginBottom = '10px';
      emailElement.addEventListener('click', () => view_email(email.id));
      document.querySelector('#emails-view').appendChild(emailElement);
    });
  });
}
