import React, { useState, useEffect, useRef, Component } from 'react';

// --- ERROR BOUNDARY (White Screen සම්පූර්ණයෙන්ම වළක්වයි) ---
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">පරණ Cache දත්ත ඉවත් කිරීම</h2>
            <p className="text-sm text-slate-500 mb-6">පරණ දත්ත නිසා ඇතිවූ ගැටලුවකි. පහත බොත්තම ඔබා Reset කරන්න.</p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-3 bg-[#7a3aec] text-white font-bold rounded-xl shadow-lg"
            >
              Clear Cache & Open App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- INLINE SVG ICONS ---
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />,
    send: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  };

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name] || icons.dashboard}
    </svg>
  );
};

const COMPANY_LOGO = 'Compnay Logo.jpg';
const CAR_IMG = 'Car.jpg';
const LORRY_IMG = 'Lorry.jpg';
const BIKE_IMG = 'Motocycle.png';
const THREE_WHEELER_IMG = 'Three-wheeler.png';

const INITIAL_SEIZERS = [
  { id: '1', name: 'Mr. K.A.P Indika', nic: '781032786v', phone: '0771234567' },
  { id: '2', name: 'MR. N.G.C. MENDIS', nic: '923572619v', phone: '0719876543' }
];

const INITIAL_DATA = [
  { id: '1', contractNo: 'WGFBA055203', vehicleNo: 'SP-BJK-1182', clientName: 'Saman Kumara', vehicleType: 'Motorcycle', actionType: 'Seized', yardLocation: 'Kurunegala Yard', offsiteBranch: '', status: 'ACTIVE', trs: false, seizerName: 'Mr. K.A.P Indika', outstanding: '450000', seizerFee: '25000', isSold: 'No', soldAmount: '0', currentBalance: '450000', clientPaid: 'No', seizerPaymentStatus: 'Pending', docs: 'MTA6' }
];

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const fileInputRef = useRef(null);

  // Safe LocalStorage Loader
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('wgYard_clean_v7');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_DATA;
  });

  const [seizers, setSeizers] = useState(() => {
    try {
      const saved = localStorage.getItem('wgSeizers_clean_v7');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_SEIZERS;
  });

  const [yardFiles, setYardFiles] = useState(() => {
    try {
      const saved = localStorage.getItem('wgYardFiles_clean_v7');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try { localStorage.setItem('wgYard_clean_v7', JSON.stringify(data)); } catch (e) {}
  }, [data]);

  useEffect(() => {
    try { localStorage.setItem('wgSeizers_clean_v7', JSON.stringify(seizers)); } catch (e) {}
  }, [seizers]);

  useEffect(() => {
    try { localStorage.setItem('wgYardFiles_clean_v7', JSON.stringify(yardFiles)); } catch (e) {}
  }, [yardFiles]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ user: '', pass: '' });

  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState({
    actionType: 'Seized',
    contractNo: '', trs: false, clientName: '', vehicleNo: '', vehicleType: 'Motorcycle',
    seizerName: '', seizerID: '', orderStatus: 'ACTIVE', seizedDate: '',
    yardLocation: 'Kurunegala Yard', offsiteBranch: '',
    outstanding: '', seizerFee: '', isSold: 'No', soldAmount: '', currentBalance: '',
    clientPaid: 'No', seizerPaymentStatus: 'Pending', specialApproval: false,
    docsMTA6: false, docsID: false, docsHForm: false, docsLetter: false, remarks: ''
  });

  const [newSeizer, setNewSeizer] = useState({ name: '', nic: '', phone: '' });

  const [yardDispatch, setYardDispatch] = useState({
    contractNo: '', vehicleNo: '', toWhom: '', epfNo: '', sentDate: '', sentMTA6: false, sentIDCopy: false
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginCreds.user === 'Admin' && loginCreds.pass === '901001') {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginCreds({ user: '', pass: '' });
    } else {
      alert("වලංගු නොවන Admin තොරතුරු!");
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitNewSeizer = (e) => {
    e.preventDefault();
    if (!newSeizer.name || !newSeizer.nic) {
      alert("කරුණාකර Seizer ගේ නම සහ ID අංකය ඇතුළත් කරන්න.");
      return;
    }
    const added = { id: Date.now().toString(), ...newSeizer };
    setSeizers(prev => [...prev, added]);
    setNewSeizer({ name: '', nic: '', phone: '' });
    alert("අලුත් Seizer සාර්ථකව පද්ධතියට එක් කරන ලදී!");
  };

  const submitForm = () => {
    if (!formData.contractNo || !formData.vehicleNo) {
      alert("Contract No සහ Vehicle No අනිවාර්යයෙන්ම ඇතුළත් කළ යුතුය.");
      return;
    }
    const newEntry = {
      id: Date.now().toString(),
      actionType: formData.actionType || 'Seized',
      contractNo: formData.contractNo,
      vehicleNo: formData.vehicleNo,
      clientName: formData.clientName || 'N/A',
      vehicleType: formData.vehicleType || 'Motorcycle',
      status: formData.orderStatus || 'ACTIVE',
      trs: !!formData.trs,
      seizerName: formData.seizerName || '',
      yardLocation: formData.yardLocation || 'Kurunegala Yard',
      offsiteBranch: formData.yardLocation === 'Offsite Yard' ? formData.offsiteBranch : '',
      outstanding: formData.outstanding || '0',
      seizerFee: formData.seizerFee || '0',
      isSold: formData.isSold || 'No',
      soldAmount: formData.soldAmount || '0',
      currentBalance: formData.currentBalance || '0',
      clientPaid: formData.clientPaid || 'No',
      seizerPaymentStatus: formData.seizerPaymentStatus || 'Pending',
      docs: [
        formData.docsMTA6 ? 'MTA6' : '',
        formData.docsID ? 'ID Copy' : '',
        formData.docsHForm ? 'HForm' : '',
        formData.docsLetter ? 'Handing Over Letter' : ''
      ].filter(Boolean).join(', ')
    };

    setData(prev => [newEntry, ...prev]);
    setActiveTab('dashboard');
    setWizardStep(1);
    setFormData({
      actionType: 'Seized', contractNo: '', trs: false, clientName: '', vehicleNo: '', vehicleType: 'Motorcycle',
      seizerName: '', seizerID: '', orderStatus: 'ACTIVE', seizedDate: '', yardLocation: 'Kurunegala Yard', offsiteBranch: '',
      outstanding: '', seizerFee: '', isSold: 'No', soldAmount: '', currentBalance: '',
      clientPaid: 'No', seizerPaymentStatus: 'Pending', specialApproval: false,
      docsMTA6: false, docsID: false, docsHForm: false, docsLetter: false, remarks: ''
    });
    alert("දත්ත සාර්ථකව ඇතුළත් කරන ලදී!");
  };

  const submitYardDispatch = (e) => {
    e.preventDefault();
    if (!yardDispatch.contractNo || !yardDispatch.vehicleNo || !yardDispatch.toWhom || !yardDispatch.epfNo) {
      alert("කරුණාකර සියලුම තොරතුරු සම්පූර්ණ කරන්න.");
      return;
    }
    const newDispatch = {
      id: Date.now().toString(),
      ...yardDispatch,
      docs: [yardDispatch.sentMTA6 ? 'MTA6' : '', yardDispatch.sentIDCopy ? 'ID Copy' : ''].filter(Boolean).join(', ')
    };
    setYardFiles(prev => [newDispatch, ...prev]);
    setYardDispatch({ contractNo: '', vehicleNo: '', toWhom: '', epfNo: '', sentDate: '', sentMTA6: false, sentIDCopy: false });
    alert("ලිපිගොනු Yard එකට යැවීමේ සටහන සුරැකිණි!");
  };

  const exportToExcel = () => {
    let csvContent = "\uFEFFContract No,Vehicle No,Client Name,Type,Method,Yard/Branch,Status,TRS,Outstanding,Sold,Client Paid,Seizer Payment,Documents\n";
    (data || []).forEach(row => {
      const yardInfo = row.yardLocation === 'Offsite Yard' ? `Offsite (${row.offsiteBranch || 'N/A'})` : (row.yardLocation || '');
      csvContent += `"${row.contractNo || ''}","${row.vehicleNo || ''}","${row.clientName || ''}","${row.vehicleType || ''}","${row.actionType || ''}","${yardInfo}","${row.status || ''}","${row.trs ? 'TRS' : 'NO'}","${row.outstanding || 0}","${row.isSold || 'No'}","${row.clientPaid || 'No'}","${row.seizerPaymentStatus || ''}","${row.docs || ''}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `WG_Yard_Journal_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split('\n');
        const imported = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const cols = lines[i].split(',').map(s => s.replace(/(^"|"$)/g, '').trim());
          if (cols[0] && cols[1]) {
            imported.push({
              id: Date.now().toString() + i,
              contractNo: cols[0] || 'WGFBA055203',
              vehicleNo: cols[1] || 'SP-XXX-0000',
              clientName: cols[2] || 'Imported Client',
              vehicleType: cols[3] || 'Motorcycle',
              actionType: cols[4] || 'Seized',
              yardLocation: cols[5] || 'Kurunegala Yard',
              offsiteBranch: '',
              status: cols[6] || 'ACTIVE',
              trs: cols[7] === 'TRS',
              outstanding: cols[8] || '0',
              isSold: cols[9] || 'No',
              clientPaid: cols[10] || 'No',
              seizerPaymentStatus: cols[11] || 'Pending',
              docs: cols[12] || ''
            });
          }
        }
        if (imported.length > 0) {
          setData(prev => [...imported, ...prev]);
          alert(`${imported.length} ක් වන දත්ත සාර්ථකව Import කරන ලදී!`);
        }
      } catch (err) {
        alert("File එක කියවීමේ දෝෂයක්. කරුණාකර නිවැරදි CSV ගොනුවක් ලබාදෙන්න.");
      }
    };
    reader.readAsText(file);
  };

  const getVehicleImage = (type) => {
    switch (type) {
      case 'Car': return CAR_IMG;
      case 'Motorcycle': return BIKE_IMG;
      case 'Three-wheeler': return THREE_WHEELER_IMG;
      case 'Lorry': return LORRY_IMG;
      default: return CAR_IMG;
    }
  };

  const filteredData = (data || []).filter(item => {
    const term = (searchTerm || '').toLowerCase();
    const cNo = (item?.contractNo || '').toLowerCase();
    const vNo = (item?.vehicleNo || '').toLowerCase();
    const cName = (item?.clientName || '').toLowerCase();
    return cNo.includes(term) || vNo.includes(term) || cName.includes(term);
  });

  return (
    <div className="flex h-screen bg-[#f4f7fb] text-slate-800 font-sans">
      
      {/* Sidebar with Company Logo next to App Title */}
      <aside className="w-72 bg-[#7a3aec] rounded-r-3xl my-4 ml-4 shadow-2xl flex flex-col justify-between text-white z-20">
        <div>
          <div className="h-28 flex items-center justify-center border-b border-white/10 mx-4 px-2">
            <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-2xl w-full shadow-inner">
              <img 
                src={COMPANY_LOGO} 
                alt="Logo" 
                className="h-10 w-12 object-contain bg-white rounded-xl p-1 shadow-md"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="overflow-hidden">
                <h1 className="text-white font-black tracking-wider text-sm truncate">WG YARD</h1>
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider truncate">COMMERCIAL CREDIT</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-white text-[#7a3aec] shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              <Icon name="dashboard" /> Dashboard
            </button>
            <button onClick={() => setActiveTab('new')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'new' ? 'bg-white text-[#7a3aec] shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              <Icon name="plus" /> New Entry
            </button>
            <button onClick={() => setActiveTab('yardfiles')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'yardfiles' ? 'bg-white text-[#7a3aec] shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              <Icon name="send" /> Send to Yard
            </button>
            <button onClick={() => setActiveTab('seizers')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'seizers' ? 'bg-white text-[#7a3aec] shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              <Icon name="users" /> Manage Seizers
            </button>
            {isAdmin && (
              <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all mt-6 ${activeTab === 'settings' ? 'bg-white text-rose-600 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                <Icon name="settings" /> Settings & Reset
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {isAdmin ? (
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
              <span className="text-xs font-bold block">Admin Access Active</span>
              <button onClick={() => setIsAdmin(false)} className="w-full mt-2 py-2 text-xs font-bold bg-rose-500 rounded-xl hover:bg-rose-600 transition-all">Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} className="w-full py-3 text-xs font-bold text-white bg-white/20 rounded-xl hover:bg-white hover:text-[#7a3aec] transition-all flex items-center justify-center gap-2">
              <Icon name="lock" className="w-4 h-4" /> Admin Login
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden px-6">
        
        {/* Top Header */}
        <header className="h-24 flex items-center justify-between pt-4">
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" className="w-5 h-5"/></span>
            <input 
              type="text" 
              placeholder="Search Contract, Vehicle No..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white shadow-sm rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a3aec]/30"
            />
          </div>
          <div className="flex items-center gap-4">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 shadow-sm rounded-full text-xs font-bold hover:shadow-md transition-all">
              <Icon name="upload" className="w-4 h-4 text-emerald-600" /> IMPORT CSV/EXCEL
            </button>
            <button onClick={exportToExcel} className="flex items-center gap-2 px-5 py-2.5 bg-[#7a3aec] text-white shadow-md rounded-full text-xs font-bold hover:bg-[#6c2ee0] transition-all">
              <Icon name="download" className="w-4 h-4" /> EXPORT EXCEL
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="flex-1 overflow-y-auto pb-8">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-[#7a3aec] p-6 rounded-3xl text-white shadow-lg">
                  <span className="text-sm font-semibold opacity-80">Motorcycles</span>
                  <h3 className="text-4xl font-black mt-2">{data.filter(d => d.vehicleType === 'Motorcycle').length}</h3>
                </div>
                <div className="bg-[#f59e0b] p-6 rounded-3xl text-white shadow-lg">
                  <span className="text-sm font-semibold opacity-80">Three-Wheelers</span>
                  <h3 className="text-4xl font-black mt-2">{data.filter(d => d.vehicleType === 'Three-wheeler').length}</h3>
                </div>
                <div className="bg-[#0ea5e9] p-6 rounded-3xl text-white shadow-lg">
                  <span className="text-sm font-semibold opacity-80">Cars</span>
                  <h3 className="text-4xl font-black mt-2">{data.filter(d => d.vehicleType === 'Car').length}</h3>
                </div>
                <div className="bg-[#10b981] p-6 rounded-3xl text-white shadow-lg">
                  <span className="text-sm font-semibold opacity-80">Lorries</span>
                  <h3 className="text-4xl font-black mt-2">{data.filter(d => d.vehicleType === 'Lorry').length}</h3>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-800">Master Intelligence Grid</h2>
                  <span className="text-xs font-bold text-[#7a3aec] bg-[#7a3aec]/10 px-4 py-1.5 rounded-full">
                    {filteredData.length} Entries
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold">
                      <tr>
                        <th className="p-4">Contract No</th>
                        <th className="p-4">Vehicle No</th>
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Vehicle Type</th>
                        <th className="p-4">Method</th>
                        <th className="p-4">Yard Location</th>
                        <th className="p-4">Outstanding</th>
                        <th className="p-4">Client Paid</th>
                        <th className="p-4">Seizer Payment</th>
                        <th className="p-4">Docs</th>
                        {isAdmin && <th className="p-4 text-center">Action</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredData.map(row => (
                        <tr key={row.id} className="hover:bg-slate-50">
                          <td className="p-4 font-mono font-bold text-[#7a3aec]">{row.contractNo}</td>
                          <td className="p-4 font-bold text-slate-700">{row.vehicleNo}</td>
                          <td className="p-4 text-slate-600">{row.clientName}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <img src={getVehicleImage(row.vehicleType)} alt={row.vehicleType} className="w-10 h-7 object-cover rounded shadow-sm border" onError={(e) => { e.target.style.display = 'none'; }} />
                              <span className="font-semibold">{row.vehicleType}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.actionType === 'Seized' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                              {row.actionType}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            {row.yardLocation === 'Offsite Yard' ? `Offsite - ${row.offsiteBranch || 'Branch'}` : row.yardLocation}
                          </td>
                          <td className="p-4 font-mono font-semibold">Rs. {Number(row.outstanding || 0).toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.clientPaid === 'Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {row.clientPaid || 'No'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.seizerPaymentStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                              {row.seizerPaymentStatus || 'Pending'}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-400">{row.docs || '-'}</td>
                          {isAdmin && (
                            <td className="p-4 text-center">
                              <button onClick={() => setData(prev => prev.filter(d => d.id !== row.id))} className="text-rose-500 hover:text-rose-700">
                                <Icon name="trash" className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* NEW ENTRY TAB */}
          {activeTab === 'new' && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">New Vehicle Journal Entry</h2>
              
              {wizardStep === 1 && (
                <div className="space-y-5">
                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 mb-4">
                    <label className="text-xs font-bold text-purple-700 uppercase block mb-2">1. Vehicle Entry Method *</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 font-bold cursor-pointer ${formData.actionType === 'Seized' ? 'bg-[#7a3aec] text-white border-[#7a3aec]' : 'bg-white text-slate-700 border-slate-200'}`}>
                        <input type="radio" name="actionType" value="Seized" checked={formData.actionType === 'Seized'} onChange={handleFormChange} className="hidden" />
                        SEIZED
                      </label>
                      <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 font-bold cursor-pointer ${formData.actionType === 'Handover' ? 'bg-[#7a3aec] text-white border-[#7a3aec]' : 'bg-white text-slate-700 border-slate-200'}`}>
                        <input type="radio" name="actionType" value="Handover" checked={formData.actionType === 'Handover'} onChange={handleFormChange} className="hidden" />
                        HANDOVER
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Contract No *</label>
                      <input type="text" name="contractNo" value={formData.contractNo} onChange={handleFormChange} placeholder="e.g. WGFBA055203" className="w-full bg-slate-50 border p-3 rounded-xl uppercase font-mono font-bold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Vehicle No *</label>
                      <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleFormChange} placeholder="SP-BJK-1182" className="w-full bg-slate-50 border p-3 rounded-xl uppercase font-mono font-bold" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Client Name</label>
                      <input type="text" name="clientName" value={formData.clientName} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Vehicle Category</label>
                      <select name="vehicleType" value={formData.vehicleType} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold">
                        <option>Motorcycle</option>
                        <option>Three-wheeler</option>
                        <option>Car</option>
                        <option>Lorry</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Seizer</label>
                      <select name="seizerName" value={formData.seizerName} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold">
                        <option value="">Select Seizer</option>
                        {seizers.map(s => <option key={s.id} value={s.name}>{s.name} ({s.nic})</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mt-4">
                    <label className="text-xs font-bold text-slate-600 uppercase block mb-1">Yard Location *</label>
                    <select name="yardLocation" value={formData.yardLocation} onChange={handleFormChange} className="w-full bg-white border p-3 rounded-xl font-bold text-slate-800">
                      <option value="Kurunegala Yard">Kurunegala Yard</option>
                      <option value="Homagama Yard">Homagama Yard</option>
                      <option value="Offsite Yard">Offsite Yard</option>
                    </select>

                    {formData.yardLocation === 'Offsite Yard' && (
                      <div className="mt-3">
                        <label className="text-xs font-bold text-blue-600 uppercase block mb-1">Offsite Branch Name *</label>
                        <input type="text" name="offsiteBranch" value={formData.offsiteBranch} onChange={handleFormChange} placeholder="e.g. Kandy Branch, Galle Branch" className="w-full bg-white border border-blue-400 p-3 rounded-xl font-semibold" />
                      </div>
                    )}
                  </div>

                  <button onClick={() => setWizardStep(2)} className="w-full py-4 bg-[#7a3aec] text-white font-bold rounded-xl shadow-lg mt-4">Next Step (Financials)</button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Total Outstanding (Rs.)</label>
                    <input type="number" name="outstanding" value={formData.outstanding} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl text-xl font-black text-blue-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Client Paid?</label>
                      <select name="clientPaid" value={formData.clientPaid} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-bold">
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Seizer Payment Complete or Not *</label>
                      <select name="seizerPaymentStatus" value={formData.seizerPaymentStatus} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-bold">
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Not Paid">Not Paid</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Documents Collected</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['docsMTA6:MTA6 Form', 'docsID:ID Copy', 'docsHForm:H Form', 'docsLetter:Handover Letter'].map(item => {
                        const [key, label] = item.split(':');
                        return (
                          <label key={key} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border cursor-pointer">
                            <input type="checkbox" name={key} checked={formData[key]} onChange={handleFormChange} className="w-4 h-4 accent-[#7a3aec]" />
                            <span className="text-sm font-semibold">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button onClick={() => setWizardStep(1)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Back</button>
                    <button onClick={submitForm} className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg">Save Entry</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEND FILES TO YARD TAB */}
          {activeTab === 'yardfiles' && (
            <div className="max-w-5xl mx-auto flex gap-6">
              <div className="w-1/2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Send Files To Yard</h3>
                <form onSubmit={submitYardDispatch} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Contract No *</label>
                    <input type="text" value={yardDispatch.contractNo} onChange={e => setYardDispatch({...yardDispatch, contractNo: e.target.value})} placeholder="e.g. WGFBA055203" className="w-full bg-slate-50 border p-3 rounded-xl font-mono uppercase font-bold" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Vehicle No *</label>
                    <input type="text" value={yardDispatch.vehicleNo} onChange={e => setYardDispatch({...yardDispatch, vehicleNo: e.target.value})} placeholder="e.g. SP-BJK-1182" className="w-full bg-slate-50 border p-3 rounded-xl font-mono uppercase font-bold" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">To Whom (භාරදුන් අයගේ නම) *</label>
                    <input type="text" value={yardDispatch.toWhom} onChange={e => setYardDispatch({...yardDispatch, toWhom: e.target.value})} placeholder="නම ඇතුළත් කරන්න" className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">EPF No (EPF අංකය) *</label>
                    <input type="text" value={yardDispatch.epfNo} onChange={e => setYardDispatch({...yardDispatch, epfNo: e.target.value})} placeholder="EPF අංකය" className="w-full bg-slate-50 border p-3 rounded-xl font-semibold font-mono" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Date Sent *</label>
                    <input type="date" value={yardDispatch.sentDate} onChange={e => setYardDispatch({...yardDispatch, sentDate: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" required />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={yardDispatch.sentMTA6} onChange={e => setYardDispatch({...yardDispatch, sentMTA6: e.target.checked})} className="w-4 h-4 accent-[#7a3aec]" />
                      <span className="text-sm font-bold">MTA 6</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={yardDispatch.sentIDCopy} onChange={e => setYardDispatch({...yardDispatch, sentIDCopy: e.target.checked})} className="w-4 h-4 accent-[#7a3aec]" />
                      <span className="text-sm font-bold">ID Copy</span>
                    </label>
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg mt-4">Record Dispatch</button>
                </form>
              </div>

              <div className="w-1/2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-lg font-bold mb-4 text-slate-800">Dispatch History</h3>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {yardFiles.length === 0 ? <p className="text-slate-400 text-sm">තවම වාර්තා නැත.</p> : yardFiles.map(f => (
                    <div key={f.id} className="p-4 bg-slate-50 rounded-2xl border flex justify-between items-center">
                      <div>
                        <div className="font-bold text-blue-700">{f.contractNo} - {f.vehicleNo}</div>
                        <div className="text-xs text-slate-600">To: <strong>{f.toWhom}</strong> (EPF: {f.epfNo})</div>
                        <div className="text-[10px] text-slate-400">{f.sentDate} | {f.docs}</div>
                      </div>
                      <Icon name="check" className="w-5 h-5 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MANAGE SEIZERS TAB */}
          {activeTab === 'seizers' && (
            <div className="max-w-4xl mx-auto flex gap-6">
              <div className="w-1/2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Add New Seizer</h3>
                <form onSubmit={submitNewSeizer} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Seizer Name *</label>
                    <input type="text" value={newSeizer.name} onChange={e => setNewSeizer({...newSeizer, name: e.target.value})} placeholder="Mr. A.B. Perera" className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">National ID (NIC) *</label>
                    <input type="text" value={newSeizer.nic} onChange={e => setNewSeizer({...newSeizer, nic: e.target.value})} placeholder="e.g. 851234567v" className="w-full bg-slate-50 border p-3 rounded-xl font-mono uppercase font-semibold" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Contact Phone</label>
                    <input type="text" value={newSeizer.phone} onChange={e => setNewSeizer({...newSeizer, phone: e.target.value})} placeholder="07XXXXXXXX" className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#7a3aec] text-white font-bold rounded-xl shadow-lg mt-2">Add Seizer</button>
                </form>
              </div>

              <div className="w-1/2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-lg font-bold mb-4 text-slate-800">Registered Seizers</h3>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {seizers.map(s => (
                    <div key={s.id} className="p-4 bg-slate-50 rounded-2xl border flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-800">{s.name}</div>
                        <div className="text-xs font-mono text-slate-500">NIC: {s.nic} | Tel: {s.phone || 'N/A'}</div>
                      </div>
                      <span className="text-xs font-bold bg-purple-100 text-[#7a3aec] px-2.5 py-1 rounded-full">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS / DATA RESET TAB */}
          {activeTab === 'settings' && isAdmin && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">System Reset & Danger Zone</h2>
              <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-rose-700">Clear All System Data</h3>
                <p className="text-sm text-rose-600 mt-1 mb-4">පද්ධතියේ ඇති සියලුම Journal Entries, Seizer Records සහ Yard Dispatches සම්පූර්ණයෙන්ම මැකී යයි.</p>
                <button 
                  onClick={() => {
                    if (window.confirm("ඔබට සම්පූර්ණ දත්ත මකා දමා පද්ධතිය Reset කිරීමට අවශ්‍යද?")) {
                      localStorage.clear();
                      setData(INITIAL_DATA);
                      setYardFiles([]);
                      alert("පද්ධතියේ සියලු දත්ත සාර්ථකව Reset විය.");
                    }
                  }} 
                  className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-md hover:bg-rose-700"
                >
                  Confirm Reset Data
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Admin Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl w-96 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Admin Authentication</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder="Username (Admin)" value={loginCreds.user} onChange={e => setLoginCreds({...loginCreds, user: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" required />
              <input type="password" placeholder="Password (901001)" value={loginCreds.pass} onChange={e => setLoginCreds({...loginCreds, pass: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" required />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowLogin(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#7a3aec] text-white rounded-xl font-bold">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
