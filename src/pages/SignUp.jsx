import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import icon1 from '/icon1.png';
import icon2 from '/icon2.png';
import icon3 from '/icon3.png';
import icon4 from '/icon4.png';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
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
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Başarılı kayıt durumunda toast göster
        toast.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...', {
          position: "top-right",
          autoClose: 2000, // 2 saniye sonra otomatik kapanır
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });

        setSuccessMessage(''); 
        setErrorMessages([]);

        // 2 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        try {
          const errorData = await response.json();
          if (errorData.errors) {
            const allErrorMessages = Object.values(errorData.errors).flat();
            setErrorMessages(allErrorMessages);
          } else {
            setErrorMessages([errorData.title || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.']);
          }
        } catch (parseError) {
          setErrorMessages(['Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.']);
        }
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Hata oluştu:', error);
      setErrorMessages(['Bir hata oluştu. Lütfen tekrar deneyin.']);
      setSuccessMessage('');
    }
  };

  return (
    <div className="signup-wrapper">
      <ToastContainer />
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

          {errorMessages.length > 0 && (
            <div className="error-message">
              {errorMessages.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          )}

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
