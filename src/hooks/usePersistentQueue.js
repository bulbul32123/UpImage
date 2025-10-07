'use client'
import { useEffect, useState } from "react";

export function usePersistentQueue(key = "batchQueue", initialValue = []) {
    const [queue, setQueue] = useState(initialValue);

    // Load from localStorage (client only)
    useEffect(() => {
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                setQueue(JSON.parse(stored));
            }
        } catch (err) {
            console.error("Failed to load batchQueue:", err);
        }
    }, [key]);

    // Save to localStorage whenever queue changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(queue));
        } catch (err) {
            console.error("Failed to save batchQueue:", err);
        }
    }, [queue, key]);

    return [queue, setQueue];
}
