import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import DrawerNavLink from './DrawerNavLink/DrawerNavLink'
import links from '../links'

const DrawerNav = ({
    children,
    show,
    className,
    ...props
}: HTMLMotionProps<'ul'> & { show: boolean }) => {
    const drawerAnimation = {
        hidden: {
            height: '0',
            transition: {
                when: 'afterChildren',
                staggerChildren: 0.01,
                staggerDirection: -1,
                duration: 0.1,
            },
        },
        show: {
            height: 'auto',
        },
    }

    const linkAnimation = {
        hidden: {
            opacity: 0,
            transition: {
                duration: 0.1,
            },
        },
        show: {
            opacity: 1,
        },
    }

    const paddingAnimation = {
        animate: (active: boolean) => ({
            height: active ? '1rem' : '0rem',
            transition: {
                duration: 0.2,
            },
        }),
    }

    return (
        <div className={className}>
            <motion.div variants={paddingAnimation} animate='animate' custom={show} />
            <AnimatePresence>
                {show && (
                    <motion.ul
                        {...props}
                        variants={drawerAnimation}
                        initial='hidden'
                        animate='show'
                        exit={'hidden'}
                    >
                        {links.map((link) => (
                            <DrawerNavLink key={link.path} {...link} />
                        ))}
                        <motion.li variants={linkAnimation}>{children}</motion.li>
                    </motion.ul>
                )}
            </AnimatePresence>
            <motion.div variants={paddingAnimation} animate='animate' custom={show} />
        </div>
    )
}

export default DrawerNav
