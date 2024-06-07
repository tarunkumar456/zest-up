const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex-center   w-full bg-[#fbe6e9] bg-dotted-pattern bg-cover bg-fixed bg-center">
            {children}
        </div>
    )
}
export default Layout;