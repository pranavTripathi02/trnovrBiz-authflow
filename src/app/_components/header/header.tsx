import { SearchIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import HeaderAlerts from "./headerAlerts";
import HeaderAuth from "./headerAuth";

async function Header() {
  return (
    <header className="sticky top-0 mb-8 flex flex-col bg-white">
      <HeaderAuth />
      <div className="flex items-center justify-between px-8 py-4">
        {/* logo */}
        <div className="text-3xl font-bold uppercase">Ecommerce</div>
        {/* links */}
        <div className="hidden space-x-8 text-lg font-semibold lg:flex">
          <Link href="#">Categories</Link>
          <Link href="#">Sale</Link>
          <Link href="#">Clearance</Link>
          <Link href="#">New stock</Link>
          <Link href="#">Trending</Link>
        </div>
        {/* search & cart */}
        <div className="flex space-x-12 text-neutral-600">
          <SearchIcon aria-label="search" />
          <ShoppingCartIcon aria-label="cart" />
        </div>
      </div>
      <HeaderAlerts />
    </header>
  );
}

export default Header;
