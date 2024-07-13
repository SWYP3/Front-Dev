"use client";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Modal.module.scss";
import { useModalStore } from "@/stores/modal";

type PropsModal = {
  children: React.ReactNode;
};

const Modal = ({ children }: PropsModal) => {
  const { closeModal, isOpen } = useModalStore();

  const handleModal = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      <div
        className={[styles.wrapper, isOpen ? styles.open : ""].join(" ")}
        onClick={handleModal}
      >
        {isOpen && (
          <motion.div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default Modal;
