import React from 'react';
import '../styles/app.scss';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSession, setUserName } from '../store/actions';

interface LoginForm {
  username: string,
  session: string
}

export const Login: React.FC = () => {
  const [form, setForm] = React.useState<LoginForm>({
    session: '',
    username: ''
  });
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const dispatch = useDispatch();

  const handleForm = (name: string, value: string): void => {
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleFetchLogin = async (): Promise<void> => {
    try {
      const { data } = await axios.post<{session: string}>('http://localhost:5000/auth', form);
      setErrorMessage('');
      dispatch(setUserName(form.username));
      dispatch(setSession(data.session));
    } catch (error) {
      console.log(error.response);
      setErrorMessage(error.response.data.message);
    }
  }

  return (
    <div className="login">
      <h3 className="login_header">Login</h3>
      <div className="login_form">
        <div className="login_form_control">
          <label htmlFor="name">Enter your name</label>
          <input id="name" type="text" value={form.username} onChange={event => handleForm(event.target.name, event.target.value)} placeholder="*User name" name="username"/> 
        </div>
        <div className="login_form_control">
          <label htmlFor="session">You can enter your session name</label>
          <input id="session" type="text" value={form.session} onChange={event => handleForm(event.target.name, event.target.value)} placeholder="Session name" name="session"/> 
        </div>
        {errorMessage && <p className="login_form_error">{errorMessage}</p>}
        <button onClick={handleFetchLogin}>Enter</button>
      </div>
    </div>
  )
}