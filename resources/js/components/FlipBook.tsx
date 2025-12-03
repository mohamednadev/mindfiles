/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import HTMLFlipBook from "react-pageflip";
import { forwardRef, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    entries: any[];
}

// Cover page component
const CoverPage = forwardRef<HTMLDivElement, any>((props, ref) => {
    return (
        <div
            ref={ref}
            className="page page-cover"
            data-density="hard"
        >
            <div className="bg-primary dark:text-black text-white p-8 flex flex-col items-center justify-center h-full w-full">
                <h1 className="text-5xl font-extrabold text-center mb-4">
                    My Digital Journal
                </h1>
                <p className="text-xl text-center opacity-90">
                    A collection of personal thoughts
                </p>
            </div>
        </div>
    );
});
CoverPage.displayName = "CoverPage";

// Regular page component
const Page = forwardRef<HTMLDivElement, any>(({ page }, ref) => {
    return (
        <div ref={ref} className="page">
            <div className="bg-primary p-8 flex flex-col h-full w-full shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-white dark:text-black border-b-2 border-gray-200 dark:border-gray-800 pb-3">
                    {page.title}
                </h2>
                <div
                    className="whitespace-pre-wrap leading-relaxed flex-1 overflow-auto hide-scrollbar text-xs dark:text-black text-white"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
                <div className="text-sm dark:text-black text-white mt-4 text-right border-t pt-2">
                    Page #{page.id}
                </div>
            </div>
        </div>
    );
});
Page.displayName = "Page";

// Back cover
const BackCover = forwardRef<HTMLDivElement, any>((props, ref) => {
    return (
        <div
            ref={ref}
            className="page page-cover"
            data-density="hard"
        >
            <div className="bg-primary dark:text-black text-white p-8 flex flex-col items-center justify-center h-full w-full">
                <h2 className="text-3xl font-bold text-center">
                    The End
                </h2>
                <p className="text-lg text-center mt-4">
                    Thank you for reading
                </p>
            </div>
        </div>
    );
});
BackCover.displayName = "BackCover";

export default function FlipBook({ entries }: Props) {
    const flipBookRef = useRef<any>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const flipKey = entries.map((p: any) => p.id).join(":");

    const onFlip = useCallback((e: any) => {
        setCurrentPage(e.data);
    }, []);

    const onInit = useCallback(() => {
        if (flipBookRef.current) {
            const pageFlip = flipBookRef.current.pageFlip();
            if (pageFlip) {
                setTotalPages(pageFlip.getPageCount());
            }
        }
    }, []);

    const nextPage = () => {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipNext();
        }
    };

    const prevPage = () => {
        if (flipBookRef.current) {
            flipBookRef.current.pageFlip().flipPrev();
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* FlipBook */}
            <div className="flex justify-center w-full rounded-lg shadow-lg overflow-hidden">
                <HTMLFlipBook
                    key={flipKey}
                    ref={flipBookRef}
                    width={550}
                    height={733}
                    size="stretch"
                    minWidth={315}
                    maxWidth={1000}
                    minHeight={400}
                    maxHeight={1533}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    className="shadow-2xl"
                    drawShadow={true}
                    flippingTime={600}
                    usePortrait={true}
                    swipeDistance={30}
                    disableFlipByClick={false}
                    style={{}} // ✅ provide empty object instead of undefined
                    startPage={0}
                    startZIndex={0}
                    autoSize={true}           // default to true
                    clickEventForward={true}  // default to true
                    useMouseEvents={true}     // optional
                    showPageCorners={true}    // optional
                    onFlip={onFlip}
                    onInit={onInit}
                >
                    {/* Front Cover */}
                    <CoverPage />

                    {/* Map entries directly as children */}
                    {entries.map((page) => (
                        <Page key={page.id} page={page} cname="bg-primary" />
                    ))}

                    {/* Back Cover */}
                    <BackCover />
                </HTMLFlipBook>

            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="text-sm font-medium min-w-[100px] text-center">
                    Page {currentPage + 1} of {totalPages}
                </div>

                <Button
                    onClick={nextPage}
                    disabled={currentPage >= totalPages - 1}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Mobile Instructions */}
            <p className="text-sm text-center">
                Click on page edges or swipe to flip pages
            </p>
        </div>
    );
}