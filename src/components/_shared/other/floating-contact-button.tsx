'use client';

import ConsultationDialog from '@/components/_shared/contact/consultation-dialog';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { motion } from 'framer-motion';
import { PhoneCall } from 'lucide-react';
import { useState } from 'react';

const FloatingContactButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Dynamic colors from website sub category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const handleMainButtonClick = () => {
    // Track dialog open event with correct content_type
    try {
      trackUnifiedEvent({
        eventName: 'ViewContent',
        customData: {
          content_type: 'page',
          content_name: 'Contact Modal',
          content_id: 'floating_contact_modal',
          page_path: '/contact-modal',
        },
      });

      console.log('📊 Pixel tracked: Contact dialog opened');
    } catch (error) {
      console.warn('Pixel tracking error:', error);
    }

    setIsDialogOpen(true);
  };

  return (
    <>
      {/* Main Floating Button with Text Bubble */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: 100 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 1.2, // Muncul setelah page load
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      >
        {/* Text Bubble - Animated */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 1.5,
            duration: 0.5,
          }}
          className="hidden md:flex items-center gap-2 bg-white px-4 py-3 rounded-3xl shadow-xl border-2"
          style={{
            borderColor: `${mainColor}30`,
          }}
        >
          {/* Question Mark Badge */}
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md"
            style={{
              background: `linear-gradient(135deg, #FFA500, #FF6347)`,
            }}
          >
            ?
          </motion.div>

          {/* Text Content */}
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-gray-900 leading-tight">
              Bingung?
            </span>
            <span
              className="text-sm font-black leading-tight"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Konsultasi Langsung!
            </span>
          </div>

          {/* Arrow Pointer */}
          <div
            className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rotate-45 border-r-2 border-b-2 bg-white"
            style={{
              borderColor: `${mainColor}30`,
            }}
          />
        </motion.div>

        {/* Mobile Text Bubble - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.5,
            duration: 0.5,
          }}
          className="md:hidden bg-white px-3 py-2 rounded-xl shadow-lg border-2"
          style={{
            borderColor: `${mainColor}30`,
          }}
        >
          <span
            className="text-xs font-black"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Konsultasi!
          </span>
          <div
            className="absolute -right-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 rotate-45 border-r-2 border-b-2 bg-white"
            style={{
              borderColor: `${mainColor}30`,
            }}
          />
        </motion.div>

        {/* Circular Button */}
        <motion.button
          onClick={handleMainButtonClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl backdrop-blur-sm flex items-center justify-center text-white font-semibold transition-all duration-300 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 touch-manipulation select-none active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
          aria-label="Buka menu konsultasi"
          role="button"
        >
          {/* Pulse animation ring */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-30"
            style={{ backgroundColor: mainColor }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Icon with bounce animation */}
          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <PhoneCall className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Contact Dialog - menggunakan reusable component */}
      <ConsultationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Wujudkan Impian PTN-mu!"
        description="Pilih langkah pertama untuk memulai journey menuju PTN idaman"
        showStats={true}
        showDiscordOption={true}
      />
    </>
  );
};

export default FloatingContactButton;
