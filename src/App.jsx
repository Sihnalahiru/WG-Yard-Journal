import React, { useState, useEffect, useRef, Component } from 'react';

const safeLocalStorageValue = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === '') return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (error) {
    return fallback;
  }
};

// --- Error Boundary ---
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
              className="w-full py-3 bg-[#8B0000] text-white font-bold rounded-xl shadow-lg hover:bg-[#700000] transition-all"
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
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-[...]
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />,
    send: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2[...]
    settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724[...]
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1[...]
    lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />,
    eye: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.58[...]
    clock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.3[...]
    camera: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H1[...]
    truck: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h[...]
    shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.8[...]
    bike: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 16a3 3 0 100-6 3 3 0 000 6zm14 0a3 3 0 100-6 3 3 0 000 6zm-7-4l2-4h3m-5 4l-3-4H6" />,
    car: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17a2 2 0 11-4 0 2 2 0 014 0zm12 0a2 2 0 11-4 0 2 2 0 014 0zM4 11l2-4h12l2 4M4 11h16M4 11v6h2m12 0h2v-6" />
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name] || icons.dashboard}
    </svg>
  );
};

const getAssetUrl = (fileName) => {
  const base = import.meta.env?.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${encodeURIComponent(fileName)}`;
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

// Clean 40 Excel Records
const INITIAL_RECORDS = [
  { id: '1', contractNo: 'WGMBA053816', vehicleNo: 'SP-BJK-1182', clientName: 'MR. H.S.SHALIKA SELLAHEWA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866797', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-15', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '12000', status: 'ACTIVE', orderPrintDate: '2024-10-15', orderIssuedDate: '2024-10-16', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '2', contractNo: 'WGMBA053816', vehicleNo: 'SP-BJW-5312', clientName: 'MR. S.D.T.S.J. FERANANDO', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866798', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-17', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '13000', status: 'ACTIVE', orderPrintDate: '2024-10-17', orderIssuedDate: '2024-10-18', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '3', contractNo: 'WGFBA060694', vehicleNo: 'SP-BGL-3152', clientName: 'MR. M.J.M. JUMAN', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866799', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-18', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '14000', status: 'ACTIVE', orderPrintDate: '2024-10-18', orderIssuedDate: '2024-10-19', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '4', contractNo: 'WGMBA061994', vehicleNo: 'SP-BJX-1479', clientName: 'MR. P.G.K.M. AMARASINGHE', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866800', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-19', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '15000', status: 'ACTIVE', orderPrintDate: '2024-10-19', orderIssuedDate: '2024-10-20', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '5', contractNo: 'WGMBA059801', vehicleNo: 'SP-BJS-6785', clientName: 'MRS. A.G.U. SHASHIKALA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866801', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-20', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '16000', status: 'ACTIVE', orderPrintDate: '2024-10-20', orderIssuedDate: '2024-10-21', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '6', contractNo: 'WGAUA027370', vehicleNo: '58-0171', clientName: 'MR. A.G.T. SANDAMAL', vehicleType: 'Car', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866802', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-21', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '17000', status: 'ACTIVE', orderPrintDate: '2024-10-21', orderIssuedDate: '2024-10-22', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '7', contractNo: 'WGTWA068225', vehicleNo: 'SP-YI-3165', clientName: 'MR. M.N.M. ILHAM', vehicleType: 'Three-wheeler', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866803', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-22', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '18000', status: 'ACTIVE', orderPrintDate: '2024-10-22', orderIssuedDate: '2024-10-23', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '8', contractNo: 'WGMBA065723', vehicleNo: 'SP-BKC-7134', clientName: 'MR. H.P.V. NILANKA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866804', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-23', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '19000', status: 'ACTIVE', orderPrintDate: '2024-10-23', orderIssuedDate: '2024-10-24', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '9', contractNo: 'WGMBA065705', vehicleNo: 'SP-BKC-7089', clientName: 'MR. K.P.D. KITHSIRI', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866805', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-24', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '20000', status: 'ACTIVE', orderPrintDate: '2024-10-24', orderIssuedDate: '2024-10-25', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '10', contractNo: 'WGMBA065884', vehicleNo: 'SP-BKE-1731', clientName: 'MR. H.G.R. RAJKUMAR', vehicleType: 'Motorcycle', actionType: 'Seized', chargeType: 'Seizing Charge', serialNo: 'S866806', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-25', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '21000', status: 'ACTIVE', orderPrintDate: '2024-10-25', orderIssuedDate: '2024-10-26', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '11', contractNo: 'WGFBA066999', vehicleNo: 'SP-BFU-6062', clientName: 'MR. A.K.P. NIMSARA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866807', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-26', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '22000', status: 'ACTIVE', orderPrintDate: '2024-10-26', orderIssuedDate: '2024-10-27', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '12', contractNo: 'WGFBA065866', vehicleNo: 'WP-BEN-6453', clientName: 'MR. E.P. NADUN', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866808', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-27', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '23000', status: 'ACTIVE', orderPrintDate: '2024-10-27', orderIssuedDate: '2024-10-28', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '13', contractNo: 'WGFBA060825', vehicleNo: 'CP-BFW-5502', clientName: 'MR. R.K. LORONSUHEWA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866809', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-28', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '24000', status: 'ACTIVE', orderPrintDate: '2024-10-28', orderIssuedDate: '2024-10-29', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '14', contractNo: 'WGMBA067961', vehicleNo: 'SP-BKI-2567', clientName: 'MR. C.P.G. JAYAWARDHANA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866810', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-29', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '25000', status: 'ACTIVE', orderPrintDate: '2024-10-29', orderIssuedDate: '2024-10-30', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '15', contractNo: 'WGFBA066096', vehicleNo: 'SP-BFG-2391', clientName: 'MR. K.H.D. THARANGA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866811', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-10-30', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '26000', status: 'ACTIVE', orderPrintDate: '2024-10-30', orderIssuedDate: '2024-10-31', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '16', contractNo: 'WGFBA058325', vehicleNo: 'SP-BAV-2298', clientName: 'MR. H.K.S. MADUSHANKA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866812', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-01', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '27000', status: 'ACTIVE', orderPrintDate: '2024-11-01', orderIssuedDate: '2024-11-02', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '17', contractNo: 'WGMBA058750', vehicleNo: 'SP-BJQ-8237', clientName: 'MRS. M.M.F. AYSHA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866813', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-02', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '28000', status: 'ACTIVE', orderPrintDate: '2024-11-02', orderIssuedDate: '2024-11-03', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '18', contractNo: 'WGFBA069853', vehicleNo: 'SP-BAS-6586', clientName: 'MR. W.A.N. UDAYANGA', vehicleType: 'Motorcycle', actionType: 'Seized', chargeType: 'Seizing Charge', serialNo: 'S866814', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-03', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '29000', status: 'ACTIVE', orderPrintDate: '2024-11-03', orderIssuedDate: '2024-11-04', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '19', contractNo: 'WGBQA037377', vehicleNo: 'SP-BCQ-7009', clientName: 'MRS. A.R.S. RANASINGHA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866815', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-04', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '30000', status: 'ACTIVE', orderPrintDate: '2024-11-04', orderIssuedDate: '2024-11-05', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '20', contractNo: 'WGMBA064292', vehicleNo: 'SP-BKA-3659', clientName: 'MR. M.D.A.P. ABEWICKRAMA', vehicleType: 'Motorcycle', actionType: 'Seized', chargeType: 'Seizing Charge', serialNo: 'S866816', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-05', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '31000', status: 'ACTIVE', orderPrintDate: '2024-11-05', orderIssuedDate: '2024-11-06', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '21', contractNo: 'WGFBA061754', vehicleNo: 'SP-BBT-8848', clientName: 'MISS. H.H.T. HANSANI', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866817', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-06', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '32000', status: 'ACTIVE', orderPrintDate: '2024-11-06', orderIssuedDate: '2024-11-07', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '22', contractNo: 'WGBQA054958', vehicleNo: 'SP-BGL-8268', clientName: 'MR. N.A. ABEYGUNAWARDENA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866818', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-07', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '33000', status: 'ACTIVE', orderPrintDate: '2024-11-07', orderIssuedDate: '2024-11-08', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '23', contractNo: 'WGTWA030718', vehicleNo: 'SP-HB-5160', clientName: 'MR. B. JAYANTHA', vehicleType: 'Three-wheeler', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866819', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-08', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '34000', status: 'ACTIVE', orderPrintDate: '2024-11-08', orderIssuedDate: '2024-11-09', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '24', contractNo: 'WGFBA071919', vehicleNo: 'NP-BIY-7311', clientName: 'MR. A.A. AWADH', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866820', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-10', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '35000', status: 'ACTIVE', orderPrintDate: '2024-11-10', orderIssuedDate: '2024-11-11', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '27', contractNo: 'WGFBA068748', vehicleNo: 'SP-BGD-1781', clientName: 'MRS. N.H.K. WIKCRAMARATHNA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866821', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-12', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '36000', status: 'ACTIVE', orderPrintDate: '2024-11-12', orderIssuedDate: '2024-11-13', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '28', contractNo: 'WGFBA056309', vehicleNo: 'SP-BEP-6577', clientName: 'MRS. H.G.N. CHANDIMA', vehicleType: 'Motorcycle', actionType: 'Order Issued', chargeType: 'Seizing Charge', serialNo: 'S866822', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '2024-11-14', handOverBy: '', handOverDate: '', yardLocation: 'Kurunegala Yard', chargeAmount: '37000', status: 'ACTIVE', orderPrintDate: '2024-11-14', orderIssuedDate: '2024-11-15', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '29', contractNo: 'WGFBA074907', vehicleNo: 'NW-WX-0186', clientName: 'MISS. H.T.M. NIHATHAMANI', vehicleType: 'Three-wheeler', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866823', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-11-16', yardLocation: 'Kurunegala Yard', chargeAmount: '38000', status: 'ACTIVE', orderPrintDate: '2024-11-16', orderIssuedDate: '2024-11-17', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '30', contractNo: 'WGFBA073120', vehicleNo: 'SP-XJ-7170', clientName: 'MR. J.V. SAMANTHA', vehicleType: 'Three-wheeler', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866824', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-11-18', yardLocation: 'Kurunegala Yard', chargeAmount: '39000', status: 'ACTIVE', orderPrintDate: '2024-11-18', orderIssuedDate: '2024-11-19', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '31', contractNo: 'WGFBA069844', vehicleNo: 'SP-XF-5244', clientName: 'MR. M. ARUN', vehicleType: 'Three-wheeler', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866825', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-11-20', yardLocation: 'Kurunegala Yard', chargeAmount: '40000', status: 'ACTIVE', orderPrintDate: '2024-11-20', orderIssuedDate: '2024-11-21', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '32', contractNo: 'WGFBA064478', vehicleNo: 'SP-BHY-8420', clientName: 'MR.M.T.M.ARKAM', vehicleType: 'Motorcycle', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866826', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-11-22', yardLocation: 'Kurunegala Yard', chargeAmount: '41000', status: 'ACTIVE', orderPrintDate: '2024-11-22', orderIssuedDate: '2024-11-23', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '33', contractNo: 'WGFBA074244', vehicleNo: 'UP-BJA-8693', clientName: 'MRS.K.W.Y.POORNIMA', vehicleType: 'Motorcycle', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866827', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-11-24', yardLocation: 'Kurunegala Yard', chargeAmount: '42000', status: 'ACTIVE', orderPrintDate: '2024-11-24', orderIssuedDate: '2024-11-25', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '34', contractNo: 'WGFBA073069', vehicleNo: 'SP-BEZ-4574', clientName: 'MRS. V.D. WAJIRANI', vehicleType: 'Motorcycle', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866828', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-11-26', yardLocation: 'Kurunegala Yard', chargeAmount: '43000', status: 'ACTIVE', orderPrintDate: '2024-11-26', orderIssuedDate: '2024-11-27', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '35', contractNo: 'WGFBA074907', vehicleNo: 'NW-WX-0186', clientName: 'MISS. H.T.M. NIHATHAMANI', vehicleType: 'Three-wheeler', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866829', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-11-28', yardLocation: 'Kurunegala Yard', chargeAmount: '44000', status: 'ACTIVE', orderPrintDate: '2024-11-28', orderIssuedDate: '2024-11-29', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '36', contractNo: 'WGFBA075580', vehicleNo: 'SP-WS-4230', clientName: 'MR. S.D.P. DENAGAMAGE', vehicleType: 'Three-wheeler', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866830', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-11-30', yardLocation: 'Kurunegala Yard', chargeAmount: '45000', status: 'ACTIVE', orderPrintDate: '2024-11-30', orderIssuedDate: '2024-12-01', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '37', contractNo: 'WGFBA057502', vehicleNo: 'SP-BCJ-5625', clientName: 'MRS. R.N.G.T.D. LANKAGE', vehicleType: 'Motorcycle', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866831', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-12-02', yardLocation: 'Kurunegala Yard', chargeAmount: '46000', status: 'ACTIVE', orderPrintDate: '2024-12-02', orderIssuedDate: '2024-12-03', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '38', contractNo: 'WGFBA069206', vehicleNo: 'SP-XP-9629', clientName: 'MR. P.B. VIRAJ', vehicleType: 'Three-wheeler', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866832', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-12-04', yardLocation: 'Kurunegala Yard', chargeAmount: '47000', status: 'ACTIVE', orderPrintDate: '2024-12-04', orderIssuedDate: '2024-12-05', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '39', contractNo: 'WGFBA074341', vehicleNo: 'SP-BBF-2536', clientName: 'MR. K.K.I. MADUSANKA', vehicleType: 'Motorcycle', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866833', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-12-06', yardLocation: 'Kurunegala Yard', chargeAmount: '48000', status: 'ACTIVE', orderPrintDate: '2024-12-06', orderIssuedDate: '2024-12-07', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '40', contractNo: 'WGFBA074776', vehicleNo: 'SP-BAB-6332', clientName: 'MRS. L.M. GIMHANI', vehicleType: 'Motorcycle', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866834', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-12-08', yardLocation: 'Kurunegala Yard', chargeAmount: '49000', status: 'ACTIVE', orderPrintDate: '2024-12-08', orderIssuedDate: '2024-12-09', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '41', contractNo: 'WGFBA072538', vehicleNo: 'SP-BDS-7165', clientName: 'MR. U.G.P. MADUSHAN', vehicleType: 'Motorcycle', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866835', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-12-10', yardLocation: 'Kurunegala Yard', chargeAmount: '50000', status: 'ACTIVE', orderPrintDate: '2024-12-10', orderIssuedDate: '2024-12-11', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
  { id: '42', contractNo: 'WGFBA074572', vehicleNo: 'SP-BDD-0061', clientName: 'MR. T.S.T. KUMARA', vehicleType: 'Motorcycle', actionType: 'Handover', chargeType: 'Transport Charge', serialNo: 'S866836', seizerName: 'Mr. K.A.P Indika', seizerID: '781032786v', seizedDate: '', handOverBy: 'Client', handOverDate: '2024-12-12', yardLocation: 'Kurunegala Yard', chargeAmount: '51000', status: 'ACTIVE', orderPrintDate: '2024-12-12', orderIssuedDate: '2024-12-13', seizerPaymentReleaseDate: '', reprocessRequest: 'Pending', hNumber: '', recoveryOfficer: '', yardDate: '', specialTerminationCase: false, seizerSpecialApprove: false, informToSeizer: false },
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

// Safe date calculation to avoid any NaN or runtime crashes
const getOrderExpiryInfo = (printDate) => {
  if (!printDate || String(printDate).trim() === '') {
    return { status: 'ACTIVE', daysLeft: 14, isExpiringSoon: false };
  }
  try {
    const pDate = new Date(printDate);
    if (isNaN(pDate.getTime())) {
      return { status: 'ACTIVE', daysLeft: 14, isExpiringSoon: false };
    }
    const today = new Date();
    const diffTime = today - pDate;
    const elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = 14 - elapsedDays;
    if (daysLeft <= 0) {
      return { status: 'EXPIRED', daysLeft: 0, isExpiringSoon: false };
    }
    return {
      status: 'ACTIVE',
      daysLeft: isNaN(daysLeft) ? 14 : daysLeft,
      isExpiringSoon: daysLeft <= 3
    };
  } catch (e) {
    return { status: 'ACTIVE', daysLeft: 14, isExpiringSoon: false };
  }
};

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const fileInputRef = useRef(null);

  // Safe localStorage Loader with darkred version key
  const [data, setData] = useState(() => {
    const fallback = INITIAL_RECORDS.map((record) => ({
      ...record,
      yardLocation:
        !record.seizedDate && (!record.handOverBy || record.handOverBy === 'N/A')
          ? '0'
          : record.yardLocation || 'Kurunegala Yard',
    }));
    const saved = safeLocalStorageValue('wgYard_final_red_v35', fallback);
    if (!Array.isArray(saved) || saved.length === 0) return fallback;
    return saved.filter(Boolean).map((record) => ({
      ...record,
      yardLocation:
        !record.seizedDate && (!record.handOverBy || record.handOverBy === 'N/A')
          ? '0'
          : record.yardLocation || 'Kurunegala Yard',
    }));
  });

  // Persistent Seizer Vault (Protected against standard resets)
  const [seizers, setSeizers] = useState(() => {
    const fallback = INITIAL_SEIZERS;
    const saved = safeLocalStorageValue('wg_persistent_seizers_vault_v35', fallback);
    if (!Array.isArray(saved) || saved.length === 0) return fallback;
    return saved.filter(Boolean);
  });

  const [yardFiles, setYardFiles] = useState(() => {
    const fallback = [];
    const saved = safeLocalStorageValue('wgYardFiles_final_red_v35', fallback);
    if (!Array.isArray(saved)) return fallback;
    return saved.filter(Boolean);
  });

  // Modal States
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingSeizer, setEditingSeizer] = useState(null);

  // Quick Filter State
  const [filterTab, setFilterTab] = useState('all');

  useEffect(() => {
    try { localStorage.setItem('wgYard_final_red_v35', JSON.stringify(data)); } catch (e) {}
  }, [data]);

  useEffect(() => {
    try { localStorage.setItem('wg_persistent_seizers_vault_v35', JSON.stringify(seizers)); } catch (e) {}
  }, [seizers]);

  useEffect(() => {
    try { localStorage.setItem('wgYardFiles_final_red_v35', JSON.stringify(yardFiles)); } catch (e) {}
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
    chargeType: 'Seizing Charge',
    handOverBy: '',
    handOverDate: '',
    vehicleCondition: '',
    releaseType: '',
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
    chargeAmount: '',
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
    contractNo: '', vehicleNo: '', toWhom: '', epfNo: '', sentDate: '', sentMTA6: false, sentIDCopy: false, sentInventory: false, sentClientLetter: false, sentHFORM: false
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

  const handleActionTypeChange = (type) => {
    if (type === 'Handover') {
      setFormData(prev => ({
        ...prev,
        actionType: 'Handover',
        chargeType: 'Transport Charge',
        handOverBy: prev.handOverBy || 'Client',
        seizerName: prev.seizerName || 'Mr. K.A.P Indika',
        seizerID: prev.seizerID || '781032786v'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        actionType: 'Seized',
        chargeType: 'Seizing Charge',
        handOverBy: prev.handOverBy || ''
      }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'seizedDate' || name === 'handOverBy') {
        const hasSeizureOrHandover = Boolean(next.seizedDate || (next.handOverBy && next.handOverBy !== 'N/A'));
        if (!hasSeizureOrHandover) next.yardLocation = '0';
        else if (!prev.seizedDate && (!prev.handOverBy || prev.handOverBy === 'N/A') && (!next.yardLocation || next.yardLocation === '0')) next.yardLocation = 'Kurunegala Yard';
      }
      return next;
    });
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
    alert("New Seizer registered successfully in persistent vault!");
  };

  const saveUpdatedSeizer = (e) => {
    e.preventDefault();
    if (!editingSeizer) return;
    setSeizers(prev => prev.map(s => s.id === editingSeizer.id ? editingSeizer : s));
    setEditingSeizer(null);
    alert("Seizer documents updated and permanently saved!");
  };

  // Main compulsory validation (Release Type is optional/blank permitted)
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
      chargeType: formData.chargeType || (formData.actionType === 'Handover' ? 'Transport Charge' : 'Seizing Charge'),
      handOverBy: formData.handOverBy || '',
      handOverDate: formData.actionType === 'Handover' ? formData.handOverDate : '',
      vehicleCondition: formData.actionType === 'Handover' ? (formData.vehicleCondition || '') : '',
      releaseType: formData.releaseType || '',
      vehicleType: formData.vehicleType || 'Motorcycle',
      status: expiryInfo.status,

      orderPrintDate: formData.orderPrintDate || '',
      orderIssuedDate: formData.orderIssuedDate || '',
      seizerSpecialApprove: Boolean(formData.seizerSpecialApprove),
      seizerPaymentReleaseDate: formData.seizerPaymentReleaseDate || '',
      reprocessRequest: formData.reprocessRequest || 'Pending',
      hNumber: formData.hNumber || '',
      yardLocation: (!formData.seizedDate && (!formData.handOverBy || formData.handOverBy === 'N/A')) ? '0' : (formData.yardLocation || 'Kurunegala Yard'),
      recoveryOfficer: formData.recoveryOfficer || '',
      handOverBranch: formData.handOverBranch || '',
      orderCancelDate: formData.orderCancelDate || '',
      informToSeizer: Boolean(formData.informToSeizer),
      yardDate: formData.yardDate || '',
      specialTerminationCase: Boolean(formData.specialTerminationCase),
      chargeAmount: formData.chargeAmount || '0',
      seizerFee: formData.seizerFee || '0',
      isSold: 'No',
      soldAmount: '0',
      currentBalance: '0',
      clientPaid: formData.clientPaid || 'No',
      seizerPaymentStatus: formData.seizerPaymentStatus || 'Pending',
      docs: [
        formData.docsMTA6 ? 'MTA6' : '',
        formData.docsID ? 'ID Copy' : '',
        formData.docsHForm ? 'HFORM' : '',
        formData.docsLetter ? 'Client Hand Over Letter' : '',
        formData.docsInventory ? 'Inventory' : ''
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
      yardLocation: (!editingRecord.seizedDate && (!editingRecord.handOverBy || editingRecord.handOverBy === 'N/A')) ? '0' : (editingRecord.yardLocation || 'Kurunegala Yard'),
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
      docs: [yardDispatch.sentMTA6 ? 'MTA6' : '', yardDispatch.sentIDCopy ? 'ID Copy' : '', yardDispatch.sentInventory ? 'Inventory' : '', yardDispatch.sentClientLetter ? 'Client Hand Over Letter' : '', yardDispatch.sentHFORM ? 'HFORM' : ''].filter(Boolean).join(', ')
    };
    setYardFiles(prev => [newDispatch, ...(Array.isArray(prev) ? prev : [])]);
    setYardDispatch({ contractNo: '', vehicleNo: '', toWhom: '', epfNo: '', sentDate: '', sentMTA6: false, sentIDCopy: false, sentInventory: false, sentClientLetter: false, sentHFORM: false });
    alert("Yard file dispatch recorded!");
  };

  const exportToExcel = () => {
    let csvContent = "\uFEFFContract No,Client Name,Vehicle No,Serial No,Seizer Name,Seizer ID,Action Type,Charge Type,Order Print Date,Order Issued Date,Seized Date,Status,Seizer Payment,Payment Amount,Yard Location,Vehicle Type\n";
    (data || []).forEach(r => {
      csvContent += `"${r.contractNo || ''}","${r.clientName || ''}","${r.vehicleNo || ''}","${r.serialNo || ''}","${r.seizerName || ''}","${r.seizerID || ''}","${r.actionType || ''}","${r.chargeType || ''}","${r.orderPrintDate || ''}","${r.orderIssuedDate || ''}","${r.seizedDate || ''}","${r.status || ''}","${r.seizerPaymentStatus || ''}","${r.chargeAmount || ''}","${r.yardLocation || ''}","${r.vehicleType || ''}"\n`;
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

  // VLOOKUP Column C (CONTRACT_NO), Column N (CAPITAL_OUTSTANDING)
  // FIX: Only update yard location if the Excel file explicitly has an updated non-empty yard value!
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split(/\r\n|\n/);
        const vlookupMap = {};
        const yardUpdateMap = {};

        lines.forEach((line) => {
          if (!line || !line.trim()) return;
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/(^"|"$)/g, '').trim());
          const contractNo = cols[2];
          const outstandingVal = cols[13];
          const yardColVal = cols[18];

          if (contractNo && String(contractNo).toUpperCase() !== 'CONTRACT_NO' && outstandingVal !== undefined && outstandingVal !== '') {
            const parsedNum = parseFloat(String(outstandingVal).replace(/,/g, ''));
            if (!isNaN(parsedNum)) {
              vlookupMap[String(contractNo).trim().toUpperCase()] = parsedNum;
            }
          }

          if (contractNo && yardColVal && yardColVal.trim() !== '' && yardColVal.toLowerCase() !== 'nat' && yardColVal.toLowerCase() !== 'nan') {
            yardUpdateMap[String(contractNo).trim().toUpperCase()] = yardColVal.trim();
          }
        });

        let updatedCount = 0;
        setData(prevData => {
          const safe = Array.isArray(prevData) ? prevData.filter(Boolean) : [];
          return safe.map(item => {
            const key = String(item.contractNo || '').trim().toUpperCase();
            let hasChange = false;
            let updatedItem = { ...item };

            if (vlookupMap[key] !== undefined) {
              updatedItem.chargeAmount = vlookupMap[key].toString();
              hasChange = true;
            }
            if (yardUpdateMap[key] !== undefined && yardUpdateMap[key] !== '') {
              updatedItem.yardLocation = yardUpdateMap[key];
              hasChange = true;
            }

            if (hasChange) updatedCount++;
            return updatedItem;
          });
        });

        alert(`VLOOKUP Complete! Updated records for ${updatedCount} contracts. Yard Locations preserved unless explicitly updated in file.`);
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
  const totalPaymentSum = safeData.reduce((acc, curr) => acc + (parseFloat(String(curr.chargeAmount || 0).replace(/,/g, '')) || 0), 0);
  const specialTerminationCount = safeData.filter(d => Boolean(d.specialTerminationCase)).length;

  // Category Counts
  const motorcycleCount = safeData.filter(d => d?.vehicleType === 'Motorcycle').length;
  const threeWheelerCount = safeData.filter(d => d?.vehicleType === 'Three-wheeler').length;
  const carCount = safeData.filter(d => d?.vehicleType === 'Car').length;
  const lorryCount = safeData.filter(d => d?.vehicleType === 'Lorry').length;
  const totalVehicles = safeData.length || 1;

  // Charges Distribution
  const transportChargesCount = safeData.filter(d => d.chargeType === 'Transport Charge').length;
  const seizingChargesCount = safeData.filter(d => d.chargeType === 'Seizing Charge').length;

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
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc' }} className="text-slate-800 font-sans">
      
      {/* Sidebar Navigation - Corporate Dark Red Theme */}
      <aside className="w-72 bg-[#7f1d1d] rounded-r-3xl my-4 ml-4 shadow-2xl flex flex-col justify-between text-white z-20">
        <div>
          <div className="h-28 flex items-center justify-center border-b border-white/10 mx-4 px-2">
            <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-2xl w-full shadow-inner">
              <img 
                src={COMPANY_LOGO} 
                alt="Logo" 
                className="h-10 w-12 object-contain bg-white rounded-xl p-1 shadow-md"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-white text-[#991b1b] shadow-lg' : 'text-white/80 hover:bg-white/10'}`}
            >
              <Icon name="dashboard" /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('new')} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'new' ? 'bg-white text-[#991b1b] shadow-lg' : 'text-white/80 hover:bg-white/10'}`}
            >
              <Icon name="plus" /> New Entry
            </button>
            <button 
              onClick={() => setActiveTab('yardfiles')} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'yardfiles' ? 'bg-white text-[#991b1b] shadow-lg' : 'text-white/80 hover:bg-white/10'}`}
            >
              <Icon name="send" /> Send to Yard
            </button>
            <button 
              onClick={() => setActiveTab('seizers')} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${activeTab === 'seizers' ? 'bg-white text-[#991b1b] shadow-lg' : 'text-white/80 hover:bg-white/10'}`}
            >
              <Icon name="users" /> Seizer Register
            </button>
            {isAdmin && (
              <button 
                onClick={() => setActiveTab('settings')} 
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all mt-6 ${activeTab === 'settings' ? 'bg-white text-rose-700 shadow-lg' : 'text-white/80 hover:bg-white/10'}`}
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
              <button onClick={() => setIsAdmin(false)} className="w-full mt-2 py-2 text-xs font-bold bg-[#991b1b] hover:bg-[#b91c1c] rounded-xl transition-all">Logout</button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} className="w-full py-3 text-xs font-bold text-white bg-white/20 rounded-xl hover:bg-white hover:text-[#991b1b] transition-all flex items-center justify-center gap-2">
              <Icon name="lock" className="w-4 h-4" /> Admin Login
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden px-6">
        <header className="h-24 flex items-center justify-between pt-4">
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="search" className="w-5 h-5"/></span>
            <input 
              type="text" 
              placeholder="Search Contract, Vehicle, Client, Branch..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white shadow-sm rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]/30"
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
              className="flex items-center gap-2 px-5 py-2.5 bg-[#991b1b] text-white shadow-md rounded-full text-xs font-bold hover:bg-[#7f1d1d] transition-all"
            >
              <Icon name="download" className="w-4 h-4" /> EXPORT EXCEL
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pb-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orders Status</span>
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">14d</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-emerald-600">{activeOrdersCount}</h3>
                    <span className="text-xs text-slate-400 font-semibold">Active</span>
                    <span className="text-slate-300">/</span>
                    <h4 className="text-xl font-bold text-rose-500">{expiredOrdersCount}</h4>
                    <span className="text-xs text-slate-400 font-semibold">Expired</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yard Tracking</span>
                    <span className="w-8 h-8 rounded-full bg-red-100 text-[#991b1b] flex items-center justify-center text-xs font-black">Loc</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-[#991b1b]">{kurunegalaCount + homagamaCount}</h3>
                    <span className="text-xs text-slate-400 font-semibold">In Yard</span>
                    <span className="text-slate-300">/</span>
                    <h4 className="text-xl font-bold text-blue-500">{offsiteCount}</h4>
                    <span className="text-xs text-slate-400 font-semibold">Offsite</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sub-Options Audit</span>
                    <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">Opt</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-amber-600">{pendingSubOptionsCount}</h3>
                    <span className="text-xs text-slate-400 font-semibold">Pending Updates</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Payments (Fee)</span>
                    <span className="w-8 h-8 rounded-full bg-red-100 text-[#991b1b] flex items-center justify-center text-xs font-black">Rs</span>
                  </div>
                  <h3 className="text-2xl font-black text-[#991b1b] truncate">Rs. {totalPaymentSum.toLocaleString()}</h3>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Master Intelligence Grid</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Click any row to view full popup details or edit sub-options</p>
                  </div>
                  <span className="text-xs font-bold text-[#991b1b] bg-red-50 px-4 py-1.5 rounded-full border border-red-100">{filteredData.length} Matches Found</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold">
                      <tr>
                        <th className="p-4">Contract No</th>
                        <th className="p-4">Vehicle No</th>
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Seizer Name</th>
                        <th className="p-4">Charge Type</th>
                        <th className="p-4">Order Status</th>
                        <th className="p-4">Sub-Options</th>
                        <th className="p-4">Yard Location</th>
                        <th className="p-4">Payment (Rs.)</th>
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
                            className="hover:bg-red-50/40 cursor-pointer transition-colors"
                          >
                            <td className="p-4 font-mono font-bold text-[#991b1b]">{String(row?.contractNo || '')}</td>
                            <td className="p-4 font-bold text-slate-700">{String(row?.vehicleNo || '')}</td>
                            <td className="p-4 text-slate-600">{String(row?.clientName || '')}</td>
                            <td className="p-4 text-slate-700 font-medium">{String(row?.seizerName || '-')}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${row?.chargeType === 'Transport Charge' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-red-50 text-[#991b1b] border border-red-200'}`}>
                                {row?.chargeType || 'Seizing Charge'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-0.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold w-fit ${expiry.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                  {expiry.status}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              {pendingCount > 0 ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">Pending ({pendingCount})</span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1 w-fit">Complete</span>
                              )}
                            </td>
                            <td className="p-4 text-slate-600">{row?.yardLocation === 'Offsite' ? `Offsite (${row?.handOverBranch || 'Branch'})` : String(row?.yardLocation || '')}</td>
                            <td className="p-4 font-mono font-semibold text-[#991b1b]">Rs. {parseFloat(String(row?.chargeAmount || '0').replace(/,/g, '')).toLocaleString()}</td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => setSelectedRecord(row)} 
                                  className="p-1.5 bg-red-50 text-[#991b1b] rounded-lg text-xs font-bold hover:bg-[#991b1b] hover:text-white transition-all border border-red-100"
                                  title="View Full Details"
                                >
                                  <Icon name="eye" className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setEditingRecord({ ...row })} 
                                  className="p-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-[#991b1b] hover:text-white transition-all"
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
        </div>
      </main>
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
