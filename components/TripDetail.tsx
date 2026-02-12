
import React, { useState } from 'react';
import { Trip, Activity, Accommodation } from '../types';
import ItineraryView from './ItineraryView';
import BudgetTracker from './BudgetTracker';
import AccommodationList from './AccommodationList';
import TripmateManager from './TripmateManager';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  HomeIcon, 
  MapIcon,
  Trash2Icon,
  SettingsIcon,
  Share2Icon,
  UsersIcon
} from 'lucide-react';

interface TripDetailProps {
  trip: Trip;
  onUpdate: (trip: Trip) => void;
  onDelete: () => void;
  onBack: () => void;
}

const TripDetail: React.FC<TripDetailProps> = ({ trip, onUpdate, onDelete, onBack }) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'accommodations' | 'tripmates'>('itinerary');

  const handleUpdateActivities = (dayIndex: number, activities: Activity[]) => {
    const newItinerary = [...trip.itinerary];
    newItinerary[dayIndex] = { ...newItinerary[dayIndex], activities };
    onUpdate({ ...trip, itinerary: newItinerary });
  };

  const handleUpdateAccommodations = (accommodations: Accommodation[]) => {
    onUpdate({ ...trip, accommodations });
  };

  return (
    <div className="min-h-screen animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img 
          src={trip.coverImage || `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200`} 
          className="w-full h-full object-cover"
          alt={trip.destination}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
        
        {/* Buttons Top */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
          <button 
            onClick={onBack}
            className="p-4 bg-[#F5DF98] text-slate-900 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-black uppercase text-[10px]"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('tripmates')}
              className="p-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-md transition-all border border-white/20"
            >
              <Share2Icon className="w-5 h-5" />
            </button>
            <button className="p-4 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-md transition-all border border-white/20">
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Bottom */}
        <div className="absolute bottom-12 left-8 right-8 z-20 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#F5DF98] text-slate-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Adventure Log</span>
                <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">• {trip.tripmates?.length || trip.travelers} Tripmates</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6 drop-shadow-2xl">{trip.destination}</h1>
              <div className="flex flex-wrap gap-4 text-white text-sm font-black uppercase tracking-widest">
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-sm">
                  <CalendarIcon className="w-4 h-4 text-[#F5DF98]" /> 
                  {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-sm">
                  {trip.itinerary.length} Days
                </span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if(confirm('Delete this itinerary?')) onDelete();
                }}
                className="bg-red-500/20 hover:bg-red-500 text-white p-5 rounded-2xl backdrop-blur-md border border-red-500/30 transition-all"
              >
                <Trash2Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-[#F5DF98]/90 backdrop-blur-xl border-b border-black/5 px-8">
        <div className="max-w-6xl mx-auto flex gap-12 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'itinerary', label: 'Timeline', icon: <MapIcon className="w-4 h-4" /> },
            { id: 'budget', label: 'Expenses', icon: <CreditCardIcon className="w-4 h-4" /> },
            { id: 'accommodations', label: 'Stays', icon: <HomeIcon className="w-4 h-4" /> },
            { id: 'tripmates', label: 'Tripmates', icon: <UsersIcon className="w-4 h-4" /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-6 px-1 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        {activeTab === 'itinerary' && (
          <ItineraryView 
            itinerary={trip.itinerary} 
            onUpdateDay={handleUpdateActivities} 
          />
        )}
        {activeTab === 'budget' && (
          <BudgetTracker 
            trip={trip} 
          />
        )}
        {activeTab === 'accommodations' && (
          <AccommodationList 
            accommodations={trip.accommodations} 
            onUpdate={handleUpdateAccommodations} 
          />
        )}
        {activeTab === 'tripmates' && (
          <TripmateManager 
            trip={trip}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default TripDetail;
