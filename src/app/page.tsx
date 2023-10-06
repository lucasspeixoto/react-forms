"use client";

import { useForm, useFieldArray } from "react-hook-form";
import * as React from "react";
import { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Utilizar o register no lugar do controller, vai permiter
 * uma maior performance do nosso componente, ja que, com o controller
 * a cada iteração do usuário com o formulário, o valor novo do formulário
 * é anotado dentro do estado, gerando mais renderizações.
 * Com o register, a validação é feita somente no momento do submit.
 */

//* O superRefine permite validações entre múltiplos campos

const createUserFormSchema = z
  .object({
    name: z
      .string()
      .nonempty("Nome é obrigatório!")
      .min(3, "O Nome precisa conter no mínimo 3 caracteres!")
      .transform((name) => {
        return name
          .trim()
          .split(" ")
          .map((word) => {
            return word[0].toLocaleUpperCase().concat(word.substring(1));
          })
          .join(" ");
      }),
    email: z
      .string()
      .nonempty("E-mail é obrigatório!")
      .email("E-mail em formato inválido!")
      .toLowerCase()
      .refine((email) => {
        return email.endsWith("@gmail.com");
      }, "O E-mail precisa ser @gmail"),
    password: z
      .string()
      .nonempty("Senha é obrigatório!")
      .min(6, "A senha precisa conter no mínimo 6 caracteres!"),
    confirmedPassword: z
      .string()
      .nonempty("A confirmação da senha é obrigatório!")
      .min(6, "A senha precisa conter no mínimo 6 caracteres!"),
    techs: z.array(
      z.object({
        name: z.string().nonempty("O título é obrigatório!"),
        knowledge: z.number().min(1).max(100),
      })
    ),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "As senhas precisam ser iguais",
    path: ["confirmedPassword"], // path of error
  });

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export default function Home() {
  const [formOutput, setFormOutput] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  //* O control é necessário para o useField ter acesso ao controle do nosso useForm
  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  function addNewTech() {
    append({ name: "", knowledge: 0 });
  }

  function createUserHandler(data: unknown) {
    setFormOutput(JSON.stringify(data, null, 2));
  }

  return (
    <React.Fragment>
      <div className="h-auto w-auto bg-zinc-700 rounded-lg p-8 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(createUserHandler)}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-white font-bold">
              Nome
            </label>
            <input
              type="text"
              className="rounded-lg border-4 border-blue-300 border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-blue-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input"
              {...register("name")}
            />
            <>
              {errors.name && (
                <span className="text-xs text-red-400">
                  {errors.name.message}
                </span>
              )}
            </>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white font-bold">
              E-mail
            </label>
            <input
              type="email"
              className="rounded-lg border-4 border-blue-300 border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-blue-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input"
              {...register("email")}
            />
            <>
              {errors.email && (
                <span className="text-xs text-red-400">
                  {errors.email.message}
                </span>
              )}
            </>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-white font-bold">
              Senha
            </label>
            <input
              type="password"
              {...register("password")}
              className="rounded-lg border-4 border-blue-300 border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-blue-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input"
            />
            <>
              {errors.password && (
                <span className="text-xs text-red-400">
                  {errors.password.message}
                </span>
              )}
            </>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-white font-bold">
              Confirmar Senha
            </label>
            <input
              type="password"
              {...register("confirmedPassword")}
              className="rounded-lg border-4 border-blue-300 border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-blue-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input"
            />
            <>
              {errors.confirmedPassword && (
                <span className="text-xs text-red-400">
                  {errors.confirmedPassword.message}
                </span>
              )}
            </>
          </div>

          <div className="flex flex-col gap-1 max-w-[400px]">
            <label htmlFor="" className="flex items-center justify-between text-white font-bold">
              Tecnologias
              <button
                type="button"
                onClick={addNewTech}
                className="text-blue-500 text-sm hover:underline"
              >
                Adicionar
              </button>
            </label>

            {fields.map((field, index) => {
              return (
                <div className="flex gap-2" key={field.id}>
                  <input
                    type="text"
                    {...register(`techs.${index}.name`)}
                    className="flex-1 rounded-lg border-4 border-blue-300 border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-blue-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input"
                  />

                  {errors.techs?.[index]?.name && (
                    <span className="text-xs text-red-400">
                      {errors.techs?.[index]?.name?.message}
                    </span>
                  )}

                  <input
                    type="number"
                    {...register(`techs.${index}.knowledge`)}
                    className="w-16 rounded-lg border-4 border-blue-300 border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-blue-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 p-2 w-full rounded-lg font-semibold text-white h-10"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>

      <pre className="m-4">{formOutput}</pre>
    </React.Fragment>
  );
}
