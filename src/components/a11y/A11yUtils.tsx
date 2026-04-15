import React from "react";

/**
 * ScreenReaderOnly - Content that is only visible to screen readers.
 * Use this for adding descriptive labels that aren't visible in the UI.
 */
export const ScreenReaderOnly = ({ 
  children, 
  as: Component = "span" 
}: { 
  children: React.ReactNode; 
  as?: any; 
}) => {
  return (
    <Component
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: "0",
      }}
    >
      {children}
    </Component>
  );
};

/**
 * Emoji - Build-safe emoji component with built-in accessibility.
 * Hides decorative emojis from screen readers by default.
 */
export const Emoji = ({ 
  symbol, 
  label, 
  hidden = true 
}: { 
  symbol: string; 
  label?: string; 
  hidden?: boolean; 
}) => {
  return (
    <span
      role="img"
      aria-label={label}
      aria-hidden={hidden ? "true" : "false"}
    >
      {symbol}
    </span>
  );
};
