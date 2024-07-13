"use client";
import { motion } from "framer-motion";
import styles from "./ScaleButton.module.scss";

type PropsButton = {
  children: React.ReactNode;
  className?: string;
};

const ScaleButton = ({ children, className }: PropsButton) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={[styles.ScaleButton, className].join(" ")}
  >
    {children}
  </motion.button>
);

export default ScaleButton;
