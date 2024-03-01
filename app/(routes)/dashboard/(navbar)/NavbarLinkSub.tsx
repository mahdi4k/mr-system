import React from 'react';
import Link from "next/link";
import classes from "./navbar.module.css";
import {LinksGroup} from "./NavbarLinksGroup";
import {ScrollArea} from "@mantine/core";
import { usePathname } from 'next/navigation'


type linksDTO = {
    label: string
    link: string
}
type linkDataDTO = {
     label:string
    initiallyOpened:boolean
    links:linksDTO[]
}
type activeLink = 'pcParts' | 'articles'

const NavbarLinkSub = ({activeLink}: { activeLink: activeLink }) => {
    const pathname = usePathname()
    const activeTabBaseUrl = pathname.split('/')[2];

    const links: linkDataDTO[] =
        [
            {
                label: 'motherboard',
                initiallyOpened: activeTabBaseUrl === 'motherboard',
                links: [
                    { label: 'لیست', link: '/dashboard/motherboard' },
                    { label: 'افزودن', link: '/dashboard/motherboard/add' },
                ],
            },
            {
                label: 'cpu',
                initiallyOpened: activeTabBaseUrl === 'cpu',
                links: [
                    { label: 'لیست', link: '/dashboard/cpu' },
                    { label: 'افزودن', link: '/dashboard/cpu/add' },
                ],
            },
            {
                label: 'گرافیک',
                initiallyOpened: activeTabBaseUrl === 'graphic',
                links: [
                    { label: 'لیست', link: '/dashboard/graphic' },
                    { label: 'افزودن', link: '/dashboard/graphic/add' },
                ],
            },
            {
                label: 'پاور',
                initiallyOpened: activeTabBaseUrl === 'power',
                links: [
                    { label: 'لیست', link: '/dashboard/power' },
                    { label: 'افزودن', link: '/dashboard/power/add' },
                ],
            }
        ]
    const linkGroup = links.map((item) => <LinksGroup {...item} key={item.label} />);
    
    return (
        <div>
            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{linkGroup}</div>
            </ScrollArea>
        </div>
    );
};

export default NavbarLinkSub;
