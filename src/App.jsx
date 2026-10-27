import React, { useState, useEffect } from 'react';
import { 
  FileText, LayoutDashboard, PlusCircle, Search, Settings, Filter, Download, 
  Edit, Trash2, ShieldAlert, Truck, Car as CarIcon, Bike, FilePlus, ChevronRight, 
  ChevronLeft, CheckCircle2, AlertCircle, X, Check, Lock, LogOut, FileCheck, UploadCloud,
  Send, User, Clock, CheckSquare, Trash, Database
} from 'lucide-react';

const CAR_IMG = 'Car.jpg';
const LORRY_IMG = 'Lorry.jpg';
const BIKE_IMG = 'Motocycle.png';
const THREE_WHEELER_IMG = 'Three-wheeler.png';

// --- MOCK DATA ---
const INITIAL_DATA = [
  { id: '1', contractNo: 'CNT-23-001', vehicleNo: 'SP-BJK-1182', clientName: 'Saman Kumara', vehicleType: 'Motorcycle', status: 'ACTIVE', trs: false, seizerName: 'Mr. K.A.P Indika', outstanding: '450000', seizerFee: '25000', isSold: 'No', soldAmount: '', currentBalance: '450000', paidAmount: '', seizerPaid: 'No', docs: 'MTA6' },
  { id: '2', contractNo: 'CNT-23-089', vehicleNo: 'WP-CBA-9921', clientName: 'Nimal Perera', vehicleType: 'Car', status: 'SEIZED', trs: true, seizerName: 'MR. N.G.C. MENDIS', outstanding: '1200000', seizerFee: '50000', isSold: 'No', soldAmount: '', currentBalance: '1200000', paidAmount: '', seizerPaid: 'No', docs: 'MTA6, ID Copy' },
  { id: '3', contractNo: 'CNT-23-105', vehicleNo: 'CP-TXY-4451', clientName: 'Kamal Addaraarachchi', vehicleType: 'Three-wheeler', status: 'CLOSED', trs: false, seizerName: 'Mr. K.A.P Indika', outstanding: '650000', seizerFee: '30000', isSold: 'Yes', soldAmount: '600000', currentBalance: '50000', paidAmount: '650000', seizerPaid: 'Yes', docs: 'HForm' },
  { id: '4', contractNo: 'CNT-23-210', vehicleNo: 'EP-LD-8832', clientName: 'De Silva', vehicleType: 'Lorry', status: 'SEIZED', trs: false, seizerName: 'MR. N.G.C. MENDIS', outstanding: '3500000', seizerFee: '85000', isSold: 'No', soldAmount: '', currentBalance: '3500000', paidAmount: '100000', seizerPaid: 'No', docs: 'ID Copy' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Load data from localStorage or use initial data
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('wgYardData');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [yardFiles, setYardFiles] = useState(() => {
    const saved = localStorage.getItem('wgYardFilesData');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem('wgYardData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('wgYardFilesData', JSON.stringify(yardFiles));
  }, [yardFiles]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ user: '', pass: '' });

  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState({
    contractNo: '', trs: false, clientName: '', vehicleNo: '', vehicleType: 'Motorcycle',
    seizerName: '', seizerID: '', orderStatus: 'ACTIVE', seizedDate: '', yardLocation: 'Kandy Yard',
    outstanding: '', seizerFee: '', isSold: 'No', soldAmount: '', currentBalance: '',
    paidAmount: '', paidDate: '', paymentComplete: 'No', seizerPaid: 'No', specialApproval: false,
    docsMTA6: false, docsID: false, docsHForm: false, docsLetter: false, remarks: ''
  });

  // Yard Files Form State
  const [yardFormData, setYardFormData] = useState({
    contractNo: '', vehicleNo: '', sentDate: '', sentMTA6: false, sentIDCopy: false
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginCreds.user === 'Admin' && loginCreds.pass === '901001') {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginCreds({ user: '', pass: '' });
    } else {
      alert("Invalid Credentials");
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleYardFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setYardFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitForm = () => {
    if(!formData.contractNo || !formData.vehicleNo) {
        alert("Contract No and Vehicle No are required.");
        return;
    }
    const newEntry = {
      id: Date.now().toString(),
      contractNo: formData.contractNo,
      vehicleNo: formData.vehicleNo,
      clientName: formData.clientName || 'Unknown',
      vehicleType: formData.vehicleType,
      status: formData.orderStatus,
      trs: formData.trs,
      seizerName: formData.seizerName,
      outstanding: formData.outstanding || '0',
      seizerFee: formData.seizerFee || '0',
      isSold: formData.isSold,
      soldAmount: formData.soldAmount || '0',
      currentBalance: formData.currentBalance || '0',
      paidAmount: formData.paidAmount || '0',
      seizerPaid: formData.seizerPaid,
      docs: [
        formData.docsMTA6 ? 'MTA6' : '',
        formData.docsID ? 'ID Copy' : '',
        formData.docsHForm ? 'HForm' : '',
        formData.docsLetter ? 'Handing Over Letter' : ''
      ].filter(Boolean).join(', ')
    };
    setData([newEntry, ...data]);
    setActiveTab('dashboard');
    alert("New Entry Added Successfully!");
    
    // Reset Form
    setWizardStep(1);
    setFormData({
        contractNo: '', trs: false, clientName: '', vehicleNo: '', vehicleType: 'Motorcycle',
        seizerName: '', seizerID: '', orderStatus: 'ACTIVE', seizedDate: '', yardLocation: 'Kandy Yard',
        outstanding: '', seizerFee: '', isSold: 'No', soldAmount: '', currentBalance: '',
        paidAmount: '', paidDate: '', paymentComplete: 'No', seizerPaid: 'No', specialApproval: false,
        docsMTA6: false, docsID: false, docsHForm: false, docsLetter: false, remarks: ''
    });
  };

  const submitYardForm = () => {
    if(!yardFormData.contractNo || !yardFormData.vehicleNo || !yardFormData.sentDate) {
        alert("Please fill all required fields.");
        return;
    }
    const newYardEntry = {
        id: Date.now().toString(),
        contractNo: yardFormData.contractNo,
        vehicleNo: yardFormData.vehicleNo,
        sentDate: yardFormData.sentDate,
        docs: [
            yardFormData.sentMTA6 ? 'MTA6' : '',
            yardFormData.sentIDCopy ? 'ID Copy' : ''
        ].filter(Boolean).join(', ')
    };
    setYardFiles([newYardEntry, ...yardFiles]);
    alert("Yard File Record Saved!");
    setYardFormData({ contractNo: '', vehicleNo: '', sentDate: '', sentMTA6: false, sentIDCopy: false });
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this record?")) {
        setData(data.filter(item => item.id !== id));
    }
  };

  const handleResetData = () => {
    if(window.confirm("WARNING: This will permanently delete ALL data in the system. Are you absolutely sure?")) {
        localStorage.removeItem('wgYardData');
        localStorage.removeItem('wgYardFilesData');
        setData([]);
        setYardFiles([]);
        alert("All system data has been reset.");
    }
  };

  const filteredData = data.filter(item => 
    item.contractNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVehicleImage = (type) => {
    switch (type) {
      case 'Car': return CAR_IMG;
      case 'Motorcycle': return BIKE_IMG;
      case 'Three-wheeler': return THREE_WHEELER_IMG;
      case 'Lorry': return LORRY_IMG;
      default: return CAR_IMG;
    }
  };

  const statusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'SEIZED': return 'text-red-700 bg-red-100 border-red-200';
      case 'CLOSED': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const countType = (type) => data.filter(d => d.vehicleType === type).length;

  return (
    <div className="flex h-screen bg-[#f4f7fb] text-slate-800 font-sans selection:bg-purple-500/30">
      
      {/* Soft Light Sidebar */}
      <aside className="w-64 bg-[#7a3aec] rounded-r-3xl my-4 ml-4 shadow-2xl flex flex-col justify-between relative z-20 overflow-hidden text-white">
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        
        <div>
          <div className="h-24 flex items-center justify-center border-b border-white/10 mx-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#7a3aec] flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-white font-bold tracking-wider text-sm mt-2">WG YARD</h1>
            </div>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-white text-[#7a3aec] shadow-lg scale-105' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('new')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${activeTab === 'new' ? 'bg-white text-[#7a3aec] shadow-lg scale-105' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <PlusCircle className="w-5 h-5" /> New Entry
            </button>
            <button 
              onClick={() => setActiveTab('yardfiles')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${activeTab === 'yardfiles' ? 'bg-white text-[#7a3aec] shadow-lg scale-105' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <Send className="w-5 h-5" /> Send to Yard
            </button>
            
            {isAdmin && (
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 mt-8 ${activeTab === 'settings' ? 'bg-white text-red-500 shadow-lg scale-105' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                >
                  <Settings className="w-5 h-5" /> System Settings
                </button>
            )}
          </nav>
        </div>

        {/* User / Admin Toggle */}
        <div className="p-6">
           {isAdmin ? (
             <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <User className="w-5 h-5 text-[#7a3aec]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Admin User</span>
                    <span className="text-[10px] text-white/70">Full Access</span>
                  </div>
               </div>
               <button onClick={() => setIsAdmin(false)} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold bg-white/20 hover:bg-red-500 rounded-xl transition-all">
                 <LogOut className="w-3 h-3" /> LOGOUT
               </button>
             </div>
           ) : (
             <button onClick={() => setShowLogin(true)} className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-white bg-white/20 rounded-xl hover:bg-white hover:text-[#7a3aec] transition-all">
               <Lock className="w-4 h-4" /> LOGIN AS ADMIN
             </button>
           )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden px-4">
        
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-6 pt-4">
          <div className="relative w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Contract, Vehicle No..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-none shadow-sm rounded-full pl-12 pr-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7a3aec]/30 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-semibold">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
             </div>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 shadow-sm rounded-full text-xs font-bold hover:shadow-md transition-all">
               <Download className="w-4 h-4" /> EXPORT EXCEL
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar">
          
          {activeTab === 'dashboard' && (
            <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Greeting & Welcome Card */}
              <div className="bg-[#fef3c7] rounded-3xl p-8 flex justify-between items-center shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-amber-900 mb-2">Hello, Team!</h2>
                    <p className="text-amber-700/80 text-sm max-w-md">Welcome back to the WG Yard Journal. Ensure all entries are accurate and up-to-date. Have a great day ahead!</p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-amber-200/50 rounded-full blur-3xl -z-0"></div>
              </div>

              {/* Category KPIs - Modern Soft Cards */}
              <div className="grid grid-cols-5 gap-6">
                {[
                  { label: 'Motorcycles', count: countType('Motorcycle'), icon: Bike, color: 'text-[#7a3aec]', bg: 'bg-[#7a3aec]' },
                  { label: 'Three-Wheelers', count: countType('Three-wheeler'), icon: CarIcon, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]' },
                  { label: 'Cars', count: countType('Car'), icon: CarIcon, color: 'text-[#0ea5e9]', bg: 'bg-[#0ea5e9]' },
                  { label: 'Lorries', count: countType('Lorry'), icon: Truck, color: 'text-[#10b981]', bg: 'bg-[#10b981]' },
                  { label: 'Total Seized', count: data.filter(d => d.status === 'SEIZED').length, icon: ShieldAlert, color: 'text-[#ef4444]', bg: 'bg-[#ef4444]' }
                ].map((kpi, idx) => (
                  <div key={idx} className={`${kpi.bg} p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:scale-105 transition-all duration-300 cursor-default`}>
                    <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/20 rounded-full"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <kpi.icon className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-1 relative z-10">{kpi.count}</h3>
                    <p className="text-sm font-semibold text-white/80 relative z-10">{kpi.label}</p>
                  </div>
                ))}
              </div>

              {/* Data Grid */}
              <div className="bg-white rounded-3xl shadow-sm flex flex-col h-[550px] overflow-hidden border border-slate-100">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-800">Master Intelligence Grid</h2>
                  <span className="text-xs font-bold text-[#7a3aec] bg-[#7a3aec]/10 px-4 py-1.5 rounded-full">
                    {filteredData.length} Matches Found
                  </span>
                </div>
                
                <div className="flex-1 overflow-auto custom-scrollbar relative">
                  <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 sticky top-0 z-20">
                      <tr>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider sticky left-0 z-30 bg-slate-50 border-b border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Contract No</th>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider sticky left-[150px] z-30 bg-slate-50 border-b border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Vehicle No</th>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Client Name</th>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Vehicle Type</th>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Status</th>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-right">Outstanding</th>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Sold</th>
                        <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Documents</th>
                        {isAdmin && <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredData.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="p-5 font-mono font-semibold text-[#7a3aec] sticky left-0 z-10 bg-white group-hover:bg-slate-50/80 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">{row.contractNo}</td>
                          <td className="p-5 font-bold text-slate-700 sticky left-[150px] z-10 bg-white group-hover:bg-slate-50/80 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">{row.vehicleNo}</td>
                          <td className="p-5 text-slate-600 font-medium">{row.clientName}</td>
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-8 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                <img src={getVehicleImage(row.vehicleType)} alt={row.vehicleType} className="w-full h-full object-cover" />
                              </div>
                              <span className="font-semibold text-slate-700">{row.vehicleType}</span>
                            </div>
                          </td>
                          <td className="p-5">
                            <span className={`px-3 py-1.5 text-[10px] font-bold rounded-full border ${row.trs ? 'text-purple-700 bg-purple-100 border-purple-200' : statusColor(row.status)}`}>
                              {row.trs ? 'TRS' : row.status}
                            </span>
                          </td>
                          <td className="p-5 text-right font-mono font-semibold text-slate-600">Rs. {Number(row.outstanding).toLocaleString()}</td>
                          <td className="p-5 text-center">
                            {row.isSold === 'Yes' ? <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div> : <span className="text-slate-300 font-bold">-</span>}
                          </td>
                          <td className="p-5">
                            <div className="flex gap-1.5 flex-wrap w-48">
                              {row.docs ? row.docs.split(', ').map((doc, i) => (
                                <span key={i} className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-1 rounded-md border border-slate-200">{doc}</span>
                              )) : <span className="text-slate-300 font-bold">-</span>}
                            </div>
                          </td>
                          {isAdmin && (
                            <td className="p-5 text-center">
                              <div className="flex justify-center gap-3">
                                <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(row.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredData.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                          <Database className="w-12 h-12 mb-4 opacity-20" />
                          <p className="font-medium">No records found matching your search.</p>
                      </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'new' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500 pt-6">
              <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 relative overflow-hidden">
                {/* Decorative header */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#7a3aec] via-[#0ea5e9] to-[#10b981]"></div>
                
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-black text-slate-800">New Journal Entry</h2>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Map seized vehicle details carefully into the central database.</p>
                </div>

                {/* Wizard Progress - Modern Pill Style */}
                <div className="flex justify-between mb-12 relative px-4">
                  <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>
                  {[1, 2, 3, 4].map(step => (
                    <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-sm ${wizardStep === step ? 'bg-[#7a3aec] text-white ring-4 ring-[#7a3aec]/20 scale-110' : wizardStep > step ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {wizardStep > step ? <Check className="w-6 h-6" /> : step}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Area - Soft inputs */}
                <div className="min-h-[300px]">
                  {/* Step 1 */}
                  {wizardStep === 1 && (
                    <div className="space-y-6 animate-in fade-in">
                      <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2"><User className="w-5 h-5 text-[#7a3aec]"/> Client & Basic Details</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Contract No *</label>
                          <input type="text" name="contractNo" value={formData.contractNo} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-[#7a3aec] focus:ring-2 focus:ring-[#7a3aec]/20 outline-none uppercase font-mono font-semibold transition-all" placeholder="Ex: CNT-23-001" required/>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Vehicle No *</label>
                          <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-[#7a3aec] focus:ring-2 focus:ring-[#7a3aec]/20 outline-none uppercase font-mono font-semibold transition-all" placeholder="Ex: SP-BJK-1182" required/>
                        </div>
                        <div className="space-y-2 col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Client Name</label>
                          <input type="text" name="clientName" value={formData.clientName} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-[#7a3aec] focus:ring-2 focus:ring-[#7a3aec]/20 outline-none font-medium transition-all" placeholder="Full Name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Vehicle Category</label>
                          <select name="vehicleType" value={formData.vehicleType} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-[#7a3aec] focus:ring-2 focus:ring-[#7a3aec]/20 outline-none font-semibold transition-all cursor-pointer">
                            <option>Motorcycle</option>
                            <option>Three-wheeler</option>
                            <option>Car</option>
                            <option>Lorry</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-3 pt-8 ml-2">
                          <input type="checkbox" id="trs" name="trs" checked={formData.trs} onChange={handleFormChange} className="w-5 h-5 accent-[#7a3aec] cursor-pointer" />
                          <label htmlFor="trs" className="text-sm font-bold text-slate-600 cursor-pointer select-none">Mark as TRS Status</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {wizardStep === 2 && (
                    <div className="space-y-6 animate-in fade-in">
                      <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-[#f59e0b]"/> Seizer Information</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Seizer Name</label>
                          <select name="seizerName" value={formData.seizerName} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-[#7a3aec] focus:ring-2 focus:ring-[#7a3aec]/20 outline-none font-semibold transition-all cursor-pointer">
                            <option value="">Select Seizer</option>
                            <option value="Mr. K.A.P Indika">Mr. K.A.P Indika</option>
                            <option value="MR. N.G.C. MENDIS">MR. N.G.C. MENDIS</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Seized Date</label>
                          <input type="date" name="seizedDate" value={formData.seizedDate} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-[#7a3aec] focus:ring-2 focus:ring-[#7a3aec]/20 outline-none font-medium transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Yard Location</label>
                          <select name="yardLocation" value={formData.yardLocation} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-[#7a3aec] focus:ring-2 focus:ring-[#7a3aec]/20 outline-none font-semibold transition-all cursor-pointer">
                            <option>Kandy Yard</option>
                            <option>Galle Yard</option>
                            <option>Colombo Yard</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {wizardStep === 3 && (
                    <div className="space-y-6 animate-in fade-in">
                      <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-[#0ea5e9]"/> Financials & Sales</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Total Outstanding (Rs.)</label>
                          <input type="number" name="outstanding" value={formData.outstanding} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-2xl font-black text-[#0ea5e9] focus:bg-white focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 outline-none transition-all" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Seizer Fee (Rs.)</label>
                          <input type="number" name="seizerFee" value={formData.seizerFee} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-[#7a3aec] outline-none font-mono font-semibold transition-all" placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Vehicle Sold?</label>
                          <select name="isSold" value={formData.isSold} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-[#7a3aec] outline-none font-semibold transition-all cursor-pointer">
                            <option>No</option>
                            <option>Yes</option>
                          </select>
                        </div>
                        
                        {formData.isSold === 'Yes' && (
                          <>
                            <div className="space-y-2 animate-in slide-in-from-top-2">
                              <label className="text-xs font-bold text-emerald-600 uppercase tracking-wider ml-1">Sold Amount (Rs.)</label>
                              <input type="number" name="soldAmount" value={formData.soldAmount} onChange={handleFormChange} className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-emerald-700 font-mono font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="0.00" />
                            </div>
                            <div className="space-y-2 animate-in slide-in-from-top-2">
                              <label className="text-xs font-bold text-rose-500 uppercase tracking-wider ml-1">Current Balance / Loss (Rs.)</label>
                              <input type="number" name="currentBalance" value={formData.currentBalance} onChange={handleFormChange} className="w-full bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-600 font-mono font-bold outline-none focus:ring-2 focus:ring-rose-500/20 transition-all" placeholder="0.00" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 4 */}
                  {wizardStep === 4 && (
                    <div className="space-y-6 animate-in fade-in">
                      <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-[#10b981]"/> Documents & Approvals</h3>
                      
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-4 items-start">
                        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800 font-medium">Payment sections can be skipped during initial entry and updated later. Use <strong className="text-blue-600 font-bold">Special Approval</strong> if releasing over tariff.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collected Documents</label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { name: 'docsMTA6', label: 'MTA6 Form' },
                              { name: 'docsID', label: 'ID Copy' },
                              { name: 'docsHForm', label: 'H Form' },
                              { name: 'docsLetter', label: 'Handover Letter' }
                            ].map(doc => (
                              <label key={doc.name} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData[doc.name] ? 'bg-[#7a3aec]/10 border-[#7a3aec] text-[#7a3aec]' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                                <input type="checkbox" name={doc.name} checked={formData[doc.name]} onChange={handleFormChange} className="hidden" />
                                <FileCheck className={`w-5 h-5 ${formData[doc.name] ? 'text-[#7a3aec]' : 'text-slate-400'}`} />
                                <span className="text-sm font-bold">{doc.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Post-Entry Actions</label>
                          
                          <label className="flex items-center justify-between p-4 rounded-xl border-2 bg-rose-50 border-rose-100 cursor-pointer hover:border-rose-200 transition-all">
                            <span className="text-sm font-bold text-rose-600">SPECIAL APPROVAL (OVER TARIFF)</span>
                            <input type="checkbox" name="specialApproval" checked={formData.specialApproval} onChange={handleFormChange} className="w-5 h-5 accent-rose-500 cursor-pointer" />
                          </label>

                          <div className="flex gap-4">
                             <div className="flex-1 space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Client Paid?</label>
                               <select name="paymentComplete" value={formData.paymentComplete} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#7a3aec]">
                                 <option>No</option><option>Yes</option>
                               </select>
                             </div>
                             <div className="flex-1 space-y-2">
                               <label className="text-xs font-bold text-slate-500 uppercase">Seizer Paid?</label>
                               <select name="seizerPaid" value={formData.seizerPaid} onChange={handleFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#7a3aec]">
                                 <option>No</option><option>Yes</option>
                               </select>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Wizard Controls */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center relative z-10">
                  <button 
                    onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                    disabled={wizardStep === 1}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 flex items-center gap-2 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  
                  {wizardStep < 4 ? (
                    <button 
                      onClick={() => setWizardStep(prev => Math.min(4, prev + 1))}
                      className="px-8 py-3 bg-[#7a3aec] hover:bg-[#6d30d8] text-white rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-[#7a3aec]/30 hover:shadow-xl hover:shadow-[#7a3aec]/40 transition-all hover:-translate-y-0.5"
                    >
                      Next Step <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button 
                      onClick={submitForm}
                      className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all hover:-translate-y-0.5"
                    >
                      <FilePlus className="w-5 h-5" /> Save Final Entry
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'yardfiles' && (
            <div className="max-w-6xl mx-auto pt-6 animate-in fade-in slide-in-from-right-8 duration-500 flex gap-6">
                
                {/* Send Form */}
                <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-fit sticky top-0">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                            <Send className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">Send Files To Yard</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Record documents dispatched to the yard.</p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Contract No *</label>
                          <input type="text" name="contractNo" value={yardFormData.contractNo} onChange={handleYardFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none uppercase font-mono font-semibold transition-all" placeholder="Enter Contract No" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Vehicle No *</label>
                          <input type="text" name="vehicleNo" value={yardFormData.vehicleNo} onChange={handleYardFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none uppercase font-mono font-semibold transition-all" placeholder="Enter Vehicle No" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date Sent *</label>
                          <input type="date" name="sentDate" value={yardFormData.sentDate} onChange={handleYardFormChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none font-semibold transition-all" />
                        </div>

                        <div className="pt-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-3 block">Documents Included</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${yardFormData.sentMTA6 ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                                    <input type="checkbox" name="sentMTA6" checked={yardFormData.sentMTA6} onChange={handleYardFormChange} className="hidden" />
                                    <CheckCircle2 className={`w-5 h-5 ${yardFormData.sentMTA6 ? 'text-blue-600' : 'text-slate-300'}`} />
                                    <span className="font-bold">MTA 6 Form</span>
                                </label>
                                <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${yardFormData.sentIDCopy ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                                    <input type="checkbox" name="sentIDCopy" checked={yardFormData.sentIDCopy} onChange={handleYardFormChange} className="hidden" />
                                    <CheckCircle2 className={`w-5 h-5 ${yardFormData.sentIDCopy ? 'text-blue-600' : 'text-slate-300'}`} />
                                    <span className="font-bold">ID Copy</span>
                                </label>
                            </div>
                        </div>

                        <button onClick={submitYardForm} className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm tracking-wide flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
                            <Send className="w-5 h-5" /> Record Dispatch
                        </button>
                    </div>
                </div>

                {/* Dispatch History List */}
                <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Dispatch History</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 max-h-[600px]">
                        {yardFiles.length === 0 ? (
                            <div className="text-center text-slate-400 py-10">No dispatches recorded yet.</div>
                        ) : (
                            yardFiles.map(file => (
                                <div key={file.id} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex justify-between items-center hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono font-bold text-blue-700 text-sm">{file.contractNo}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="font-bold text-slate-700 text-sm">{file.vehicleNo}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {file.sentDate}</span>
                                            {file.docs && (
                                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                                                    {file.docs}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-500 border border-slate-100">
                                        <Check className="w-5 h-5" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
          )}

          {activeTab === 'settings' && isAdmin && (
              <div className="max-w-3xl mx-auto pt-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                      <h2 className="text-2xl font-black text-slate-800 mb-6">System Settings</h2>
                      
                      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
                          <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0">
                                  <Trash className="w-6 h-6" />
                              </div>
                              <div>
                                  <h3 className="text-lg font-bold text-rose-700 mb-1">Factory Reset Data</h3>
                                  <p className="text-sm text-rose-600/80 mb-4 font-medium">This will permanently delete all Journal entries and Yard File records from the local database. This action cannot be undone.</p>
                                  <button onClick={handleResetData} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-500/30 transition-all">
                                      Delete All Data
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )}
        </div>
      </main>

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white p-8 rounded-3xl w-96 shadow-2xl animate-in zoom-in-95 border border-slate-100">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#7a3aec]/10 text-[#7a3aec] rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">Admin Login</h3>
                </div>
                <button onClick={() => setShowLogin(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleLogin} className="space-y-5">
               <div>
                   <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Username</label>
                   <input type="text" value={loginCreds.user} onChange={(e) => setLoginCreds({...loginCreds, user: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:bg-white focus:border-[#7a3aec] focus:ring-2 focus:ring-[#7a3aec]/20 outline-none font-semibold transition-all" required />
               </div>
               <div>
                   <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Password</label>
                   <input type="password" value={loginCreds.pass} onChange={(e) => setLoginCreds({...loginCreds, pass: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 focus:bg-white focus:border-[#7a3aec] focus:ring-2 focus:ring-[#7a3aec]/20 outline-none font-semibold transition-all" required />
               </div>
               <button type="submit" className="w-full bg-[#7a3aec] hover:bg-[#6d30d8] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#7a3aec]/30 transition-all mt-4">Authenticate</button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
