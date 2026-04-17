import { type Data } from "@puckeditor/core";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { type RootProps, type Page } from "@/types";

// --- CONFIGURATION ---
const SHADCN_COMPONENT_MAP: Record<string, { path: string; imports: string[]; cli: string; }> = {
  Section: { path: "", imports: [], cli: "" },
  Card: { path: "@/components/ui/card", imports: ["Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter"], cli: "card" },
  Button: { path: "@/components/ui/button", imports: ["Button"], cli: "button" },
  Input: { path: "@/components/ui/input", imports: ["Input"], cli: "input" },
  Label: { path: "@/components/ui/label", imports: ["Label"], cli: "label" },
  Accordion: { path: "@/components/ui/accordion", imports: ["Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger"], cli: "accordion" },
  Separator: { path: "@/components/ui/separator", imports: ["Separator"], cli: "separator" },
  Badge: { path: "@/components/ui/badge", imports: ["Badge"], cli: "badge" },
  Alert: { path: "@/components/ui/alert", imports: ["Alert", "AlertDescription", "AlertTitle"], cli: "alert" },
  Progress: { path: "@/components/ui/progress", imports: ["Progress"], cli: "progress" },
};

// --- HELPERS ---
const mapBootstrapVariant = (variant: string) => {
  const map: Record<string, string> = {
    default: "btn-primary",
    destructive: "btn-danger",
    outline: "btn-outline-dark",
    secondary: "btn-secondary",
    ghost: "btn-link",
    link: "btn-link"
  };
  return map[variant] || "btn-primary";
};

// Always wrap in absolute positioning
const wrapLayout = (jsx: string, props: any) => {
  const w = typeof props.w === 'number' ? `${props.w}px` : props.w || 'auto';
  const h = typeof props.h === 'number' ? `${props.h}px` : props.h || 'auto';

  return `
    <div style={{ position: 'absolute', left: ${props.x}, top: ${props.y}, width: '${w}', height: '${h}', zIndex: 10 }}>
      ${jsx}
    </div>`;
};

// --- SHADCN GENERATOR ---
const generateShadcnJSX = (item: any, data: Data): string => {
  const { type, props } = item;
  let componentJSX = "";

  switch (type) {
    case "Section": {
      // For the canvas section, we render the children directly
      const zoneKey = `${item.readOnly?.puckId}:canvas-content`;
      const zoneItems = data.zones?.[zoneKey] || [];
      const childrenJSX = zoneItems.map(zi => generateShadcnJSX(zi, data)).join("\n");

      componentJSX = `
      <section 
        className="relative overflow-hidden"
        style={{ 
          backgroundColor: '${props.bgColor}', 
          height: '${props.height}' 
        }}
      >
        ${childrenJSX}
      </section>`;
      return componentJSX; // Section wraps children, doesn't get wrapped itself
    }
    case "Card": 
      componentJSX = `<Card className="w-full h-full"><CardHeader><CardTitle>${props.title}</CardTitle><CardDescription>${props.description}</CardDescription></CardHeader><CardContent>${props.content}</CardContent>${props.footer ? `<CardFooter>${props.footer}</CardFooter>` : ""}</Card>`;
      break;
    case "Button": {
      let onClick = "";
      if (props.actionType === "link" && props.actionTarget) onClick = ` onClick={() => window.location.href = "${props.actionTarget}"}`;
      if (props.actionType === "alert" && props.actionTarget) onClick = ` onClick={() => alert("${props.actionTarget}")}`;
      componentJSX = `<Button variant="${props.variant}" size="${props.size}" className="w-full h-full"${onClick}>${props.text}</Button>`;
      break;
    }
    case "Badge": 
      componentJSX = `<Badge variant="${props.variant}">${props.text}</Badge>`;
      break;
    case "Separator": 
      componentJSX = `<Separator orientation="${props.orientation}" className="w-full h-full" />`;
      break;
    case "Alert": 
      componentJSX = `<Alert variant="${props.variant}"><AlertCircle className="h-4 w-4" /><AlertTitle>${props.title}</AlertTitle><AlertDescription>${props.description}</AlertDescription></Alert>`;
      break;
    case "Progress": 
      componentJSX = `<div className="w-full"><Label>${props.label}</Label><Progress value={${props.value}} /></div>`;
      break;
    case "Input": 
      componentJSX = `<div className="space-y-2 w-full"><Label>${props.label}</Label><Input type="${props.type}" placeholder="${props.placeholder}" /></div>`;
      break;
    case "Accordion": 
      componentJSX = `<Accordion type="single" collapsible className="w-full">${props.items?.map((it: any, i: number) => `<AccordionItem value="item-${i}"><AccordionTrigger>${it.title}</AccordionTrigger><AccordionContent>${it.content}</AccordionContent></AccordionItem>`).join("")}</Accordion>`;
      break;
    default: 
      componentJSX = "";
  }

  return wrapLayout(componentJSX, props);
};

