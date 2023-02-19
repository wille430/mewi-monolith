import SideNav from "@/components/SideNav/SideNav";
import {NextLayoutProps} from "@/lib/types/next";

const MyPagesLayout = ({children}: NextLayoutProps) => {
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