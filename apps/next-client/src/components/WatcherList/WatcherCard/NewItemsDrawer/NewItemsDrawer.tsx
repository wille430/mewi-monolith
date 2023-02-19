import { motion } from "framer-motion";
import styles from "./NewItemsDrawer.module.scss";
import { openListing } from "@/store/listings";
import { useAppDispatch } from "@/hooks";
import StyledLoader from "@/components/StyledLoader";
import { ListingRow } from "@/components/ListingRow/ListingRow";
import { MY_WATCHERS_KEY } from "@/client/user-watchers/swr-keys";
import { getWatcherItems } from "@/client/user-watchers/queries";
import useSWR from "swr";
import clsx from "clsx";
import {UserWatcherDto} from "@mewi/models";

interface NewItemsDrawerProps {
    watcher: UserWatcherDto
}

const NewItemsDrawer = ({ watcher }: NewItemsDrawerProps) => {
    const dispatch = useAppDispatch();

    const { data, error } = useSWR([MY_WATCHERS_KEY, watcher.id], () => getWatcherItems(watcher));
    const { hits } = data ?? {};
    const isLoading = !hits;

    const drawerVariants = {
        hidden: {
            height: 0,
        },
        show: {
            height: hits?.length || hits?.length ? "auto" : "3.5rem",
        },
    };

    const handleClick = (id: string) => {
        const itemToOpen = hits?.find((x) => x.id === id);
        if (itemToOpen) {
            dispatch(openListing(itemToOpen));
        }
    };

    const renderItems = () => {
        return hits?.map((item) => (
            <ListingRow key={item.id} listing={item} onClick={() => handleClick(item.id)} />
        ));
    };

    return (
        <motion.div
            className={clsx({
                [styles.itemDrawer]: true,
                [styles.empty]: !hits?.length,
            })}
            variants={drawerVariants}
            initial='hidden'
            animate='show'
            exit='hidden'
            transition={{
                ease: "easeInOut",
                duration: 0.25,
            }}
        >
            {hits?.length && !isLoading ? (
                <ul>
                    <span className='mb-1'>Nya föremål:</span>
                    {renderItems()}
                </ul>
            ) : isLoading ? (
                <div className='align-center flex w-full justify-center'>
                    <StyledLoader />
                </div>
            ) : error ? (
                <span className='mx-auto mt-2'>Ett fel inträffade</span>
            ) : (
                <span className='py-2 text-center'>Inga nya föremål hittades</span>
            )}
        </motion.div>
    );
};

export default NewItemsDrawer;
