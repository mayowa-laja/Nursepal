import { useState } from "react";

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = async e => {
        e.preventDefault();

        const user = {
            username: username,
            password: password
        };

        // const {data} = await fetch('http://localhost:8000/nursepal/api/login', {
        //     method: 'POST',
        //     user,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': getCookie('csrftoken')
        //     },
        // });

        localStorage.clear();
        localStorage.setItem('loggedIn', true);
        window.location.href = '/';

    }

    return (
      <div className="container">
          <div className="row justify-content-center mt-5">
              <div className="col-md-6">
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
                                  <button type="submit" className="btn btn-primary">Submit</button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}