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

              // Try to find the highlight in the currently active PDF view
              const visionOnElement = document.querySelector('#VisionOn') as HTMLElement;
              const vision = visionOnElement?.style.display !== 'none';
              const containerId = vision ? 'VisionOn' : 'VisionOff';
              
              // Multiple selector patterns based on react-pdf-highlighter-extended structure
              const selectors = [
                // CSS class selectors from the library
                `#${containerId} .Highlight[data-highlight-id="${props.block.props.highlightId}"]`,
                `#${containerId} .TextHighlight[data-highlight-id="${props.block.props.highlightId}"]`,
                `#${containerId} .Highlight__part[data-highlight-id="${props.block.props.highlightId}"]`,
                `#${containerId} .TextHighlight__part[data-highlight-id="${props.block.props.highlightId}"]`,
                // ID-based selectors
                `#${containerId} #${props.block.props.highlightId}`,
                `#${containerId} [data-id="${props.block.props.highlightId}"]`,
                // General highlight selectors
                `#${containerId} [data-highlight-id="${props.block.props.highlightId}"]`,
                // Fallback selectors
                `.Highlight[data-highlight-id="${props.block.props.highlightId}"]`,
                `#${props.block.props.highlightId}`
              ];
              
              let highlightElement: HTMLElement | null = null;
              
              // Try each selector until we find a match
              for (const selector of selectors) {
                highlightElement = document.querySelector(selector) as HTMLElement;
                if (highlightElement) {
                  console.log(`Found highlight using selector: ${selector}`);
                  break;
                }
              }

              if (highlightElement) {
                // Get the PDF container for proper scrolling
                const pdfContainer = document.querySelector(`#${containerId} .PdfHighlighter`);
                
                if (pdfContainer) {
                  // Calculate position relative to container
                  const containerRect = pdfContainer.getBoundingClientRect();
                  const highlightRect = highlightElement.getBoundingClientRect();
                  const scrollTop = pdfContainer.scrollTop + (highlightRect.top - containerRect.top) - 100; // 100px offset
                  
                  // Smooth scroll to position
                  pdfContainer.scrollTo({
                    top: Math.max(0, scrollTop),
                    behavior: 'smooth'
                  });
                } else {
                  // Fallback to regular scrollIntoView
                  highlightElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest',
                  });
                }

                // Add temporary highlight effect
                const originalBoxShadow = highlightElement.style.boxShadow;
                const originalTransition = highlightElement.style.transition;
                highlightElement.style.boxShadow = '0 0 15px rgba(255, 193, 7, 0.9)';
                highlightElement.style.transition = 'box-shadow 0.3s ease';
                
                setTimeout(() => {
                  highlightElement.style.boxShadow = originalBoxShadow;
                  highlightElement.style.transition = originalTransition;
                }, 2500);
              } else {
                console.warn(`Highlight dengan ID ${props.block.props.highlightId} tidak ditemukan di ${containerId}`);
                // Fallback: set hash and let browser handle scroll
                document.location.hash = props.block.props.highlightId;
              }
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
