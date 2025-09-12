import styles from "./UpdateUser.module.css";
import { FormProvider, useForm, useFormContext, useFormState } from "react-hook-form";
import { type HTMLInputTypeAttribute, type ReactNode, useId } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { hc, type InferRequestType, type InferResponseType } from "hono/client";
import type { AppType } from "../../server";

const client = hc<AppType>("");
const $updateScore = client.api.highscore[":id"].$put;
const $getScoreData = client.api["highscore-data"][":id"].$get;

type FormEntryProps = {
  name: string;
  label: ReactNode;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
};

function FormEntry({ label, type = "text", required, name, placeholder, defaultValue }: FormEntryProps) {
  const { register, control } = useFormContext();
  const { errors, isSubmitting } = useFormState({ control, name });
  const id = useId();
  const error = errors[name];
  return (
    <div className={styles.formEntry}>
      <label htmlFor={id}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <div>
        <input
          id={id}
          type={type}
          {...register(name, {
            required: required ? "This field is required" : false,
            validate:
              type === "email"
                ? (value) =>
                    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i.test(value) ||
                    "Please enter a proper email"
                : undefined,
          })}
          data-error={!!error}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={isSubmitting}
        />
        <div className={styles.errorMessage} aria-live="polite">
          {typeof error?.message === "string" ? error?.message : null}
        </div>
      </div>
    </div>
  );
}

export function UpdateUser() {
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery({
    queryKey: ["score-data", id],
    queryFn: async () => {
      const res = await $getScoreData({
        param: {
          id: id!,
        },
      });
      if (!res.ok) {
        throw new Error();
      }
      return await res.json();
    },
  });

  const methods = useForm({
    values: data,
    defaultValues: {
      nickname: "",
      name: "",
      email: "",
    },
  });

  const navigate = useNavigate();

  const { mutate: updateScore } = useMutation<
    InferResponseType<typeof $updateScore>,
    Error,
    InferRequestType<typeof $updateScore>["json"]
  >({
    mutationFn: async ({ nickname, name, email }) => {
      const res = await $updateScore({
        param: {
          id: id!,
        },
        json: {
          nickname: nickname ?? undefined,
          name: name ?? undefined,
          email: email ?? undefined,
        },
      });
      return await res.json();
    },
    onSuccess: () => {
      navigate("thanks");
    },
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1>Register your highscore</h1>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit((data) => updateScore(data))} noValidate>
            <FormEntry name="nickname" label="Nickname" placeholder={`Player ${id}`} />
            <FormEntry name="name" label="Full Name" />
            <FormEntry name="email" label="Email" type="email" required />
            <button className={styles.submit} type="submit">
              Register
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
