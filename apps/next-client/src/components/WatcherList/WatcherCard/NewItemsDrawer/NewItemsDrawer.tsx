import { motion } from "framer-motion";
import styles from "./NewItemsDrawer.module.scss";
import { openListing } from "@/store/listings";
import { useAppDispatch } from "@/hooks";
import { ListingRow } from "@/components/ListingRow/ListingRow";
import clsx from "clsx";
import { ListingDto } from "@mewi/models";
import StyledLoader from "@/components/StyledLoader";

interface NewItemsDrawerProps {
  listings: ListingDto[] | null;
}

const NewItemsDrawer = ({ listings }: NewItemsDrawerProps) => {
  const dispatch = useAppDispatch();
  const drawerVariants = {
    hidden: {
      height: 0,
    },
    show: {
      height: listings?.length || listings?.length ? "auto" : "3.5rem",
    },
  };
  const handleClick = (id: string) => {
    const itemToOpen = listings?.find((x) => x.id === id);
    if (itemToOpen) {
      dispatch(openListing(itemToOpen));
    }
  };
  const renderItems = () => {
    return listings?.map((item) => (
      <ListingRow
        key={item.id}
        listing={item}
        onClick={() => handleClick(item.id)}
      />
    ));
  };
  return (
    <motion.div
      className={clsx({
        [styles.itemDrawer]: true,
        [styles.empty]: !listings?.length,
      })}
      variants={drawerVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{
        ease: "easeInOut",
        duration: 0.25,
      }}
    >
      { listings == null ? (
          <div>
            <StyledLoader/>
          </div>
      ) : listings.length ? (
        <ul className="w-full">
          <span className="mb-1">Nya föremål:</span>
          {renderItems()}
        </ul>
      ) : (
        <span className="py-2 text-center">Inga nya föremål hittades</span>
      )}
    </motion.div>
  );
};

export default NewItemsDrawer;
