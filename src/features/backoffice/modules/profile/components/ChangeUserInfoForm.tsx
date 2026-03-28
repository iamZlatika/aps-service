import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { profileApi } from "@/features/backoffice/modules/profile/api";
import EditButton from "@/features/backoffice/modules/profile/components/buttons/EditButton.tsx";
import {
  type ChangeUserInfoFormValues,
  createChangeUserInfoSchema,
} from "@/features/backoffice/modules/profile/profile.schema.ts";
import { AcceptButton } from "@/features/backoffice/widgets/table/components/buttons/AcceptButton.tsx";
import { CancelButton } from "@/features/backoffice/widgets/table/components/buttons/CancelButton.tsx";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { handleFormError } from "@/shared/lib/errors/handleFormError.ts";

interface ChangeUserInfoFormProps {
  userName: string;
  userEmail: string;
}

const ChangeUserInfoForm = ({
  userName,
  userEmail,
}: ChangeUserInfoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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

  const updateUserInfoMutation = useMutation({
    mutationFn: profileApi.updateUserInfo,
  });

  useEffect(() => {
    if (isEditing) {
      reset({ name: userName, email: userEmail });
    }
  }, [isEditing, userName, userEmail, reset]);

  const handleCancel = () => {
    reset({ name: userName, email: userEmail });
    setIsEditing(false);
  };

  const onSubmit = (data: ChangeUserInfoFormValues) => {
    updateUserInfoMutation.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
        setIsEditing(false);
      },
      onError: (error) =>
        handleFormError<ChangeUserInfoFormValues>(error, setError, {
          fieldMap: {
            name: "name",
            email: "email",
          },
          messageMap: {
            "The email has already been taken.": t(
              "profile.user_info.email_taken",
            ),
          },
        }),
    });
  };

  if (!isEditing) {
    return (
      <div className="relative flex flex-col gap-1 min-w-0">
        <span className="text-2xl font-semibold truncate">{userName}</span>
        <span className="text-xl text-muted-foreground truncate">
          {userEmail}
        </span>
        <EditButton
          onClick={() => setIsEditing(true)}
          className="absolute -top-2 -right-6 h-6 w-6"
          iconClassName="h-3 w-3"
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 min-w-0 w-full"
    >
      <div className="flex flex-col gap-1">
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
      </div>
      <div className="flex items-center gap-1">
        <AcceptButton type="submit" />
        <CancelButton onClick={handleCancel} />
      </div>
    </form>
  );
};

export default ChangeUserInfoForm;
