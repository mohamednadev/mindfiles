import '../css/app.css';
import 'aos/dist/aos.css'; // Import AOS styles

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import AOS from 'aos'; // Import AOS

// ✅ Import toaster
import { Toaster } from '@/components/ui/sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Initialize AOS
        AOS.init({
            duration: 800,
            once: true,
        });

        root.render(
            <>
                <App {...props} />
                <Toaster 
                    position="top-center" 
                    richColors 
                    closeButton
                />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Set light / dark mode on load
initializeTheme();
