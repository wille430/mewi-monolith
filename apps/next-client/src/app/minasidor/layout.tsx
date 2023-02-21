import SideNav from "@/components/SideNav/SideNav";
import {NextLayoutProps} from "@/lib/types/next";
import {getUser} from "@/app/minasidor/getUser";
import {redirect} from "next/navigation";
import {UNAUTHORIZED_REDIRECT_TO} from "@/lib/constants/paths";

const MyPagesLayout = async ({children}: NextLayoutProps) => {
    const user = await getUser();

    if (user == null) {
        redirect(UNAUTHORIZED_REDIRECT_TO);
        return null;
    }

    return (
        <div className="double-col-grid">
            <aside></aside>
            <div className="flex-grow">{children}</div>
            <aside>
                <SideNav/>
            </aside>
        </div>
    );
};

export default MyPagesLayout;