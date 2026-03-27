import { setAccessToken } from '../../core/store.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // 기본 폼 제출 차단

      const email = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            setAccessToken(data.token);
            console.log('Login successful, token stored in variable.');
            // 성공 시 메인 페이지로 이동 (이동 후 Refresh Token으로 다시 채워질 예정)
            location.href = '/plan';
          }
        } else {
          alert('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
      }
    });
  }
});
