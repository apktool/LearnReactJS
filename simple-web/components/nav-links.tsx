"use client"

import {usePathname} from "next/navigation";
import {NavLink} from "@mantine/core";

const links = [
    {name: "Home", href: "/", icon: "home"},
    {name: "UI", href: "/ui", icon: "ui"},
]

export default function NavLinks() {
    const pathname = usePathname()

    return (
        <>
            {links.map(link => {
                return (
                    <NavLink key={link.name}
                             label={link.name}
                             href={link.href}
                             variant="filled"
                             active={link.href == pathname}
                    />
                )
            })}
        </>
    )
}