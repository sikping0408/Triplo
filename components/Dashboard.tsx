
import React from 'react';
import { Trip } from '../types';
import { CalendarIcon, UsersIcon, ChevronRightIcon, PlusIcon, MapPinIcon } from 'lucide-react';

interface DashboardProps {
  trips: Trip[];
  onSelectTrip: (id: string) => void;
  onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ trips, onSelectTrip, onCreateNew }) => {
  const now = new Date();
  
  const upcomingTrips = trips.filter(t => new Date(t.startDate) > now);
  const ongoingTrips = trips.filter(t => new Date(t.startDate) <= now && new Date(t.endDate) >= now);
  const pastTrips = trips.filter(t => new Date(t.endDate) < now);

  const TripGrid = ({ title, data, emptyMsg }: { title: string, data: Trip[], emptyMsg: string }) => (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
          {title} 
          <span className="ml-2 text-sm font-bold text-slate-500 bg-white/50 px-2 py-0.5 rounded-full border border-black/5">{data.length}</span>
        </h2>
      </div>
      {data.length === 0 ? (
        <div className="bg-white/40 border border-black/5 rounded-3xl p-12 text-center shadow-inner">
          <p className="text-slate-600 font-medium italic mb-0">{emptyMsg}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map(trip => (
            <div 
              key={trip.id}
              onClick={() => onSelectTrip(trip.id)}
              className="bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group wander-card"
            >
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={trip.coverImage || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600`} 
                  alt={trip.destination} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-black text-white truncate drop-shadow-md mb-1">{trip.destination}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-[10px] font-black uppercase tracking-widest">
                    <MapPinIcon className="w-3 h-3 text-[#F5DF98]" />
                    <span>Adventure Trip</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100/50 px-3 py-2 rounded-xl">
                    <CalendarIcon className="w-3 h-3" />
                    {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100/50 px-3 py-2 rounded-xl">
                    <UsersIcon className="w-3 h-3" />
                    {trip.travelers} Guests
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900">Open Planner</span>
                  <div className="bg-[#F5DF98] p-2 rounded-full group-hover:translate-x-1 transition shadow-sm">
                    <ChevronRightIcon className="w-4 h-4 text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4">Wanderlust</h1>
          <p className="text-slate-800 text-lg font-bold opacity-70">Your personal travel logs and future dreams.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="flex items-center justify-center gap-3 bg-slate-900 text-[#F5DF98] px-10 py-5 rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
        >
          <PlusIcon className="w-6 h-6" />
          Plan New Adventure
        </button>
      </header>

      {ongoingTrips.length > 0 && (
        <TripGrid 
          title="Ongoing" 
          data={ongoingTrips} 
          emptyMsg=""
        />
      )}
      
      <TripGrid 
        title="Upcoming" 
        data={upcomingTrips} 
        emptyMsg="Looking for your next getaway? Start planning today."
      />

      <TripGrid 
        title="Past Memories" 
        data={pastTrips} 
        emptyMsg="Your past trips will appear here."
      />
    </div>
  );
};

export default Dashboard;
