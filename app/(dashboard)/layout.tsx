import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
const links = [
    {href:"/",label:"Home"},
    {href:"/journal",label:"Journal"},
    {href:"/history",label:"History"},
]
const DashboardLayout = ({ children }) => {
    return (
        <div className="h-screen w-screen relative">
            <aside className="absolute w-[200px] top-0 left-0 h-full border-r border-black/10">
                {links.map((link) => {
                    return (
                        <Link href={link.href} className="px-2 py-6 text-xl">
                            {link.label}
                        </Link>
                    )
                })}
            </aside>
            <div className="ml-[200px]">
                <header className="h-[60px] border-b border-black/10">
                    <div className="h-full w-full px-6 flex items-center justify-end">
                        <UserButton />
                    </div> 
                </header>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
export default DashboardLayout;