// --- BOOTSTRAP GENERATOR ---
const generateBootstrapJSX = (item: any, data: Data): string => {
  const { type, props } = item;
  let componentJSX = "";

  switch (type) {
    case "Section": {
      const zoneKey = `${item.readOnly?.puckId}:canvas-content`;
      const zoneItems = data.zones?.[zoneKey] || [];
      const childrenJSX = zoneItems.map(zi => generateBootstrapJSX(zi, data)).join("\n");

      componentJSX = `
      <section className="position-relative overflow-hidden" style={{ backgroundColor: '${props.bgColor}', height: '${props.height}' }}>
        ${childrenJSX}
      </section>`;
      return componentJSX;
    }
    case "Card": 
      componentJSX = `
        <div className="card h-100 shadow-sm w-100">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">${props.title}</h5>
            <small className="text-muted">${props.description}</small>
          </div>
          <div className="card-body">
            <p className="card-text">${props.content}</p>
          </div>
          ${props.footer ? `<div className="card-footer text-muted">${props.footer}</div>` : ""}
        </div>`;
      break;
    case "Button": {
      const bootstrapClass = mapBootstrapVariant(props.variant);
      const sizeClass = props.size === 'lg' ? 'btn-lg' : props.size === 'sm' ? 'btn-sm' : '';
      let onClick = "";
      if (props.actionType === "link" && props.actionTarget) onClick = ` onClick={() => window.location.href = "${props.actionTarget}"}`;
      if (props.actionType === "alert" && props.actionTarget) onClick = ` onClick={() => alert("${props.actionTarget}")}`;
      componentJSX = `<button type="button" className={\`btn ${bootstrapClass} ${sizeClass} w-100 h-100\`}${onClick}>${props.text}</button>`;
      break;
    }
    case "Badge": {
      const badgeClass = props.variant === 'secondary' ? 'bg-secondary' : props.variant === 'outline' ? 'border text-dark' : 'bg-primary';
      componentJSX = `<span className={\`badge ${badgeClass}\`}>${props.text}</span>`;
      break;
    }
    case "Alert": {
      const alertClass = props.variant === 'destructive' ? 'alert-danger' : 'alert-primary';
      componentJSX = `
        <div className={\`alert ${alertClass} w-100\`} role="alert">
          <h6 className="alert-heading fw-bold">${props.title}</h6>
          <p className="mb-0">${props.description}</p>
        </div>`;
      break;
    }
    case "Input": 
      componentJSX = `
        <div className="mb-3 w-100">
          <label className="form-label fw-bold text-muted small text-uppercase">${props.label}</label>
          <input type="${props.type}" className="form-control" placeholder="${props.placeholder}" />
        </div>`;
      break;
    case "Progress":
      componentJSX = `
        <div className="mb-3 w-100">
            <label className="form-label fw-bold text-muted small text-uppercase">${props.label}</label>
            <div className="progress" style={{ height: '6px' }}>
                <div className="progress-bar" role="progressbar" style={{ width: "${props.value}%" }} aria-valuenow={${props.value}} aria-valuemin={0} aria-valuax={100}></div>
            </div>
        </div>`;
      break;
    case "Separator":
      componentJSX = `<hr className="${props.orientation === 'vertical' ? 'd-inline-block h-100 border-end border-0 align-middle mx-3' : 'my-3 w-100'}" />`;
      break;
    case "Accordion":
      componentJSX = `
        <div className="accordion w-100" id="accordionExample">
          ${props.items?.map((it: any, i: number) => `
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}">
                ${it.title}
              </button>
            </h2>
            <div id="collapse${i}" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                ${it.content}
              </div>
            </div>
          </div>`).join("")}
        </div>`;
      break;
    default: 
      componentJSX = "";
  }

  return wrapLayout(componentJSX, props);
};

// --- MAIN EXPORT FUNCTION ---

export type ExportFormat = "shadcn" | "bootstrap";

export async function saveProject(pages: Page[], format: ExportFormat = "shadcn") {
  const zip = new JSZip();
  const allUsedComponents = new Set<string>();

  pages.forEach((page) => {
    const pageProps = page.data.root.props as RootProps;
    const pageName = pageProps?.pageTitle?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || "untitled";
    
    let code = "";

    if (format === "shadcn") {
      const usedOnPage = new Set<string>();
      const findUsed = (items: any[]) => {
        items.forEach(i => {
          usedOnPage.add(i.type);
          if (["Input", "Progress"].includes(i.type)) usedOnPage.add("Label");
          const puckId = i.readOnly?.puckId;
          if (puckId && page.data.zones) {
            Object.keys(page.data.zones).forEach(key => {
              if (key.startsWith(puckId)) findUsed(page.data.zones![key] || []);
            });
          }
        });
      };
      findUsed(page.data.content);
      usedOnPage.forEach(u => allUsedComponents.add(u));

      const importStr = Array.from(usedOnPage)
        .map(t => SHADCN_COMPONENT_MAP[t] && SHADCN_COMPONENT_MAP[t].path ? `import { ${SHADCN_COMPONENT_MAP[t].imports.join(", ")} } from "${SHADCN_COMPONENT_MAP[t].path}";` : "")
        .filter(Boolean)
        .join("\n");
        
      const jsx = page.data.content.map(i => generateShadcnJSX(i, page.data)).join("\n");
      
      code = `
import React from 'react';
import { AlertCircle } from "lucide-react";
${importStr}

export default function ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}() {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '${pageProps?.canvasColor}' }}>
      ${jsx}
    </div>
  );
}`;
    } else {
      const jsx = page.data.content.map(i => generateBootstrapJSX(i, page.data)).join("\n");
      
      code = `
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}() {
  return (
    <div style={{ backgroundColor: '${pageProps?.canvasColor}', minHeight: '100vh' }}>
      ${jsx}
    </div>
  );
}`;
    }

    zip.folder("src")?.folder("pages")?.file(`${pageName}.tsx`, code.trim());
  });

  if (format === "shadcn") {
    const cliCommand = `npx shadcn@latest add ${Array.from(allUsedComponents).map(c => SHADCN_COMPONENT_MAP[c]?.cli).filter(Boolean).join(" ")}`;
    zip.file("README.md", `# Generated Site (Shadcn)\n\nRun this to install dependencies:\n\`\`\`bash\n${cliCommand}\n\`\`\``);
  } else {
    zip.file("README.md", `# Generated Site (Bootstrap)\n\nRun this to install dependencies:\n\`\`\`bash\nnpm install bootstrap\n\`\`\``);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${format}-project-export.zip`);
}