import { useMutation } from "@tanstack/react-query";
import { register } from "../api/api";

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};
