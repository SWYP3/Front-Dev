"use client";
import { useModalStore } from "@/stores/modal";
import styles from "./AccountActionModal.module.scss";
import { removeToken } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/Auth";
import { useMutation } from "@tanstack/react-query";
import { fetchUserDelete } from "@/api/authService";
import SimpleModal from "./SimpleModal";

type PropsAccountModal = {
  accountType: string;
};

type AccountType = {
  [deleteType: string]: {
    title: string | JSX.Element;
    content: string | JSX.Element;
  };
};

const ACCOUNT_TYPE: AccountType = {
  logout: {
    title: "로그아웃 하시겠습니까?",
    content: (
      <>
        기존 계정으로 다시 로그인하여 <br />
        접속할 수 있습니다.
      </>
    )
  },
  userDelete: {
    title: "탈퇴하시겠습니까?",
    content: <>등록된 정보가 모두 삭제됩니다.</>
  }
};

const AccountActionModal = ({ accountType }: PropsAccountModal) => {
  const { closeModal, openModal } = useModalStore();
  const { setToken } = useAuthStore();
  const router = useRouter();

  const handleCancel = () => {
    closeModal();
  };

  const handleAccount = () => {
    if (accountType === "logout") {
      removeToken();
      setToken("");
      closeModal();
      router.push("/welcome/login");
    } else {
      mutation.mutate();
      closeModal();
    }
  };

  const mutation = useMutation({
    mutationFn: fetchUserDelete,
    onSuccess: (res) => {
      removeToken();
      setToken("");
      router.push("/");
    },
    onError: (error) => {
      closeModal();
      openModal(<SimpleModal type={"deleteN"} answer={"확인"} />);
    }
  });

  return (
    <div className={styles.account}>
      <p className={styles.accountTitle}>{ACCOUNT_TYPE[accountType].title}</p>
      <p className={styles.accountContent}>
        {ACCOUNT_TYPE[accountType].content}
      </p>
      <div className={styles.accountButtonList}>
        <button
          type="button"
          className={styles.accountButton}
          onClick={handleCancel}
        >
          아니요
        </button>
        <button
          type="button"
          className={styles.accountButton}
          onClick={handleAccount}
        >
          네
        </button>
      </div>
    </div>
  );
};

export default AccountActionModal;
