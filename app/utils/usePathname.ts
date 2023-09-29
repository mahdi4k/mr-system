"use client"

import {usePathname} from "next/navigation";

export function useActivePathname(): string[] {

    const pathname = usePathname();
    console.log(pathname, 'pathname')
    return pathname.split('/')

}
