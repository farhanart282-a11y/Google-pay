import { useState, useEffect } from 'react';
import { Download, X, CheckCircle, AlertCircle } from 'lucide-react';

export const InstallDebug = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('🔍 PWA Debug initialized');

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    if (isStandalone) {
      addLog('✅ App is already installed (running in standalone mode)');
      return;
    }

    // Check service worker
    if ('serviceWorker' in navigator) {
      addLog('✅ Service Worker API supported');
      
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          addLog(`✅ Service Worker registered: ${reg.scope}`);
        } else {
          addLog('⚠️ Service Worker not registered yet');
        }
      });
    } else {
      addLog('❌ Service Worker not supported');
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      addLog('🎉 beforeinstallprompt event fired!');
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleInstalled = () => {
      addLog('✅ App installed successfully!');
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    // Check after 2 seconds
    setTimeout(() => {
      if (!isInstallable) {
        addLog('ℹ️ Install prompt not triggered yet. This is normal on first load.');
        addLog('💡 Try: 1) Refresh page 2) Check if HTTPS/localhost 3) Check DevTools Console');
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      addLog('❌ Install prompt not available');
      return;
    }

    addLog('📱 Showing install prompt...');
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    addLog(`User choice: ${outcome}`);

    if (outcome === 'accepted') {
      addLog('✅ User accepted installation');
    } else {
      addLog('ℹ️ User dismissed installation');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (!showDebug && !isInstallable) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg z-50 hover:bg-gray-700"
        title="PWA Debug"
      >
        🔧
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">PWA Installation Debug</h2>
          <button
            onClick={() => setShowDebug(false)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status */}
        <div className="p-4 border-b border-gray-200">
          {isInstallable ? (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-green-800">Ready to Install!</p>
                <p className="text-sm text-green-600">Your app meets all PWA requirements</p>
              </div>
              <button
                onClick={handleInstall}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install Now
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div className="flex-1">
                <p className="font-semibold text-yellow-800">Not Installable Yet</p>
                <p className="text-sm text-yellow-600">Check the logs below for details</p>
              </div>
            </div>
          )}
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Debug Logs:</h3>
          <div className="space-y-1 font-mono text-xs">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  log.includes('✅') ? 'bg-green-50 text-green-800' :
                  log.includes('❌') ? 'bg-red-50 text-red-800' :
                  log.includes('⚠️') ? 'bg-yellow-50 text-yellow-800' :
                  'bg-gray-50 text-gray-700'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
          <button
            onClick={() => {
              setLogs([]);
              addLog('🔄 Logs cleared');
            }}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Clear Logs
          </button>
        </div>

        {/* Help */}
        <div className="p-4 bg-blue-50 text-xs text-blue-800">
          <p className="font-semibold mb-1">Troubleshooting Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure you're on HTTPS or localhost</li>
            <li>Check DevTools → Application → Manifest</li>
            <li>Check DevTools → Application → Service Workers</li>
            <li>Try refreshing the page</li>
            <li>Clear browser cache and reload</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
