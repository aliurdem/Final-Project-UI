import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import icon1 from '/icon1.png';
import icon2 from '/icon2.png';
import icon3 from '/icon3.png';
import icon4 from '/icon4.png';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: email,
      password: password
    };

    try {
      const response = await fetch('https://localhost:7263/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccessMessage('Kayıt başarılı! Giriş yapabilirsiniz.');
        setErrorMessage('');
        setTimeout(() => navigate('/login'), 2000); // 2 saniye sonra giriş sayfasına yönlendir
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Hata oluştu:', error);
      setErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2 className="title">Bize Katılın!</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-Mail"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">Kaydol</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
        <p className="login-text">
          Hesabınız var mı? <a href="/login" className="login-link">Giriş Yap</a>
        </p>
      </div>
      <div className="image-container">
        <img src="/signup.png" alt="Kayıt İllustrasyonu" className="signup-image" />
        <img src={icon1} alt="İkon 1" className="icon icon-top-left" />
        <img src={icon2} alt="İkon 2" className="icon icon-top-right" />
        <img src={icon3} alt="İkon 3" className="icon icon-bottom-left" />
        <img src={icon4} alt="İkon 4" className="icon icon-bottom-right" />
      </div>
    </div>
  );
};

export default SignUp;
