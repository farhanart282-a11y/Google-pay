import { useState, useEffect } from 'react';
import { 
  Search, QrCode, Contact, Phone, Landmark, AtSign, ArrowLeftRight, 
  Receipt, Smartphone, ChevronDown, ArrowLeft, X, Camera, 
  User as UserIcon, CreditCard, History, ShieldCheck, Info,
  CheckCircle2, AlertCircle, IndianRupee, Download
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { installPWA, isStandalone } from './pwa-install';
import { InstallDebug } from './InstallDebug';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Transaction {
  recipient: string;
  id?: string;
  type: 'upi' | 'bank' | 'contact' | 'bill';
  amount?: string;
}

// --- Components ---

const InstallButton = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running as PWA
    if (isStandalone()) {
      setIsInstalled(true);
      return;
    }

    // Listen for installable event
    const handleInstallable = () => {
      setIsInstallable(true);
    };

    const handleInstalled = () => {
      setIsInstallable(false);
      setIsInstalled(true);
    };

    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setIsInstallable(false);
      setIsInstalled(true);
    }
  };

  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto"
    >
      <div className="bg-gpay-blue text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Install Hikma App</h3>
          <p className="text-xs opacity-90">Get quick access and work offline</p>
        </div>
        <button
          onClick={handleInstall}
          className="bg-white text-gpay-blue px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors active:scale-95"
        >
          <Download className="w-4 h-4" />
          Install
        </button>
        <button
          onClick={() => setIsInstallable(false)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const ActionItem = ({ icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 text-center cursor-pointer group outline-none"
  >
    <div className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100 group-active:scale-95 transition-transform">
      <Icon className="w-6 h-6 text-gpay-blue" />
    </div>
    <span className="text-xs font-medium text-gray-700 leading-tight px-1">{label}</span>
  </button>
);

const PersonAvatar = ({ name, imageUrl, initials, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 cursor-pointer group outline-none"
  >
    <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 bg-white flex items-center justify-center group-active:scale-95 transition-transform">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <div className={cn(
          "w-full h-full flex items-center justify-center text-white font-semibold text-lg",
          initials === 'G' ? 'bg-teal-600' : initials === 'A' ? 'bg-blue-600' : initials === 'B' ? 'bg-gray-600' : 'bg-blue-500'
        )}>
          {initials || name[0]}
        </div>
      )}
    </div>
    <span className="text-xs text-gray-600 text-center line-clamp-2 w-16">{name}</span>
  </button>
);

const ViewHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
  <header className="px-4 py-4 flex items-center gap-4 bg-white border-b border-gray-100 sticky top-0 z-20">
    <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
      <ArrowLeft className="w-6 h-6 text-gray-700" />
    </button>
    <h2 className="text-lg font-medium text-gray-800">{title}</h2>
  </header>
);

// --- Action Views ---

const ScannerView = ({ onBack, onScan }: { onBack: () => void, onScan: (data: Transaction) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onScan({ recipient: "Merchant Store #42", id: "merchant@okaxis", type: 'upi' });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <header className="p-4 flex justify-between items-center absolute top-0 w-full z-10">
        <button onClick={onBack} className="p-2 bg-black/20 rounded-full"><X className="w-6 h-6" /></button>
        <div className="flex gap-4">
          <button className="p-2 bg-black/20 rounded-full"><Info className="w-6 h-6" /></button>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center relative">
        <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gpay-blue -mt-1 -ml-1 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gpay-blue -mt-1 -mr-1 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gpay-blue -mb-1 -ml-1 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gpay-blue -mb-1 -mr-1 rounded-br-lg"></div>
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-gpay-blue shadow-[0_0_10px_rgba(26,115,232,0.8)]"
          />
        </div>
        <p className="absolute bottom-32 text-center px-8 text-sm opacity-80">
          Align QR code within the frame to scan
        </p>
      </div>
      <footer className="p-8 flex justify-center gap-12 bg-black/40 backdrop-blur-md">
        <div className="flex flex-col items-center gap-2">
          <div className="p-4 bg-white/10 rounded-full"><Camera className="w-6 h-6" /></div>
          <span className="text-xs">Upload</span>
        </div>
      </footer>
    </div>
  );
};

