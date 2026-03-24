"use client";

import React, { useState, useEffect, useRef } from 'react';
import Input from '@/components/Input';
import { useDebounce } from '@/lib/useDebounce';
import { showError } from '@/utils/toast';
import { Suggest } from '@/types/types-frontend';



export default function Autocomplete({ onSelect }: Readonly<{ onSelect: (suggestion: Suggest) => void }>) {
  const [query, setQuery] = useState('');
  const [suggests, setSuggests] = useState<Suggest[]>([]);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 300); // aguardar um pouco após digitar para evitar fazer muitas reqs
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!debounced) return setSuggests([]);
    fetch(`/api/suggest?q=${encodeURIComponent(debounced)}`)
      .then((response) => response.json())
      .then((data) => setSuggests(data))
      .catch(() => showError('Erro ao buscar sugestões'));
  }, [debounced]);

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* make input height match the 'Usar meu local' button (h-14) so both columns align visually */}
      <Input placeholder="Buscar cidade..." value={query} onChange={(e) => { setQuery(e.target.value); 
        setOpen(true); }} className="rounded-2xl bg-white text-slate-900 h-14" />
      {open && suggests.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden">
          {suggests.map((suggest) => (
            <button
              key={`${suggest.lat}-${suggest.lon}`}
              onClick={() => { onSelect(suggest); setOpen(false); setQuery(suggest.display); }}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 text-slate-900"
            >
              {suggest.display}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
