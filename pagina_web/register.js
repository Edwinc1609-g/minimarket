document.querySelector('.form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = document.getElementById('user').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user, email, password })
    });
    
    const result = await response.text();
    alert(result);
  });
  