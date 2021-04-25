import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import NavList from "./NavList";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

export enum NavigationLink {
  Home,
  Discover,
  Library,
  Search,
}

const Navbar = () => {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState<number>(null);
  const [isMobile, setMobile] = useState(true);
  const [isMobileNavbarActive, setMobileNavbarActive] = useState(false);
  const [
    activeNavigationLink,
    setActiveNavigationLink,
  ] = useState<NavigationLink>(NavigationLink.Home);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setActiveNavigationLink(getNavigationLinkForUrl(router.pathname));

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    router.events.on("routeChangeComplete", (url: string) => {
      setActiveNavigationLink(getNavigationLinkForUrl(url));
    });
  }, []);

  useEffect(() => {
    if (windowWidth === null) return;
    windowWidth < 768 ? setMobile(true) : setMobile(false);
  }, [windowWidth]);

  const getNavigationLinkForUrl = (url: string): NavigationLink | null => {
    if (url === "/") {
      return NavigationLink.Home;
    } else if (url.includes("/discover")) {
      return NavigationLink.Discover;
    } else if (url.includes("/library")) {
      return NavigationLink.Library;
    } else if (url.includes("/search")) {
      return NavigationLink.Search;
    } else {
      return null;
    }
  };

  return (
    <div>
      <nav
        className={`${
          isMobileNavbarActive
            ? "bg-gray-800 text-gray-50"
            : "bg-gray-50 text-gray-800"
        } md:bg-gray-50 md:text-gray-800`}
      >
        <div className="flex justify-between items-center p-4">
          <h1 className="text-4xl font-black">
            <Link href="/">CONSUMAT.IO</Link>
          </h1>

          {!isMobile && (
            <NavList
              activeNavigationLink={activeNavigationLink}
              isMobile={isMobile}
              isMobileNavVisible={isMobileNavbarActive}
            />
          )}

          <button
            className="md:hidden cursor-pointer focus:outline-none"
            onClick={() => setMobileNavbarActive(!isMobileNavbarActive)}
          >
            {isMobileNavbarActive ? (
              <XIcon className="h-8 w-8 text-gray-50" />
            ) : (
              <MenuIcon className="h-8 w-8 text-gray-800" />
            )}
          </button>
        </div>

        {isMobile && (
          <NavList
            activeNavigationLink={activeNavigationLink}
            isMobile={isMobile}
            isMobileNavVisible={isMobileNavbarActive}
            setMobileNavbarVisibility={setMobileNavbarActive}
          />
        )}
      </nav>
    </div>
  );
};

export default Navbar;