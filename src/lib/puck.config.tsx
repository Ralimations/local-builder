import { type Config, DropZone } from "@puckeditor/core";
import { AlertCircle } from "lucide-react";
import { type Props, type RootProps } from "@/types";
import { DraggableWrapper } from "@/components/DraggableWrapper";

// Components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// --- COMMON FIELDS ---
const layoutFields = {
  x: { type: "number", label: "X (px)" },
  y: { type: "number", label: "Y (px)" },
  w: { type: "text", label: "Width" },
  h: { type: "text", label: "Height" }
};

const defaultLayoutProps = {
  x: 20,
  y: 20,
  w: "auto",
  h: "auto"
};

// Helper to wrap render
const withDrag = (Component: React.FC<any>) => (props: any) => (
  <DraggableWrapper {...props}>
    <Component {...props} />
  </DraggableWrapper>
);

export const config: Config<Props, RootProps> = {
  root: {
    fields: {
      pageTitle: { type: "text", label: "Page Title" },
      pageRoute: { type: "text", label: "Page Route" },
      canvasColor: { type: "text", label: "Canvas Background" },
      maxWidth: { 
        type: "select", 
        label: "Max Width",
        options: [
          { label: "Standard (1200px)", value: "max-w-6xl" },
          { label: "Full Width", value: "max-w-full" }
        ]
      }
    },
    defaultProps: {
      pageTitle: "Home",
      pageRoute: "/",
      canvasColor: "#f3f4f6",
      maxWidth: "max-w-full"
    },
    render: ({ children, canvasColor, maxWidth }) => (
      <div className="min-h-screen w-full transition-all" style={{ backgroundColor: canvasColor }}>
        <div className={`mx-auto ${maxWidth}`}>
          {children}
        </div>
      </div>
    ),
  },
  categories: {
    Structure: { components: ["Section"] },
    Layout: { components: ["Card", "Separator", "Accordion"] },
    Forms: { components: ["Button", "Input"] },
    Display: { components: ["Badge", "Progress"] },
    Feedback: { components: ["Alert"] },
    Pages: { components: [] }
  },
  components: {
    Section: {
      fields: {
        sectionTitle: { type: "text", label: "Section Name" },
        height: { type: "text", label: "Height (e.g. 600px)" },
        bgColor: { type: "text", label: "BG Color" }
      },
      defaultProps: {
        sectionTitle: "Canvas Area",
        height: "600px",
        bgColor: "#ffffff",
      },
      render: ({ height, bgColor, sectionTitle }) => (
        <section 
          className="relative border-b border-gray-200 puck-section-container overflow-hidden group"
          style={{ 
            backgroundColor: bgColor,
            height: height,
            minHeight: '400px'
          }}
        >
          <div className="absolute top-0 left-0 bg-gray-100 text-gray-400 text-[10px] px-2 py-1 z-0 pointer-events-none uppercase font-bold tracking-widest group-hover:text-blue-500">
             {sectionTitle}
          </div>
          <div className="absolute inset-0 z-0">
             <DropZone zone="canvas-content" />
          </div>
        </section>
      ),
    },
    
    Button: {
      render: withDrag(({ text, variant, size }) => (
        <Button variant={variant} size={size} className="w-full h-full pointer-events-none">{text}</Button>
      )),
      defaultProps: { ...defaultLayoutProps, w: "120px", h: "40px", text: "Button", variant: "default" },
      fields: { ...layoutFields, text: { type: "text" }, variant: { type: "select", options: [{ label: "Default", value: "default" }, { label: "Destructive", value: "destructive" }] }, size: { type: "select", options: [{ label: "Default", value: "default" }, { label: "Small", value: "sm" }] } },
    },
    Card: {
        render: withDrag(({ title, description, content, footer }) => (
          <Card className="w-full h-full pointer-events-none overflow-hidden"> 
            <CardHeader className="p-4"><CardTitle className="text-lg">{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>
            <CardContent className="p-4 pt-0 text-sm">{content}</CardContent>
            {footer && <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">{footer}</CardFooter>}
          </Card>
        )),
        defaultProps: { ...defaultLayoutProps, w: "300px", h: "200px", title: "Card Title", description: "Subtitle", content: "Card content goes here.", footer: "" },
        fields: { ...layoutFields, title: { type: "text" }, description: { type: "text" }, content: { type: "textarea" }, footer: { type: "text" } },
    },
    Input: {
        render: withDrag(({ label, placeholder }) => (
            <div className="space-y-1.5 pointer-events-none w-full"><Label>{label}</Label><Input placeholder={placeholder} /></div>
        )),
        defaultProps: { ...defaultLayoutProps, w: "250px", h: "auto", label: "Email", placeholder: "test@example.com" },
        fields: { ...layoutFields, label: { type: "text" }, placeholder: { type: "text" } }
    },
    Badge: { 
        render: withDrag(({ text, variant }) => <Badge variant={variant} className="pointer-events-none">{text}</Badge>), 
        defaultProps: { ...defaultLayoutProps, w: "auto", h: "auto", text: "Badge", variant: "default" }, 
        fields: { ...layoutFields, text: { type: "text" }, variant: { type: "select", options: [{label: "Default", value: "default"}, {label: "Outline", value: "outline"}] } } 
    },
    Alert: { 
        render: withDrag(({ title }) => <Alert className="pointer-events-none"><AlertTitle>{title}</AlertTitle></Alert>), 
        defaultProps: { ...defaultLayoutProps, w: "300px", h: "auto", title: "Alert Message" }, 
        fields: { ...layoutFields, title: { type: "text" } } 
    },
    Progress: { 
        render: withDrag(({ value }) => <Progress value={value} className="pointer-events-none" />), 
        defaultProps: { ...defaultLayoutProps, w: "200px", h: "auto", value: 50 }, 
        fields: { ...layoutFields, value: { type: "number" } } 
    },
    Accordion: { 
        render: withDrag(() => <div className="p-4 border rounded bg-white w-full pointer-events-none text-sm text-gray-500">Accordion Component</div>), 
        defaultProps: { ...defaultLayoutProps, w: "300px", h: "auto" }, 
        fields: { ...layoutFields } 
    },
    Separator: { 
        render: withDrag(({ orientation }) => <Separator orientation={orientation} className={orientation === 'vertical' ? 'h-full' : 'w-full'} />), 
        defaultProps: { ...defaultLayoutProps, w: "100%", h: "2px", orientation: "horizontal" }, 
        fields: { ...layoutFields, orientation: { type: "select", options: [{ label: "Horizontal", value: "horizontal" }, { label: "Vertical", value: "vertical" }] } } 
    },
  },
};