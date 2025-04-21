import { WebsiteSubCategory } from "@/types/database";

export const getMainStyles = (
  websiteSubCategory: WebsiteSubCategory | null
) => {
  const mainColor = websiteSubCategory?.main_color || "#0091FF";
  const shades = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

  const styles = `
      .bg-gradient {background: linear-gradient(145deg, ${
        websiteSubCategory?.secondary_color
      }, ${websiteSubCategory?.main_color});}
      .bg-main { background-color: ${mainColor}; }
      .data-\[state\=active\]\:bg-main { background-color: ${mainColor}; }

      .text-main { color: ${mainColor}; }
      
      .border-main { border-color: ${mainColor}; }

      .ring-main { --tw-ring-color: ${mainColor}; }
      .ring-offset-background {
            --tw-ring-offset-color: ${mainColor};
      }
      ${shades
        .map((color) => {
          const value = `${hexToRgba(mainColor, color / 100)}`;
          return `
          .bg-main\\/${color} { background-color: ${value}; }
          .hover\\:bg-main\\/${color}:hover { background-color: ${value}; }
          .focus\\:bg-main\\/${color}:focus { background-color: ${value}; }
  
          .data-\[state\=active\]\:bg-main\\/${color} { background-color: ${value}; }
          .ring-main\\/${color} { 
            --tw-ring-color: ${value};
          }
          .ring-offset-background\\/${color}  {
            --tw-ring-offset-color: ${value};
          }
  
          .text-main\\/${color} { color: ${value}; }
          .hover\\:text-main\\/${color} { color: ${value}; }
          .focus\\:text-main\\/${color} { color: ${value}; }

            .border-main\\/${color} { border-color: ${value}; }
          `;
        })
        .join("")}
    `;

  return styles;
};

const hexToRgba = (hex: string, opacity: number) => {
  const sanitizedHex = hex.replace("#", "");
  const bigint = parseInt(sanitizedHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
