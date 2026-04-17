import { type Data } from "@puckeditor/core";

// Common props for positioning
export type LayoutProps = {
  x?: number;
  y?: number;
  w?: number | string; // width
  h?: number | string; // height
  // Removed 'position' - we are going full "Free Canvas"
};

// Helper to add layout props to existing props
export type WithLayout<T> = T & LayoutProps;

export type Props = {
  Section: WithLayout<{ 
    columns: number; // We might keep columns for grid guides, or ignore them
    gap: number; 
    paddingY: number; 
    bgColor: string;
    sectionTitle: string;
    height: string; // Add height control for the canvas section
  }>;
  Button: WithLayout<{ 
    text: string; 
    variant: "default" | "destructive" | "outline" | "secondary"; 
    size: "default" | "sm" | "lg";
    actionType: "none" | "link" | "alert";
    actionTarget: string;
  }>;
  Badge: WithLayout<{ text: string; variant: "default" | "secondary" | "outline" }>;
  Card: WithLayout<{ title: string; description: string; content: string; footer: string }>;
  Accordion: WithLayout<{ items: { title: string; content: string }[] }>;
  Input: WithLayout<{ type: string; placeholder: string; label: string }>;
  Alert: WithLayout<{ title: string; description: string; variant: "default" | "destructive" }>;
  Progress: WithLayout<{ value: number; label: string }>;
  Separator: WithLayout<{ orientation: "horizontal" | "vertical" }>;
};

export type RootProps = {
  canvasColor: string;
  maxWidth: string;
  pageTitle: string;
  pageRoute: string;
};

export interface Page {
  id: string;
  data: Data;
}