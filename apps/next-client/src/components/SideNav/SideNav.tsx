"use client";
import { Container } from "../Container/Container";
import styles from "./SideNav.module.scss";
import { FiHeart, FiUser } from "react-icons/fi";
import { BsFillBinocularsFill } from "react-icons/bs";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { LinkType } from "@/lib/types/ui";

const links: LinkType[] = [
  {
    label: "Bevakningar",
    path: "/minasidor/bevakningar",
    icon: <BsFillBinocularsFill className="mr-2" />,
  },
  {
    label: "Konto",
    path: "/minasidor/konto",
    icon: <FiUser className="mr-2" />,
  },
  {
    label: "Gillade annonser",
    path: "/minasidor/gillade",
    icon: <FiHeart className="mr-2" />,
  },
];

const SideNav = () => {

    const pathname = usePathname();

    return (
        <Container className={styles.container} data-testid="side-nav">
            <h4>Mina Sidor</h4>

            <ul>
                {links.map(o => (
                    <li className={clsx("hover:bg-gray-300 py-1.5 px-2", pathname === o.path && "bg-gray-200")}>
                        <Link className="center-y" href={o.path}>
                            {o.icon} {o.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </Container>
    );
};

export default SideNav;
