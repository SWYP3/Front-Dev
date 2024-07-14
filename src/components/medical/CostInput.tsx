import { AnimatePresence, motion } from "framer-motion";
import styles from "./CostInput.module.scss";
import { useTreatmentCost, useTreatmentType } from "@/stores/medicalWrite";
import { useEffect } from "react";
import { CostList } from "@/stores/medicalWrite";

const CostInput = () => {
  const { treatmentType } = useTreatmentType();
  const { treatmentCostList, updateTreatmentCost } = useTreatmentCost();

  const checkTreatmentCost = () => {
    const newCostList: CostList[] = [];
    treatmentType.forEach((item, index) => {
      if (item.number > 0) {
        for (let i = 0; i < item.number; i++) {
          const isExist = treatmentCostList.find(
            (cost) => cost.name === item.name && cost.id === newCostList.length
          );
          newCostList.push({
            id: newCostList.length,
            name: item.name,
            value: isExist ? isExist.value : ""
          });
          updateTreatmentCost(newCostList);
        }
      }
    });
    updateTreatmentCost(newCostList);
  };

  useEffect(() => {
    checkTreatmentCost();
  }, [treatmentType]);

  useEffect(() => {
    console.log(treatmentCostList);
  }, [treatmentCostList]);

  const handleChangeCost = (index: number, value: string) => {
    const newCostList = [...treatmentCostList];
    if (isNaN(Number(value))) {
      newCostList[index].value = "";
      return;
    }
    newCostList[index].value = value;
    updateTreatmentCost(newCostList);
  };

  const handleDeleteCost = (index: number) => {
    const newCostList = [...treatmentCostList];
    newCostList[index].value = "";
    updateTreatmentCost(newCostList);
  };

  return (
    <motion.div
      className={styles.writeWrapper}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <label className={styles.writeLabel}>
        각 치료에 지불한 비용을 <br /> 입력해 주세요.
      </label>
      <span className={styles.helperText}>
        각각의 치료에 해당하는 비용을 입력해 주세요.
      </span>
      <div className={styles.cost}>
        <AnimatePresence>
          {treatmentCostList.map((item, index) => (
            <motion.div
              className={styles.costInput}
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <label className={styles.costLabel}>{item.name}</label>
              <div className={styles.costInputBox}>
                <input
                  type="text"
                  className={[styles.costBox, item.value && styles.fill].join(
                    " "
                  )}
                  placeholder="숫자만 입력하세요."
                  value={item.value}
                  onChange={(e) => handleChangeCost(index, e.target.value)}
                />
                {item.value && (
                  <button
                    type="button"
                    className={styles.deleteCost}
                    onClick={() => handleDeleteCost(index)}
                  >
                    삭제
                  </button>
                )}
              </div>
              <span className={styles.costUnit}> 원</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CostInput;