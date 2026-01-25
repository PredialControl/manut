'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { storage } from '@/lib/storage';
import { useState, useEffect, Suspense } from 'react';

function TestStorageContent() {
    // 1. Reactive Hook Test
    const [count, setCount] = useLocalStorage<number>('test-count', 0);
    const [text, setText] = useLocalStorage<string>('test-text', '');

    // 2. Non-reactive Utility Test (checking initial load)
    const [manualValue, setManualValue] = useState<string>('');

    useEffect(() => {
        // Get initial value using utility
        const saved = storage.get('test-manual', 'Nada salvo');
        setManualValue(saved);
    }, []);

    const handleManualSave = () => {
        const newVal = `Salvo em ${new Date().toLocaleTimeString()}`;
        storage.set('test-manual', newVal);
        setManualValue(newVal);
    };

    return (
        <div className="p-8 space-y-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold">Teste de Local Storage</h1>

            {/* Hook Section */}
            <section className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">1. Hook Reativo (useLocalStorage)</h2>
                <p className="text-sm text-muted-foreground">
                    Estes valores persistem mesmo se você recarregar a página ou abrir em outra aba.
                </p>

                <div className="flex items-center gap-4">
                    <span className="font-medium">Contador: {count}</span>
                    <button
                        onClick={() => setCount(prev => prev + 1)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                    >
                        Incrementar
                    </button>
                    <button
                        onClick={() => setCount(0)}
                        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition-opacity"
                    >
                        Resetar
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Texto Persistente:</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-2 border rounded-md bg-background"
                        placeholder="Digite algo aqui..."
                    />
                </div>
            </section>

            {/* Utility Section */}
            <section className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">2. Utilidade Manual (storage.ts)</h2>
                <p className="text-sm text-muted-foreground">
                    Usado para acesso direto (não reativo automaticamente).
                </p>
                <div className="flex flex-col gap-2">
                    <p>Valor atual: <code className="bg-muted px-2 py-1 rounded">{manualValue}</code></p>
                    <button
                        onClick={handleManualSave}
                        className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    >
                        Salvar Timestamp via Utility
                    </button>
                </div>
            </section>

            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    💡 Tente recarregar a página (F5) para ver os dados mantidos!
                </p>
            </div>
        </div>
    );
}

export default function TestStoragePage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <TestStorageContent />
        </Suspense>
    );
}
