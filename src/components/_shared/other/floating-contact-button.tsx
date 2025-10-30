'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CONTACT_CONFIG } from '@/config/contact';
import { pixel } from '@/lib/pixel/_core';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, PhoneCall, Users } from 'lucide-react';
import { useState } from 'react';

interface ContactOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

const FloatingContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Dynamic colors from website sub category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Pixel tracking function for contact events
  const trackContactEvent = (contactType: string, contactValue: number) => {
    try {
      // Track Meta Pixel Contact event with correct value format
      pixel.meta.track('Contact', {
        content_type: 'contact',
        content_name: contactType,
      });

      // Track TikTok Pixel Contact event - using 'contact' as requested
      pixel.tiktok.track('Contact', {
        content_name: contactType,
        content_id: `contact_${contactType.toLowerCase()}`, // ✅ Required for TikTok VSA
      });

      console.log(`📊 Pixel tracked: ${contactType} contact initiated`);
    } catch (error) {
      console.warn('Pixel tracking error:', error);
    }
  };

  // Contact options - Konsultasi langsung
  const consultationOptions: ContactOption[] = [
    {
      id: 'whatsapp',
      title: 'Chat WhatsApp',
      description: 'Respons cepat dalam 5 menit',
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => {
        // Track pixel event before redirect - using numeric value for conversion tracking
        trackContactEvent('WhatsApp', 1);

        const message = encodeURIComponent(CONTACT_CONFIG.whatsapp.message);
        window.open(
          `https://wa.me/${CONTACT_CONFIG.whatsapp.number}?text=${message}`,
          '_blank',
        );
        setIsDialogOpen(false);
      },
      color: '#25D366', // WhatsApp green
    },
    {
      id: 'phone',
      title: 'Telepon Langsung',
      description: 'Bicara dengan ahli sekarang',
      icon: <Phone className="w-5 h-5" />,
      action: () => {
        // Track pixel event before call - using numeric value for conversion tracking
        trackContactEvent('Phone', 1);

        window.open(`tel:${CONTACT_CONFIG.phone.number}`, '_self');
        setIsDialogOpen(false);
      },
      color: mainColor,
    },
  ];

  // Discord option - Alternatif
  const discordOption: ContactOption = {
    id: 'discord',
    title: 'Grup Belajar',
    description: 'Join komunitas study buddies yang supportive 24/7',
    icon: <Users className="w-5 h-5" />,
    action: () => {
      // Track community join event (using different tracking for community)
      try {
        pixel.meta.track('Lead', {
          content_type: 'community',
          content_name: 'discord_group',
          value: 0, // ✅ Free community join - no monetary value
        });

        pixel.tiktok.track('Lead', {
          content_name: 'discord_group',
          content_id: 'discord_group_join', // ✅ Required for TikTok VSA
        });
      } catch (error) {
        console.warn('Pixel tracking error:', error);
      }

      window.open('https://discord.com/invite/5Fy3fnVaE9', '_blank');
      setIsDialogOpen(false);
    },
    color: '#0088CC', // Discord blue
  };

  const handleMainButtonClick = () => {
    // Track dialog open event with correct content_type
    try {
      pixel.meta.track('ViewContent', {
        content_type: 'page', // ✅ Valid content_type
        content_name: 'Contact Modal',
      });

      pixel.tiktok.track('ViewContent', {
        content_name: 'Contact Modal',
        content_id: 'floating_contact_modal', // ✅ Required for TikTok VSA
        page_path: '/contact-modal',
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
          className="hidden md:flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-xl border-2"
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
          className={cn(
            'relative w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl backdrop-blur-sm',
            'flex items-center justify-center text-white font-semibold',
            'transition-all duration-300 hover:shadow-2xl',
            'focus:outline-none focus:ring-4 focus:ring-offset-2',
            // Mobile optimizations
            'touch-manipulation select-none',
            // Ensure button is accessible on mobile
            'active:scale-95',
          )}
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

      {/* Contact Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="md:max-w-md max-h-[90vh] overflow-hidden flex flex-col items-center justify-center">
          <DialogHeader className="pb-4 w-full">
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              Wujudkan Impian PTN-mu!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 text-sm mt-2">
              Pilih langkah pertama untuk memulai journey menuju PTN idaman
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 w-full">
            {/* Konsultasi Langsung - 2 Columns Grid */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">
                Konsultasi Langsung
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {consultationOptions.map((option, index) => (
                  <div
                    key={`consultation-${option.id}`}
                    className="w-full"
                  >
                    <Button
                      onClick={option.action}
                      className={cn(
                        'w-full h-auto p-3 rounded-xl text-center',
                        'flex flex-col items-center gap-2 bg-white border-2',
                        'hover:shadow-lg transition-all duration-300',
                        'hover:border-opacity-60 hover:bg-opacity-5 hover:scale-105',
                      )}
                      style={{
                        borderColor: `${option.color}30`,
                      }}
                      variant="outline"
                    >
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: option.color }}
                      >
                        {option.icon}
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {option.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-tight px-1">
                          {option.description}
                        </p>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500">atau</span>
              </div>
            </div>

            {/* Grup Discord - Alternatif */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">
                Mulai dari Komunitas
              </h3>
              <Button
                onClick={discordOption.action}
                className={cn(
                  'w-full h-auto p-4 rounded-xl text-left',
                  'flex items-center gap-4 bg-white border-2',
                  'hover:shadow-lg transition-all duration-300 hover:scale-105',
                  'border-blue-200 bg-blue-50/30 hover:bg-blue-50/50',
                )}
                style={{
                  borderColor: `${discordOption.color}30`,
                }}
                variant="outline"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: discordOption.color }}
                >
                  {discordOption.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {discordOption.title}
                    </h3>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Gratis
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {discordOption.description}
                  </p>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingContactButton;
