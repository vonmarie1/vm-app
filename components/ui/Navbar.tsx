"use client";

import Link from "next/link";
import Image from "next/image";
import { NavItems } from "./Navitems";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <nav className="navbar">
      <Link href="/">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={100}
            height={100}
            priority
          />
        </div>
      </Link>
      <div className="flex items-center gap-8">
        <NavItems />
        {!isSignedIn ? (
          <SignInButton>
            <button className="btn-signin">Sign In</button>
          </SignInButton>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
