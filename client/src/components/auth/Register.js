import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Register = () => {

    // setFormData is the function used to update the state of the elements
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    }); 

    // pulling out individual values from the formData
    const {name, email, password, password2} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

    const onSubmit = async e => {
      e.preventDefault();  // The default action for the event will not happen. In this case "submit"
      if(password !== password2){
        console.log('Passwords do not match')
      }
      else{
        const newUser = {
          name,
          email,
          password
        }


        try {
          const config = {
            headers: {
              'Content-type': 'application-json'
            }
          }

          const body = JSON.stringify(newUser);
          const res = await axios.post('/api/users', body, config); // This will make a request to the backend. /api/users because we are using a proxy.
          console.log(res.data);

        } catch (err) {
          console.error(err.response.data);
          
        }
      }
    } 

    return(
        <Fragment>
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form className="form" onSubmit={e => onSubmit(e)}>
          <div className="form-group">
            <input 
                type="text" 
                placeholder="Name" 
                name="name" 
                value={name}  // this will associate the value of this input to "const {name, email, password, password2} = formData;"
                onChange={e => onChange(e)}
                required 
            />
          </div>
          <div className="form-group">
            <input 
                type="email" 
                placeholder="Email Address" 
                name="email"
                value={email}
                onChange={e => onChange(e)} 
                required
            />
            <small className="form-text"
              >This site uses Gravatar so if you want a profile image, use a
              Gravatar email</small
            >
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength="6"
              value={password}
              onChange={e => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              minLength="6"
              value={password2}
              onChange={e => onChange(e)}
              required
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="login">Sign In</Link>
        </p>
      </Fragment>
    )

}

export default Register;