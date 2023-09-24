import React from 'react';
import Link from "next/link";
import classes from "./navbar.module.css";
import { usePathname } from 'next/navigation';


type linkDataDTO = {
    pcParts: string[];
    articles: string[];
}
type activeLink = 'pcParts' | 'articles'

const NavbarLinkSub = ({activeLink}: { activeLink: activeLink }) => {
    const pathname = usePathname();
    console.log(pathname,'pathname')
    const getActiveLink = pathname.split('/')
    console.log(getActiveLink[2] === 'motherboard')
    const links: linkDataDTO =
        {
            pcParts: [
                'motherboard',
                'cpu',
                'graphic card'
            ],
            articles: ['asd']
        }

    return (
        <div>
            {links[activeLink].map((link) => (
                <Link
                    replace
                    className={classes.link}
                    data-active={link === getActiveLink[2] || undefined}
                    href={{pathname: `/dashboard/${link}`}}
                    key={link}
                >
                    {link}
                </Link>
            ))}
        </div>
    );
};

export default NavbarLinkSub;
