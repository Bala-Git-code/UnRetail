'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/lib/api-client';
import { formatCurrency, formatCondition } from '@/lib/utils';
import {
  TAXONOMY,
  getSubcategories,
  isTechCategory,
  TECH_CONDITION_GRADES,
} from '@/lib/taxonomy';
import {
  Search,
  Filter,
  X,
  ShieldCheck,
  Tag,
  ShoppingBag,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  Cpu,
  Lock,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export default function SearchPage() {
  const { addToCart, isInCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedEra, setSelectedEra] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedTechGrade, setSelectedTechGrade] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceMax, setPriceMax] = useState(25000);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestionSuffix, setSuggestionSuffix] = useState('');

  // Extract suggestions from current items matching the query
  const getSuggestionsFromItems = (searchQuery, itemList) => {
    if (!searchQuery) return [];
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (normalizedQuery.length === 0) return [];
    
    const extracted = [];
    itemList.forEach((item) => {
      // 1. Check title and extract matching phrase starting with query
      if (item.title) {
        const words = item.title.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
          const phrase = words.slice(i).join(' ');
          if (phrase.toLowerCase().startsWith(normalizedQuery)) {
            extracted.push({
              text: phrase,
              type: 'title'
            });
          }
        }
      }
      // 2. Check brand
      if (item.brand && item.brand.toLowerCase().startsWith(normalizedQuery)) {
        extracted.push({
          text: item.brand,
          type: 'brand'
        });
      }
      // 3. Check subcategory
      if (item.subcategory && item.subcategory.toLowerCase().startsWith(normalizedQuery)) {
        extracted.push({
          text: item.subcategory,
          type: 'subcategory'
        });
      }
    });

    // Remove duplicates (case-insensitive)
    const seen = new Set();
    const unique = [];
    for (const item of extracted) {
      const key = item.text.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    return unique.slice(0, 5);
  };

  // Compute suggestions and autocomplete suffix
  useEffect(() => {
    const list = getSuggestionsFromItems(query, items);
    setSuggestions(list);
    
    if (list.length > 0 && query) {
      const topSuggestion = list[0].text;
      const normalizedQuery = query.toLowerCase();
      const normalizedSuggestion = topSuggestion.toLowerCase();
      
      if (normalizedSuggestion.startsWith(normalizedQuery)) {
        const suffix = topSuggestion.slice(query.length);
        setSuggestionSuffix(suffix);
      } else {
        setSuggestionSuffix('');
      }
    } else {
      setSuggestionSuffix('');
    }
  }, [query, items]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' || e.key === 'ArrowRight') {
      const cursorAtEnd = e.target.selectionStart === query.length;
      if (suggestionSuffix && (e.key === 'Tab' || cursorAtEnd)) {
        e.preventDefault();
        setQuery(query + suggestionSuffix);
        setSuggestionSuffix('');
        setShowDropdown(false);
      }
    } else if (e.key === 'ArrowDown') {
      if (suggestions.length > 0) {
        e.preventDefault();
        setShowDropdown(true);
        setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      if (suggestions.length > 0) {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }
    } else if (e.key === 'Enter') {
      if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
        e.preventDefault();
        setQuery(suggestions[focusedIndex].text);
        setShowDropdown(false);
        setFocusedIndex(-1);
      } else {
        setShowDropdown(false);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setFocusedIndex(-1);
    }
  };

  useEffect(() => {
    fetchFilteredItems();
  }, [query, selectedCategory, selectedSubcategory, selectedEra, selectedCondition, selectedTechGrade, selectedCity]);

  const fetchFilteredItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
      if (selectedEra) params.append('era', selectedEra);
      if (selectedCondition) params.append('condition', selectedCondition);
      if (selectedTechGrade) params.append('techConditionGrade', selectedTechGrade);
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
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedSize('');
    setSelectedEra('');
    setSelectedCondition('');
    setSelectedTechGrade('');
    setSelectedCity('');
    setPriceMax(25000);
  };

  const filteredItems = items.filter((item) => {
    if (selectedSize && item.size !== selectedSize) return false;
    if (item.price > priceMax) return false;
    return true;
  });

  const sizes = ['S', 'M', 'L', 'XL', 'W32 L30', 'Pocket', 'Handheld', 'US 10', 'OS'];
  const eras = ['70s', '80s', '90s', 'Y2K', 'Archival'];
  const apparelConditions = [
    { value: 'LIKE_NEW', label: 'Pristine / Like New' },
    { value: 'GENTLY_USED', label: 'Gently Loved' },
    { value: 'FLAWED', label: 'Vintage Character' },
  ];
  const cities = ['Mumbai', 'Bengaluru', 'Delhi', 'Kolkata'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-street-black text-zinc-100 p-4 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Search Header Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/20 rounded-full text-xs font-medium text-neon-lime">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Tier Taxonomy & Search Engine</span>
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
          <div className="relative w-full bg-street-card/90 border border-zinc-800 focus-within:border-neon-lime rounded-2xl transition-all shadow-lg flex items-center overflow-hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            
            {/* Autocomplete Background Text */}
            {suggestionSuffix && (
              <div className="absolute left-12 right-10 top-1/2 -translate-y-1/2 text-sm font-sans text-zinc-400/65 pointer-events-none select-none whitespace-pre overflow-hidden">
                <span className="opacity-0">{query}</span>
                <span>{suggestionSuffix}</span>
              </div>
            )}

            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
                setFocusedIndex(-1);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => {
                // Delay blur slightly to allow suggestion click events to fire first
                setTimeout(() => setShowDropdown(false), 200);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search across apparel & retro tech (e.g. Levi 501, Sony Cyber-shot, Game Boy, Harley Bomber)..."
              className="w-full bg-transparent text-white text-sm pl-12 pr-10 py-3.5 focus:outline-none placeholder:text-zinc-500"
            />

            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSuggestionSuffix('');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-street-card/95 border border-zinc-800/90 rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-md">
              <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      onMouseDown={() => {
                        setQuery(suggestion.text);
                        setShowDropdown(false);
                        setFocusedIndex(-1);
                      }}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                        index === focusedIndex
                          ? 'bg-neon-lime/10 text-neon-lime font-semibold'
                          : 'text-zinc-300 hover:bg-zinc-800/40'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 opacity-60 text-neon-lime" />
                        <span>{suggestion.text}</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 bg-zinc-900/50 rounded border border-zinc-800/85">
                        {suggestion.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Active Filter Chips Bar */}
        {(selectedCategory || selectedSubcategory || selectedSize || selectedEra || selectedCondition || selectedTechGrade || selectedCity || query) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-zinc-500 font-medium mr-1">Active Filters:</span>
            {query && (
              <span className="bg-zinc-900 text-neon-lime border border-neon-lime/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                Query: &quot;{query}&quot;
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => setQuery('')} />
              </span>
            )}
            {selectedCategory && (
              <span className="bg-zinc-900 text-white border border-neon-lime/40 px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold">
                Category: {selectedCategory}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400" onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }} />
              </span>
            )}
            {selectedSubcategory && (
              <span className="bg-zinc-900 text-neon-lime border border-neon-lime/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                Subcategory: {selectedSubcategory}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400" onClick={() => setSelectedSubcategory('')} />
              </span>
            )}
            {selectedTechGrade && (
              <span className="bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold">
                Tech Grade: {selectedTechGrade}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400" onClick={() => setSelectedTechGrade('')} />
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
              <Filter className="w-4 h-4 text-neon-lime" /> Faceted Taxonomy
            </span>
            <button
              onClick={handleClearFilters}
              className="text-zinc-500 hover:text-rose-400 flex items-center gap-1 font-medium transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Facet Accordion */}
          <div className="space-y-3">
            <label className="text-zinc-400 font-semibold block uppercase tracking-wider text-[11px]">
              Parent Category
            </label>
            <div className="space-y-1.5">
              {TAXONOMY.map((cat) => {
                const isCatActive = selectedCategory === cat.id;
                return (
                  <div key={cat.id} className="space-y-1">
                    <button
                      onClick={() => {
                        if (isCatActive) {
                          setSelectedCategory('');
                          setSelectedSubcategory('');
                        } else {
                          setSelectedCategory(cat.id);
                          setSelectedSubcategory('');
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl font-medium transition-all ${
                        isCatActive
                          ? 'bg-neon-lime/10 border border-neon-lime text-neon-lime font-bold'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {cat.id === 'Tech & Retro Electronics' && <Cpu className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{cat.name}</span>
                      </span>
                      {isCatActive ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {/* Subcategory Pills */}
                    <AnimatePresence>
                      {isCatActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-2 pt-1 pb-1 space-y-1 overflow-hidden"
                        >
                          {cat.subcategories.map((sub) => {
                            const isSubActive = selectedSubcategory === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setSelectedSubcategory(isSubActive ? '' : sub.id)}
                                className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] transition-all flex items-center justify-between ${
                                  isSubActive
                                    ? 'bg-neon-lime text-black font-bold'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                }`}
                              >
                                <span>{sub.name}</span>
                                {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tech Condition Grades (Visible if Tech is selected or no specific category is filtered) */}
          {(!selectedCategory || selectedCategory === 'Tech & Retro Electronics') && (
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <label className="text-cyan-400 font-semibold block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Tech Functional Grades</span>
              </label>
              <div className="space-y-1.5">
                {TECH_CONDITION_GRADES.map((grade) => (
                  <button
                    key={grade.value}
                    onClick={() => setSelectedTechGrade(selectedTechGrade === grade.value ? '' : grade.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                      selectedTechGrade === grade.value
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizing Filter (Hidden for Accessories) */}
          {selectedCategory !== 'Accessories' && (
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <label className="text-zinc-400 font-semibold block uppercase tracking-wider text-[11px]">Size / Form Factor</label>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs ${
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
          )}

          {/* Era Filter */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <label className="text-zinc-400 font-semibold block uppercase tracking-wider text-[11px]">Vintage Era</label>
            <div className="flex flex-wrap gap-1.5">
              {eras.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(selectedEra === era ? '' : era)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs ${
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

          {/* Condition Filter (Apparel) */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <label className="text-zinc-400 font-semibold block uppercase tracking-wider text-[11px]">Apparel Condition</label>
            <div className="space-y-2 pt-1">
              {apparelConditions.map((c) => (
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
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
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
          <div className="space-y-2 pt-2 border-t border-zinc-800/80">
            <div className="flex justify-between text-zinc-400 font-semibold text-[11px] uppercase tracking-wider">
              <span>Max Price</span>
              <span className="text-neon-lime font-bold tabular-nums text-xs">{formatCurrency(priceMax)}</span>
            </div>
            <input
              type="range"
              min={500}
              max={30000}
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
            <span>
              Showing <strong className="text-white">{filteredItems.length}</strong> matching rack items
            </span>
            {(selectedCategory || selectedSubcategory || selectedSize || selectedEra || selectedCondition || selectedTechGrade || selectedCity || query) && (
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
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item) => {
                const img = item.images?.[0] || '/images/denim_vintage.png';
                const isItemTech = isTechCategory(item.category);

                return (
                  <motion.div
                    key={item.id}
                    variants={cardVariants}
                    className="bg-street-card/80 border border-zinc-800/90 hover:border-zinc-700 rounded-2xl transition-all flex flex-col justify-between overflow-hidden group card-hover-effect shadow-xl backdrop-blur-sm"
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
                      {item.subcategory && (
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                          <span className="bg-black/75 text-zinc-300 text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-zinc-700/80 backdrop-blur-md">
                            {item.subcategory}
                          </span>
                        </div>
                      )}
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

                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                        <span className="text-lg font-bold text-white tracking-tight tabular-nums">
                          {formatCurrency(item.price)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => addToCart(item, true)}
                            disabled={item.status === 'SOLD'}
                            className={`p-2 rounded-xl border text-xs transition-all ${
                              isInCart(item.id)
                                ? 'bg-zinc-900 border-neon-lime text-neon-lime'
                                : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                            } active:scale-95 disabled:opacity-50 cursor-pointer`}
                            title={isInCart(item.id) ? 'In Your Bag' : 'Add to Bag'}
                          >
                            {isInCart(item.id) ? <Check className="w-3.5 h-3.5 text-neon-lime" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                          </button>
                          <Link
                            href={`/item/${item.id}`}
                            className="bg-neon-lime hover:bg-white text-black font-extrabold text-xs uppercase px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
