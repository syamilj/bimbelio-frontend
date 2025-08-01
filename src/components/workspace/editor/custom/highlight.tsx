import { defaultProps } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';

export const HighlighBlock = createReactBlockSpec(
  {
    type: 'highlight',
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      highlightId: {
        default: '',
      },
    },
    content: 'inline',
  },
  {
    render: (props) => {
      return (
        <div className="flex min-h-[40px] w-full max-w-full items-center gap-2 rounded-sm p-2 bg-yellow-50 border-l-4 border-yellow-400 my-2">
          <div
            onClick={() => {
              if (!props?.block?.props?.highlightId) return;

              const highlightId = props.block.props.highlightId;
              
              // Multiple scroll strategies for better reliability
              const scrollToHighlight = () => {
                // Strategy 1: Use URL hash (works with PDF provider)
                const currentHash = window.location.hash;
                window.location.hash = highlightId;
                
                // Strategy 2: Direct DOM scroll after small delay
                setTimeout(() => {
                  const visionOnElement = document.querySelector('#VisionOn') as HTMLElement;
                  const vision = visionOnElement?.style.display !== 'none';
                  const containerId = vision ? 'VisionOn' : 'VisionOff';
                  
                  const pdfContainer = document.querySelector(`#${containerId} .PdfHighlighter`);
                  
                  if (pdfContainer) {
                    // Try multiple selectors for the highlight
                    const selectors = [
                      `#${containerId} [data-id="${highlightId}"]`,
                      `#${containerId} .Highlight[data-id="${highlightId}"]`,
                      `#${containerId} .TextHighlight[data-id="${highlightId}"]`,
                      `[data-id="${highlightId}"]`,
                      `#${highlightId}`
                    ];

                    let highlightElement: HTMLElement | null = null;
                    for (const selector of selectors) {
                      const el = document.querySelector(selector) as HTMLElement;
                      if (el && el.offsetParent !== null) {
                        highlightElement = el;
                        break;
                      }
                    }

                    if (highlightElement) {
                      const containerRect = pdfContainer.getBoundingClientRect();
                      const highlightRect = highlightElement.getBoundingClientRect();
                      const scrollTop = pdfContainer.scrollTop + (highlightRect.top - containerRect.top) - 100;
                      
                      pdfContainer.scrollTo({
                        top: Math.max(0, scrollTop),
                        behavior: 'smooth'
                      });

                      // Visual feedback
                      highlightElement.style.outline = '2px solid #fbbf24';
                      setTimeout(() => {
                        highlightElement!.style.outline = '';
                      }, 1500);
                    }
                  }
                  
                  // Reset hash
                  setTimeout(() => {
                    window.location.hash = currentHash;
                  }, 100);
                }, 200);
              };

              scrollToHighlight();
            }}
            className="w-3 h-3 rounded-full bg-yellow-400 hover:cursor-pointer hover:bg-yellow-500 transition-colors flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div
              className="inline-content text-gray-900 font-medium"
              style={{
                color: '#1f2937 !important',
                fontSize: '14px',
                lineHeight: '1.5',
              }}
              ref={props.contentRef}
            />

            {/* Fallback text rendering if contentRef doesn't work */}
            {props.block.content && Array.isArray(props.block.content) && (
              <div
                className="fallback-content text-gray-900 font-medium"
                style={{ color: '#1f2937 !important' }}
              >
                {props.block.content.map((item: any, index: number) => (
                  <span key={index}>
                    {item.type === 'text' ? item.text : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
);
