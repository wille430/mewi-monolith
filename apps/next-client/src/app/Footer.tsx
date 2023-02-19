"use client";
import Link from "next/link";
import {Category, CategoryLabel} from "@mewi/models";
import styles from "./Footer.module.scss";
import clsx from "clsx";

interface FooterLink {
    path: string
    label: string
    children?: FooterLink[]
}

export const FooterLinks: FooterLink[] = [
    {
        path: "/",
        label: "Hem",
        children: [
            {
                path: "/loggain",
                label: "Logga in"
            },
            {
                path: "/nyttkonto",
                label: "Skapa ett konto"
            }
        ],
    },
    {
        path: "/kategorier",
        label: "Alla kategorier",
        children: Object.keys(Category).map(c => ({
            path: `/sok?categories=${c}`,
            label: CategoryLabel[c as Category]
        })),
    },
    {
        path: "/minasidor/bevakningar",
        label: "Mina sidor",
        children: [
            {
                path: "/minasidor/bevakningar",
                label: "Bevakningar",
            },
            {
                path: "/minasidor/konto",
                label: "Mitt konto"
            }
        ]
    }
];

export const Footer = () => {

    const renderLinks = (link: FooterLink) => {
        return (
            <ul key={link.path} className="mr-4 mb-2">
                <li className="mb-1">
                    <Link href={link.path}>{link.label}</Link>
                </li>
                {link.children && <ul className="text-sm">
                    {link.children.map(renderLinks)}
                </ul>}
            </ul>
        );
    };

    return (
        <footer className={clsx("bg-primary text-white pb-12", styles["arc"])}>
            <div className="container py-2 px-4 flex flex-wrap justify-between md:justify-start">
                {FooterLinks.map(renderLinks)}
            </div>
        </footer>
    );
};
