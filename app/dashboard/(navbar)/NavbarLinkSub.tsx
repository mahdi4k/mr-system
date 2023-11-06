import React from 'react';
import Link from "next/link";
import classes from "./navbar.module.css";
import {LinksGroup} from "./NavbarLinksGroup";
import {ScrollArea} from "@mantine/core";

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
    const links: linkDataDTO[] =
        [
            {
                label: 'motherboard',
                initiallyOpened: true,
                links: [
                    { label: 'لیست', link: '/dashboard/motherboard' },
                    { label: 'افزودن', link: '/dashboard/motherboard/add' },
                ],
            },
            {
                label: 'cpu',
                initiallyOpened: false,
                links: [
                    { label: 'لیست', link: '/dashboard/cpu' },
                    { label: 'افزودن', link: '/dashboard/cpu/add' },
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
