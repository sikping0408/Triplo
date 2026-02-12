
import React, { useState } from 'react';
import { Trip, Tripmate } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
  UsersIcon, 
  UserPlusIcon, 
  MailIcon, 
  CopyIcon, 
  CheckIcon, 
  ShieldCheckIcon,
  XIcon,
  LinkIcon,
  MoreVerticalIcon,
  Trash2Icon
} from 'lucide-react';

interface TripmateManagerProps {
  trip: Trip;
  onUpdate: (trip: Trip) => void;
}

const TripmateManager: React.FC<TripmateManagerProps> = ({ trip, onUpdate }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    const newTripmate: Tripmate = {
      id: uuidv4(),
      name: inviteName,
      email: inviteEmail,
      role: 'editor',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviteName}`
    };

    onUpdate({
      ...trip,
      tripmates: [...(trip.tripmates || []), newTripmate]
    });

    setInviteEmail('');
    setInviteName('');
    setShowInviteForm(false);
    alert(`Invite sent to ${inviteName}!`);
  };

  const handleRemove = (id: string) => {
    if (confirm('Remove this tripmate?')) {
      onUpdate({
        ...trip,
        tripmates: trip.tripmates.filter(t => t.id !== id)
      });
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}?trip=${trip.id}&code=${trip.shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Header */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-slate-900 p-5 rounded-3xl shrink-0">
            <UsersIcon className="w-10 h-10 text-[#F5DF98]" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Tripmates</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              {trip.tripmates?.length || 0} People Traveling to {trip.destination}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="bg-slate-900 text-[#F5DF98] px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs"
        >
          {showInviteForm ? <XIcon className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
          {showInviteForm ? 'Close' : 'Invite Friend'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Tripmates List */}
        <div className="lg:col-span-2 space-y-4">
          {showInviteForm && (
            <div className="bg-[#F5DF98]/10 border-2 border-dashed border-[#F5DF98] rounded-[2rem] p-8 mb-8 animate-in slide-in-from-top-4 duration-300">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6">Invite Someone New</h3>
              <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Friend's Name" 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-bold"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                />
                <div className="relative">
                  <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#F5DF98] outline-none transition font-bold"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="md:col-span-2 bg-slate-900 text-[#F5DF98] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition"
                >
                  Send Invitation
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-[2rem] shadow-lg border border-black/5 divide-y divide-slate-50 overflow-hidden">
            {trip.tripmates?.map((mate) => (
              <div key={mate.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden ring-4 ring-white shadow-sm">
                    <img src={mate.avatar} alt={mate.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 leading-tight flex items-center gap-2">
                      {mate.name}
                      {mate.role === 'owner' && <ShieldCheckIcon className="w-4 h-4 text-blue-500" />}
                    </h4>
                    <p className="text-xs font-bold text-slate-400">{mate.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${mate.role === 'owner' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                    {mate.role}
                  </span>
                  {mate.role !== 'owner' && (
                    <button 
                      onClick={() => handleRemove(mate.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-3 text-slate-300 hover:text-slate-900 transition">
                    <MoreVerticalIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Sidecard */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
            
            <div className="relative z-10">
              <div className="bg-[#F5DF98] w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <LinkIcon className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Share Trip</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Generated Invite Link</p>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between gap-4 border border-white/10 mb-8">
                <div className="truncate text-[10px] font-mono opacity-60">
                  {window.location.origin}?trip={trip.id.substring(0,8)}...
                </div>
                <button 
                  onClick={copyShareLink}
                  className="bg-[#F5DF98] text-slate-900 p-3 rounded-xl hover:scale-105 active:scale-95 transition shadow-lg shrink-0"
                >
                  {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Share Code: <span className="text-white">{trip.shareCode}</span></p>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                  Anyone with this link can view and join the planning team for your {trip.destination} adventure.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-md border border-black/5 rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Sharing Tip</h4>
            <p className="text-slate-600 text-xs font-bold leading-relaxed italic">
              "Give your tripmates Editor access if you want them to help add activities and manage the budget!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripmateManager;
