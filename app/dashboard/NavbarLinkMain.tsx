import React, {FC} from 'react';
import {rem, Tooltip, UnstyledButton} from "@mantine/core";
import classes from "./navbar.module.css";
import {IconDeviceDesktopAnalytics, IconGauge, IconHome2, TablerIconsProps} from "@tabler/icons-react";

interface Item {
    icon: (props: TablerIconsProps) => JSX.Element; // assuming the icon is a string value
    label: string;
    value: 'pcParts' | 'articles'; // using a union type for the value
}

interface props {
    active: string
    setActive: React.Dispatch<React.SetStateAction<activeLink>>
}

type activeLink = 'pcParts' | 'articles'

const NavbarLinkMain :FC<props> = ({active,setActive}) => {
    const mainLinks: Item[] = [
        {icon: IconHome2, label: 'Home', value: 'pcParts'},
        {icon: IconGauge, label: 'Dashboard', value: 'articles'},
        {icon: IconDeviceDesktopAnalytics, label: 'Analytics', value: 'articles'},
    ];
    return (
        <div>
            {mainLinks.map((link) => (
                <Tooltip
                    label={link.label}
                    position="right"
                    withArrow
                    transitionProps={{duration: 0}}
                    key={link.label}
                >
                    <UnstyledButton
                        onClick={() => setActive(link.value)}
                        className={classes.mainLink}
                        data-active={link.value === active || undefined}
                    >
                        <link.icon style={{width: rem(22), height: rem(22)}} stroke={1.5}/>
                    </UnstyledButton>
                </Tooltip>
            ))}
        </div>
    );
};

export default NavbarLinkMain;
