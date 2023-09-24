import React, { useState } from 'react'
import classes from './navbar.module.css';
import NavbarLinkMain from "./NavbarLinkMain";
import NavbarLinkSub from "./NavbarLinkSub";

type activeLink = 'pcParts' | 'articles'

const Navbar = () => {
    const [active, setActive] = useState<activeLink>('pcParts');
    return (
        <nav className={classes.navbar}>
            <div className={classes.wrapper}>
                <div className={classes.aside}>
                     <NavbarLinkMain active={active} setActive={setActive}/>
                </div>
                <div className={classes.main}>
                     <NavbarLinkSub activeLink={active}/>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
