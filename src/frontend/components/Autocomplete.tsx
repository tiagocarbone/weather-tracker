"use client";

import React, { useState, useEffect, useRef } from 'react';
import Input from '@/components/Input';
import { useDebounce } from '@/lib/useDebounce';
import { showError } from '@/utils/toast';

type Suggest = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  display: string;
};

export default function Autocomplete({ onSelect }: { onSelect: (s: Suggest) => void }) {
  const [query, setQuery] = useState('');
  const [suggests, setSuggests] = useState<Suggest[]>([]);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 300);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!debounced) return setSuggests([]);
    fetch(`/api/suggest?q=${encodeURIComponent(debounced)}`)
      .then((r) => r.json())
      .then((data) => setSuggests(data))
      .catch(() => showError('Erro ao buscar sugestões'));
  }, [debounced]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* make input height match the 'Usar meu local' button (h-14) so both columns align visually */}
      <Input placeholder="Buscar cidade..." value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} className="rounded-2xl bg-white text-slate-900 h-14" />
      {open && suggests.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden">
          {suggests.map((s) => (
            <button
              key={`${s.lat}-${s.lon}`}
              onClick={() => { onSelect(s); setOpen(false); setQuery(s.display); }}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 text-slate-900"
            >
              {s.display}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
