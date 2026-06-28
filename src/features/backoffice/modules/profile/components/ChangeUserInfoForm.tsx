import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { CHANGE_USER_INFO_FORM_ID } from "@/features/backoffice/modules/profile/components/constants.ts";
import { useUpdateUserInfo } from "@/features/backoffice/modules/profile/hooks/useUpdateUserInfo.ts";
import {
  type ChangeUserInfoFormValues,
  createChangeUserInfoSchema,
} from "@/features/backoffice/modules/profile/profile.schema.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";

interface ChangeUserInfoFormProps {
  userName: string;
  userEmail: string;
  isEditing: boolean;
  onSubmitSuccess: () => void;
}

const ChangeUserInfoForm = ({
  userName,
  userEmail,
  isEditing,
  onSubmitSuccess,
}: ChangeUserInfoFormProps) => {
  const schema = useMemo(() => createChangeUserInfoSchema(), []);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangeUserInfoFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: userName,
      email: userEmail,
    },
  });

  const { updateUserInfo } = useUpdateUserInfo(setError, onSubmitSuccess);

  useEffect(() => {
    if (isEditing) {
      reset({ name: userName, email: userEmail });
    }
  }, [isEditing, userName, userEmail, reset]);

  if (!isEditing) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-semibold truncate">{userName}</span>
        <span className="text-xl text-muted-foreground truncate">
          {userEmail}
        </span>
      </div>
    );
  }

  return (
    <form
      id={CHANGE_USER_INFO_FORM_ID}
      onSubmit={handleSubmit((data) => updateUserInfo(data))}
      className="flex flex-col gap-2 min-w-0 w-full"
    >
      <FormField
        {...register("name")}
        className="text-2xl font-semibold h-auto py-1"
        error={errors.name}
      />
      <FormField
        {...register("email")}
        className="text-xl text-muted-foreground h-auto py-1"
        error={errors.email}
      />
    </form>
  );
};

export default ChangeUserInfoForm;