const ContactsView = ({ onBack, title, onSelect }: { onBack: () => void, title: string, onSelect: (data: Transaction) => void }) => {
  const contacts = [
    { name: "Aarav Sharma", phone: "+91 98765 43210", initials: "AS" },
    { name: "Bhavya Gupta", phone: "+91 91234 56789", initials: "BG" },
    { name: "Chitra Singh", phone: "+91 88888 77777", initials: "CS" },
    { name: "Deepak Verma", phone: "+91 77777 66666", initials: "DV" },
    { name: "Esha Patel", phone: "+91 99999 00000", initials: "EP" },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <ViewHeader title={title} onBack={onBack} />
      <div className="p-4">
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2.5 mb-6">
          <Search className="w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Search contacts" className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
        <div className="space-y-6">
          {contacts.map((contact, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelect({ recipient: contact.name, id: contact.phone, type: 'contact' })}
              className="flex items-center gap-4 cursor-pointer active:bg-gray-50 p-2 rounded-xl transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                {contact.initials}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800">{contact.name}</h4>
                <p className="text-xs text-gray-500">{contact.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BankTransferView = ({ onBack, onContinue }: { onBack: () => void, onContinue: (data: Transaction) => void }) => {
  const [name, setName] = useState('');
  return (
    <div className="flex flex-col h-full bg-white">
      <ViewHeader title="Bank transfer" onBack={onBack} />
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">Account number</label>
            <input type="text" className="w-full border-b border-gray-300 py-2 outline-none focus:border-gpay-blue transition-colors" placeholder="Enter account number" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">Re-enter account number</label>
            <input type="text" className="w-full border-b border-gray-300 py-2 outline-none focus:border-gpay-blue transition-colors" placeholder="Re-enter account number" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">IFSC code</label>
            <div className="flex items-center gap-2">
              <input type="text" className="flex-1 border-b border-gray-300 py-2 outline-none focus:border-gpay-blue transition-colors" placeholder="Enter IFSC code" />
              <button className="text-xs font-semibold text-gpay-blue">SEARCH</button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">Recipient name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-gpay-blue transition-colors" 
              placeholder="Enter recipient name" 
            />
          </div>
        </div>
        <button 
          onClick={() => onContinue({ recipient: name || "Unknown Recipient", type: 'bank' })}
          className="w-full bg-gpay-blue text-white py-3 rounded-full font-medium shadow-lg shadow-blue-100 active:scale-95 transition-transform mt-8"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const UpiPaymentView = ({ onBack, onContinue }: { onBack: () => void, onContinue: (data: Transaction) => void }) => {
  const [id, setId] = useState('');
  return (
    <div className="flex flex-col h-full bg-white">
      <ViewHeader title="Pay UPI ID or number" onBack={onBack} />
      <div className="p-6">
        <div className="bg-blue-50 p-4 rounded-2xl mb-8 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-gpay-blue shrink-0" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Google Pay protects your money with world-class security. Never share your UPI PIN with anyone.
          </p>
        </div>
        <div className="space-y-1 mb-8">
          <label className="text-xs font-medium text-gray-500 ml-1">UPI ID or phone number</label>
          <input 
            type="text" 
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-gpay-blue transition-colors" 
            placeholder="e.g. name@bank or 9876543210" 
          />
        </div>
        <button 
          onClick={() => onContinue({ recipient: id || "UPI User", id, type: 'upi' })}
          className="w-full bg-gpay-blue text-white py-3 rounded-full font-medium shadow-lg shadow-blue-100 active:scale-95 transition-transform"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const BillsView = ({ onBack, onSelect }: { onBack: () => void, onSelect: (data: Transaction) => void }) => {
  const categories = [
    { icon: Smartphone, label: "Mobile recharge", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: CreditCard, label: "Credit card", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: History, label: "DTH", color: "text-orange-600", bg: "bg-orange-50" },
    { icon: Landmark, label: "Electricity", color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <ViewHeader title="Pay bills" onBack={onBack} />
      <div className="p-4 grid grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelect({ recipient: cat.label, type: 'bill' })}
            className="flex flex-col items-center gap-2 text-center cursor-pointer group"
          >
            <div className={cn("p-4 rounded-2xl group-active:scale-95 transition-transform", cat.bg)}>
              <cat.icon className={cn("w-6 h-6", cat.color)} />
            </div>
            <span className="text-[10px] font-medium text-gray-600">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaymentView = ({ transaction, onBack, onPay }: { transaction: Transaction, onBack: () => void, onPay: (amount: string) => void }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Circular ripple background effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full border border-blue-100/30" />
        <div className="absolute w-[500px] h-[500px] rounded-full border border-blue-100/30" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-blue-100/30" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-blue-100/30" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-blue-100/30" />
      </div>

      {/* Header */}
      <header className="p-4 flex items-center justify-between relative z-10">
        <button onClick={onBack} className="p-2 hover:bg-white/50 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <div className="w-6" />
        <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
          <span className="text-gray-600 text-xl">⋮</span>
        </button>
      </header>

      {/* Recipient Info */}
      <div className="flex flex-col items-center mt-4 relative z-10">
        <div className="w-16 h-16 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold text-2xl mb-3">
          {transaction.recipient[0]}
        </div>
        <h2 className="text-lg font-medium text-gray-700 mb-1">
          Paying {transaction.recipient}
        </h2>
        {transaction.id && (
          <p className="text-xs text-gray-500">{transaction.id}</p>
        )}
      </div>

      {/* Amount Input */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-5xl font-light text-gray-800">$</span>
          <input 
            type="number" 
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="text-7xl font-light text-gray-800 outline-none bg-transparent text-center placeholder:text-gray-300 w-48"
          />
        </div>
        
        <input 
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="For The Batman"
          className="text-center text-gray-500 text-base outline-none bg-transparent placeholder:text-gray-400 w-full max-w-xs"
        />
      </div>

      {/* Payment Method & Button */}
      <div className="p-6 relative z-10">
        {/* Payment Method */}
        <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">Personal Checking ••••</span>
              <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                <span className="text-blue-600">⚡</span>
                <span>Instant transfer, no fee</span>
              </div>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>

        {/* Warning Message */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-700 leading-relaxed">
            <p className="font-semibold mb-1">This is the first payment between you and this person using Google Pay</p>
            <p className="text-gray-600">Always verify the info of the person you're paying before sending money.</p>
            <p className="text-gray-600 mt-1">Any fraudulent transactions may result in the loss of your money with no recourse</p>
          </div>
        </div>

        {/* Pay Button */}
        <button 
          disabled={!amount || parseFloat(amount) <= 0}
          onClick={() => onPay(amount)}
          className="w-full bg-blue-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg shadow-blue-200 active:scale-95 transition-transform disabled:opacity-50 disabled:bg-gray-300 disabled:active:scale-100"
        >
          Pay ${amount || '0.00'}
        </button>
      </div>
    </div>
  );
};

const SuccessView = ({ transaction, onDone }: { transaction: Transaction, onDone: () => void }) => {
  return (
    <div className="flex flex-col h-full bg-white items-center justify-center p-8">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="mb-8"
      >
        <CheckCircle2 className="w-24 h-24 text-teal-500" />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">₹{transaction.amount}</h2>
        <p className="text-gray-600 mb-1">Paid to {transaction.recipient}</p>
        <p className="text-xs text-gray-400 mb-12">Mar 5, 2026 • 10:28 AM</p>
        
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-12 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Transaction ID</span>
            <span className="text-xs font-medium text-gray-700">CIC2603051028</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">UPI Ref No.</span>
            <span className="text-xs font-medium text-gray-700">60305102842</span>
          </div>
        </div>
      </motion.div>

      <button 
        onClick={onDone}
        className="w-full border border-gray-200 text-gpay-blue py-3 rounded-full font-medium active:bg-gray-50 transition-colors"
      >
        Done
      </button>
    </div>
  );
};

const UpiPinView = ({ transaction, onBack, onSuccess }: { transaction: Transaction, onBack: () => void, onSuccess: () => void }) => {
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleKeyPress = (key: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length === 6) {
      setIsVerifying(true);
      // Simulate verification delay
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] text-gray-800">
      {/* UPI Header */}
      <header className="bg-white px-4 py-3 flex justify-between items-center border-b border-gray-200">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500">State Bank of India</span>
          <span className="text-sm font-bold">XXXX8869</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-6" />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center pt-12 px-8">
        <h3 className="text-sm font-bold text-gray-600 mb-8 uppercase tracking-wider">Enter 6-digit UPI PIN</h3>
        
        {/* PIN Display */}
        <div className="flex gap-4 mb-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative w-4 h-4 flex items-center justify-center">
              {pin.length > i ? (
                <div className="w-3 h-3 bg-gray-800 rounded-full" />
              ) : (
                <div className="w-full h-0.5 bg-gray-300 absolute bottom-0" />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-gray-500 leading-relaxed max-w-[240px]">
          UPI PIN will keep your account secure from unauthorized access. Do not share this PIN with anyone.
        </p>

        {isVerifying && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-gpay-blue border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gpay-blue font-medium">Verifying PIN...</span>
          </div>
        )}
      </div>

      {/* Custom Keypad */}
      <div className="bg-white grid grid-cols-3 gap-px border-t border-gray-200">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num} 
            onClick={() => handleKeyPress(num.toString())}
            className="py-5 text-2xl font-medium active:bg-gray-100 transition-colors"
          >
            {num}
          </button>
        ))}
        <button 
          onClick={handleBackspace}
          className="py-5 flex items-center justify-center active:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handleKeyPress('0')}
          className="py-5 text-2xl font-medium active:bg-gray-100 transition-colors"
        >
          0
        </button>
        <button 
          onClick={handleSubmit}
          disabled={pin.length !== 6 || isVerifying}
          className={cn(
            "py-5 flex items-center justify-center transition-colors",
            pin.length === 6 ? "bg-blue-900 text-white" : "bg-gray-50 text-gray-300"
          )}
        >
          <CheckCircle2 className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

const SignUpView = ({ onBack, onSignUp }: { onBack: () => void, onSignUp: () => void }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div className="flex flex-col h-full bg-white p-8">
      <button onClick={onBack} className="mb-8 p-1 hover:bg-gray-100 rounded-full transition-colors w-fit"><X className="w-6 h-6 text-gray-700" /></button>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h2>
      <p className="text-sm text-gray-500 mb-8">Enter your details to get started with Google Pay.</p>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Abhishek Kumar" 
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:border-gpay-blue transition-colors text-gray-800"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210" 
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:border-gpay-blue transition-colors text-gray-800"
          />
        </div>

        <button 
          onClick={onSignUp}
          disabled={!name || phone.length < 10}
          className="w-full bg-gpay-blue text-white py-4 rounded-full font-semibold shadow-lg shadow-blue-100 active:scale-95 transition-transform disabled:opacity-50 mt-8"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

const AccountSelectionView = ({ onBack, onSelect }: { onBack: () => void, onSelect: () => void }) => {
  const accounts = [
    { name: "Abhishek Kumar", email: "abhi.document-2@gmail.com", img: "https://picsum.photos/seed/user/100/100" },
    { name: "Rahul Sharma", email: "rahul.sharma@gmail.com", img: "https://picsum.photos/seed/rahul/100/100" },
    { name: "Priya Singh", email: "priya.singh@gmail.com", img: "https://picsum.photos/seed/priya/100/100" },
  ];

  return (
    <div className="flex flex-col h-full bg-white p-8">
      <button onClick={onBack} className="mb-8 p-1 hover:bg-gray-100 rounded-full transition-colors w-fit"><X className="w-6 h-6 text-gray-700" /></button>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose an account</h2>
      <p className="text-sm text-gray-500 mb-8">to continue to Google Pay</p>

      <div className="space-y-2">
        {accounts.map((acc, idx) => (
          <div 
            key={idx} 
            onClick={onSelect}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-gray-100"
          >
            <img src={acc.img} alt={acc.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{acc.name}</p>
              <p className="text-xs text-gray-500">{acc.email}</p>
            </div>
          </div>
        ))}
        <div 
          onClick={onSelect}
          className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-gray-100"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-sm font-medium text-gray-800">Use another account</p>
        </div>
      </div>
    </div>
  );
};

const AuthView = ({ onSignIn }: { onSignIn: () => void }) => {
  const [mode, setMode] = useState<'welcome' | 'signup' | 'switch'>('welcome');

  if (mode === 'signup') {
    return <SignUpView onBack={() => setMode('welcome')} onSignUp={onSignIn} />;
  }

  if (mode === 'switch') {
    return <AccountSelectionView onBack={() => setMode('welcome')} onSelect={onSignIn} />;
  }

  return (
    <div className="flex flex-col h-full bg-white items-center justify-center p-8">
      <div className="mb-12 flex flex-col items-center">
        <div className="w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Pay_Logo.svg" alt="GPay" className="w-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Google Pay</h1>
        <p className="text-sm text-gray-500 text-center">The simple and secure way to pay and manage your money.</p>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={onSignIn}
          className="w-full bg-gpay-blue text-white py-4 rounded-full font-semibold shadow-lg shadow-blue-100 active:scale-95 transition-transform flex items-center justify-center gap-3"
        >
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-1">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
          </div>
          Sign in with Google
        </button>
        <button 
          onClick={() => setMode('switch')}
          className="w-full border border-gray-200 text-gray-600 py-4 rounded-full font-medium active:bg-gray-50 transition-colors"
        >
          Use another account
        </button>
        <button 
          onClick={() => setMode('signup')}
          className="w-full text-gpay-blue text-sm font-semibold py-2 active:opacity-70 transition-opacity"
        >
          Create new account
        </button>
      </div>

      <p className="mt-12 text-[10px] text-gray-400 text-center leading-relaxed">
        By continuing, you agree to Google Pay's Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

const ProfileView = ({ onBack, onSignOut }: { onBack: () => void, onSignOut: () => void }) => (
  <div className="flex flex-col h-full bg-white">
    <header className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
      <button onClick={onBack} className="p-1"><X className="w-6 h-6 text-gray-700" /></button>
      <h2 className="text-lg font-medium text-gray-800">Account</h2>
      <div className="w-6" />
    </header>
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gpay-blue p-1 mb-4">
          <img src="https://picsum.photos/seed/user/200/200" alt="Profile" className="w-full h-full rounded-full object-cover" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Abhishek Kumar</h3>
        <p className="text-sm text-gray-500">abhi.document-2@okicici</p>
        <div className="mt-4 flex gap-2">
          <button className="px-4 py-1.5 border border-gray-200 rounded-full text-xs font-medium text-gpay-blue">Manage Google Account</button>
        </div>
      </div>

      <div className="space-y-1">
        {[
          { icon: History, label: "Transaction history" },
          { icon: Landmark, label: "Bank accounts", sub: "1 account linked" },
          { icon: ShieldCheck, label: "Security & privacy" },
          { icon: Info, label: "Help & feedback" },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer rounded-2xl transition-colors">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              {item.sub && <p className="text-[10px] text-gray-500">{item.sub}</p>}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
          </div>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 text-center">
        <button 
          onClick={onSignOut}
          className="text-sm font-semibold text-red-500 hover:text-red-600 active:scale-95 transition-transform"
        >
          Sign out
        </button>
      </div>
    </div>
  </div>
);

const PhoneNumberView = ({ onBack, onContinue }: { onBack: () => void, onContinue: (data: Transaction) => void }) => {
  const [number, setNumber] = useState('');
  return (
    <div className="flex flex-col h-full bg-white">
      <ViewHeader title="Pay phone number" onBack={onBack} />
      <div className="p-6">
        <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-4 mb-8 border border-gray-200 focus-within:border-gpay-blue transition-colors">
          <Phone className="w-5 h-5 text-gray-500" />
          <input 
            type="tel" 
            autoFocus
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter a mobile number" 
            className="bg-transparent border-none outline-none text-lg w-full font-medium"
          />
        </div>
        <button 
          disabled={number.length < 10}
          onClick={() => onContinue({ recipient: number, id: number, type: 'contact' })}
          className="w-full bg-gpay-blue text-white py-4 rounded-full font-semibold shadow-lg shadow-blue-100 active:scale-95 transition-transform disabled:opacity-50"
        >
          Pay {number || '...'}
        </button>
        
        <div className="mt-12">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recent contacts</h4>
          <div className="space-y-4">
            {['Dipa', 'Kinjan', 'Sunita'].map((name, idx) => (
              <div key={idx} onClick={() => onContinue({ recipient: name, type: 'contact' })} className="flex items-center gap-4 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">{name[0]}</div>
                <span className="text-sm font-medium text-gray-700">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryView = () => {
  const transactions = [
    { name: "Merchant Store #42", date: "Mar 5, 2026", amount: "₹500", status: "Completed", type: "upi" },
    { name: "Dipa", date: "Mar 4, 2026", amount: "₹1,200", status: "Completed", type: "contact" },
    { name: "Electricity Bill", date: "Mar 2, 2026", amount: "₹2,450", status: "Completed", type: "bill" },
    { name: "Aarav Sharma", date: "Feb 28, 2026", amount: "₹150", status: "Completed", type: "contact" },
    { name: "Mobile Recharge", date: "Feb 25, 2026", amount: "₹499", status: "Completed", type: "bill" },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <header className="px-6 py-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {transactions.map((tx, idx) => (
          <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
              {tx.name[0]}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-800">{tx.name}</h4>
              <p className="text-[10px] text-gray-500">{tx.date} • {tx.status}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-gray-800">{tx.amount}</span>
              <p className="text-[10px] text-green-600 font-medium">Success</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [activeView, setActiveView] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const actions = [
    { id: 'scan', icon: QrCode, label: "Scan any QR code" },
    { id: 'contacts', icon: Contact, label: "Pay contacts" },
    { id: 'phone', icon: Phone, label: "Pay phone number" },
    { id: 'bank', icon: Landmark, label: "Bank transfer" },
    { id: 'upi', icon: AtSign, label: "Pay UPI ID or number" },
    { id: 'self', icon: ArrowLeftRight, label: "Self transfer" },
    { id: 'bills', icon: Receipt, label: "Pay bills" },
    { id: 'recharge', icon: Smartphone, label: "Mobile recharge" },
  ];

  const people = [
    { name: "Self transfer", initials: "S", isSpecial: true },
    { name: "Dipa", imageUrl: "https://picsum.photos/seed/dipa/100/100" },
    { name: "GITA MOH...", initials: "G" },
    { name: "Kinjan", imageUrl: "https://picsum.photos/seed/kinjan/100/100" },
    { name: "Sunita", imageUrl: "https://picsum.photos/seed/sunita/100/100" },
    { name: "Abhi Chat", initials: "A" },
    { name: "BABI DAS", initials: "B" },
  ];

  const handleSelectRecipient = (data: Transaction) => {
    setTransaction(data);
    setActiveView('payment');
  };

  const handlePay = (amount: string) => {
    if (transaction) {
      setTransaction({ ...transaction, amount });
      setActiveView('pin');
    }
  };

  const handlePinSuccess = () => {
    setIsSuccess(true);
    setActiveView('success');
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setActiveView(null);
    setActiveTab('home');
  };

  const handleSignIn = () => {
    setIsLoggedIn(true);
  };

  const reset = () => {
    setActiveView(null);
    setTransaction(null);
    setIsSuccess(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'scan': return <ScannerView onBack={reset} onScan={handleSelectRecipient} />;
      case 'contacts': return <ContactsView onBack={reset} title="Pay contacts" onSelect={handleSelectRecipient} />;
      case 'phone': return <PhoneNumberView onBack={reset} onContinue={handleSelectRecipient} />;
      case 'bank': return <BankTransferView onBack={reset} onContinue={handleSelectRecipient} />;
      case 'upi': return <UpiPaymentView onBack={reset} onContinue={handleSelectRecipient} />;
      case 'self': return <ContactsView onBack={reset} title="Self transfer" onSelect={handleSelectRecipient} />;
      case 'bills': return <BillsView onBack={reset} onSelect={handleSelectRecipient} />;
      case 'recharge': return <PhoneNumberView onBack={reset} onContinue={handleSelectRecipient} />;
      case 'payment': return transaction ? <PaymentView transaction={transaction} onBack={reset} onPay={handlePay} /> : null;
      case 'pin': return transaction ? <UpiPinView transaction={transaction} onBack={() => setActiveView('payment')} onSuccess={handlePinSuccess} /> : null;
      case 'success': return transaction ? <SuccessView transaction={transaction} onDone={reset} /> : null;
      case 'profile': return <ProfileView onBack={reset} onSignOut={handleSignOut} />;
      default: return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col shadow-2xl relative overflow-hidden">
        <AuthView onSignIn={handleSignIn} />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col h-full">
            {/* Header */}
            <header className="px-4 pt-4 pb-2 flex items-center gap-3 sticky top-0 bg-gpay-bg z-10">
              <div className="flex-1 flex items-center gap-3 bg-white rounded-full px-4 py-2.5 shadow-sm border border-gray-100">
                <Search className="w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Pay friends and merchants" 
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500"
                />
              </div>
              <button 
                onClick={() => setActiveView('profile')}
                className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 cursor-pointer active:scale-90 transition-transform"
              >
                <img 
                  src="https://picsum.photos/seed/user/100/100" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            </header>

            <main className="flex-1 overflow-y-auto hide-scrollbar pb-20">
              {/* Hero Banner */}
              <section className="px-4 py-4">
                <div className="bg-gpay-banner rounded-3xl p-6 relative overflow-hidden flex flex-col items-center text-center min-h-[180px] justify-center">
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] text-white font-bold">₹</div>
                  </div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 opacity-80">
                     <img src="https://picsum.photos/seed/finance/100/100" alt="finance" className="w-full h-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 max-w-[200px]">
                    Instant loans up to ₹8 lakhs
                  </h2>
                  <button className="bg-gpay-blue text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    Apply now <span className="text-lg">›</span>
                  </button>
                </div>
              </section>

              {/* Action Grid */}
              <section className="px-6 py-4 grid grid-cols-4 gap-y-8 gap-x-4">
                {actions.map((action) => (
                  <ActionItem 
                    key={action.id} 
                    icon={action.icon} 
                    label={action.label} 
                    onClick={() => setActiveView(action.id)}
                  />
                ))}
              </section>

              {/* UPI ID Badge */}
              <section className="flex justify-center py-4">
                <div className="bg-blue-50/50 border border-blue-100 px-4 py-1.5 rounded-full flex items-center gap-2">
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">UPI ID:</span>
                  <span className="text-xs font-medium text-gray-700">abhi.document-2@okicici</span>
                </div>
              </section>

              {/* People Section */}
              <section className="px-4 py-6">
                <h3 className="text-lg font-medium text-gray-800 mb-6 px-2">People</h3>
                <div className="grid grid-cols-4 gap-y-8 gap-x-2">
                  {people.map((person, idx) => (
                    <PersonAvatar 
                      key={idx} 
                      name={person.name} 
                      imageUrl={person.imageUrl} 
                      initials={person.initials} 
                      onClick={() => handleSelectRecipient({ recipient: person.name, type: 'contact' })}
                    />
                  ))}
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center group-active:scale-95 transition-transform bg-white">
                      <ChevronDown className="w-6 h-6 text-gpay-blue" />
                    </div>
                    <span className="text-xs text-gray-600">More</span>
                  </div>
                </div>
              </section>
            </main>
          </div>
        );
      case 'history':
        return <HistoryView />;
      case 'bills':
        return <BillsView onBack={() => setActiveTab('home')} onSelect={handleSelectRecipient} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gpay-bg flex flex-col shadow-2xl relative overflow-hidden">
      <AnimatePresence mode="wait">
        {activeView ? (
          <motion.div 
            key="view"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-30 bg-white"
          >
            {renderView()}
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            {renderTabContent()}

            {/* Bottom Nav */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around px-6 z-20">
              <button 
                onClick={() => setActiveTab('home')}
                className={cn(
                  "flex flex-col items-center gap-1 relative h-full justify-center transition-colors",
                  activeTab === 'home' ? "text-gpay-blue" : "text-gray-400"
                )}
              >
                {activeTab === 'home' && <div className="w-12 h-1 rounded-full bg-gpay-blue absolute top-0" />}
                <Landmark className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={cn(
                  "flex flex-col items-center gap-1 relative h-full justify-center transition-colors",
                  activeTab === 'history' ? "text-gpay-blue" : "text-gray-400"
                )}
              >
                {activeTab === 'history' && <div className="w-12 h-1 rounded-full bg-gpay-blue absolute top-0" />}
                <ArrowLeftRight className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setActiveTab('bills')}
                className={cn(
                  "flex flex-col items-center gap-1 relative h-full justify-center transition-colors",
                  activeTab === 'bills' ? "text-gpay-blue" : "text-gray-400"
                )}
              >
                {activeTab === 'bills' && <div className="w-12 h-1 rounded-full bg-gpay-blue absolute top-0" />}
                <Receipt className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* PWA Install Button */}
      <InstallButton />
      
      {/* PWA Debug Tool - Remove in production */}
      <InstallDebug />
    </div>
  );
}
