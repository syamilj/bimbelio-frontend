'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { Subscription, UserRoleEnum } from '@/types/database';
import { Check, ChevronsUpDown, Users } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const SelectUser = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [selectedUser, setSelectedUser] = useState<UserDataType | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const { mainColor, secondaryColor } = useWebsiteSubCategory();

  useEffect(() => {
    if (email) {
      setSearchTerm(email);
    }
  }, [email]);

  const { data: usersData } = useGet<UserDataType[]>('/user/getAllUsers', {
    params: {
      take: 10,
      page: 1,
      search: searchTerm,
    },
    debounceTime: 1000,
    enabled: searchTerm.length >= 3 || searchTerm.length === 0,
    useEffectDependencies: [searchTerm],
    onSuccess: ({ data }) => {
      if (data) {
        const findData = data.find((user) => user.email === email);
        if (findData) {
          setSelectedUser(findData);
        }
      }
    },
  });

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden mb-6">
      <CardHeader
        className="pb-0 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <Users
              className="w-5 h-5"
              style={{ color: mainColor }}
            />
          </div>
          <CardTitle
            className="text-xl font-bold"
            style={{ color: mainColor }}
          >
            Pilih User
          </CardTitle>
        </div>
        <div
          className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
      </CardHeader>

      <CardContent className="p-6 pt-4">
        <Popover
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between border-2"
              style={{
                borderColor: `${mainColor}30`,
                backgroundColor: `${mainColor}05`,
              }}
            >
              {selectedUser ? selectedUser.email : 'Cari dan Pilih User'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            side="bottom"
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Cari berdasarkan email atau nama..."
                value={searchTerm}
                onValueChange={(value) => setSearchTerm(value)}
              />
              <CommandList>
                {usersData && usersData.length === 0 ? (
                  <CommandEmpty>User tidak ditemukan.</CommandEmpty>
                ) : null}
                <CommandGroup>
                  {usersData?.map((user) => {
                    const isExsist = selectedUser?.id === user.id;
                    return (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        onSelect={() => {
                          if (isExsist) return;
                          setSelectedUser({
                            ...user,
                          });
                          setPopoverOpen(false);
                          const linkElement = document.getElementById(user.id);
                          if (linkElement) {
                            linkElement.click();
                          }
                        }}
                        className={cn(
                          'flex items-center justify-start w-full',
                          isExsist && 'opacity-50  pointer-events-none',
                        )}
                      >
                        {isExsist && (
                          <Check className={cn('mr-2 h-4 w-4 shrink-0')} />
                        )}
                        <Link
                          id={user.id}
                          href={`/${website_sub_category_id_params}/admin/learning-analytics/${user.id}?email=${user.email}`}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

type UserDataType = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  Role: UserRoleEnum;
  TryoutUnlock: {
    id: string;
  }[];
  UserTryout: {
    id: string;
    phone: string;
    kabupaten: string;
    provinsi: string;
    channel: string;
    schoolOrigin: string;
  } | null;
  Subscription: Subscription[];
};
