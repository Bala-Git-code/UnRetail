'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition } from '@/lib/utils';
import { Search, Filter, X, ShieldCheck, Tag, ShoppingBag, SlidersHorizontal, RefreshCw, Sparkles } from 'lucide-react';

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
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Attribute Search Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Real-Time Search & Racks
            </h1>
          </div>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden w-full sm:w-auto bg-zinc-900 border border-zinc-700/80 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2"
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
            className="w-full bg-street-card/90 border border-zinc-800 rounded-2xl text-white text-sm pl-12 pr-10 py-3.5 focus:outline-none focus:border-neon-lime transition-all shadow-lg placeholder:text-zinc-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Active Filter Chips Bar */}
        {(selectedSize || selectedEra || selectedCondition || selectedCity || query) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-zinc-500 font-medium mr-1">Active Filters:</span>
            {query && (
              <span className="bg-zinc-900 text-neon-lime border border-neon-lime/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                Query: &quot;{query}&quot;
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => setQuery('')} />
              </span>
            )}
            {selectedSize && (
              <span className="bg-zinc-900 text-white border border-zinc-700 px-3 py-1 rounded-full flex items-center gap-1.5">
                Size: {selectedSize}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400" onClick={() => setSelectedSize('')} />
              </span>
            )}
            {selectedEra && (
              <span className="bg-zinc-900 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                Era: {selectedEra}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400" onClick={() => setSelectedEra('')} />
              </span>
            )}
            {selectedCondition && (
              <span className="bg-zinc-900 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                Condition: {selectedCondition}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400" onClick={() => setSelectedCondition('')} />
              </span>
            )}
            {selectedCity && (
              <span className="bg-zinc-900 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                City: {selectedCity}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400" onClick={() => setSelectedCity('')} />
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-zinc-500 hover:text-rose-400 font-medium underline ml-2 transition-colors"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Filter Sidebar */}
        <aside
          className={`lg:col-span-3 bg-street-card/80 border border-zinc-800/90 rounded-2xl p-6 space-y-6 lg:sticky lg:top-24 text-xs shadow-xl backdrop-blur-sm ${
            mobileFiltersOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <span className="font-bold text-white flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-neon-lime" /> Attribute Filters
            </span>
            <button
              onClick={handleClearFilters}
              className="text-zinc-500 hover:text-rose-400 flex items-center gap-1 font-medium transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <label className="text-zinc-400 font-semibold block uppercase tracking-wider text-[11px]">Size Rack</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedSize === s
                      ? 'bg-neon-lime text-black shadow-sm font-bold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Era Filter */}
          <div className="space-y-2">
            <label className="text-zinc-400 font-semibold block uppercase tracking-wider text-[11px]">Vintage Era</label>
            <div className="flex flex-wrap gap-2">
              {eras.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(selectedEra === era ? '' : era)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedEra === era
                      ? 'bg-neon-lime text-black shadow-sm font-bold'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <label className="text-zinc-400 font-semibold block uppercase tracking-wider text-[11px]">Item Condition</label>
            <div className="space-y-2 pt-1">
              {conditions.map((c) => (
                <label key={c.value} className="flex items-center gap-2.5 cursor-pointer text-zinc-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={selectedCondition === c.value}
                    onChange={() => setSelectedCondition(selectedCondition === c.value ? '' : c.value)}
                    className="accent-neon-lime rounded"
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-zinc-400 font-semibold block uppercase tracking-wider text-[11px]">Boutique City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl text-white p-2.5 focus:outline-none focus:border-neon-lime transition-colors"
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
          <div className="space-y-2">
            <div className="flex justify-between text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
              <span>Max Price</span>
              <span className="text-neon-lime font-bold tabular-nums text-xs">{formatCurrency(priceMax)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={25000}
              step={500}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-neon-lime bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>
        </aside>

        {/* Results Catalogue Grid */}
        <main className="lg:col-span-9">
          <div className="flex items-center justify-between mb-4 text-xs text-zinc-400 font-medium">
            <span>Showing <strong className="text-white">{filteredItems.length}</strong> matching rack items</span>
            {(selectedSize || selectedEra || selectedCondition || selectedCity || query) && (
              <span className="text-neon-lime">Filters Applied</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-street-card/80 border border-zinc-800 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-street-card/80 border border-zinc-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
              <X className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-xl font-bold text-white">No Matching Grails Found</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Try widening your price range or clearing attribute filters to explore the entire multi-vendor catalog.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-neon-lime text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md"
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
                    className="bg-street-card/80 border border-zinc-800/90 hover:border-zinc-700/90 rounded-2xl transition-all flex flex-col justify-between overflow-hidden group card-hover-effect shadow-xl backdrop-blur-sm"
                  >
                    <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden border-b border-zinc-800/80">
                      <img
                        src={img}
                        alt={item.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/denim_vintage.png';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 text-[11px] text-emerald-400 font-medium px-2.5 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur-md">
                        {formatCondition(item.condition)}
                      </div>
                      <div className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-neon-lime text-black shadow-sm">
                        {item.size || 'OS'}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                      <div>
                        <div className="text-[11px] text-zinc-400 flex items-center justify-between mb-1 font-medium">
                          <span>{item.shop?.shopName || 'Relic Vintage Co.'}</span>
                          <span className="text-zinc-500">{item.era || '90s'}</span>
                        </div>
                        <Link href={`/item/${item.id}`}>
                          <h3 className="text-sm font-semibold text-white line-clamp-1 hover:text-neon-lime transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                      </div>

                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                        <span className="text-lg font-bold text-white tracking-tight tabular-nums">
                          {formatCurrency(item.price)}
                        </span>
                        <Link
                          href={`/item/${item.id}`}
                          className="bg-white hover:bg-neon-lime text-black font-semibold text-xs uppercase px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
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
