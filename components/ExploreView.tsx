
import React, { useState } from 'react';
import { searchPlacesGrounding, SearchResult } from '../geminiService';
import { Trip, Activity } from '../types';
import { 
  SearchIcon, 
  SparklesIcon, 
  MapPinIcon, 
  PlusIcon, 
  ExternalLinkIcon,
  UtensilsIcon,
  CameraIcon,
  HomeIcon,
  Loader2Icon,
  ChevronRightIcon
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ExploreViewProps {
  trips: Trip[];
  onAddActivity: (tripId: string, activity: Activity) => void;
}

const CATEGORY_MAP = {
  food: { label: 'Dining', icon: <UtensilsIcon className="w-4 h-4" />, color: 'bg-orange-500' },
  attraction: { label: 'Visit', icon: <CameraIcon className="w-4 h-4" />, color: 'bg-purple-500' },
  accommodation: { label: 'Stay', icon: <HomeIcon className="w-4 h-4" />, color: 'bg-blue-500' },
};

const ExploreView: React.FC<ExploreViewProps> = ({ trips, onAddActivity }) => {
  const [query, setQuery] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery || !destination) return;

    setLoading(true);
    const data = await searchPlacesGrounding(finalQuery, destination);
    setResults(data);
    setLoading(false);
  };

  const handleAdd = (res: SearchResult) => {
    if (!selectedTripId) {
      alert("Please select or create a trip first!");
      return;
    }
    
    const activity: Activity = {
      id: uuidv4(),
      name: res.name,
      category: res.category,
      time: '10:00', // Default
      address: res.address,
      notes: res.description,
      estimatedCost: 0,
      actualCost: 0,
      completed: false
    };

    onAddActivity(selectedTripId, activity);
    alert(`Added ${res.name} to your itinerary!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-slate-900 p-2 rounded-xl">
            <SparklesIcon className="w-5 h-5 text-[#F5DF98]" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">AI Discovery Engine</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">Explore</h1>
        <p className="text-slate-800 text-lg font-bold opacity-70">Find hidden gems using real-time search grounding.</p>
      </header>

      {/* Search Bar */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-black/5 mb-12">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative group">
            <MapPinIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition" />
            <input 
              type="text" 
              placeholder="Destination (e.g. Paris)"
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-black"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
          <div className="flex-1 relative group">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition" />
            <input 
              type="text" 
              placeholder="What are you looking for? (e.g. Sushi)"
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-black"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-[#F5DF98] px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2Icon className="w-5 h-5 animate-spin" /> : <ChevronRightIcon className="w-5 h-5" />}
            {loading ? 'Searching' : 'Discover'}
          </button>
        </form>

        <div className="mt-8 flex flex-wrap gap-3">
          {['Best hidden coffee', 'Michelin star dining', 'Historical landmarks', 'Boutique hotels'].map(chip => (
            <button 
              key={chip}
              onClick={() => { setQuery(chip); handleSearch(undefined, chip); }}
              className="px-4 py-2 bg-slate-100 hover:bg-[#F5DF98] text-slate-500 hover:text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest transition"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Select Trip for adding */}
      {trips.length > 0 && results.length > 0 && (
        <div className="mb-8 flex items-center justify-end gap-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add to Trip:</label>
          <select 
            value={selectedTripId} 
            onChange={e => setSelectedTripId(e.target.value)}
            className="bg-white border border-black/5 rounded-xl px-4 py-2 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-[#F5DF98]"
          >
            {trips.map(t => <option key={t.id} value={t.id}>{t.destination}</option>)}
          </select>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/40 h-80 rounded-[2.5rem] animate-pulse border border-black/5" />
          ))
        ) : results.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-24 h-24 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your search starts here.</h3>
            <p className="text-slate-500 font-medium italic">Type a city and query to unlock local recommendations.</p>
          </div>
        ) : (
          results.map((res, i) => (
            <div 
              key={i} 
              className="bg-white rounded-[2.5rem] overflow-hidden border border-black/5 shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col"
            >
              <div className="h-48 relative overflow-hidden bg-slate-100">
                <img 
                  src={`https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600&sig=${i}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-[2000ms]"
                  alt={res.name}
                />
                <div className={`absolute top-4 left-4 p-3 rounded-2xl text-white shadow-lg ${CATEGORY_MAP[res.category].color}`}>
                  {CATEGORY_MAP[res.category].icon}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-slate-900 mb-2 truncate group-hover:text-blue-600 transition">{res.name}</h3>
                <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <MapPinIcon className="w-3 h-3 text-[#F5DF98]" />
                  {res.address.split(',')[0]}
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8 flex-1">
                  {res.description}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                  {res.url ? (
                    <a 
                      href={res.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 transition"
                    >
                      <ExternalLinkIcon className="w-3.5 h-3.5" /> Source
                    </a>
                  ) : <div />}
                  <button 
                    onClick={() => handleAdd(res)}
                    className="flex items-center gap-2 bg-[#F5DF98] text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-110 active:scale-95 transition"
                  >
                    <PlusIcon className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExploreView;
