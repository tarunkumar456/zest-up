import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navitems from "./Navitems"
import MobileNav from "./MobileNav"

const Header = () => {
    return (
        <header className="w-full border-b border-[#f17a86]">
            <div className="wrapper flex items-center justify-between">
                <Link href={'/'} className="w-[50vw]">
                    <Image src={"/assets/images/logo.svg"} alt="logo" width={290} height={10} />
                </Link>
                <SignedIn>
                    <nav className="md:flex-between hidden w-full max-w-xs">
                        <Navitems />
                    </nav>
                </SignedIn>
                <div className="flex w-[25vw] justify-end gap-3">
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                        <MobileNav />
                    </SignedIn>

                    <SignedOut>
                        <Button asChild className="rounded-full" size='lg' variant={'used'}>
                            <Link href="/sign-in">
                                Login
                            </Link>
                        </Button>
                    </SignedOut>
                </div>
            </div>
        </header>
    )
}

export default Header