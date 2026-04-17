import React from "react";
import { Monitor, ChevronRight, File, ChevronDown, Plus, Trash2 } from "lucide-react";
import { type Page, type RootProps } from "@/types";

interface EditorHeaderProps {
  currentPage: Page;
  pages: Page[];
  selectedPageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  onDeletePage: () => void;
  actions: React.ReactNode;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  currentPage,
  pages,
  selectedPageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
  actions
}) => {
  const rootProps = currentPage.data.root.props as RootProps;

  return (
    <header className="h-[48px] w-full border-b border-gray-100 flex items-center justify-between px-4 z-[400] bg-white relative">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4 text-sm font-medium text-gray-600">
          <span className="flex items-center gap-1"><Monitor size={14} /> App</span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-zinc-900 font-bold">{rootProps.pageTitle}</span>
          <span className="text-xs text-gray-400 ml-1 font-mono">({rootProps.pageRoute})</span>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <div className="relative group">
            <select 
              value={selectedPageId}
              onChange={(e) => onSelectPage(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-xs font-medium pl-8 pr-8 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer min-w-[140px]"
            >
              {pages.map(p => {
                 const pProps = p.data.root.props as RootProps;
                 return (
                  <option key={p.id} value={p.id}>
                    {pProps.pageTitle}
                  </option>
                );
              })}
            </select>
            <File size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="h-4 w-px bg-gray-300 mx-1"></div>

          <button 
            onClick={onAddPage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
            title="Add New Page"
          >
            <Plus size={12} />
            Add
          </button>

          <button 
            onClick={onDeletePage}
            className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
            title="Delete Current Page"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-gray-400">
         <div className="flex items-center gap-2 border-l pl-3 ml-1">
            {actions}
         </div>
      </div>
    </header>
  );
}