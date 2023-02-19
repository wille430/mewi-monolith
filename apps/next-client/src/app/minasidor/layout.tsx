"use client";
import SideNav from "@/components/SideNav/SideNav";
import {withAuthorized} from "@/hocs/withAuthorized";
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

export default withAuthorized(MyPagesLayout);