"use client";
import {
  IconBlogAdmin,
  IconCourse,
  IconDocumentAdmin,
  IconReceipt,
  IconTryOut,
  IconUserAdmin,
} from "@/styles/icon";
import { usePathname } from "next/navigation";
import { FC } from "react";
import ActiveLink from "./active-link";
import { cn } from "@/lib/utils";
import ChooseWebCategory from "@/components/ui/choose-web-category";
import { useAppContext } from "@/components/provider/provider-app";

const SidebarRoute: FC = () => {
  const pathname = usePathname();
  const { minimizeSidebar } = useAppContext();

  const routes = [
    {
      icon: (
        <IconReceipt
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes("website-category")
              ? "text-main-gray-text2"
              : "text-white"
          }`}
        />
      ),
      href: "/admin/website-category",
      label: "Web Category",
    },
    {
      icon: (
        <IconUserAdmin
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes("user")
              ? "text-main-gray-text2"
              : "text-white"
          }`}
          active={pathname?.toLowerCase().includes("user") ? true : false}
        />
      ),
      href: "/admin/user",
      label: "User",
    },
    {
      icon: (
        <IconUserAdmin
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes("pricing")
              ? "text-main-gray-text2"
              : "text-white"
          }`}
          active={pathname?.toLowerCase().includes("pricing") ? true : false}
        />
      ),
      href: "/admin/pricing",
      label: "Pricing",
    },

    {
      icon: (
        <IconReceipt
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes("plan")
              ? "text-main-gray-text2"
              : "text-white"
          }`}
        />
      ),
      href: "/admin/plan",
      label: "Plan",
    },
    {
      icon: (
        <IconBlogAdmin
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes("blog")
              ? "text-main-gray-text2"
              : "text-white"
          }`}
          active={pathname?.toLowerCase().includes("blog") ? true : false}
        />
      ),
      href: "/admin/blog",
      label: "Blog",
    },
    {
      icon: (
        <IconDocumentAdmin
          w={20}
          className={`text-[1.5rem] ${
            pathname?.toLowerCase() !== "/admin/category"
              ? "text-main-gray-text2"
              : "text-white"
          }`}
        />
      ),
      href: "/admin/category",
      label: "Category Document",
    },
    {
      icon: (
        <IconDocumentAdmin
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes("document")
              ? "text-main-gray-text2"
              : "text-white"
          }`}
          active={pathname?.toLowerCase().includes("document") ? true : false}
        />
      ),
      href: "/admin/document",
      label: "Document",
    },
    {
      icon: (
        <IconTryOut
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes("category-tryout")
              ? "text-main-gray-text2"
              : "text-white"
          }`}
        />
      ),
      href: "/admin/category-tryout",
      label: "Category Tryout",
    },
    {
      icon: (
        <IconTryOut
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes("/tryout")
              ? "text-main-gray-text2"
              : "text-white"
          }`}
          active={pathname?.toLowerCase().includes("/tryout") ? true : false}
        />
      ),
      href: "/admin/tryout",
      label: "Tryout",
    },
    {
      icon: (
        <IconCourse
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes("course")
              ? "text-main-gray-text2"
              : "text-white"
          }`}
          active={pathname?.toLowerCase().includes("course") ? true : false}
        />
      ),
      href: "/admin/course",
      label: "Course",
    },
    {
      icon: (
        <IconReceipt
          w={20}
          className={`text-[1.5rem] ${
            !pathname?.toLowerCase().includes("token")
              ? "text-main-gray-text2"
              : "text-white"
          }`}
        />
      ),
      href: "/admin/token",
      label: "Token",
    },
  ];
  return (
    <div className="flex flex-col gap-[.5rem]">
      <div className={cn("px-2 w-full", minimizeSidebar && "hidden")}>
        <ChooseWebCategory />
      </div>
      {routes.map((route, index) => (
        <ActiveLink
          key={index}
          icon={route.icon}
          href={route.href}
          label={route.label}
        />
      ))}
    </div>
  );
};

export default SidebarRoute;
