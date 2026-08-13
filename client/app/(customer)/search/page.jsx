'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition } from '@/lib/utils';
import { Search, Filter, X, ShieldCheck, Tag, ShoppingBag, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedEra, setSelectedEra] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceMax, setPriceMax] = useState(15000);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchFilteredItems();
  }, [query, selectedEra, selectedCondition, selectedCity]);

  const fetchFilteredItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (selectedEra) params.append('era', selectedEra);
      if (selectedCondition) params.append('condition', selectedCondition);
      if (selectedCity) params.append('city', selectedCity);

      const res = await apiClient.get(`/items?${params.toString()}`);
      if (res.data?.data) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.warn('Search fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setQuery('');
    setSelectedSize('');
    setSelectedEra('');
    setSelectedCondition('');
    setSelectedCity('');
    setPriceMax(15000);
  };

  const filteredItems = items.filter((item) => {
    if (selectedSize && item.size !== selectedSize) return false;
    if (item.price > priceMax) return false;
    return true;
  });

  const sizes = ['S', 'M', 'L', 'XL', 'W32 L30', 'OS'];
  const eras = ['70s', '80s', '90s', 'Y2K', 'Archival'];
  const conditions = [
    { value: 'LIKE_NEW', label: 'Pristine / Like New' },
    { value: 'GENTLY_USED', label: 'Gently Loved' },
    { value: 'FLAWED', label: 'Vintage Character' },
  ];
  const cities = ['Mumbai', 'Bengaluru', 'Delhi', 'Kolkata'];

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Search Header Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-neon-lime uppercase tracking-widest">
              MULTI-ATTRIBUTE ARCHIVE ENGINE
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Real-Time Search & Racks
            </h1>
          </div>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden w-full sm:w-auto bg-zinc-900 border border-zinc-700 text-white font-mono text-xs uppercase px-4 py-2.5 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-neon-lime" /> Filter Drawer ({filteredItems.length} items)
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search archival pieces (e.g. Levi 501, Harley Davidson, 90s Bomber, Carhartt)..."
            className="w-full bg-street-card border border-zinc-800 text-white text-sm font-mono pl-12 pr-4 py-4 focus:outline-none focus:border-neon-lime transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Active Filter Chips Bar */}
        {(selectedSize || selectedEra || selectedCondition || selectedCity || query) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-xs">
            <span className="text-zinc-500 text-[11px] uppercase mr-1">Active Filters:</span>
            {query && (
              <span className="bg-zinc-900 text-neon-lime border border-neon-lime/40 px-2.5 py-1 flex items-center gap-1.5">
                Query: &quot;{query}&quot;
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setQuery('')} />
              </span>
            )}
            {selectedSize && (
              <span className="bg-zinc-900 text-white border border-zinc-700 px-2.5 py-1 flex items-center gap-1.5">
                Size: {selectedSize}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-400" onClick={() => setSelectedSize('')} />
              </span>
            )}
            {selectedEra && (
              <span className="bg-zinc-900 text-amber-400 border border-amber-500/40 px-2.5 py-1 flex items-center gap-1.5">
                Era: {selectedEra}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-400" onClick={() => setSelectedEra('')} />
              </span>
            )}
            {selectedCondition && (
              <span className="bg-zinc-900 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 flex items-center gap-1.5">
                Condition: {selectedCondition}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-400" onClick={() => setSelectedCondition('')} />
              </span>
            )}
            {selectedCity && (
              <span className="bg-zinc-900 text-cyan-400 border border-cyan-500/40 px-2.5 py-1 flex items-center gap-1.5">
                City: {selectedCity}
                <X className="w-3 h-3 cursor-pointer hover:text-rose-400" onClick={() => setSelectedCity('')} />
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-zinc-500 hover:text-rose-400 text-[11px] underline uppercase ml-2"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Filter Sidebar (Desktop) */}
        <aside
          className={`lg:col-span-3 bg-street-card border border-zinc-800 p-6 space-y-6 lg:sticky lg:top-24 font-mono text-xs ${
            mobileFiltersOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <span className="font-extrabold uppercase text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-neon-lime" /> Attribute Filters
            </span>
            <button
              onClick={handleClearFilters}
              className="text-zinc-500 hover:text-rose-400 flex items-center gap-1 text-[10px] uppercase"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Size Filter */}
          <div>
            <label className="text-zinc-400 font-bold uppercase block mb-2">Size Rack</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                  className={`px-3 py-1.5 border font-bold uppercase transition-all ${
                    selectedSize === s
                      ? 'bg-neon-lime text-black border-neon-lime'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Era Filter */}
          <div>
            <label className="text-zinc-400 font-bold uppercase block mb-2">Vintage Era</label>
            <div className="flex flex-wrap gap-2">
              {eras.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(selectedEra === era ? '' : era)}
                  className={`px-3 py-1.5 border font-bold uppercase transition-all ${
                    selectedEra === era
                      ? 'bg-neon-lime text-black border-neon-lime'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="text-zinc-400 font-bold uppercase block mb-2">Item Condition</label>
            <div className="space-y-2">
              {conditions.map((c) => (
                <label key={c.value} className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={selectedCondition === c.value}
                    onChange={() => setSelectedCondition(selectedCondition === c.value ? '' : c.value)}
                    className="accent-neon-lime"
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* City Filter */}
          <div>
            <label className="text-zinc-400 font-bold uppercase block mb-2">Boutique City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white font-mono p-2.5 focus:outline-none focus:border-neon-lime"
            >
              <option value="">All Indian Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between text-zinc-400 font-bold uppercase mb-2">
              <span>Max Price</span>
              <span className="text-neon-lime font-extrabold">{formatCurrency(priceMax)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={25000}
              step={500}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-neon-lime bg-zinc-800"
            />
          </div>
        </aside>

        {/* Results Catalogue Grid */}
        <main className="lg:col-span-9">
          <div className="flex items-center justify-between mb-4 font-mono text-xs text-zinc-400">
            <span>Showing {filteredItems.length} matching rack items</span>
            {(selectedSize || selectedEra || selectedCondition || selectedCity || query) && (
              <span className="text-neon-lime">Filters Applied</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-street-card border border-zinc-800 h-80 animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-street-card border border-zinc-800 p-12 text-center space-y-4 font-mono">
              <X className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-xl font-bold uppercase text-white">No Matching Grails Found</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try widening your price range or clearing attribute filters to explore the entire multi-vendor catalog.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-neon-lime text-black font-extrabold text-xs uppercase px-6 py-3"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const img = item.images?.[0] || '/images/denim_vintage.png';
                return (
                  <div
                    key={item.id}
                    className="bg-street-card border border-zinc-800 hover:border-neon-lime transition-all flex flex-col justify-between overflow-hidden group card-hover-effect"
                  >
                    <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden border-b border-zinc-800">
                      <img
                        src={img}
                        alt={item.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/denim_vintage.png';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 font-mono text-[10px] text-emerald-400 font-bold uppercase px-2.5 py-1 border border-emerald-500/30">
                        {formatCondition(item.condition)}
                      </div>
                      <div className="absolute top-3 right-3 font-mono text-[10px] font-black uppercase px-2 py-1 bg-neon-lime text-black">
                        {item.size || 'OS'}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                      <div>
                        <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between mb-1">
                          <span>{item.shop?.shopName || 'Relic Vintage Co.'}</span>
                          <span>{item.era || '90s'}</span>
                        </div>
                        <Link href={`/item/${item.id}`}>
                          <h3 className="text-sm font-bold uppercase text-white line-clamp-1 hover:text-neon-lime transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                      </div>

                      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                        <span className="text-lg font-black font-mono text-white">
                          {formatCurrency(item.price)}
                        </span>
                        <Link
                          href={`/item/${item.id}`}
                          className="bg-white hover:bg-neon-lime text-black font-bold text-xs uppercase px-3 py-2 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                        >
                          View Item
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
