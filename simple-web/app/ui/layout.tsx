'use client'

import {AppShell, Burger, Button, Switch} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {ReactNode, useState} from "react";
import NavLinks from "@/components/nav-links";

export default function DashboardLayout({children}: { children: ReactNode }) {
    const [opened, {toggle}] = useDisclosure();
    const [navbarOpen, setNavbarOpen] = useState(false);

    return (
        <AppShell
            padding="md"
            header={{height: 60}}
            navbar={{
                width: `${navbarOpen ? 300: 100}`,
                breakpoint: 'sm',
                collapsed: {mobile: !opened},
            }}
        >
            <AppShell.Header>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />

                <div>Hello, I am Header</div>
            </AppShell.Header>

            <AppShell.Navbar>
                <NavLinks/>
                <Switch onClick={() => setNavbarOpen(!navbarOpen)}/>
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}