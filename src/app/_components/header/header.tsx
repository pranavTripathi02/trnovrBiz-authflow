import { SearchIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import HeaderAlerts from "./headerAlerts";
import HeaderAuth from "./headerAuth";

function Header() {
  return (
    <header className="flex flex-col">
      <HeaderAuth />
      <div className="flex justify-between">
        {/* logo */}
        <div className="text-2xl font-bold uppercase">Ecommerce</div>
        {/* links */}
        <div className="flex text-lg">
          <Link href="#">Categories</Link>
          <Link href="#">Sale</Link>
          <Link href="#">Clearance</Link>
          <Link href="#">New stock</Link>
          <Link href="#">Trending</Link>
        </div>
        {/* search & cart */}
        <div className="flex">
          <SearchIcon />
          <ShoppingCartIcon />
        </div>
      </div>
      <HeaderAlerts />
    </header>
  );
}

export default Header;
