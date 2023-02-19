import {NextLayoutProps} from "@/lib/types/next";

const Layout = ({children}: NextLayoutProps) => {
    return (
        <div className="flex flex-col md:single-col-grid">
            {children}
        </div>
    );
};

export default Layout;