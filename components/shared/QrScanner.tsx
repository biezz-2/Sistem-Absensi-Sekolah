import React, { useEffect, useRef } from 'react';
import Spinner from '../ui/Spinner';

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError: (errorMessage: string) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef<any>(null); // To hold the Html5QrcodeScanner instance

  useEffect(() => {
    // Dynamically check if the library is loaded
    if (typeof (window as any).Html5QrcodeScanner === 'undefined') {
      onScanError("QR code scanning library not loaded.");
      return;
    }

    const scanner = new (window as any).Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdge * 0.8);
            return { width: qrboxSize, height: qrboxSize };
        },
        rememberLastUsedCamera: true,
        supportedScanTypes: [(window as any).Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      false // verbose
    );

    const handleSuccess = (decodedText: string, decodedResult: any) => {
      onScanSuccess(decodedText);
      scanner.clear();
    };

    const handleError = (error: string) => {
        // We can ignore some errors
        if (!error.includes("No QR code found")) {
            onScanError(error);
        }
    };
    
    scanner.render(handleSuccess, handleError);
    scannerRef.current = scanner;

    // Cleanup function to stop the scanner
    return () => {
      if (scannerRef.current && scannerRef.current.getState() !== 2) { // 2 is NOT_STARTED state
        scannerRef.current.clear().catch((error: any) => {
          console.error("Failed to clear scanner on unmount", error);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
       {/* Styles for animation and hiding default scanner UI */}
      <style>{`
        @keyframes scan-line-anim {
          0% { transform: translateY(-10%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan-line {
          animation: scan-line-anim 3s linear infinite;
        }
        #qr-reader {
          border: none !important;
        }
        #qr-reader__dashboard_section_csr, #qr-reader__dashboard_section_swaplink {
            display: none;
        }
      `}</style>
      <div className="relative w-full max-w-md mx-auto aspect-square rounded-lg flex items-center justify-center bg-slate-900 overflow-hidden shadow-inner">
          <div id="qr-reader" className="w-full h-full" />
          
          {/* Visual Feedback Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-[80%] h-[80%]">
                {/* Corner Brackets */}
                <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-white/70 rounded-tl-lg"></div>
                <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-white/70 rounded-tr-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-white/70 rounded-bl-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-white/70 rounded-br-lg"></div>
                
                {/* Animated Scanning Line */}
                 <div className="absolute top-0 left-0 right-0 h-full overflow-hidden">
                    <div 
                        className="absolute w-full h-1.5 bg-red-500/80 animate-scan-line" 
                        style={{ boxShadow: '0 0 10px 2px rgba(239, 68, 68, 0.7)' }}
                    ></div>
                </div>
              </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center -z-10 bg-slate-100" id="qr-reader-placeholder">
              <div className="flex flex-col items-center">
                  <Spinner />
                  <p className="mt-2 text-slate-500 text-sm">Memulai kamera...</p>
              </div>
          </div>
      </div>
    </>
  );
};

export default QrScanner;