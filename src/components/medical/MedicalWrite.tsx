"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import styles from "./MedicalWrite.module.scss";
import BtnBottom from "../common/BtnBottom";
import ClinicInput from "@/components/medical/ClinicInput";
import DateInput from "@/components/medical/DateInput";
import TreatmentSelection from "./TreatmentSelection";
import CostInput from "./CostInput";
import ToothSelection from "./ToothSelection";
import ShareOption from "./ShareOption";
import { useTreatmentType } from "@/stores/medicalWrite";
import Modal from "../modal/Modal";

const MedicalWrite = () => {
  const [isShare, setIsShare] = useState<boolean>(true);
  const [isClinic, setIsClinic] = useState<boolean>(false);
  const [isCalendar, setIsCalendar] = useState<boolean>(false);
  const { treatmentType } = useTreatmentType();
  const [clickTreatment, setClickTreatment] = useState<boolean>(false);

  useEffect(() => {
    treatmentType.filter((treatment) => {
      return treatment.isClick;
    }).length > 0
      ? setClickTreatment(true)
      : setClickTreatment(false);
  }, [treatmentType]);

  return (
    <>
      <form className={styles.writeForm}>
        <ClinicInput isClinic={isClinic} setIsClinic={setIsClinic} />
        <DateInput isCalendar={isCalendar} setIsCalendar={setIsCalendar} />
        <TreatmentSelection />
        <AnimatePresence>
          {clickTreatment && (
            <>
              <CostInput />
              <ToothSelection />
              <ShareOption isShare={isShare} setIsShare={setIsShare} />
              <BtnBottom btnType={false} title="기록 완료" />
            </>
          )}
        </AnimatePresence>
      </form>
      <Modal />
    </>
  );
};

export default MedicalWrite;