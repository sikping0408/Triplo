
import React, { useState } from 'react';
import { Activity, DayPlan, ActivityCategory } from '../types';
import { 
  PlusIcon, 
  ClockIcon, 
  MapPinIcon, 
  Trash2Icon, 
  CheckCircleIcon,
  UtensilsIcon,
  CameraIcon,
  BusIcon,
  HomeIcon,
  MoreHorizontalIcon,
  CalendarIcon,
  ChevronDownIcon
} from 'lucide-react';

interface ItineraryViewProps {
  itinerary: DayPlan[];
  onUpdateDay: (index: number, activities: Activity[]) => void;
}

const CATEGORY_STYLES: Record<ActivityCategory, { color: string, bg: string, icon: React.ReactNode }> = {
  food: { color: 'text-orange-600', bg: 'bg-orange-100', icon: <UtensilsIcon className="w-3.5 h-3.5" /> },
  attraction: { color: 'text-purple-600', bg: 'bg-purple-100', icon: <CameraIcon className="w-3.5 h-3.5" /> },
  transport: { color: 'text-teal-600', bg: 'bg-teal-100', icon: <BusIcon className="w-3.5 h-3.5" /> },
  accommodation: { color: 'text-blue-600', bg: 'bg-blue-100', icon: <HomeIcon className="w-3.5 h-3.5" /> },
  custom: { color: 'text-slate-600', bg: 'bg-slate-100', icon: <MoreHorizontalIcon className="w-3.5 h-3.5" /> }
};

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, onUpdateDay }) => {
  const [activeDay, setActiveDay] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    category: 'attraction',
    time: '10:00',
    estimatedCost: 0
  });

  const handleAddActivity = () => {
    if (!newActivity.name) return;
    const activity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      name: newActivity.name,
      category: newActivity.category as ActivityCategory || 'attraction',
      time: newActivity.time || '10:00',
      address: newActivity.address || '',
      notes: newActivity.notes || '',
      estimatedCost: newActivity.estimatedCost || 0,
      actualCost: 0,
      completed: false
    };
    const updated = [...itinerary[activeDay].activities, activity].sort((a, b) => a.time.localeCompare(b.time));
    onUpdateDay(activeDay, updated);
    setShowAddForm(false);
    setNewActivity({ category: 'attraction', time: '10:00', estimatedCost: 0 });
  };

  const toggleComplete = (id: string) => {
    const updated = itinerary[activeDay].activities.map(a => a.id === id ? { ...a, completed: !a.completed } : a);
    onUpdateDay(activeDay, updated);
  };

  const deleteActivity = (id: string) => {
    const updated = itinerary[activeDay].activities.filter(a => a.id !== id);
    onUpdateDay(activeDay, updated);
  };

  const dayActivities = itinerary[activeDay].activities;

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
      {/* Sidebar - Days */}
      <div className="lg:w-80 shrink-0">
        <div className="sticky top-32 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Timeline</h3>
            <div className="bg-white/40 p-1.5 rounded-full border border-black/5">
              <ChevronDownIcon className="w-3 h-3 text-slate-900" />
            </div>
          </div>
          <div className="flex lg:flex-col gap-3 overflow-x-auto no-scrollbar">
            {itinerary.map((day, idx) => (
              <button
                key={day.date}
                onClick={() => setActiveDay(idx)}
                className={`flex-shrink-0 lg:w-full flex flex-col p-5 rounded-[1.5rem] transition-all duration-300 border-2 ${activeDay === idx ? 'bg-white border-black/5 shadow-xl scale-[1.02]' : 'bg-transparent border-transparent hover:bg-white/30 text-slate-600'}`}
              >
                <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${activeDay === idx ? 'text-slate-900' : 'text-slate-500'}`}>
                  Stop Day {idx + 1}
                </span>
                <span className={`text-lg font-black ${activeDay === idx ? 'text-slate-900' : 'text-slate-600'}`}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <div className="mt-4 flex -space-x-2">
                  {day.activities.slice(0, 5).map((a, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${CATEGORY_STYLES[a.category].bg}`}>
                      <div className={CATEGORY_STYLES[a.category].color}>{CATEGORY_STYLES[a.category].icon}</div>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Column */}
      <div className="flex-1 space-y-10 pb-24">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-black/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                {new Date(itinerary[activeDay].date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h2>
              <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{dayActivities.length} Destinations</span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{dayActivities.filter(a => a.category === 'food').length} Dining</span>
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-slate-900 text-[#F5DF98] px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
            >
              <PlusIcon className="w-5 h-5" /> Add stop
            </button>
          </div>

          {showAddForm && (
            <div className="mb-12 p-8 bg-[#F5DF98]/10 rounded-3xl border-2 border-dashed border-[#F5DF98] animate-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Destination Name</label>
                  <input type="text" placeholder="Where next?" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-bold"
                    value={newActivity.name || ''} onChange={e => setNewActivity({...newActivity, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Category</label>
                  <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-bold bg-white"
                    value={newActivity.category} onChange={e => setNewActivity({...newActivity, category: e.target.value as ActivityCategory})}>
                    <option value="attraction">Attraction</option>
                    <option value="food">Dining</option>
                    <option value="transport">Transit</option>
                    <option value="accommodation">Lodging</option>
                    <option value="custom">Special</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Planned Arrival</label>
                  <input type="time" className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-bold"
                    value={newActivity.time} onChange={e => setNewActivity({...newActivity, time: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowAddForm(false)} className="px-6 py-4 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-2xl transition">Cancel</button>
                <button onClick={handleAddActivity} className="px-10 py-4 bg-slate-900 text-[#F5DF98] font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition uppercase text-[10px] tracking-widest">Add Stop</button>
              </div>
            </div>
          )}

          {dayActivities.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-24 h-24 bg-[#F5DF98]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#F5DF98]/30">
                <CalendarIcon className="w-10 h-10 text-slate-400" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Day is clear for exploration</h4>
              <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">Fill your itinerary with hidden gems and local favorites.</p>
            </div>
          ) : (
            <div className="relative pl-12 space-y-12">
              <div className="absolute left-[19px] top-8 bottom-8 w-1 bg-[#F5DF98] rounded-full shadow-inner opacity-50" />
              {dayActivities.map((activity, idx) => {
                const style = CATEGORY_STYLES[activity.category];
                return (
                  <div key={activity.id} className="relative group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className={`absolute -left-[48px] top-4 w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10 ${style.bg} ${style.color}`}>
                      {style.icon}
                    </div>
                    <div className={`flex flex-col md:flex-row gap-8 p-8 rounded-[2rem] border-2 transition-all duration-300 ${activity.completed ? 'bg-slate-50 border-slate-100 grayscale-[0.8]' : 'bg-white border-black/5 shadow-xl hover:shadow-2xl hover:-translate-y-1'}`}>
                      <div className="w-full md:w-44 h-32 rounded-3xl overflow-hidden bg-slate-100 shrink-0 shadow-inner">
                        <img src={`https://picsum.photos/seed/${activity.id}/400/300`} className="w-full h-full object-cover group-hover:scale-110 transition duration-[3000ms]" alt="" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[10px] font-black text-slate-900 bg-[#F5DF98] px-2 py-0.5 rounded shadow-sm">{activity.time}</span>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em] border border-black/5 ${style.bg} ${style.color}`}>
                                {activity.category}
                              </span>
                            </div>
                            <h4 className={`text-2xl font-black tracking-tight ${activity.completed ? 'text-slate-400 line-through' : 'text-slate-900 group-hover:text-slate-900 transition'}`}>
                              {activity.name}
                            </h4>
                            {activity.address && (
                              <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-2">
                                <MapPinIcon className="w-3.5 h-3.5 text-[#F5DF98]" /> {activity.address}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                            <button onClick={() => toggleComplete(activity.id)} className={`p-3 rounded-2xl transition ${activity.completed ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-300 hover:text-green-600 hover:bg-green-100 shadow-sm'}`}>
                              <CheckCircleIcon className="w-6 h-6" />
                            </button>
                            <button onClick={() => deleteActivity(activity.id)} className="p-3 rounded-2xl bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 transition shadow-sm">
                              <Trash2Icon className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                        {activity.notes && (
                          <div className="mt-6 pt-6 border-t border-slate-50">
                            <p className="text-xs font-medium text-slate-500 italic leading-relaxed">
                              "{activity.notes}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
