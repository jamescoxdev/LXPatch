import React from 'react';
import Styles from './Header.module.scss';
import Logo from '../img/patch.png';

const Header = () => {
    return(
        <div className={Styles.Header}>
            <img src={Logo} alt={'logo'} className={Styles.logo} />
            <p className={Styles.title}>LX Patch</p>
        </div>
    );
}

export default Header;