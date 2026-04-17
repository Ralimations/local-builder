import React, { useMemo, useState } from "react";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";

import { config } from "@/lib/puck.config";
import { saveProject, type ExportFormat } from "@/lib/generator";
import { type Page, type RootProps } from "@/types";
import { EditorHeader } from "@/components/editor/EditorHeader.tsx";
import { ExportModal } from "@/components/ExportModal";

export default function App() {
  const [pages, setPages] = useState<Page[]>([
    { 
      id: "home", 
      data: { 
        content: [], 
        root: { 
          props: { 
            pageTitle: "Home", 
            pageRoute: "/", 
            canvasColor: "#ffffff", 
            maxWidth: "max-w-6xl" 
          } as RootProps 
        }, 
        zones: {} 
      } 
    }
  ]);
  const [selectedPageId, setSelectedPageId] = useState("home");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const currentPage = useMemo(() => pages.find(p => p.id === selectedPageId), [pages, selectedPageId]);

  const handleAddPage = () => {
    const newId = crypto.randomUUID();
    const newPage: Page = {
      id: newId,
      data: {
        content: [],
        root: {
          props: {
            pageTitle: "New Page",
            pageRoute: "/new-page",
            canvasColor: "#ffffff",
            maxWidth: "max-w-6xl"
          } as RootProps
        },
        zones: {}
      }
    };
    setPages([...pages, newPage]);
    setSelectedPageId(newId);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) {
      alert("Cannot delete the last page.");
      return;
    }
    const newPages = pages.filter(p => p.id !== selectedPageId);
    setPages(newPages);
    setSelectedPageId(newPages[0].id);
  };

  const handlePageDataChange = (newData: Data) => {
    setPages(prev => prev.map(p => p.id === selectedPageId ? { ...p, data: newData } : p));
  };

  const handleExportConfirm = async (format: ExportFormat) => {
    setIsExportModalOpen(false);
    try {
      await saveProject(pages, format);
    } catch (error) {
      console.error("Project export failed:", error);
      alert("Export failed. Check console.");
    }
  };

  if (!currentPage) return null;

  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden font-sans">
      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}</style>

      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleExportConfirm}
      />

      <main className="flex-1 relative overflow-hidden bg-gray-50">
        <Puck
          key={selectedPageId}
          config={config}
          data={currentPage.data}
          onChange={handlePageDataChange}
          onPublish={() => setIsExportModalOpen(true)}
          overrides={{
            header: ({ actions }) => (
              <EditorHeader 
                currentPage={currentPage}
                pages={pages}
                selectedPageId={selectedPageId}
                onSelectPage={setSelectedPageId}
                onAddPage={handleAddPage}
                onDeletePage={handleDeletePage}
                actions={actions}
              />
            )
          }}
        />
      </main>
    </div>
  );
}