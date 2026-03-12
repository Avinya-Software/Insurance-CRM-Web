import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Save, X, Check, AlertCircle } from 'lucide-react';

interface CashflowItem {
  id?: string;
  maturityDate: string;
  amount: string;
  description: string;
  noOfYears?: string;
  isDeleted?: boolean;

}

interface RiderItem {
  id?: string;
  name: string;
  commDate: string;
  sa: string;
  term: string;
  ppt: string;
  yearlyPrem: string;
  isDeleted?: boolean;
}

interface FundItem {
  id?: string;
  fmcName: string;
  fmcPercentage: string;
  fundDate: string;
  unitBalance: string;
  isDeleted?: boolean;
}

interface Props {
  form: any
  setForm: React.Dispatch<React.SetStateAction<any>>
}

export default function PolicyFundInfo({
  form,
  setForm,
}: Props) {
  // UI State
  const [activeSection, setActiveSection] =useState<'cashflows' | 'riders' | 'funds' | null>(null);  const [editingId, setEditingId] = useState<string | null>(null);

  // Local state for inputs
  const [cashflowInput, setCashflowInput] = useState({ maturityDate: '', noOfYears: '', amount: '', description: '' });
  const [riderInput, setRiderInput] = useState({ name: '', commDate: '', sa: '', term: '', ppt: '', yearlyPrem: '' });
  const [fundInput, setFundInput] = useState({ fmcName: '', fmcPercentage: '', fundDate: '', unitBalance: '' });

  // CRUD Handlers
  const handleSaveCashflow = () => {
    if (!cashflowInput.maturityDate || !cashflowInput.amount) return;
  
    setForm((prev: any) => {
      const list = [...(prev.cashflows || [])];
  
      if (editingId) {
        const index = list.findIndex((item) => item.id === editingId);
  
        if (index !== -1) {
          list[index] = {
            ...cashflowInput,
            id: editingId
          };
        }
      } else {
        list.push({
          ...cashflowInput,
          isDeleted:false
        });
      }
  
      return {
        ...prev,
        cashflows: list
      };
    });
  
    resetForm();
  };

  const handleSaveRider = () => {
    if (!riderInput.name || !riderInput.sa) return;
  
    setForm((prev: any) => {
      const list = [...(prev.riders || [])];
  
      if (editingId) {
        const index = list.findIndex((item) => item.id === editingId);
  
        if (index !== -1) {
          list[index] = {
            ...riderInput,
            id: editingId
          };
        }
      } else {
        list.push({
          ...riderInput,
          isdeleted:false
        });
      }
  
      return {
        ...prev,
        riders: list
      };
    });
  
    resetForm();
  };

  const handleSaveFund = () => {
    if (!fundInput.fmcName || !fundInput.unitBalance) return;
  
    setForm((prev: any) => {
      const list = [...(prev.funds || [])];
  
      if (editingId) {
        const index = list.findIndex((item) => item.id === editingId);
  
        if (index !== -1) {
          list[index] = {
            ...fundInput,
            id: editingId
          };
        }
      } else {
        list.push({
          ...fundInput,
          isDeleted:false
        });
      }
  
      return {
        ...prev,
        funds: list
      };
    });
  
    resetForm();
  };

  const resetForm = () => {
    setActiveSection(null);
    setEditingId(null);
    setCashflowInput({ maturityDate: '', noOfYears: '', amount: '', description: '' });
    setRiderInput({ name: '', commDate: '', sa: '', term: '', ppt: '', yearlyPrem: '' });
    setFundInput({ fmcName: '', fmcPercentage: '', fundDate: '', unitBalance: '' });
  };

  const removeItem = (section: 'cashflows' | 'riders' | 'funds', id: string) => {
    setForm((prev: any) => {
      const updated = prev[section].map((item: any) =>
        item.id === id ? { ...item, isDeleted: true } : item
      );
  
      return {
        ...prev,
        [section]: updated
      };
    });
  };


  const startEdit = (section: 'cashflows' | 'riders' | 'funds', item: any) => {
        setActiveSection(section);
    setEditingId(item.id);
    if (section === 'cashflows') setCashflowInput(item);
    if (section === 'riders') setRiderInput(item);
    if (section === 'funds') setFundInput(item);
  };

  return (
    <div className="w-full space-y-6 p-6 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* CASHFLOW DETAILS */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-widest">Cashflow Details</h3>
          {activeSection !== 'cashflows' && (
                        <button 
                        onClick={() => setActiveSection('cashflows')}
                                      className="flex items-center gap-2 px-4 py-1.5 border border-blue-600 text-blue-600 rounded-md text-xs font-bold hover:bg-blue-50 transition-all"
            >
              <Plus size={14} /> Add Item
            </button>
          )}
        </div>

        {activeSection === 'cashflows' && (
                    <div className="p-6 bg-white border-b border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Maturity Date</label>
                <input 
                  type="date" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={cashflowInput.maturityDate}
                  onChange={e => setCashflowInput({...cashflowInput, maturityDate: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">No Of Years</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={cashflowInput.noOfYears}
                  onChange={e => setCashflowInput({...cashflowInput, noOfYears: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount P.A.</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={cashflowInput.amount}
                  onChange={e => setCashflowInput({...cashflowInput, amount: e.target.value})}
                />
              </div>
              <div className="md:col-span-3 space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={cashflowInput.description}
                  onChange={e => setCashflowInput({...cashflowInput, description: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={resetForm} className="flex items-center gap-1.5 text-slate-600 text-xs font-bold hover:text-slate-800">
                <X size={14} /> Cancel
              </button>
              <button 
                onClick={handleSaveCashflow}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-xs font-bold transition-all shadow-sm"
              >
                <Check size={14} /> {editingId ? 'Update Item' : 'Save Item'}
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {(!form.cashflows || form.cashflows.length === 0) && activeSection !== 'cashflows' ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
              <AlertCircle size={40} className="opacity-20 mb-3" />
              <p className="text-sm font-medium">No records found</p>
            </div>
          ) : (
            (form.cashflows || []).filter((item:any)=>!item.isDeleted).map((item: CashflowItem) => (
                            <div key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors group">
                <div className="grid grid-cols-4 gap-8 flex-1">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Maturity Date</p>
                    <p className="text-sm text-slate-700 font-medium">{item.maturityDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Amount</p>
                    <p className="text-sm text-slate-700 font-medium">{item.amount}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">No of year</p>
                    <p className="text-sm text-slate-700 font-medium">{item.noOfYears}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Description</p>
                    <p className="text-sm text-slate-700 font-medium">{item.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit('cashflows', item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => removeItem('cashflows', item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIDER DETAILS */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-widest">Rider Details</h3>
          {activeSection !== 'riders' && (
            <button 
              onClick={() => setActiveSection('riders')}
              className="flex items-center gap-2 px-4 py-1.5 border border-blue-600 text-blue-600 rounded-md text-xs font-bold hover:bg-blue-50 transition-all"
            >
              <Plus size={14} /> Add Item
            </button>
          )}
        </div>

        {activeSection === 'riders' && (
          <div className="p-6 bg-white border-b border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rider Name</label>
                <select 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={riderInput.name}
                  onChange={e => setRiderInput({...riderInput, name: e.target.value})}
                >
                  <option value="">Select Rider</option>
                  <option value="Accidental Death">Accidental Death</option>
                  <option value="Critical Illness">Critical Illness</option>
                  <option value="Waiver of Premium">Waiver of Premium</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Comm Date</label>
                <input 
                  type="date" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={riderInput.commDate}
                  onChange={e => setRiderInput({...riderInput, commDate: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sum Assured (SA)</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={riderInput.sa}
                  onChange={e => setRiderInput({...riderInput, sa: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Term</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={riderInput.term}
                  onChange={e => setRiderInput({...riderInput, term: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">PPT</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={riderInput.ppt}
                  onChange={e => setRiderInput({...riderInput, ppt: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Yearly Premium</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={riderInput.yearlyPrem}
                  onChange={e => setRiderInput({...riderInput, yearlyPrem: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={resetForm} className="flex items-center gap-1.5 text-slate-600 text-xs font-bold hover:text-slate-800">
                <X size={14} /> Cancel
              </button>
              <button 
                onClick={handleSaveRider}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-xs font-bold transition-all shadow-sm"
              >
                <Check size={14} /> {editingId ? 'Update Item' : 'Save Item'}
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {(!form.riders || form.riders.length === 0) && activeSection !== 'riders' ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
              <AlertCircle size={40} className="opacity-20 mb-3" />
              <p className="text-sm font-medium">No records found</p>
            </div>
          ) : (
            (form.riders || []).filter((item:any)=>!item.isDeleted).map((item: RiderItem) => (
              <div key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors group">
                <div className="grid grid-cols-3 gap-8 flex-1">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Rider Name</p>
                    <p className="text-sm text-slate-700 font-medium">{item.name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">commDate</p>
                    <p className="text-sm text-slate-700 font-medium">{item.commDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">SumAssured</p>
                    <p className="text-sm text-slate-700 font-medium">{item.sa}</p>
                  </div>
                  
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Term</p>
                    <p className="text-sm text-slate-700 font-medium">{item.term}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">ppt</p>
                    <p className="text-sm text-slate-700 font-medium">{item.ppt}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Yearly Premium</p>
                    <p className="text-sm text-slate-700 font-medium">{item.yearlyPrem}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit('riders', item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => removeItem('riders', item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FUND DETAILS */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-widest">Fund Details</h3>
          {activeSection !== 'funds' && (
            <button 
              onClick={() => setActiveSection('funds')}
              className="flex items-center gap-2 px-4 py-1.5 border border-blue-600 text-blue-600 rounded-md text-xs font-bold hover:bg-blue-50 transition-all"
            >
              <Plus size={14} /> Add Item
            </button>
          )}
        </div>

        {activeSection === 'funds' && (
          <div className="p-6 bg-white border-b border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">FMC Name</label>
                <select 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={fundInput.fmcName}
                  onChange={e => setFundInput({...fundInput, fmcName: e.target.value})}
                >
                  <option value="">Select FMC</option>
                  <option value="HDFC Life">HDFC Life</option>
                  <option value="ICICI Pru">ICICI Pru</option>
                  <option value="SBI Life">SBI Life</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">FMC Percentage</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={fundInput.fmcPercentage}
                  onChange={e => setFundInput({...fundInput, fmcPercentage: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fund Date</label>
                <input 
                  type="date" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={fundInput.fundDate}
                  onChange={e => setFundInput({...fundInput, fundDate: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit Balance</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  value={fundInput.unitBalance}
                  onChange={e => setFundInput({...fundInput, unitBalance: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={resetForm} className="flex items-center gap-1.5 text-slate-600 text-xs font-bold hover:text-slate-800">
                <X size={14} /> Cancel
              </button>
              <button 
                onClick={handleSaveFund}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-xs font-bold transition-all shadow-sm"
              >
                <Check size={14} /> {editingId ? 'Update Item' : 'Save Item'}
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-100">
          {(!form.funds || form.funds.length === 0) && activeSection !== 'funds' ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
              <AlertCircle size={40} className="opacity-20 mb-3" />
              <p className="text-sm font-medium">No records found</p>
            </div>
          ) : (
            (form.funds || []).filter((item:any)=>!item.isDeleted).map((item: FundItem) => (
              <div key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors group">
                <div className="grid grid-cols-4 gap-8 flex-1">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">FMC Name</p>
                    <p className="text-sm text-slate-700 font-medium">{item.fmcName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Percentage</p>
                    <p className="text-sm text-slate-700 font-medium">{item.fmcPercentage}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Fund Date</p>
                    <p className="text-sm text-slate-700 font-medium">{item.fundDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Unit Balance</p>
                    <p className="text-sm text-slate-700 font-medium">{item.unitBalance}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit('funds', item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => removeItem('funds', item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
