import { useState, useEffect } from "react";
import { loginUser } from "../api";
import {Alert, Button} from 'react-bootstrap'

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const submit = async e => {
        e.preventDefault();

        try{
            const data = await loginUser(username, password);
            localStorage.clear();
            localStorage.setItem('loggedIn', true);
            localStorage.setItem('nurseID', data.nurseID)
            window.location.href = '/';

        } catch (error) {
            console.error('Error logging in:', error);
            setShowAlert(true);
        }

    }

    return (
      <div className="container">
          <div className="row justify-content-center mt-5">
              <div className="col-md-6">
                    <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                        <Alert.Heading>Login Failed!</Alert.Heading>
                        <p>Your login credentials are incorrect. Please try again.</p>
                    </Alert>
                  <div className="card">
                      <div className="card-body">
                          <h3 className="card-title text-center">Sign In</h3>
                          <form onSubmit={submit}>
                              <div className="mb-3">
                                  <label htmlFor="username" className="form-label">Username</label>
                                  <input
                                      type="text"
                                      className="form-control"
                                      id="username"
                                      placeholder="Enter Username"
                                      value={username}
                                      required
                                      onChange={(e) => setUsername(e.target.value)}
                                  />
                              </div>
                              <div className="mb-3">
                                  <label htmlFor="password" className="form-label">Password</label>
                                  <input
                                      type="password"
                                      className="form-control"
                                      id="password"
                                      placeholder="Enter Password"
                                      value={password}
                                      required
                                      onChange={(e) => setPassword(e.target.value)}
                                  />
                              </div>
                              <div className="d-grid gap-2">
                                  <button type="submit" className="btn btn-success">Submit</button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}