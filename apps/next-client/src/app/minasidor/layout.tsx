import SideNav from "@/components/SideNav/SideNav";
import { NextLayoutProps } from "@/lib/types/next";
import { getUser } from "@/app/minasidor/getUser";
import { redirect } from "next/navigation";
import { UNAUTHORIZED_REDIRECT_TO } from "@/lib/constants/paths";

const MyPagesLayout = async ({ children }: NextLayoutProps) => {
  const user = await getUser();

  if (user == null) {
    redirect(UNAUTHORIZED_REDIRECT_TO);
    return null;
  }

  return (
    <div className="container w-full mx-auto gap-4 py-16 flex flex-col-reverse xl:flex-row 2xl:double-col-grid">
      <div className="flex-grow xl:col-start-2">{children}</div>
      <aside className="w-full xl:w-64">
        <SideNav />
      </aside>
    </div>
  );
};

export default MyPagesLayout;
