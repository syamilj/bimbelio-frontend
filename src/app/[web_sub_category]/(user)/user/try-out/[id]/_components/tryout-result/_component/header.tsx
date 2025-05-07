import { IconTailedArrowPrev } from '@/styles/icon';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import ExitTryout from './exit-tryout';

interface Props {
  current: number;
  total: number;
  name: string;
  done?: boolean;
}

const Header = ({ current, total, name, done }: Props) => {
  // const { onOpen } = useModal();

  const [open, setOpen] = useState<boolean>(false);

  // const progress = ((current + 1) / total) * 100;

  return (
    <header className="absolute left-0 top-0 z-[2] mx-auto flex w-full items-center justify-between gap-x-7 border-b bg-workspace p-[1rem] md:bg-white">
      <div className="flex items-center gap-[.5rem]">
        <ExitTryout
          open={open}
          setOpen={setOpen}
          done={done ? true : false}
        />
        <div
          onClick={() => {
            setOpen(true);
          }}
        >
          <IconTailedArrowPrev className="cursor-pointer text-black transition" />
        </div>

        <p className="pl-[1rem] text-[1.2rem]">{name}</p>
      </div>
      {/* <Progress value={progress} className="w-[50%] h-2 lg:h-3" /> */}
      {total > 0 && (
        <div className="relative flex items-center gap-1 overflow-hidden text-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={current}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ ease: 'backIn', duration: 0.75 }}
              className="block text-lg font-semibold"
            >
              {current + 1}
            </motion.span>
          </AnimatePresence>
          /<span>{total}</span>
        </div>
      )}
    </header>
  );
};

export default Header;

// import { Progress } from "@/src/components/ui/progress";
// import { useModal } from "@/src/hooks/use-modal-store";
// import { X } from "lucide-react";

// import { AnimatePresence, motion } from "framer-motion";

// interface Props {
//   current: number;
//   total: number;
// }

// const Header = ({ current, total }: Props) => {
//   const { onOpen } = useModal();

//   const progress = ((current + 1) / total) * 100;

//   return (
//     <header className="lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between mx-auto w-full">
//       <X
//         onClick={() => onOpen("exit")}
//         className="text-slate-500 hover:opacity-75 transition cursor-pointer"
//       />

//       <Progress value={progress} className="w-[50%] h-2 lg:h-3" />
//       <div className="text-center relative overflow-hidden flex items-center gap-1">
//         <AnimatePresence mode="popLayout">
//           <motion.span
//             key={current}
//             initial={{ y: "100%" }}
//             animate={{ y: "0%" }}
//             exit={{ y: "-100%" }}
//             transition={{ ease: "backIn", duration: 0.75 }}
//             className="block font-semibold text-lg"
//           >
//             {current + 1}
//           </motion.span>
//         </AnimatePresence>
//         /<span>{total}</span>
//       </div>
//     </header>
//   );
// };

// export default Header;
