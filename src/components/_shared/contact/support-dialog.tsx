'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CONTACT_CONFIG } from '@/config/contact';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { cn } from '@/lib/utils';
import { MessageCircle, Phone, Users } from 'lucide-react';
import { ReactNode } from 'react';
interface ContactOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

export const SupportDialog = ({ children }: { children: ReactNode }) => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Dynamic colors from website sub category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  // Pixel tracking function for contact events
  const trackContactEvent = (contactType: string, contactValue: number) => {
    try {
      trackUnifiedEvent({
        eventName: 'Contact',
        customData: {
          content_type: 'contact',
          content_name: contactType,
          content_id: `contact_${contactType.toLowerCase()}`,
          value: contactValue,
        },
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
        trackUnifiedEvent({
          eventName: 'Lead',
          customData: {
            content_type: 'community',
            content_name: 'discord_group',
            content_id: 'discord_group_join',
            value: 0,
          },
        });
      } catch (error) {
        console.warn('Pixel tracking error:', error);
      }

      window.open('https://www.bimbelio.com/link/komunitas', '_blank');
    },
    color: '#0088CC', // Discord blue
  };

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
  };

  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={handleMainButtonClick}
      >
        {children}
      </DialogTrigger>
      <DialogContent className="mb:max-w-md max-h-[90vh] overflow-hidden flex flex-col items-center justify-center">
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
  );
};
