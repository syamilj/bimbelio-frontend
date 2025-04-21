// index.tsx
import LOGO from "@/_assest/logomark.png";
import Logo from "@/components/ui/logo";
import { IconOpenAI } from "@/styles/icon";
import Image from "next/image";

export default function Footer() {
  // const ScrollOffsetLink = ({ href, children }: any) => {
  //   const handleClick = (e: any) => {
  //     e.preventDefault();

  //     const targetId = href.substring(1);
  //     const targetElement = document.getElementById(targetId);

  //     if (targetElement) {
  //       const offset = 200;
  //       const elementPosition = targetElement.getBoundingClientRect().top;
  //       const offsetPosition = elementPosition + window.pageYOffset - offset;

  //       window.scrollTo({
  //         top: offsetPosition,
  //         behavior: 'smooth',
  //       });
  //     }
  //   };

  //   return (
  //     <a
  //       href={href}
  //       onClick={handleClick}
  //       className="text-main-gray-text md:hover:underline md:hover:text-main duration-200"
  //     >
  //       {children}
  //     </a>
  //   );
  // };
  return (
    <div
      id="footer"
      className="mx-auto w-full max-w-[1280px] px-[1rem] md:px-0"
    >
      <div className="flex w-full items-center justify-between">
        {/* <div className="">
          <Image src={logo} alt="Bimbelio - Bimbel AI untuk SNBT/UTBK" />
        </div> */}
        <Logo />
        <div className="flex items-center gap-[.5rem] text-[1.5rem]">
          <i className="bx bxl-instagram text-main" />
          <p className="text-[1rem] font-semibold text-main">Bimbelio</p>
        </div>
      </div>
      {/* <div className="grid grid-cols-2 md:flex gap-[2rem] md:gap-[6rem] justify-center w-full py-[2rem] text-center md:text-start">
        <div className="flex flex-col gap-[1rem]">
          <h1 className="text-[1.2rem] font-regular">Hubungi kami</h1>
          <div>
            <p className="text-main text-[.9rem]">Customer Support</p>
            <p className="text-main-gray-text2 text-[.9rem]">
              tutorsnbt@gmail.com
            </p>
          </div>
          <div>
            <p className="text-main text-[.9rem]">IT Support</p>
            <p className="text-main-gray-text2 text-[.9rem]">
              tutorsnbt@gmail.com
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[.5rem] text-[.9rem]">
          <h1 className="text-[1.2rem] font-regular">Navigation</h1>
          <div className="flex gap-[1rem] justify-center md:justify-start">
            <div className="flex flex-col gap-[.5rem]">
              <ScrollOffsetLink href={'#hero'}>Beranda</ScrollOffsetLink>
              <ScrollOffsetLink href={'#fitur'}>Fitur</ScrollOffsetLink>
              <ScrollOffsetLink href={'#materi'}>Materi</ScrollOffsetLink>
              <ScrollOffsetLink href={'#testimoni'}>Testimoni</ScrollOffsetLink>
            </div>
            <div className="flex flex-col gap-[.5rem]">
              <ScrollOffsetLink href={'#faq'}>FAQ</ScrollOffsetLink>
              <ScrollOffsetLink href={'#pricing'}>Harga</ScrollOffsetLink>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[.5rem] text-[.9rem] col-span-2">
          <h1 className="text-[1.2rem] font-regular">Ketentuan</h1>
          <Link
            href={'/privacy-policy'}
            className="text-main-gray-text md:hover:underline md:hover:text-main duration-200"
          >
            Kebijakan Privasi
          </Link>
          <Link
            href={'/terms-of-service'}
            className="text-main-gray-text md:hover:underline md:hover:text-main duration-200"
          >
            Syarat dan Ketentuan
          </Link>
        </div>
      </div> */}
      <div className="font-regular mt-[2rem] flex w-full flex-col justify-center gap-[1rem] border-t py-[1rem] text-center text-[.9rem] text-main-gray-text md:flex-row md:justify-between">
        <div className="flex shrink-0 items-center justify-center gap-[.5rem] md:justify-start">
          Powered by
          <IconOpenAI />
        </div>
        <p>by Jutif AI | ©2024 Bimbelio. All Right Reserved.</p>
      </div>
    </div>
  );
}
