"use client";
// noinspection SuspiciousTypeOfGuard
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useMemo, useState } from "react";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useWindowSize } from "@/hooks/useWindowSize";
import styles from "./Nav.module.scss";
import { getUser, logout } from "@/store/user";
import { useAppDispatch, useAppSelector } from "@/hooks";
import clsx from "clsx";
import { Arc } from "@/components/Arc/Arc";
import { LinkType } from "@/lib/types/ui";
import { Category, CategoryLabel } from "@mewi/models";
import { createSearchUrl } from "@/utils/createSearchUrl";
import { UNAUTHORIZED_REDIRECT_TO } from "@/lib/constants/paths";

const hideLogoInRoutes = ["/"];

const navLinks: LinkType[] = [
  {
    path: "/",
    label: "Hem",
  },
  {
    path: "#",
    label: "Om Oss",
  },
  {
    path: "/kategorier",
    label: "Kategorier",
    children: Object.keys(Category).map((o) => ({
      label: CategoryLabel[o as keyof CategoryLabel],
      path: createSearchUrl({ categories: [o as Category] }),
    })),
  },
];

const accountLinks: LinkType[] = [
  {
    path: "/minasidor/bevakningar",
    label: "Bevakningar",
  },
  {
    path: "/minasidor/konto",
    label: "Mitt konto",
  },
  {
    path: "/minasidor/gillade",
    label: "Gillade Annonser",
  },
];

export const drawerVariants: Variants = {
  hidden: {
    height: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.01,
      staggerDirection: -1,
      duration: 0.1,
    },
  },
  show: {
    height: "auto",
  },
};

const linkVariants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
  show: {
    opacity: 1,
  },
};

const logoVariants: Variants = {
  hidden: {
    display: "none",
    opacity: 0,
  },
  show: {
    display: "block",
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.25,
    },
  },
};

export const DisplayLinks = ({ links }: { links: LinkType[] }) => {
  return (
    <>
      {links.map((o) => (
        <li>
          <Link className="li-link" href={o.path}>
            {o.label}
          </Link>
        </li>
      ))}
    </>
  );
};

export const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const size = useWindowSize();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isDrawer = useMemo(() => size.width < 768, [size]);
  const [showLogo, setShowLogo] = useState(
    !isDrawer || (isDrawer && !mobileOpen)
  );

  const { isLoggedIn, isReady } = useAppSelector((state) => state.user);

  useEffect(() => {
    setShowLogo(!isDrawer || (isDrawer && !mobileOpen));
  }, [isDrawer, mobileOpen]);

  // fetch user status
  // DO NOT move
  useEffect(() => {
    if (!isReady) {
      dispatch(getUser());
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  return (
    <>
      <nav className="bg-primary text-white">
        <div className={styles["inner-nav"]}>
          <motion.figure
            className="h-auto w-20"
            variants={logoVariants}
            animate={showLogo ? "show" : "hidden"}
          >
            <Link href="/">
              {!hideLogoInRoutes.includes(pathname ?? "/") && (
                <img src="/img/logo.png" alt="Mewi logo" />
              )}
            </Link>
          </motion.figure>

          <motion.ul
            variants={isDrawer ? drawerVariants : undefined}
            animate={mobileOpen ? "show" : "hidden"}
          >
            {navLinks.map((o) => (
              <motion.li
                key={o.path}
                className={clsx(styles["nav-link"], "md:dropdown-parent")}
                variants={isDrawer ? linkVariants : undefined}
              >
                <Link href={o.path}>{o.label}</Link>

                {o.children && (
                  <ul className="dropdown w-52">
                    <DisplayLinks links={o.children} />
                  </ul>
                )}
              </motion.li>
            ))}

            <motion.li
              className={clsx(
                styles["logout-btn"],
                styles["nav-link"],
                "md:dropdown-parent"
              )}
              variants={isDrawer ? linkVariants : undefined}
            >
              {isLoggedIn ? (
                <>
                  <Link href="/minasidor">Mina Sidor</Link>
                  <div className="dropdown w-40 text-black">
                    <DisplayLinks links={accountLinks} />

                    <button
                      className="li-link text-left text-secondary"
                      aria-label="Logga ut"
                      onClick={() =>
                        dispatch(logout()).then(() =>
                          router.push(UNAUTHORIZED_REDIRECT_TO)
                        )
                      }
                    >
                      Logga ut
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/loggain">Logga in</Link>
              )}
            </motion.li>

            {isLoggedIn && (
              <motion.li className={clsx(styles["nav-link"], "md:hidden")}>
                <button
                  className="text-secondary"
                  aria-label="Logga ut"
                  onClick={() =>
                    dispatch(logout()).then(() =>
                      router.push(UNAUTHORIZED_REDIRECT_TO)
                    )
                  }
                >
                  Logga ut
                </button>
              </motion.li>
            )}
          </motion.ul>

          <button
            className={clsx(styles["menu-toggle"], "h-min ml-2")}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <GiHamburgerMenu size={32} />
          </button>
        </div>
      </nav>

      {!hideLogoInRoutes.includes(pathname ?? "/") && <Arc />}
    </>
  );
};
