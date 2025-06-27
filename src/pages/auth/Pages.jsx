import React from 'react'
import './App.css';

const Pages = () => {
     const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin((prev) => !prev);
  };

  return (
    <div>
      <div className="app-container">
     <div className='main'>
       <div className="info-container">
        <h1 className="app-title">
          MediConnect <span>Your Health, Our Priority</span>
        </h1>
        <div className="auth-toggle-buttons">
          <button onClick={toggleForm}>
            {showLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>

      <div className="form-container">
        {showLogin ? <Login /> : <Register />}
      </div>
     </div>
    </div>
    </div>
  )
}

export default Pages
