import React, { useState } from 'react';
import './login.css';
import {registerUser, loginUser} from '../../Api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [action, setAction] = useState("Sign Up");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        console.log('button clicked')
        let data = {
            username: document.querySelector('input[placeholder="Username"]').value,
            password: document.querySelector('input[placeholder="Password"]').value,
        };

        try {
            let result;
            if (action === "Sign Up") {
                data = {type:document.querySelector('select').value, ...data};
                console.log(data, 'sign up');
                result = await registerUser(data);
                if (result.status === 200) {
                    alert('User registered successfully');
                } else {
                    alert('Username is unavailable');
                }
                
            } else {
                console.log(data, 'login');
                result = await loginUser(data);
                console.log(result, ' result')
                if (result.additionalData.status === 200) {
                   if (result.additionalData.type === 'patient') {
                       navigate('/user');
                   } else {
                       navigate('/doctor');
                   }
                } else {
                    console.log('Invalid credentials');
                    alert('Invalid credentials');
                }
            }
            console.log(result); 
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className={action==="Login" ? "submit gray": "submit"} onClick={()=>setAction("Sign Up")}>Sign Up</div>
                <div className={action==="Sign Up" ? "submit gray": "submit"} onClick={()=>setAction("Login")}>Login</div>
            </div>

            <div className="inputs">
                <div className="input">
                    <input type="text" placeholder="Username"/>
                </div>
                <div className="input">
                    <input type="text" placeholder="Password"/>
                </div>
                {action==="Login" ?<div></div> : <div className="input">
                    <select className="select">
                        <option value="" disabled selected hidden>Select Type</option>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>}
                
            </div>

            <div className="submit-container">
                <div className="submit-button" onClick={handleSubmit}>
                    {action==="Sign Up" ? "Register" : "Enter"}
                </div>
            </div>
           
        </div>
    )
}

export default Login;


