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

  // Telegram option - Alternatif
  const telegramOption: ContactOption = {
    id: 'telegram',
    title: 'Grup Belajar',
    description: 'Join komunitas study buddies yang supportive 24/7',
    icon: <Users className="w-5 h-5" />,
    action: () => {
      // Track community join event (using different tracking for community)
      try {
        pixel.meta.track('Lead', {
          content_type: 'community',
          content_name: 'telegram_group',
          value: 0, // ✅ Free community join - no monetary value
        });

        pixel.tiktok.track('Lead', {
          content_name: 'telegram_group',
          content_id: 'telegram_group_join', // ✅ Required for TikTok VSA
        });
      } catch (error) {
        console.warn('Pixel tracking error:', error);
      }

      window.open('https://t.me/bimbelio', '_blank');
      setIsDialogOpen(false);
    },
    color: '#0088CC', // Telegram blue
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
      {/* Main Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 1, // Muncul setelah page load
        }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          onClick={handleMainButtonClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            'relative w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg backdrop-blur-sm',
            'flex items-center justify-center text-white font-semibold',
            'transition-all duration-300 hover:shadow-xl',
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
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: mainColor }}
          />

          {/* Icon */}
          <PhoneCall className="w-6 h-6 md:w-7 md:h-7 relative z-10" />

          {/* Tooltip - hanya di desktop */}
          <div className="hidden md:block absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
              Konsultasi Gratis
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Contact Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col items-center justify-center">
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

            {/* Quick Stats - Compact Layout */}
            <div className="flex justify-center gap-4 text-center py-2">
              <div>
                <div
                  className="font-bold text-base leading-tight"
                  style={{ color: mainColor }}
                >
                  {CONTACT_CONFIG.stats.responseTime}
                </div>
                <div className="text-xs text-gray-600">Response</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div
                  className="font-bold text-base leading-tight"
                  style={{ color: mainColor }}
                >
                  {CONTACT_CONFIG.stats.studentsServed}
                </div>
                <div className="text-xs text-gray-600">Siswa</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div
                  className="font-bold text-base leading-tight"
                  style={{ color: mainColor }}
                >
                  {CONTACT_CONFIG.stats.satisfactionRate}
                </div>
                <div className="text-xs text-gray-600">Rating</div>
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

            {/* Grup Telegram - Alternatif */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">
                Mulai dari Komunitas
              </h3>
              <Button
                onClick={telegramOption.action}
                className={cn(
                  'w-full h-auto p-4 rounded-xl text-left',
                  'flex items-center gap-4 bg-white border-2',
                  'hover:shadow-lg transition-all duration-300 hover:scale-105',
                  'border-blue-200 bg-blue-50/30 hover:bg-blue-50/50',
                )}
                style={{
                  borderColor: `${telegramOption.color}30`,
                }}
                variant="outline"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: telegramOption.color }}
                >
                  {telegramOption.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {telegramOption.title}
                    </h3>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Gratis
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {telegramOption.description}
                  </p>
                </div>
              </Button>
            </div>

            {/* Additional Info - Updated Messaging */}
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                  style={{ backgroundColor: mainColor }}
                >
                  💡
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 text-sm">
                    Blueprint Personal 100% Gratis
                  </span>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Tim kami akan membantu kamu bikin strategi belajar yang
                    tepat untuk mencapai target PTN idamanmu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingContactButton;
