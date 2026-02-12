
import React, { useState } from 'react';
import { Accommodation } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { HomeIcon, MapPinIcon, CalendarIcon, HashIcon, PhoneIcon, PlusIcon, Trash2Icon, ExternalLinkIcon } from 'lucide-react';

interface AccommodationListProps {
  accommodations: Accommodation[];
  onUpdate: (accommodations: Accommodation[]) => void;
}

const AccommodationList: React.FC<AccommodationListProps> = ({ accommodations, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Accommodation>>({
    cost: 0
  });

  const handleAdd = () => {
    if (!formData.hotelName) return;
    
    const newItem: Accommodation = {
      id: uuidv4(),
      hotelName: formData.hotelName || '',
      address: formData.address || '',
      checkIn: formData.checkIn || '',
      checkOut: formData.checkOut || '',
      bookingRef: formData.bookingRef || '',
      cost: formData.cost || 0,
      contactInfo: formData.contactInfo || ''
    };

    onUpdate([...accommodations, newItem]);
    setShowAddForm(false);
    setFormData({ cost: 0 });
  };

  const deleteItem = (id: string) => {
    onUpdate(accommodations.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-900">Accommodations</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-5 h-5" /> Add Hotel
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-lg animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hotel Name</label>
              <input 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.hotelName || ''}
                onChange={e => setFormData({...formData, hotelName: e.target.value})}
                placeholder="The Grand Palace"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Address</label>
              <input 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.address || ''}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="123 Luxury Ave, City"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Check-in</label>
              <input 
                type="date"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.checkIn || ''}
                onChange={e => setFormData({...formData, checkIn: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Check-out</label>
              <input 
                type="date"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.checkOut || ''}
                onChange={e => setFormData({...formData, checkOut: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Booking Reference</label>
              <input 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.bookingRef || ''}
                onChange={e => setFormData({...formData, bookingRef: e.target.value})}
                placeholder="#CONF-12345"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Total Cost</label>
              <input 
                type="number"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.cost || 0}
                onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleAdd}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              Add Accommodation
            </button>
          </div>
        </div>
      )}

      {accommodations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
          <HomeIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400">No accommodations added yet. Where are you staying?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accommodations.map(acc => (
            <div key={acc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <HomeIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{acc.hotelName}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1"><MapPinIcon className="w-3 h-3" /> {acc.address}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteItem(acc.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2Icon className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check-in</span>
                    <span className="text-sm font-bold text-slate-700">{new Date(acc.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check-out</span>
                    <span className="text-sm font-bold text-slate-700">{new Date(acc.checkOut).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2"><HashIcon className="w-4 h-4" /> Booking Ref</span>
                    <span className="font-bold text-slate-800">{acc.bookingRef || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2"><PhoneIcon className="w-4 h-4" /> Contact</span>
                    <span className="font-bold text-slate-800">{acc.contactInfo || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-slate-500">Total Stay Cost</span>
                    <span className="text-xl font-black text-blue-600">${acc.cost}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
                <button 
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(acc.address)}`, '_blank')}
                >
                  <ExternalLinkIcon className="w-3 h-3" /> Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccommodationList;
