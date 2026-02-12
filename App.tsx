
import React, { useState, useEffect } from 'react';
import { Trip, Activity } from './types';
import Dashboard from './components/Dashboard';
import TripDetail from './components/TripDetail';
import TripForm from './components/TripForm';
import ExploreView from './components/ExploreView';
import { 
  PlusIcon, 
  CompassIcon,
  LayoutDashboardIcon,
  SearchIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'detail' | 'explore'>('dashboard');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('travelmate_trips');
    if (saved) {
      try {
        setTrips(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse trips", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('travelmate_trips', JSON.stringify(trips));
  }, [trips]);

  const handleAddTrip = (newTrip: Trip) => {
    setTrips([...trips, newTrip]);
    setCurrentView('dashboard');
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(trips.filter(t => t.id !== id));
    setCurrentView('dashboard');
  };

  const handleAddActivityToTrip = (tripId: string, activity: Activity) => {
    setTrips(trips.map(t => {
      if (t.id === tripId) {
        const newItinerary = [...t.itinerary];
        // Add to the first day by default for simplicity in discovery
        if (newItinerary.length > 0) {
          newItinerary[0] = {
            ...newItinerary[0],
            activities: [...newItinerary[0].activities, activity]
          };
        }
        return { ...t, itinerary: newItinerary };
      }
      return t;
    }));
  };

  const navigateToDetail = (id: string) => {
    setSelectedTripId(id);
    setCurrentView('detail');
  };

  const selectedTrip = trips.find(t => t.id === selectedTripId);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      {currentView !== 'detail' && (
        <nav className="glass-header border-b border-black/5 sticky top-0 z-50 px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => setCurrentView('dashboard')}
            >
              <div className="bg-slate-900 p-2.5 rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <CompassIcon className="w-5 h-5 text-[#F5DF98]" />
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">tripl+o</h1>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`text-sm font-extrabold transition-all uppercase tracking-wider ${currentView === 'dashboard' ? 'text-slate-900 underline underline-offset-8' : 'text-slate-700 hover:text-slate-900'}`}
              >
                My Trips
              </button>
              <button 
                onClick={() => setCurrentView('explore')}
                className={`text-sm font-extrabold transition-all uppercase tracking-wider ${currentView === 'explore' ? 'text-slate-900 underline underline-offset-8' : 'text-slate-700 hover:text-slate-900'}`}
              >
                Discovery
              </button>
              <div className="h-4 w-[1px] bg-black/10" />
              <button 
                onClick={() => setCurrentView('create')}
                className="bg-slate-900 text-[#F5DF98] px-6 py-2.5 rounded-xl text-xs font-black shadow-sm hover:scale-105 transition-all active:scale-95 uppercase tracking-widest"
              >
                Plan a Trip
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <Dashboard 
            trips={trips} 
            onSelectTrip={navigateToDetail} 
            onCreateNew={() => setCurrentView('create')}
          />
        )}
        
        {currentView === 'explore' && (
          <ExploreView 
            trips={trips} 
            onAddActivity={handleAddActivityToTrip}
          />
        )}

        {currentView === 'create' && (
          <div className="py-12">
            <TripForm 
              onSave={handleAddTrip} 
              onCancel={() => setCurrentView('dashboard')}
            />
          </div>
        )}

        {currentView === 'detail' && selectedTrip && (
          <TripDetail 
            trip={selectedTrip} 
            onUpdate={handleUpdateTrip} 
            onDelete={() => handleDeleteTrip(selectedTrip.id)}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-6 left-6 right-6 flex md:hidden items-center justify-around px-8 py-4 glass-header border border-black/5 rounded-[2.5rem] shadow-2xl z-50">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'dashboard' ? 'text-slate-900 scale-110' : 'text-slate-600 opacity-50'}`}
        >
          <LayoutDashboardIcon className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setCurrentView('explore')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'explore' ? 'text-slate-900 scale-110' : 'text-slate-600 opacity-50'}`}
        >
          <SearchIcon className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setCurrentView('create')}
          className="flex flex-col items-center justify-center -mt-12 bg-slate-900 text-[#F5DF98] p-5 rounded-[2rem] shadow-xl"
        >
          <PlusIcon className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default App;
