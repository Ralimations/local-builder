import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { usePuck } from "@puckeditor/core";
import { type LayoutProps } from "@/types";

interface DraggableWrapperProps extends LayoutProps {
  children: React.ReactNode;
  id?: string;
}

export const DraggableWrapper: React.FC<DraggableWrapperProps & { [key: string]: any }> = ({
  children,
  x = 0,
  y = 0,
  w = "auto",
  h = "auto",
  id, // We will try to pass this from config if available, or find it
  ...props
}) => {
  const { appState, dispatch } = usePuck();
  const [isHovered, setIsHovered] = useState(false);
  
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width: w, height: h });

  useEffect(() => {
    setPosition({ x, y });
    setSize({ width: w, height: h });
  }, [x, y, w, h]);

  // Helper to find and select this component in Puck's data
  const handleSelect = (e: React.MouseEvent | React.TouchEvent) => {
    // 1. Stop propagation so we don't trigger parent selections immediately
    e.stopPropagation();

    // 2. Find this item in the data tree
    // We match by comparing the props (x, y, w, h) + specific content props
    const { data } = appState;
    
    const findItemPath = () => {
      // Check main content
      const contentIndex = data.content.findIndex(item => 
        item.props.x === x && item.props.y === y && item.props.w === w
      );
      if (contentIndex !== -1) return { index: contentIndex, zone: "content" }; // Puck uses "content" or undefined for root? Usually undefined/null key for root list.
      
      // Check zones
      for (const [zoneKey, items] of Object.entries(data.zones || {})) {
        const zoneIndex = items.findIndex(item => 
           item.props.x === x && item.props.y === y && item.props.w === w
        );
        if (zoneIndex !== -1) return { index: zoneIndex, zone: zoneKey };
      }
      return null;
    };

    const path = findItemPath();
    
    if (path) {
      dispatch({ 
        type: "setUi", 
        payload: { 
          itemSelector: path,
          componentListOpen: true 
        } 
      });
    }
  };

  const updateProps = (newProps: Partial<LayoutProps>) => {
    // Only update if we have a valid selection (which we should after clicking)
    if (appState.ui.itemSelector) {
        const { index, zone } = appState.ui.itemSelector;
        const currentProps = zone && zone !== "content" 
            ? appState.data.zones?.[zone]?.[index]?.props 
            : appState.data.content[index]?.props;

        if (currentProps) {
            dispatch({
                type: "set",
                payload: { ...currentProps, ...newProps }
            } as any);
        }
    }
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      // MouseDownCapture ensures we catch the click before Rnd might swallow it
      onMouseDownCapture={handleSelect}
      className="absolute top-0 left-0" 
      style={{ pointerEvents: 'auto', zIndex: isHovered ? 50 : 10 }}
    >
      <Rnd
        size={size}
        position={position}
        onDrag={(e, d) => setPosition({ x: d.x, y: d.y })}
        onDragStop={(e, d) => updateProps({ x: d.x, y: d.y })}
        onResize={(e, direction, ref, delta, position) => {
            setSize({ width: ref.style.width, height: ref.style.height });
            setPosition(position);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          updateProps({
            w: ref.style.width,
            h: ref.style.height,
            x: position.x,
            y: position.y
          });
        }}
        bounds=".puck-section-container"
        className={`group ${isHovered ? 'ring-1 ring-blue-500 ring-dashed' : ''}`}
        // We use a handle to ensure dragging is deliberate, allowing clicks on content to pass if needed
        // But for free-form, dragging anywhere is usually expected.
        cancel=".no-drag" // Add class 'no-drag' to inner elements if you want them clickable without dragging
      >
        <div className="w-full h-full relative">
            {/* Hover Label */}
            {isHovered && (
                <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm z-50 whitespace-nowrap pointer-events-none">
                    {Math.round(position.x)}, {Math.round(position.y)}
                </div>
            )}
            
            {/* Overlay to ensure we can select even if content is pointer-events-none */}
            <div className="absolute inset-0 z-0" />
            
            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
      </Rnd>
    </div>
  );
};