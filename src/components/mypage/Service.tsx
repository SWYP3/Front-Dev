"use client";
import styles from "./Service.module.scss";
import { removeToken } from "@/api/auth";
import { useRouter } from "next/navigation";

const Service = () => {
  const router = useRouter();

  const userLogout = () => {
    removeToken();
    router.push("/");
  };

  const cancelMembership = () => {
    console.log("회원탈퇴 로직");
  };

  const goTermsOfService = () => {
    router.push("/my-page/terms");
  };

  return (
    <div className={styles.serviceUse}>
      <div className={styles.serviceBox}>
        <h3 className={styles.serviceTitle}>서비스 이용 </h3>
        <button className={styles.serviceText} onClick={goTermsOfService}>
          이용약관
        </button>
        <button className={styles.serviceText} onClick={userLogout}>
          로그아웃
        </button>
        <button className={styles.serviceText} onClick={cancelMembership}>
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default Service;
