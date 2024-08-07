import { AnimatePresence, motion } from "framer-motion";
import styles from "./DateInput.module.scss";
import CustomCalendar from "../common/CustomCalendar";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { formatKoreaDate } from "@/util/formatDate";
import { useMedicalWriteStore, useModifyData } from "@/stores/medicalWrite";

type PropsDateInput = {
  isCalendar: boolean;
  setIsCalendar: (value: boolean) => void;
  isModify?: boolean;
  noDate: boolean;
  setNoDate: Dispatch<SetStateAction<boolean>>;
};
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const slideInVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
};

const DateInput = ({
  isCalendar,
  setIsCalendar,
  isModify,
  noDate,
  setNoDate
}: PropsDateInput) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [selectedValue, setSelectedValue] = useState<string>("");
  const [value, setValue] = useState<Value>(null);
  const { updateVisitDate } = useMedicalWriteStore();
  const { visitDate } = useModifyData();

  const formattedDate = useMemo(() => {
    if (value instanceof Date) {
      return formatKoreaDate(value);
    }
    return "";
  }, [value]);

  useEffect(() => {
    setSelectedValue(formattedDate);
  }, [formattedDate]);

  useEffect(() => {
    if (value instanceof Date) {
      updateVisitDate(formatKoreaDate(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, calendarRef]);

  const handleCalenderClick = (event: React.MouseEvent) => {
    if (
      selectedValue !== "" &&
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setIsCalendar(false);
    }
  };

  const handleInputClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isCalendar) {
      !value && setValue(new Date());
    }
    setIsCalendar(!isCalendar);
  };

  useEffect(() => {
    if (visitDate && isModify) {
      setSelectedValue(visitDate);
    }
  }, [visitDate, isModify]);

  useEffect(() => {
    if (selectedValue.length > 0) {
      setNoDate(false);
    }
  }, [selectedValue]);

  return (
    <motion.div
      className={styles.writeWrapper}
      initial="hidden"
      animate="visible"
      variants={slideInVariants}
      transition={{ duration: 1.0, ease: "easeInOut" }}
    >
      <label className={styles.writeLabel}>
        진료를 진행한 날짜를 <br /> 선택해 주세요.
      </label>
      <div ref={wrapperRef}>
        <div className={styles.inputField} onClick={handleInputClick}>
          <input
            type="text"
            className={styles.formInput}
            placeholder="날짜를 선택해 주세요."
            readOnly
            value={selectedValue}
          />
          <img
            src="/date-icon.svg"
            alt="date"
            aria-hidden="true"
            className={styles.inputIcon}
          />
        </div>
        <AnimatePresence>
          {isCalendar && (
            <motion.div
              className={styles.calendar}
              ref={calendarRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={handleCalenderClick}
            >
              <CustomCalendar value={value} onChange={setValue} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {noDate && (
        <span className={styles.errorText}>날짜를 선택해 주세요.</span>
      )}
    </motion.div>
  );
};

export default DateInput;
