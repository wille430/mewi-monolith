"use client";
import type { ReactElement } from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./WatcherList.module.scss";
import WatcherPopUpButton from "./WatcherPopUpButton";
import { Container } from "../Container/Container";
import { HorizontalLine } from "../HorizontalLine/HorizontalLine";
import {UserWatcherDto} from "@mewi/models";

const WatcherCard = dynamic(() => import("./WatcherCard/WatcherCard"));

export interface DisplayWatchersProps {
  watchers: UserWatcherDto[];
}

const DisplayWatchers = (props: DisplayWatchersProps) => {
  const { watchers } = props;
  const [expandedId, setExpandedId] = useState<string | undefined>(undefined);

  const withWrapper = (component: ReactElement) => (
    <Container className={styles.watcherList}>
      <Container.Header>
        <h3>Mina bevakningar</h3>
      </Container.Header>
      <Container.Content className={styles.content}>
        {component}
      </Container.Content>
      <HorizontalLine />
      <Container.Footer className="flex justify-end">
        <WatcherPopUpButton data-testid="createNewWatcherButton" />
      </Container.Footer>
    </Container>
  );

  if (watchers.length === 0) {
    return withWrapper(
      <div className="centered flex-grow pb-24">
        <span className="text-sm text-muted">Du har inga bevakningar ännu</span>
      </div>
    );
  }

  return withWrapper(
    <>
      {watchers.map(
        (watcherObj) =>
          watcherObj && (
            <WatcherCard
              key={watcherObj.id}
              userWatcher={watcherObj}
              expand={expandedId === watcherObj.id}
              onExpand={(val?: boolean) => {
                if (val) {
                  setExpandedId(watcherObj.id);
                } else {
                  setExpandedId(undefined);
                }
              }}
            />
          )
      )}
    </>
  );
};

export default DisplayWatchers;
