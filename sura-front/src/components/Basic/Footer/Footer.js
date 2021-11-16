/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import logo2 from '../../../assets/img/up3.svg';

import './Footer.scss';

const Footer = (props) => {

    const { setSaveData, logo } = props;

    return ( 
        <footer>
            <img className="logo" src={logo} alt="logo" />
            <a onClick={() => setSaveData(2)}>
                Powered By
                <img src={logo2} alt="logo2" />
            </a>
            
        </footer>
    );
}
 
export default Footer;