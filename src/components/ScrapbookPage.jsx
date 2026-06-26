import React, { forwardRef } from "react";
import "../styles/global.css";
import "../styles/scrapbook.css";

const ScrapbookPage = forwardRef(({ pageNum, isLeft, children }, ref) => {
  return (
    <div 
      className="page-flip-item" 
      ref={ref} 
      style={{ 
        width: "100%", 
        height: "100%", 
        backgroundColor: "var(--cream-paper)",
        position: "relative"
      }}
    >
      <div className={`scrapbook-page ${isLeft ? "left-page" : "right-page"}`}>
        {/* Notebook binding paper lines background effect */}
        <div className="paper-texture" />
        
        {/* Page children content */}
        {children}
        
        {/* Page Footer - Page Indicator */}
        <div className="page-footer">
          {pageNum}
        </div>
      </div>
    </div>
  );
});

export default ScrapbookPage;
