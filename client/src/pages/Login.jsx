// src/pages/Login.js

import React from 'react';

const Login = () => {
    return (
        <form>
            <h2>Log In</h2>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Log In</button>
        </form>
    );
};

export default Login;
