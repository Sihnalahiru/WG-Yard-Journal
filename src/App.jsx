import React, { useState, useEffect, useRef, Component } from 'react';

// --- Error Boundary (White screen prevention) ---
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Application Runtime Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">System Notice</h2>
            <p className="text-sm text-slate-500 mb-6">
              A temporary local storage conflict was detected. Click below to clear cache and refresh smoothly.
            </p>
            <button
              onClick={() => {
                try { localStorage.clear(); } catch(e) {}
                window.location.reload();
              }}
              className="w-full py-3 bg-[#7a3aec] text-white font-bold rounded-xl shadow-lg hover:bg-[#6c2ee0] transition-all"
            >
              Clear Cache & Launch App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Reliable SVG Icons (Zero Dependency) ---
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
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />,
    eye: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    camera: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name] || icons.dashboard}
    </svg>
  );
};

const getAssetUrl = (fileName) => {
  const base = import.meta.env?.BASE_URL || './';
  return `${base.endsWith('/') ? base : base + '/'}${fileName}`;
};

const COMPANY_LOGO = getAssetUrl('Compnay Logo.jpg');
const CAR_IMG = getAssetUrl('Car.jpg');
const LORRY_IMG = getAssetUrl('Lorry.jpg');
const BIKE_IMG = getAssetUrl('Motocycle.png');
const THREE_WHEELER_IMG = getAssetUrl('Three-wheeler.png');

// 129 Branches List
const BRANCHES_LIST = [
  "Ambalangoda", "Ampara", "Anuradhapura", "Ahangama", "Akkaraipattu", "Akuressa", "Alawwa", "Ambalantota",
  "Aralaganwila", "Avissawella", "Badulla", "Balangoda", "Bandarawela", "Batticaloa", "Beliatta",
  "Benthota", "Bible", "Boralesgamuwa", "Chavakachcheri", "Chilaw", "Chunnakam", "Colombo",
  "Dambulla", "Dehiattakandiya", "Dehiwala", "Deniyaya", "Digana", "Divulapitiya", "Diyatalawa",
  "Dompe", "Elpitiya", "Embilipitiya", "Eppawala", "Galenbindunuwewa", "Galewela", "Galle",
  "Gampaha", "Gampola", "Ganemulla", "Giriulla", "Godakawela", "Habarana", "Hambantota", "Hanwella",
  "Hatton", "Hikkaduwa", "Hingurakgoda", "Homagama", "Horana", "Ja-Ela", "Jaffna", "Kadawatha",
  "Kaduwela", "Kahawatta", "Kalmunai", "Kalutara", "Kamburupitiya", "Kandy", "Karapitiya", "Katugastota",
  "Katunayake", "Kegalle", "Kekirawa", "Kilinochchi", "Kiribathgoda", "Kirinda", "Kuliyapitiya", "Kurunegala",
  "Kuruwita", "Maharagama", "Mahiyanganaya", "Maho", "Malabe", "Mannar", "Marawila", "Matale",
  "Matara", "Mathugama", "Mawanella", "Medawachchiya", "Minuwangoda", "Mirigama", "Monaragala", "Moratuwa",
  "Mullaitivu", "Narammala", "Nawalapitiya", "Negombo", "Nelliady", "Nikaweratiya", "Nittambuwa", "Nuwara Eliya",
  "Padaviya", "Panadura", "Pannala", "Pelmadulla", "Peradeniya", "Pilimathalawa", "Piliyandala", "Polonnaruwa",
  "Puttalam", "Radawana", "Ragama", "Rajagiriya", "Rakwana", "Ranala", "Ratnapura", "Ruwanwella",
  "Seeduwa", "Sigiriya", "Tangalle", "Thambuttegama", "Thanamalwila", "Thihariya", "Trincomalee", "Udugama",
  "Udugampola", "Valachchenai", "Vavuniya", "Veyangoda", "Warakapola", "Wattala", "Wariyapola", "Weligama",
  "Welimada", "Welisara", "Wellawaya", "Wennappuwa", "Yakkala"
];

const INITIAL_SEIZERS = [
  { id: '1', name: 'Mr. K.A.P Indika', nic: '781032786v', phone: '0771234567', accountNo: '1002345678', passbookImg: '', photo: '' },
  { id: '2', name: 'MR. N.G.C. MENDIS', nic: '923572619v', phone: '0719876543', accountNo: '1008765432', passbookImg: '', photo: '' }
];

