// src/pages/Signup.js

import React from 'react';

const Signup = () => {
    return (
        <form>
            <h2>Sign Up</h2>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
