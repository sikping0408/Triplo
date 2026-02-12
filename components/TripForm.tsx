
import React, { useState } from 'react';
import { Trip, DayPlan, Tripmate } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { MapPinIcon, CalendarIcon, UsersIcon, DollarSignIcon, ArrowLeftIcon } from 'lucide-react';

interface TripFormProps {
  onSave: (trip: Trip) => void;
  onCancel: () => void;
  initialData?: Trip;
}

const TripForm: React.FC<TripFormProps> = ({ onSave, onCancel, initialData }) => {
  const [destination, setDestination] = useState(initialData?.destination || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [travelers, setTravelers] = useState(initialData?.travelers || 1);
  const [budget, setBudget] = useState(initialData?.totalBudget || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) return;

    const days: DayPlan[] = [];
    let curr = new Date(startDate);
    const end = new Date(endDate);
    while (curr <= end) {
      days.push({ date: curr.toISOString(), activities: [] });
      curr.setDate(curr.getDate() + 1);
    }

    const defaultOwner: Tripmate = {
      id: uuidv4(),
      name: 'You (Organizer)',
      email: 'organizer@triplo.com',
      role: 'owner',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Organizer`
    };

    const newTrip: Trip = {
      id: initialData?.id || uuidv4(),
      destination,
      startDate,
      endDate,
      travelers,
      totalBudget: budget,
      itinerary: initialData?.itinerary || days,
      accommodations: initialData?.accommodations || [],
      tripmates: initialData?.tripmates || [defaultOwner],
      shareCode: initialData?.shareCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
      coverImage: initialData?.coverImage
    };
    onSave(newTrip);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 animate-in fade-in zoom-in-95 duration-500">
      <button 
        onClick={onCancel}
        className="flex items-center gap-3 text-slate-900 font-black uppercase text-xs tracking-widest mb-10 hover:opacity-70 transition group"
      >
        <div className="bg-white/50 p-2 rounded-full border border-black/5 group-hover:-translate-x-1 transition"><ArrowLeftIcon className="w-4 h-4" /></div>
        Discard Draft
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-black/5 overflow-hidden">
        <div className="bg-slate-900 p-12 text-[#F5DF98]">
          <h2 className="text-5xl font-black tracking-tighter mb-4">Plan Trip</h2>
          <p className="font-bold opacity-80 text-lg">Define the blueprint of your next journey.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-12 space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Destination</label>
            <div className="relative group">
              <MapPinIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-slate-900 transition" />
              <input 
                type="text" 
                placeholder="e.g. Kyoto, Japan"
                className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-[#F5DF98] outline-none transition text-lg font-bold"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Departure</label>
              <div className="relative group">
                <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-slate-900 transition" />
                <input 
                  type="date" 
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-bold"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Return</label>
              <div className="relative group">
                <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-slate-900 transition" />
                <input 
                  type="date" 
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-bold"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Travelers</label>
              <div className="relative group">
                <UsersIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-slate-900 transition" />
                <input 
                  type="number" 
                  min="1"
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-bold"
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Total Budget ($)</label>
              <div className="relative group">
                <DollarSignIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-slate-900 transition" />
                <input 
                  type="number" 
                  min="0"
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-bold"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-6 pt-10">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 px-8 py-5 border-2 border-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition uppercase text-xs tracking-widest"
            >
              Discard
            </button>
            <button 
              type="submit"
              className="flex-[2] bg-slate-900 text-[#F5DF98] px-8 py-5 font-black rounded-2xl hover:scale-[1.02] shadow-2xl transition uppercase text-xs tracking-widest active:scale-[0.98]"
            >
              {initialData ? 'Update Manifest' : 'Confirm Expedition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;
