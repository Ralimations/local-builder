import React from "react";
import { Download, FileCode, FileJson, X } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (format: "shadcn" | "bootstrap") => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative scale-100 animate-in zoom-in-95 duration-200 border border-gray-100">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Export Project</h2>
              <p className="text-xs text-gray-500">Choose your preferred framework</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-3">
          <button
            onClick={() => onConfirm("shadcn")}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-black hover:ring-1 hover:ring-black transition-all group text-left"
          >
            <div className="p-2 bg-zinc-900 text-white rounded-md group-hover:scale-110 transition-transform">
              <FileCode size={20} />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Shadcn UI (React)</div>
              <div className="text-xs text-gray-500">Modern, Tailwind-based components. Best for new React apps.</div>
            </div>
          </button>

          <button
            onClick={() => onConfirm("bootstrap")}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-600 hover:ring-1 hover:ring-purple-600 transition-all group text-left"
          >
            <div className="p-2 bg-purple-600 text-white rounded-md group-hover:scale-110 transition-transform">
              <FileJson size={20} />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Bootstrap (HTML/CSS)</div>
              <div className="text-xs text-gray-500">Classic styling. Standard HTML structure with Bootstrap classes.</div>
            </div>
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="text-sm font-medium text-gray-500 hover:text-gray-800 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};