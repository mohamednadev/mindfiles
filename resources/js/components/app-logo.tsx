import { MessageSquareText } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-black dark:bg-white text-white dark:text-black">
                <MessageSquareText className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">Mind Files</span>
            </div>
        </>
    );
}
