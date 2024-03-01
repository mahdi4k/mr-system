"use client"

import {usePathname} from "next/navigation";

export function useActivePathname(): string[] {

    const pathname = usePathname();
    return pathname.split('/')

}
