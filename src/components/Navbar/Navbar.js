import React from 'react';
import './Navbar.css';

const Navbar = (props) => {
    return (
        <div className='Navbar'>
            <span className='NavbarTitle'>{props.title}</span>
        </div>
    )
}

export default Navbar;