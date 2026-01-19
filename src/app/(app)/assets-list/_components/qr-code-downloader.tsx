"use client"

import * as htmlToImage from 'html-to-image';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface QrCodeDownloaderProps {
    tag: string | null;
    children: ReactNode;
}

export function QrCodeDownloader({ tag, children }: QrCodeDownloaderProps) {
    const handleDownload = async () => {
        if (!tag) return;
        const node = document.getElementById(`qr-code-${tag}`);
        if (node) {
            try {
                const dataUrl = await htmlToImage.toPng(node);
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `${tag}.png`;
                link.click();
            } catch (error) {
                console.error('oops, something went wrong!', error);
            }
        }
    };

    return (
        <div onClick={handleDownload} className="w-full">
            {children}
        </div>
    );
} 