
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Folder, ChartBar, ListChecks, Star, PencilLine, Lightbulb } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    // PLATFORM
    {
        title: 'Analytics',
        href: '/dashboard',
        icon: ChartBar,
        group: 'Platform',
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Lightbulb, // change to a bell if you want
        group: 'Platform',
    },

    // TASKS
    {
        title: 'Daily Tasks',
        href: '/tasks',
        icon: ListChecks,
        group: 'Tasks',
    },
    {
        title: 'Awakening Tasks',
        href: '/awakening-tasks',
        icon: Star,
        group: 'Tasks',
    },

    // DOCUMENTS
    {
        title: 'Journal',
        href: '/journal',
        icon: PencilLine,
        group: 'Documents',
    },
    {
        title: 'Philosophy',
        href: '/philosophy',
        icon: Lightbulb,
        group: 'Documents',
    },
    {
        title: 'Visa Documents',
        href: '/visa-docs',
        icon: Folder,
        group: 'Documents',
    },
];




export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
