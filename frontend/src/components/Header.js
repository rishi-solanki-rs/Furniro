import React from 'react';
import logoImage from '../utils/Logo.png'; // Make sure this path is correct

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <nav className="nav">
                    {/* Logo Group */}
                    <div className="logo-group">
                        <img src={logoImage} alt="Furniro Logo" className="logo-image" 
                        />
                        <span className="logo-text">Furniro</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="nav-links">
                        <a href="#home">Home</a>
                        <a href="#shop">Shop</a>
                        <a href="#about">About</a>
                        <a href="#contact">Contact</a>
                    </div>

                    {/* Navigation Icons */}
                    <div className="nav-icons">
                        <a href="#account">👤</a>
                        <a href="#search">🔍</a>
                        <a href="#wishlist">❤️</a>
                        <a href="#cart">🛒</a>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;