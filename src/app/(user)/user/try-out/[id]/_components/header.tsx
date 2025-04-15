import { IconTailedArrowPrev } from '@/styles/icon';
import { useState } from 'react';
import ExitTryout from './exit-tryout';

interface HeaderProps {
  current: number;
  total: number;
  name: string;
  done?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  current,
  total,
  name,
  done = false,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="absolute left-0 top-0 z-10 mx-auto flex w-full items-center rounded-b-xl justify-between border-b bg-workspace/80 p-4 md:bg-white">
      <div className="flex items-center gap-2">
        <ExitTryout
          open={open}
          setOpen={setOpen}
          done={done}
        />
        <div
          onClick={() => {
            setOpen(true);
          }}
        >
          <IconTailedArrowPrev className="cursor-pointer text-black transition-colors hover:text-gray-600" />
        </div>
        <p className="pl-4 text-xl font-semibold">{name}</p>
      </div>
      <div className="hidden md:block">
        <span className="text-sm text-gray-600">
          {current + 1} / {total}
        </span>
      </div>
    </header>
  );
};

export default Header;
