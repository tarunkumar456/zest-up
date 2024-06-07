import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import Loading from "@/components/shared/Loading";
import { Suspense } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex   flex-col">
            <Suspense fallback={<Loading />}>
                <main className="flex-1">{children}</main>
            </Suspense>
        </div>
    );
}
