"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import style from "./Hero.module.scss";
import { SearchInput } from "@/components/SearchInput/SearchInput";

export const Hero = () => {
  return (
    <section className={style.hero}>
      <div className={style["inner-hero"]}>
        <div className={style["logo-wrapper"]}>
          <img className={style.logo} src="/img/logo.png" alt="Mewi Logo" />
        </div>
        <div className={style["search-box"]}>
          <h3>Hitta begagnade produkter på ett enda ställe</h3>

          <div className="flex w-full flex-col items-end">
            <SearchInput data-testid="search-input" />

            <Link className="mt-2 text-secondary" href="/filter">
              {"Avancerade filter >>"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
