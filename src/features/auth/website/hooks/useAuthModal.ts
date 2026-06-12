import { useModalParam } from "@/features/website/hooks/useModalParam";
import {
  LOGIN_MODAL_VALUE,
  MODAL_PARAM,
  REGISTER_MODAL_VALUE,
} from "@/features/website/lib/modalParams";

type UseAuthModalReturn = {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  openLogin: () => void;
  openRegister: () => void;
  close: () => void;
};

export const useAuthModal = (): UseAuthModalReturn => {
  const { value, set, clear } = useModalParam(MODAL_PARAM);

  return {
    isLoginOpen: value === LOGIN_MODAL_VALUE,
    isRegisterOpen: value === REGISTER_MODAL_VALUE,
    openLogin: () => set(LOGIN_MODAL_VALUE),
    openRegister: () => set(REGISTER_MODAL_VALUE),
    close: clear,
  };
};