// Excel Audit Records (Initial Data)
const INITIAL_RECORDS = [
  { id: '1', contractNo: 'WGMBA053816', vehicleNo: 'SP-BJK-1182', clientName: 'MR. H.S.SHALIKA SELLAHEWA', vehicleType: 'Motorcycle', actionType: 'Order Issued', serialNo: 'S866797', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', orderPrintDate: '2026-07-10', orderIssuedDate: '2026-07-11', seizedDate: '', status: 'EXPIRED', seizerSpecialApprove: false, seizerPaymentReleaseDate: '', handOverBy: '', handOverDate: '', releaseType: 'Mortgage Release', reprocessRequest: 'Pending', hNumber: '', yardLocation: 'Kurunegala Yard', recoveryOfficer: 'Madusankal', handOverBranch: '', orderCancelDate: '', informToSeizer: false, yardDate: '', specialTerminationCase: false, outstanding: '0', seizerFee: '0', isSold: 'No', soldAmount: '0', currentBalance: '0', clientPaid: 'No', seizerPaymentStatus: 'Pending', docs: '' },
  { id: '10', contractNo: 'WGMBA065884', vehicleNo: 'SP-BKE-1731', clientName: 'MR. H.G.R. RAJKUMAR', vehicleType: 'Motorcycle', actionType: 'Seized', serialNo: 'S867336', seizerName: 'MR. N.G.C. MENDIS', seizerID: '923572619v', orderPrintDate: '2026-07-27', orderIssuedDate: '2026-07-27', seizedDate: '2026-07-27', status: 'EXPIRED', seizerSpecialApprove: false, seizerPaymentReleaseDate: '', handOverBy: '', handOverDate: '', releaseType: 'Mortgage Release', reprocessRequest: 'Pending', hNumber: '', yardLocation: 'Kurunegala Yard', recoveryOfficer: 'Madusankal', handOverBranch: '', orderCancelDate: '', informToSeizer: false, yardDate: '2026-07-30', specialTerminationCase: false, outstanding: '42000', seizerFee: '0', isSold: 'No', soldAmount: '0', currentBalance: '0', clientPaid: 'No', seizerPaymentStatus: 'Completed', docs: 'MTA6, ID Copy' },
  { id: '29', contractNo: 'WGFBA074907', vehicleNo: 'NW-WX-0186', clientName: 'MISS. H.T.M. NIHATHAMANI', vehicleType: 'Three-wheeler', actionType: 'Handover', serialNo: '', seizerName: '', seizerID: '', orderPrintDate: '', orderIssuedDate: '', seizedDate: '', status: 'ACTIVE', seizerSpecialApprove: false, seizerPaymentReleaseDate: '', handOverBy: 'Client', handOverDate: '2026-09-24', releaseType: 'Mortgage Release', reprocessRequest: 'Pending', hNumber: 'H00901399', yardLocation: 'Offsite', recoveryOfficer: 'shadeeshan', handOverBranch: 'Ampara', orderCancelDate: '', informToSeizer: false, yardDate: '2026-09-26', specialTerminationCase: false, outstanding: '15000', seizerFee: '0', isSold: 'No', soldAmount: '0', currentBalance: '0', clientPaid: 'No', seizerPaymentStatus: 'Pending', docs: 'MTA6, ID Copy' }
];

// Helper to count pending Sub-Options
const getPendingSubOptionsCount = (item) => {
  if (!item) return 0;
  let count = 0;
  if (!item.orderPrintDate) count++;
  if (!item.orderIssuedDate) count++;
  if (!item.seizerPaymentReleaseDate) count++;
  if (!item.reprocessRequest || item.reprocessRequest === 'Pending') count++;
  if (!item.hNumber) count++;
  if (!item.recoveryOfficer) count++;
  if (!item.yardDate) count++;
  return count;
};

// Calculate Expiry status and remaining days
const getOrderExpiryInfo = (printDate) => {
  if (!printDate) return { status: 'ACTIVE', daysLeft: 14, isExpiringSoon: false };
  const pDate = new Date(printDate);
  const today = new Date();
  const diffTime = today - pDate;
  const elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysLeft = 14 - elapsedDays;
  if (daysLeft <= 0) {
    return { status: 'EXPIRED', daysLeft: 0, isExpiringSoon: false };
  }
  return {
    status: 'ACTIVE',
    daysLeft,
    isExpiringSoon: daysLeft <= 3
  };
};

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const fileInputRef = useRef(null);

  // Safe localStorage Loader
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('wgYard_main_v20');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(Boolean);
      }
    } catch (e) {}
    return INITIAL_RECORDS;
  });

  const [seizers, setSeizers] = useState(() => {
    try {
      const saved = localStorage.getItem('wgSeizers_main_v20');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter(Boolean);
      }
    } catch (e) {}
    return INITIAL_SEIZERS;
  });

  const [yardFiles, setYardFiles] = useState(() => {
    try {
      const saved = localStorage.getItem('wgYardFiles_main_v20');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      }
    } catch (e) {}
    return [];
  });

  // Modal States
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingSeizer, setEditingSeizer] = useState(null);

  // Quick Filter Tab
  const [filterTab, setFilterTab] = useState('all');

  useEffect(() => {
    try { localStorage.setItem('wgYard_main_v20', JSON.stringify(data)); } catch (e) {}
  }, [data]);

  useEffect(() => {
    try { localStorage.setItem('wgSeizers_main_v20', JSON.stringify(seizers)); } catch (e) {}
  }, [seizers]);

  useEffect(() => {
    try { localStorage.setItem('wgYardFiles_main_v20', JSON.stringify(yardFiles)); } catch (e) {}
  }, [yardFiles]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ user: '', pass: '' });

  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState({
    contractNo: '',
    clientName: '',
    vehicleNo: '',
    serialNo: '',
    seizerName: '',
    seizerID: '',
    seizedDate: '',
    actionType: 'Seized',
    handOverBy: 'Client',
    handOverDate: '',
    releaseType: 'Mortgage Release',
    vehicleType: 'Motorcycle',

    orderPrintDate: '',
    orderIssuedDate: '',
    seizerSpecialApprove: false,
    seizerPaymentReleaseDate: '',
    reprocessRequest: 'Pending',
    hNumber: '',
    yardLocation: 'Kurunegala Yard',
    recoveryOfficer: '',
    handOverBranch: '',
    orderCancelDate: '',
    informToSeizer: false,
    yardDate: '',
    specialTerminationCase: false,
    outstanding: '',
    seizerFee: '',
    isSold: 'No',
    soldAmount: '',
    currentBalance: '',
    clientPaid: 'No',
    seizerPaymentStatus: 'Pending',
    docsMTA6: false,
    docsID: false,
    docsHForm: false,
    docsLetter: false
  });

  const [newSeizer, setNewSeizer] = useState({
    name: '', nic: '', phone: '', accountNo: '', passbookImg: '', photo: ''
  });

  const [yardDispatch, setYardDispatch] = useState({
    contractNo: '', vehicleNo: '', toWhom: '', epfNo: '', sentDate: '', sentMTA6: false, sentIDCopy: false
  });

  const calculateOrderStatus = (printDate) => {
    if (!printDate) return 'ACTIVE';
    const pDate = new Date(printDate);
    const today = new Date();
    const diffTime = today - pDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14 ? 'ACTIVE' : 'EXPIRED';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginCreds.user === 'Admin' && loginCreds.pass === '901001') {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginCreds({ user: '', pass: '' });
    } else {
      alert("Invalid Admin Credentials!");
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingRecord(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSeizerSelect = (name) => {
    const matched = seizers.find(s => s.name === name);
    setFormData(prev => ({
      ...prev,
      seizerName: name,
      seizerID: matched ? matched.nic : ''
    }));
  };

  const handleFileUploadAsBase64 = (e, field, isEditing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      if (isEditing) {
        setEditingSeizer(prev => ({ ...prev, [field]: uploadEvt.target.result }));
      } else {
        setNewSeizer(prev => ({ ...prev, [field]: uploadEvt.target.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const submitNewSeizer = (e) => {
    e.preventDefault();
    if (!newSeizer.name || !newSeizer.nic || !newSeizer.accountNo) {
      alert("Please enter Seizer Name, NIC, and Account Number.");
      return;
    }
    const added = { id: Date.now().toString(), ...newSeizer };
    setSeizers(prev => [...prev, added]);
    setNewSeizer({ name: '', nic: '', phone: '', accountNo: '', passbookImg: '', photo: '' });
    alert("New Seizer registered successfully!");
  };

  const saveUpdatedSeizer = (e) => {
    e.preventDefault();
    if (!editingSeizer) return;
    setSeizers(prev => prev.map(s => s.id === editingSeizer.id ? editingSeizer : s));
    setEditingSeizer(null);
    alert("Seizer documents updated successfully!");
  };

  // Main compulsory validation
  const submitForm = () => {
    if (!formData.contractNo || !formData.vehicleNo || !formData.clientName || !formData.serialNo) {
      alert("Contract No, Vehicle No, Client Name, and Serial No are compulsory Main fields.");
      return;
    }

    if (formData.actionType === 'Seized' && (!formData.seizerName || !formData.seizedDate)) {
      alert("Seizer Name and Seized Date are compulsory for Seized vehicles.");
      return;
    }

    if (formData.actionType === 'Handover' && !formData.handOverDate) {
      alert("Hand Over Date is compulsory for Handover vehicles.");
      return;
    }

    const expiryInfo = getOrderExpiryInfo(formData.orderPrintDate);

    const newEntry = {
      id: Date.now().toString(),
      contractNo: String(formData.contractNo).trim().toUpperCase(),
      clientName: formData.clientName,
      vehicleNo: String(formData.vehicleNo).trim().toUpperCase(),
      serialNo: formData.serialNo || '',
      seizerName: formData.seizerName || '',
      seizerID: formData.seizerID || '',
      seizedDate: formData.seizedDate || '',
      actionType: formData.actionType || 'Seized',
      handOverBy: formData.actionType === 'Handover' ? (formData.handOverBy || 'Client') : '',
      handOverDate: formData.actionType === 'Handover' ? formData.handOverDate : '',
      releaseType: formData.releaseType || 'Mortgage Release',
      vehicleType: formData.vehicleType || 'Motorcycle',
      status: expiryInfo.status,

      orderPrintDate: formData.orderPrintDate || '',
      orderIssuedDate: formData.orderIssuedDate || '',
      seizerSpecialApprove: Boolean(formData.seizerSpecialApprove),
      seizerPaymentReleaseDate: formData.seizerPaymentReleaseDate || '',
      reprocessRequest: formData.reprocessRequest || 'Pending',
      hNumber: formData.hNumber || '',
      yardLocation: formData.yardLocation || 'Kurunegala Yard',
      recoveryOfficer: formData.recoveryOfficer || '',
      handOverBranch: formData.handOverBranch || '',
      orderCancelDate: formData.orderCancelDate || '',
      informToSeizer: Boolean(formData.informToSeizer),
      yardDate: formData.yardDate || '',
      specialTerminationCase: Boolean(formData.specialTerminationCase),
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

    setData(prev => [newEntry, ...(Array.isArray(prev) ? prev : [])]);
    setActiveTab('dashboard');
    setWizardStep(1);
    alert("New Entry Saved Successfully! Incomplete Sub-Options are marked as Pending in the list.");
  };

  const saveUpdatedRecord = () => {
    if (!editingRecord) return;
    const expiryInfo = getOrderExpiryInfo(editingRecord.orderPrintDate);
    const updated = {
      ...editingRecord,
      status: expiryInfo.status
    };
    setData(prev => prev.map(item => item.id === updated.id ? updated : item));
    if (selectedRecord && selectedRecord.id === updated.id) {
      setSelectedRecord(updated);
    }
    setEditingRecord(null);
    alert("Sub-Options updated successfully!");
  };

  const submitYardDispatch = (e) => {
    e.preventDefault();
    if (!yardDispatch.contractNo || !yardDispatch.vehicleNo || !yardDispatch.toWhom || !yardDispatch.epfNo) {
      alert("Please fill all required fields.");
      return;
    }
    const newDispatch = {
      id: Date.now().toString(),
      contractNo: String(yardDispatch.contractNo).trim().toUpperCase(),
      vehicleNo: String(yardDispatch.vehicleNo).trim().toUpperCase(),
      toWhom: yardDispatch.toWhom,
      epfNo: yardDispatch.epfNo,
      sentDate: yardDispatch.sentDate,
      docs: [yardDispatch.sentMTA6 ? 'MTA6' : '', yardDispatch.sentIDCopy ? 'ID Copy' : ''].filter(Boolean).join(', ')
    };
    setYardFiles(prev => [newDispatch, ...(Array.isArray(prev) ? prev : [])]);
    setYardDispatch({ contractNo: '', vehicleNo: '', toWhom: '', epfNo: '', sentDate: '', sentMTA6: false, sentIDCopy: false });
    alert("Yard file dispatch recorded!");
  };

  const exportToExcel = () => {
    let csvContent = "\uFEFFContract No,Client Name,Vehicle No,Serial No,Seizer Name,Seizer ID,Order Print Date,Order Issued Date,Seized Date,Status,Seizer Payment,Payment Release Date,Hand Over By,Hand Over Date,Release Type,Reprocess Request,H Number,Yard Location,Recovery Officer,Hand Over Branch,Order Cancel Date,Yard Date,Outstanding,Client Paid,Seizer Payment Status,Docs\n";
    (data || []).forEach(r => {
      csvContent += `"${r.contractNo || ''}","${r.clientName || ''}","${r.vehicleNo || ''}","${r.serialNo || ''}","${r.seizerName || ''}","${r.seizerID || ''}","${r.orderPrintDate || ''}","${r.orderIssuedDate || ''}","${r.seizedDate || ''}","${r.status || ''}","${r.seizerSpecialApprove ? 'Special Approved' : 'Normal'}","${r.seizerPaymentReleaseDate || ''}","${r.handOverBy || ''}","${r.handOverDate || ''}","${r.releaseType || ''}","${r.reprocessRequest || ''}","${r.hNumber || ''}","${r.yardLocation || ''}","${r.recoveryOfficer || ''}","${r.handOverBranch || ''}","${r.orderCancelDate || ''}","${r.yardDate || ''}","${r.outstanding || 0}","${r.clientPaid || 'No'}","${r.seizerPaymentStatus || ''}","${r.docs || ''}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `WG_Yard_Journal_Full_${new Date().toISOString().slice(0, 10)}.csv`;
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
        const lines = text.split(/\r\n|\n/);
        const vlookupMap = {};

        lines.forEach((line) => {
          if (!line || !line.trim()) return;
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/(^"|"$)/g, '').trim());
          const contractNo = cols[2];
          const outstandingVal = cols[13];

          if (contractNo && String(contractNo).toUpperCase() !== 'CONTRACT_NO' && outstandingVal !== undefined && outstandingVal !== '') {
            const parsedNum = parseFloat(String(outstandingVal).replace(/,/g, ''));
            if (!isNaN(parsedNum)) {
              vlookupMap[String(contractNo).trim().toUpperCase()] = parsedNum;
            }
          }
        });

        let updatedCount = 0;
        setData(prevData => {
          const safe = Array.isArray(prevData) ? prevData.filter(Boolean) : [];
          return safe.map(item => {
            const key = String(item.contractNo || '').trim().toUpperCase();
            if (vlookupMap[key] !== undefined) {
              updatedCount++;
              return { ...item, outstanding: vlookupMap[key].toString() };
            }
            return item;
          });
        });

        alert(`VLOOKUP Match Complete! Updated Outstanding for ${updatedCount} contracts.`);
      } catch (err) {
        alert("Error parsing CSV file.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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

  const safeData = Array.isArray(data) ? data.filter(Boolean) : [];
  const safeSeizers = Array.isArray(seizers) ? seizers.filter(Boolean) : INITIAL_SEIZERS;
  const safeYardFiles = Array.isArray(yardFiles) ? yardFiles.filter(Boolean) : [];

  // Metrics Calculations for Actionable KPIs
  const activeOrdersCount = safeData.filter(d => d.status === 'ACTIVE').length;
  const expiredOrdersCount = safeData.filter(d => d.status === 'EXPIRED').length;
  const expiringSoonCount = safeData.filter(d => getOrderExpiryInfo(d.orderPrintDate).isExpiringSoon).length;
  const kurunegalaCount = safeData.filter(d => d.yardLocation === 'Kurunegala Yard').length;
  const homagamaCount = safeData.filter(d => d.yardLocation === 'Homagama Yard').length;
  const offsiteCount = safeData.filter(d => d.yardLocation === 'Offsite').length;
  const pendingSubOptionsCount = safeData.filter(d => getPendingSubOptionsCount(d) > 0).length;
  const totalOutstandingSum = safeData.reduce((acc, curr) => acc + parseFloat(String(curr.outstanding || 0).replace(/,/g, '') || 0), 0);
  const specialTerminationCount = safeData.filter(d => Boolean(d.specialTerminationCase)).length;

  // Filtered dataset
  const filteredData = safeData.filter(item => {
    if (!item) return false;
    
    // Tab Filter
    if (filterTab === 'active' && item.status !== 'ACTIVE') return false;
    if (filterTab === 'expiring' && !getOrderExpiryInfo(item.orderPrintDate).isExpiringSoon) return false;
    if (filterTab === 'pending' && getPendingSubOptionsCount(item) === 0) return false;
    if (filterTab === 'kurunegala' && item.yardLocation !== 'Kurunegala Yard') return false;
    if (filterTab === 'homagama' && item.yardLocation !== 'Homagama Yard') return false;
    if (filterTab === 'offsite' && item.yardLocation !== 'Offsite') return false;
    if (filterTab === 'handover' && item.actionType !== 'Handover') return false;

    // Search query filter
    const term = String(searchTerm || '').trim().toLowerCase();
    if (!term) return true;
    const cNo = String(item.contractNo || '').toLowerCase();
    const vNo = String(item.vehicleNo || '').toLowerCase();
    const cName = String(item.clientName || '').toLowerCase();
    const sName = String(item.seizerName || '').toLowerCase();
    const hNo = String(item.hNumber || '').toLowerCase();
    const bName = String(item.handOverBranch || '').toLowerCase();
    return cNo.includes(term) || vNo.includes(term) || cName.includes(term) || sName.includes(term) || hNo.includes(term) || bName.includes(term);
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f4f7fb' }} className="text-slate-800 font-sans">
      
      {/* Sidebar Navigation */}
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
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-white text-[#7a3aec] shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="dashboard" /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('new')} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'new' ? 'bg-white text-[#7a3aec] shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="plus" /> New Entry
            </button>
            <button 
              onClick={() => setActiveTab('yardfiles')} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'yardfiles' ? 'bg-white text-[#7a3aec] shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="send" /> Send to Yard
            </button>
            <button 
              onClick={() => setActiveTab('seizers')} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'seizers' ? 'bg-white text-[#7a3aec] shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <Icon name="users" /> Seizer Register
            </button>
            {isAdmin && (
              <button 
                onClick={() => setActiveTab('settings')} 
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all mt-6 ${activeTab === 'settings' ? 'bg-white text-rose-600 shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                <Icon name="settings" /> Settings & Reset
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {isAdmin ? (
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
              <span className="text-xs font-bold block">Admin Mode Active</span>
              <button onClick={() => setIsAdmin(false)} className="w-full mt-2 py-2 text-xs font-bold bg-rose-500 rounded-xl hover:bg-rose-600 transition-all">Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} className="w-full py-3 text-xs font-bold text-white bg-white/20 rounded-xl hover:bg-white hover:text-[#7a3aec] transition-all flex items-center justify-center gap-2">
              <Icon name="lock" className="w-4 h-4" /> Admin Login
            </button>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden px-6">
        
        {/* Top App Header */}
        <header className="h-24 flex items-center justify-between pt-4">
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" className="w-5 h-5"/></span>
            <input 
              type="text" 
              placeholder="Search Contract, Vehicle, Client, Branch..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white shadow-sm rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a3aec]/30"
            />
          </div>
          <div className="flex items-center gap-4">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              title="VLOOKUP Update Outstanding from CSV Column C & N"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 shadow-sm rounded-full text-xs font-bold hover:shadow-md transition-all border border-slate-200"
            >
              <Icon name="upload" className="w-4 h-4 text-emerald-600" /> VLOOKUP IMPORT (CSV)
            </button>
            <button 
              onClick={exportToExcel} 
              className="flex items-center gap-2 px-5 py-2.5 bg-[#7a3aec] text-white shadow-md rounded-full text-xs font-bold hover:bg-[#6c2ee0] transition-all"
            >
              <Icon name="download" className="w-4 h-4" /> EXPORT EXCEL
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="flex-1 overflow-y-auto pb-8">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Special Termination Critical Alert Banner */}
              {specialTerminationCount > 0 && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                      <Icon name="alert" className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-800">Special Termination Letter Case Active!</h4>
                      <p className="text-xs text-rose-600">There are {specialTerminationCount} record(s) flagged to Inform Mr. Athula or Mr. Indika.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setFilterTab('all');
                      setSearchTerm('Special Termination');
                    }}
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all"
                  >
                    View Alerts
                  </button>
                </div>
              )}

              {/* Actionable KPI Summary Cards */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orders Status</span>
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                      14d
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-emerald-600">{activeOrdersCount}</h3>
                    <span className="text-xs text-slate-400 font-semibold">Active</span>
                    <span className="text-slate-300">/</span>
                    <h4 className="text-xl font-bold text-rose-500">{expiredOrdersCount}</h4>
                    <span className="text-xs text-slate-400 font-semibold">Expired</span>
                  </div>
                  {expiringSoonCount > 0 && (
                    <div className="mt-2 text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Icon name="clock" className="w-3.5 h-3.5" /> {expiringSoonCount} order(s) expiring within 3 days
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yard Tracking</span>
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black">
                      Loc
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-[#7a3aec]">{kurunegalaCount + homagamaCount}</h3>
                    <span className="text-xs text-slate-400 font-semibold">In Yard</span>
                    <span className="text-slate-300">/</span>
                    <h4 className="text-xl font-bold text-blue-500">{offsiteCount}</h4>
                    <span className="text-xs text-slate-400 font-semibold">Offsite</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 font-medium">Kurunegala: {kurunegalaCount} | Homagama: {homagamaCount}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sub-Options Audit</span>
                    <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
                      Opt
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-amber-600">{pendingSubOptionsCount}</h3>
                    <span className="text-xs text-slate-400 font-semibold">Pending Updates</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 font-medium">Missing H-No, Yard Date, or Officer</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Outstanding</span>
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-black">
                      Rs
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-blue-600 truncate">
                    Rs. {totalOutstandingSum.toLocaleString()}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 font-medium">{safeData.length} Total Registered Contracts</p>
                </div>
              </div>

              {/* Quick Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { key: 'all', label: 'All Records', count: safeData.length },
                  { key: 'active', label: 'Active Orders', count: activeOrdersCount },
                  { key: 'expiring', label: 'Expiring Soon (<=3d)', count: expiringSoonCount, highlight: expiringSoonCount > 0 },
                  { key: 'pending', label: 'Pending Sub-Options', count: pendingSubOptionsCount },
                  { key: 'kurunegala', label: 'Kurunegala Yard', count: kurunegalaCount },
                  { key: 'homagama', label: 'Homagama Yard', count: homagamaCount },
                  { key: 'offsite', label: 'Offsite Branches', count: offsiteCount },
                  { key: 'handover', label: 'Handover Only', count: safeData.filter(d => d.actionType === 'Handover').length }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilterTab(tab.key)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      filterTab === tab.key 
                        ? 'bg-[#7a3aec] text-white shadow-md shadow-[#7a3aec]/30 scale-105' 
                        : (tab.highlight ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100')
                    }`}
                  >
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      filterTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Master Data Grid */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Master Intelligence Grid</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Click any row to view full popup details or edit sub-options</p>
                  </div>
                  <span className="text-xs font-bold text-[#7a3aec] bg-[#7a3aec]/10 px-4 py-1.5 rounded-full">
                    {filteredData.length} Matches Found
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold">
                      <tr>
                        <th className="p-4">Contract No</th>
                        <th className="p-4">Vehicle No</th>
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Seizer Name</th>
                        <th className="p-4">Order Status</th>
                        <th className="p-4">Sub-Options</th>
                        <th className="p-4">Yard Location</th>
                        <th className="p-4">Outstanding</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredData.map(row => {
                        const pendingCount = getPendingSubOptionsCount(row);
                        const expiry = getOrderExpiryInfo(row?.orderPrintDate);
                        return (
                          <tr 
                            key={row?.id || Math.random()} 
                            onClick={() => setSelectedRecord(row)}
                            className="hover:bg-purple-50/50 cursor-pointer transition-colors"
                          >
                            <td className="p-4 font-mono font-bold text-[#7a3aec]">{String(row?.contractNo || '')}</td>
                            <td className="p-4 font-bold text-slate-700">{String(row?.vehicleNo || '')}</td>
                            <td className="p-4 text-slate-600">{String(row?.clientName || '')}</td>
                            <td className="p-4 text-slate-700 font-medium">{String(row?.seizerName || '-')}</td>
                            <td className="p-4">
                              <div className="flex flex-col gap-0.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold w-fit ${
                                  expiry.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}>
                                  {expiry.status}
                                </span>
                                {expiry.status === 'ACTIVE' && row.orderPrintDate && (
                                  <span className={`text-[10px] font-semibold ${expiry.isExpiringSoon ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                                    {expiry.daysLeft}d left
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              {pendingCount > 0 ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                                  Pending ({pendingCount})
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1 w-fit">
                                  Complete
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-slate-600">
                              {row?.yardLocation === 'Offsite' ? `Offsite (${row?.handOverBranch || 'Branch'})` : String(row?.yardLocation || '')}
                            </td>
                            <td className="p-4 font-mono font-semibold text-blue-600">
                              Rs. {parseFloat(String(row?.outstanding || '0').replace(/,/g, '')).toLocaleString()}
                            </td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => setSelectedRecord(row)} 
                                  className="p-1.5 bg-purple-100 text-[#7a3aec] rounded-lg text-xs font-bold hover:bg-[#7a3aec] hover:text-white transition-all"
                                  title="View Full Details"
                                >
                                  <Icon name="eye" className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setEditingRecord({ ...row })} 
                                  className="p-1.5 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                                  title="Edit & Update Sub-Options"
                                >
                                  <Icon name="edit" className="w-4 h-4" />
                                </button>
                                {isAdmin && (
                                  <button 
                                    onClick={() => setData(prev => prev.filter(d => d?.id !== row?.id))} 
                                    className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition-all"
                                    title="Delete Entry"
                                  >
                                    <Icon name="trash" className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredData.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">No records found matching query.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* NEW ENTRY TAB */}
          {activeTab === 'new' && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-2 text-slate-800">New Vehicle Journal Entry</h2>
              <p className="text-xs text-slate-400 mb-6">Main fields marked with (*) are compulsory. Sub-options can be left empty and updated later.</p>
              
              {/* STEP 1: MAIN COMPULSORY FIELDS */}
              {wizardStep === 1 && (
                <div className="space-y-5">
                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 mb-2">
                    <label className="text-xs font-bold text-purple-700 uppercase block mb-2">Vehicle Entry Method (Compulsory Main) *</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 font-bold cursor-pointer transition-all ${formData.actionType === 'Seized' ? 'bg-[#7a3aec] text-white border-[#7a3aec]' : 'bg-white text-slate-700 border-slate-200'}`}>
                        <input type="radio" name="actionType" value="Seized" checked={formData.actionType === 'Seized'} onChange={handleFormChange} className="hidden" />
                        SEIZED
                      </label>
                      <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 font-bold cursor-pointer transition-all ${formData.actionType === 'Handover' ? 'bg-[#7a3aec] text-white border-[#7a3aec]' : 'bg-white text-slate-700 border-slate-200'}`}>
                        <input type="radio" name="actionType" value="Handover" checked={formData.actionType === 'Handover'} onChange={handleFormChange} className="hidden" />
                        HANDOVER
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Contract No (Main) *</label>
                      <input type="text" name="contractNo" value={formData.contractNo} onChange={handleFormChange} placeholder="e.g. WGFBA055203" className="w-full bg-slate-50 border p-3 rounded-xl uppercase font-mono font-bold" required />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Vehicle No (Main) *</label>
                      <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleFormChange} placeholder="e.g. SP-BJK-1182" className="w-full bg-slate-50 border p-3 rounded-xl uppercase font-mono font-bold" required />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Client Name (Main) *</label>
                      <input type="text" name="clientName" value={formData.clientName} onChange={handleFormChange} placeholder="Full Name" className="w-full bg-slate-50 border p-3 rounded-xl" required />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Serial No (Seizing Order) *</label>
                      <input type="text" name="serialNo" value={formData.serialNo} onChange={handleFormChange} placeholder="e.g. S866797" className="w-full bg-slate-50 border p-3 rounded-xl font-mono" required />
                    </div>

                    {formData.actionType === 'Seized' ? (
                      <>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Seizer Name (Main) *</label>
                          <select name="seizerName" value={formData.seizerName} onChange={(e) => handleSeizerSelect(e.target.value)} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold">
                            <option value="">Select Registered Seizer</option>
                            {safeSeizers.map(s => <option key={s.id} value={s.name}>{s.name} ({s.nic})</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Seizer ID (NIC) *</label>
                          <input type="text" name="seizerID" value={formData.seizerID} readOnly className="w-full bg-slate-100 border p-3 rounded-xl font-mono text-slate-600" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Seized Date (Main) *</label>
                          <input type="date" name="seizedDate" value={formData.seizedDate} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Hand Over By (Main: Client / 3rd Party / Other) *</label>
                          <select name="handOverBy" value={formData.handOverBy} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-bold">
                            <option value="Client">Client</option>
                            <option value="3rd Party">3rd Party</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Hand Over Date (Main) *</label>
                          <input type="date" name="handOverDate" value={formData.handOverDate} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Release Type (Main Dropdown) *</label>
                      <select name="releaseType" value={formData.releaseType} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-bold">
                        <option value="Mortgage Release">Mortgage Release</option>
                        <option value="Garage Release">Garage Release</option>
                        <option value="Court Release">Court Release</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Vehicle Category (Main) *</label>
                      <select name="vehicleType" value={formData.vehicleType} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold">
                        <option>Motorcycle</option>
                        <option>Three-wheeler</option>
                        <option>Car</option>
                        <option>Lorry</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={submitForm} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all">
                      Save With Main Compulsory Fields
                    </button>
                    <button onClick={() => setWizardStep(2)} className="flex-1 py-4 bg-[#7a3aec] hover:bg-[#6c2ee0] text-white font-bold rounded-xl shadow-lg transition-all">
                      Continue To Sub-Options (Optional)
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: MAIN / SUB OPTIONS (NON-COMPULSORY) */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-4 text-xs text-amber-800 font-medium">
                    Note: Sub-Options are optional right now. You can leave them blank and update them anytime later from the Dashboard.
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Order Print / Reprint Date</label>
                      <input type="date" name="orderPrintDate" value={formData.orderPrintDate} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Order Issued Date</label>
                      <input type="date" name="orderIssuedDate" value={formData.orderIssuedDate} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Seizer Payment Release Date</label>
                      <input type="date" name="seizerPaymentReleaseDate" value={formData.seizerPaymentReleaseDate} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Reprocess Request (Done Or Pending)</label>
                      <select name="reprocessRequest" value={formData.reprocessRequest} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-bold">
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">H Number</label>
                      <input type="text" name="hNumber" value={formData.hNumber} onChange={handleFormChange} placeholder="e.g. H-1199" className="w-full bg-slate-50 border p-3 rounded-xl font-mono" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Yard (Kurunegala / Offsite / Homagama)</label>
                      <select name="yardLocation" value={formData.yardLocation} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-bold">
                        <option value="Kurunegala Yard">Kurunegala</option>
                        <option value="Homagama Yard">Homagama</option>
                        <option value="Offsite">Offsite</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Recovery Officer</label>
                      <input type="text" name="recoveryOfficer" value={formData.recoveryOfficer} onChange={handleFormChange} placeholder="Officer Name" className="w-full bg-slate-50 border p-3 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Hand Over Branch (Manual Type or Pick)</label>
                      <input 
                        list="branches-list-options" 
                        name="handOverBranch" 
                        value={formData.handOverBranch} 
                        onChange={handleFormChange} 
                        placeholder="Type branch name..." 
                        className="w-full bg-slate-50 border p-3 rounded-xl"
                      />
                      <datalist id="branches-list-options">
                        {BRANCHES_LIST.map((b, i) => <option key={i} value={b} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Yard Date</label>
                      <input type="date" name="yardDate" value={formData.yardDate} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Order Cancel Date</label>
                      <input type="date" name="orderCancelDate" value={formData.orderCancelDate} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Total Outstanding (Rs.)</label>
                      <input type="number" name="outstanding" value={formData.outstanding} onChange={handleFormChange} className="w-full bg-slate-50 border p-3 rounded-xl font-mono text-blue-600 font-bold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border cursor-pointer">
                      <input type="checkbox" name="seizerSpecialApprove" checked={formData.seizerSpecialApprove} onChange={handleFormChange} className="w-5 h-5 accent-[#7a3aec]" />
                      <span className="text-sm font-bold text-slate-700">Seizer Payment: Special Approve Checkbox</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border cursor-pointer">
                      <input type="checkbox" name="informToSeizer" checked={formData.informToSeizer} onChange={handleFormChange} className="w-5 h-5 accent-[#7a3aec]" />
                      <span className="text-sm font-bold text-slate-700">Inform to Seizer (Checkbox)</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl cursor-pointer col-span-2">
                      <input type="checkbox" name="specialTerminationCase" checked={formData.specialTerminationCase} onChange={handleFormChange} className="w-5 h-5 accent-rose-600" />
                      <span className="text-sm font-bold text-rose-700">Special Termination Letter Case: Inform to Mr.Athula Or Mr.Indika (Checkbox)</span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button onClick={() => setWizardStep(1)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Back to Main</button>
                    <button onClick={submitForm} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all">Save Full Entry</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEND TO YARD TAB */}
          {activeTab === 'yardfiles' && (
            <div className="max-w-5xl mx-auto flex gap-6">
              <div className="w-1/2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Send Files To Yard</h3>
                <form onSubmit={submitYardDispatch} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Contract No *</label>
                    <input type="text" value={yardDispatch.contractNo} onChange={e => setYardDispatch({...yardDispatch, contractNo: e.target.value})} placeholder="WGFBA055203" className="w-full bg-slate-50 border p-3 rounded-xl font-mono uppercase font-bold" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Vehicle No *</label>
                    <input type="text" value={yardDispatch.vehicleNo} onChange={e => setYardDispatch({...yardDispatch, vehicleNo: e.target.value})} placeholder="SP-BJK-1182" className="w-full bg-slate-50 border p-3 rounded-xl font-mono uppercase font-bold" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">To Whom (Recipient Name) *</label>
                    <input type="text" value={yardDispatch.toWhom} onChange={e => setYardDispatch({...yardDispatch, toWhom: e.target.value})} placeholder="Officer Name" className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">EPF No *</label>
                    <input type="text" value={yardDispatch.epfNo} onChange={e => setYardDispatch({...yardDispatch, epfNo: e.target.value})} placeholder="EPF Number" className="w-full bg-slate-50 border p-3 rounded-xl font-semibold font-mono" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Date Sent *</label>
                    <input type="date" value={yardDispatch.sentDate} onChange={e => setYardDispatch({...yardDispatch, sentDate: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" required />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={Boolean(yardDispatch.sentMTA6)} onChange={e => setYardDispatch({...yardDispatch, sentMTA6: e.target.checked})} className="w-4 h-4 accent-[#7a3aec]" />
                      <span className="text-sm font-bold">MTA 6</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={Boolean(yardDispatch.sentIDCopy)} onChange={e => setYardDispatch({...yardDispatch, sentIDCopy: e.target.checked})} className="w-4 h-4 accent-[#7a3aec]" />
                      <span className="text-sm font-bold">ID Copy</span>
                    </label>
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg mt-4 hover:bg-blue-700 transition-all">Record Dispatch</button>
                </form>
              </div>

              <div className="w-1/2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                <h3 className="text-lg font-bold mb-4 text-slate-800">Dispatch History</h3>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {safeYardFiles.length === 0 ? <p className="text-slate-400 text-sm">No recorded dispatches yet.</p> : safeYardFiles.map(f => (
                    <div key={f?.id || Math.random()} className="p-4 bg-slate-50 rounded-2xl border flex justify-between items-center">
                      <div>
                        <div className="font-bold text-blue-700">{String(f?.contractNo || '')} - {String(f?.vehicleNo || '')}</div>
                        <div className="text-xs text-slate-600">To: <strong>{String(f?.toWhom || '')}</strong> (EPF: {String(f?.epfNo || '')})</div>
                        <div className="text-[10px] text-slate-400">{String(f?.sentDate || '')} | {String(f?.docs || '')}</div>
                      </div>
                      <Icon name="check" className="w-5 h-5 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEIZER REGISTER (MENU 2) */}
          {activeTab === 'seizers' && (
            <div className="max-w-4xl mx-auto flex gap-6">
              <div className="w-1/2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Register New Seizer</h3>
                <form onSubmit={submitNewSeizer} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">1. Seizer Name *</label>
                    <input type="text" value={newSeizer.name} onChange={e => setNewSeizer({...newSeizer, name: e.target.value})} placeholder="Mr. A.B. Perera" className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">2. Seizer NIC *</label>
                    <input type="text" value={newSeizer.nic} onChange={e => setNewSeizer({...newSeizer, nic: e.target.value})} placeholder="851234567v" className="w-full bg-slate-50 border p-3 rounded-xl font-mono uppercase font-semibold" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Contact Phone</label>
                    <input type="text" value={newSeizer.phone} onChange={e => setNewSeizer({...newSeizer, phone: e.target.value})} placeholder="07XXXXXXXX" className="w-full bg-slate-50 border p-3 rounded-xl font-semibold" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">3. Account Number (with Passbook Image) *</label>
                    <input type="text" value={newSeizer.accountNo} onChange={e => setNewSeizer({...newSeizer, accountNo: e.target.value})} placeholder="Bank Account Number" className="w-full bg-slate-50 border p-3 rounded-xl font-mono" required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Passbook Image Upload</label>
                    <input type="file" accept="image/*" onChange={e => handleFileUploadAsBase64(e, 'passbookImg', false)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-[#7a3aec]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">4. Seizer Photo Upload</label>
                    <input type="file" accept="image/*" onChange={e => handleFileUploadAsBase64(e, 'photo', false)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-[#7a3aec]" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#7a3aec] text-white font-bold rounded-xl shadow-lg mt-2 hover:bg-[#6c2ee0]">Register New Seizer</button>
                </form>
              </div>

              <div className="w-1/2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Registered Seizers</h3>
                  <span className="text-xs font-bold text-slate-400">{safeSeizers.length} Active</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {safeSeizers.map(s => (
                    <div key={s?.id || Math.random()} className="p-4 bg-slate-50 rounded-2xl border flex items-center justify-between gap-3 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        {s?.photo ? (
                          <img src={s.photo} alt="Seizer" className="w-12 h-12 rounded-xl object-cover border" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#7a3aec] flex items-center justify-center font-bold">
                            {s?.name?.charAt(0) || 'S'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-800">{String(s?.name || '')}</div>
                          <div className="text-xs font-mono text-slate-500">NIC: {String(s?.nic || '')}</div>
                          <div className="text-xs text-slate-400">Acc: {String(s?.accountNo || 'Not Added')}</div>
                          {s?.passbookImg && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Passbook Attached
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Button to upload/update existing seizer photo/passbook */}
                      <button
                        onClick={() => setEditingSeizer({ ...s })}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-[#7a3aec] hover:bg-[#7a3aec] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                        title="Upload Photo or Passbook for this Seizer"
                      >
                        <Icon name="camera" className="w-3.5 h-3.5" /> Upload/Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS / DATA RESET */}
          {activeTab === 'settings' && isAdmin && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">System Reset & Danger Zone</h2>
              <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-rose-700">Clear All System Data</h3>
                <p className="text-sm text-rose-600 mt-1 mb-4">This will permanently delete all local storage records and restore default initial state.</p>
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reset all data to default?")) {
                      try { localStorage.clear(); } catch(e) {}
                      setData(INITIAL_RECORDS);
                      setYardFiles([]);
                      alert("All data reset successfully!");
                    }
                  }} 
                  className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-md hover:bg-rose-700 transition-all"
                >
                  Confirm Reset Data
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* POPUP CARD MODAL - Full Details on Click */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7a3aec]/10 text-[#7a3aec] flex items-center justify-center font-bold">
                  <Icon name="dashboard" className="w-5 h-5 text-[#7a3aec]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Contract: {selectedRecord.contractNo}</h3>
                  <p className="text-xs text-slate-400 font-mono">Vehicle No: {selectedRecord.vehicleNo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setEditingRecord({ ...selectedRecord });
                    setSelectedRecord(null);
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <Icon name="edit" className="w-4 h-4" /> Edit Sub-Options
                </button>
                <button 
                  onClick={() => setSelectedRecord(null)} 
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"
                >
                  <Icon name="close" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex flex-wrap gap-2 pb-4 border-b">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedRecord.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  Status: {selectedRecord.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-[#7a3aec]">
                  Method: {selectedRecord.actionType}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  Category: {selectedRecord.vehicleType}
                </span>
                {getPendingSubOptionsCount(selectedRecord) > 0 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Sub-Options: {getPendingSubOptionsCount(selectedRecord)} Pending
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    Sub-Options: Complete
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">1. Order & Client Details (Main)</h4>
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Client Name</span>
                    <strong className="text-slate-700">{selectedRecord.clientName || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Serial No (Order)</span>
                    <strong className="font-mono text-slate-700">{selectedRecord.serialNo || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Seizer Name</span>
                    <strong className="text-slate-700">{selectedRecord.seizerName || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Seizer ID (NIC)</span>
                    <strong className="font-mono text-slate-700">{selectedRecord.seizerID || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Seized Date</span>
                    <strong className="text-slate-700">{selectedRecord.seizedDate || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Order Status</span>
                    <strong className="text-slate-700">{selectedRecord.status}</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">2. Handover & Release Information (Main)</h4>
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Hand Over By</span>
                    <strong className="text-slate-700">{selectedRecord.handOverBy || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Hand Over Date</span>
                    <strong className="text-slate-700">{selectedRecord.handOverDate || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Release Type</span>
                    <strong className="text-slate-700">{selectedRecord.releaseType || 'N/A'}</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">3. Movement & Yard Sub-Options</h4>
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Order Print / Reprint Date</span>
                    <strong className="text-slate-700">{selectedRecord.orderPrintDate || <span className="text-amber-600 font-bold">Pending</span>}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Order Issued Date</span>
                    <strong className="text-slate-700">{selectedRecord.orderIssuedDate || <span className="text-amber-600 font-bold">Pending</span>}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Yard Location</span>
                    <strong className="text-slate-700">{selectedRecord.yardLocation || 'N/A'}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Hand Over Branch</span>
                    <strong className="text-slate-700">{selectedRecord.handOverBranch || <span className="text-slate-400 font-normal">None</span>}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">H Number</span>
                    <strong className="font-mono text-slate-700">{selectedRecord.hNumber || <span className="text-amber-600 font-bold">Pending</span>}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Recovery Officer</span>
                    <strong className="text-slate-700">{selectedRecord.recoveryOfficer || <span className="text-amber-600 font-bold">Pending</span>}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Yard Date</span>
                    <strong className="text-slate-700">{selectedRecord.yardDate || <span className="text-amber-600 font-bold">Pending</span>}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Order Cancel Date</span>
                    <strong className="text-slate-700">{selectedRecord.orderCancelDate || <span className="text-slate-400 font-normal">None</span>}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Reprocess Request</span>
                    <strong className="text-slate-700">{selectedRecord.reprocessRequest || 'Pending'}</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">4. Financials & Sub-Option Approvals</h4>
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Total Outstanding</span>
                    <strong className="font-mono text-blue-600 text-base">
                      Rs. {parseFloat(String(selectedRecord.outstanding || '0').replace(/,/g, '')).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Seizer Payment: Special Approve</span>
                    <strong className="text-slate-700">{selectedRecord.seizerSpecialApprove ? 'Yes' : 'No'}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Payment Release Date</span>
                    <strong className="text-slate-700">{selectedRecord.seizerPaymentReleaseDate || <span className="text-amber-600 font-bold">Pending</span>}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Inform to Seizer</span>
                    <strong className="text-slate-700">{selectedRecord.informToSeizer ? 'Yes' : 'No'}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-slate-400 block font-medium">Special Termination Letter Case</span>
                    <strong className="text-slate-700">{selectedRecord.specialTerminationCase ? 'Informed to Mr.Athula Or Mr.Indika' : 'None'}</strong>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT & UPDATE SUB-OPTIONS MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Update Sub-Options</h3>
                <p className="text-xs text-slate-400 font-mono">Contract: {editingRecord.contractNo} | Vehicle: {editingRecord.vehicleNo}</p>
              </div>
              <button onClick={() => setEditingRecord(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Order Print / Reprint Date</label>
                  <input type="date" name="orderPrintDate" value={editingRecord.orderPrintDate || ''} onChange={handleEditChange} className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-semibold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Order Issued Date</label>
                  <input type="date" name="orderIssuedDate" value={editingRecord.orderIssuedDate || ''} onChange={handleEditChange} className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-semibold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Seizer Payment Release Date</label>
                  <input type="date" name="seizerPaymentReleaseDate" value={editingRecord.seizerPaymentReleaseDate || ''} onChange={handleEditChange} className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-semibold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Reprocess Request (Done Or Pending)</label>
                  <select name="reprocessRequest" value={editingRecord.reprocessRequest || 'Pending'} onChange={handleEditChange} className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-bold">
                    <option value="Pending">Pending</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">H Number</label>
                  <input type="text" name="hNumber" value={editingRecord.hNumber || ''} onChange={handleEditChange} placeholder="e.g. H-1199" className="w-full bg-slate-50 border p-3 rounded-xl font-mono text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Yard (Kurunegala / Offsite / Homagama)</label>
                  <select name="yardLocation" value={editingRecord.yardLocation || 'Kurunegala Yard'} onChange={handleEditChange} className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-bold">
                    <option value="Kurunegala Yard">Kurunegala</option>
                    <option value="Homagama Yard">Homagama</option>
                    <option value="Offsite">Offsite</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Recovery Officer</label>
                  <input type="text" name="recoveryOfficer" value={editingRecord.recoveryOfficer || ''} onChange={handleEditChange} placeholder="Officer Name" className="w-full bg-slate-50 border p-3 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Hand Over Branch (Manual / Pick)</label>
                  <input 
                    list="edit-branches-datalist" 
                    name="handOverBranch" 
                    value={editingRecord.handOverBranch || ''} 
                    onChange={handleEditChange} 
                    placeholder="Enter branch name..." 
                    className="w-full bg-slate-50 border p-3 rounded-xl text-sm"
                  />
                  <datalist id="edit-branches-datalist">
                    {BRANCHES_LIST.map((b, i) => <option key={i} value={b} />)}
                  </datalist>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Yard Date</label>
                  <input type="date" name="yardDate" value={editingRecord.yardDate || ''} onChange={handleEditChange} className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-semibold" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Order Cancel Date</label>
                  <input type="date" name="orderCancelDate" value={editingRecord.orderCancelDate || ''} onChange={handleEditChange} className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-semibold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border cursor-pointer">
                  <input type="checkbox" name="seizerSpecialApprove" checked={Boolean(editingRecord.seizerSpecialApprove)} onChange={handleEditChange} className="w-4 h-4 accent-[#7a3aec]" />
                  <span className="text-xs font-bold text-slate-700">Seizer Payment: Special Approve Checkbox</span>
                </label>
                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border cursor-pointer">
                  <input type="checkbox" name="informToSeizer" checked={Boolean(editingRecord.informToSeizer)} onChange={handleEditChange} className="w-4 h-4 accent-[#7a3aec]" />
                  <span className="text-xs font-bold text-slate-700">Inform to Seizer (Checkbox)</span>
                </label>
                <label className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl cursor-pointer col-span-2">
                  <input type="checkbox" name="specialTerminationCase" checked={Boolean(editingRecord.specialTerminationCase)} onChange={handleEditChange} className="w-4 h-4 accent-rose-600" />
                  <span className="text-xs font-bold text-rose-700">Special Termination Letter Case: Inform to Mr.Athula Or Mr.Indika (Checkbox)</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button onClick={() => setEditingRecord(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm">Cancel</button>
                <button onClick={saveUpdatedRecord} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg transition-all">Save Sub-Options</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SEIZER MODAL - Upload Photo & Passbook for existing Seizer */}
      {editingSeizer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-y-auto shadow-2xl border border-slate-100 p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Update Seizer Documents</h3>
                <p className="text-xs text-slate-400 font-medium">Seizer: {editingSeizer.name} ({editingSeizer.nic})</p>
              </div>
              <button onClick={() => setEditingSeizer(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={saveUpdatedSeizer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Bank Account Number *</label>
                <input 
                  type="text" 
                  value={editingSeizer.accountNo || ''} 
                  onChange={(e) => setEditingSeizer({ ...editingSeizer, accountNo: e.target.value })} 
                  className="w-full bg-slate-50 border p-3 rounded-xl font-mono text-sm" 
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Contact Phone</label>
                <input 
                  type="text" 
                  value={editingSeizer.phone || ''} 
                  onChange={(e) => setEditingSeizer({ ...editingSeizer, phone: e.target.value })} 
                  className="w-full bg-slate-50 border p-3 rounded-xl text-sm" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Upload Bank Passbook Image</label>
                {editingSeizer.passbookImg && (
                  <div className="mb-2">
                    <img src={editingSeizer.passbookImg} alt="Passbook" className="h-20 w-auto rounded-lg border object-contain bg-slate-50 p-1" />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUploadAsBase64(e, 'passbookImg', true)} 
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-[#7a3aec]" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Upload Seizer Photo</label>
                {editingSeizer.photo && (
                  <div className="mb-2">
                    <img src={editingSeizer.photo} alt="Photo" className="h-20 w-auto rounded-lg border object-cover" />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileUploadAsBase64(e, 'photo', true)} 
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-[#7a3aec]" 
                />
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button type="button" onClick={() => setEditingSeizer(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#7a3aec] text-white font-bold rounded-xl text-sm shadow-lg hover:bg-[#6c2ee0] transition-all">Save Documents</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
