"use client";

import styles from "@/components/modal/TreatmentAddModal.module.scss";
import { useEffect, useState } from "react";
import { useTreatmentType } from "@/stores/medicalWrite";
import { useModalStore } from "@/stores/modal";

type PropsTreatmentAddModal = {
  treatmentName: string;
  treatmentId: number;
};

const TreatmentAddModal = ({
  treatmentName,
  treatmentId
}: PropsTreatmentAddModal) => {
  const { treatmentType, updateOrAddTreatmentType } = useTreatmentType();
  const [addNum, setAddNum] = useState<number>(0);
  const { closeModal } = useModalStore();

  useEffect(() => {
    const existingTreatment = treatmentType.find(
      (treatment) => treatment.name === treatmentName
    );
    if (existingTreatment) {
      setAddNum(existingTreatment.number);
    }
  }, [treatmentName, treatmentType]);

  const handleMinus = () => {
    if (addNum > 0) {
      setAddNum(addNum - 1);
    }
  };

  const handlePlus = () => {
    if (addNum < 3) {
      setAddNum(addNum + 1);
    }
  };

  const handleRefresh = () => {
    setAddNum(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (Number(value) > 3) {
      setAddNum(3);
      return;
    }
    if (value === "") {
      setAddNum(0);
      return;
    }

    if (Number(value) < 0) {
      setAddNum(0);
      return;
    }
    if (isNaN(Number(value))) {
      setAddNum(0);
      return;
    }
    setAddNum(Number(value));
  };

  const handleAddTreatment = () => {
    updateOrAddTreatmentType(treatmentId, treatmentName, addNum, addNum > 0);
    closeModal();
  };

  return (
    <div className={styles.add}>
      <div className={styles.Text}>
        <p className={styles.title}>개수를 선택해 주세요.</p>
        <span className={styles.helperText}>개수는 최대 3개까지 가능해요.</span>
      </div>
      <div className={styles.addBox}>
        <span className={styles.addTitle}>{treatmentName}</span>
        <div className={styles.addBtn}>
          <button type="button" className={styles.minus} onClick={handleMinus}>
            -
          </button>
          <input
            type="text"
            value={addNum}
            className={styles.addNum}
            onChange={handleChange}
          />
          <button type="button" className={styles.plus} onClick={handlePlus}>
            +
          </button>
        </div>
      </div>
      <div className={styles.addButton}>
        <button
          type="button"
          className={styles.refreshButton}
          onClick={handleRefresh}
        >
          <img src="/refresh.svg" alt="refresh" />
        </button>
        <button
          type="button"
          className={styles.saveButton}
          onClick={handleAddTreatment}
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default TreatmentAddModal;
