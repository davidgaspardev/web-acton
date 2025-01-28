"use client";

import { DEBUG_MODE } from "@/helpers/env";
import LocalStorage from "@/helpers/storage";
import * as Form from "@radix-ui/react-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useRef, useState } from "react";
import ActonAvatarLogin from "@/assets/svg/acton-avatar-login.svg"
import ActoLogo from "@/assets/svg/acto-logo.svg"

export default function LoginPage(): JSX.Element {
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const lockRef = useRef<boolean>(false);

    const loginSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
      if (!event.defaultPrevented) event.preventDefault();
        if (lockRef.current) return;
        lockRef.current = true;
        setLoading(true);

        try {
            const tokenGenerated = await toSignIn(username, password);

            const localStorage = LocalStorage.getInstance();
            localStorage.setToken(tokenGenerated);

            return router.push("/dashboard");
        } catch (e) {
            console.error(e);
            setLoading(false);
            lockRef.current = false;
        }
    }, [lockRef, username, password, router])

    return (
        <main className="bg-white min-h-screen flex flex-row">

            <div className="flex-1 min-w-[400px] flex justify-center items-center">
                <Form.Root className="max-w-[350px] w-full" onSubmit={loginSubmit}>

                  <Image
                    src={ActonAvatarLogin}
                    width={250}
                    alt="Acton avatar"
                    className="block mx-auto"/>

                    <div className="border-[1px] border-[#7C65B532] rounded-md p-8">
                      <Form.Field name="username" className="flex flex-col">
                          <div className="flex items-baseline justify-between">
                              <Form.Label className="text-[15px] font-medium leading-[35px] text-[#484848]">Usuário / E-mail</Form.Label>
                              <Form.Message className="text-[13px] text-[#484848] opacity-[0.8]" match="valueMissing">
                                  Please enter your username
                              </Form.Message>
                          </div>
                          <Form.Control asChild>
                              <input
                                  className="h-8 border-b-2 border-b-[#7C65B5]"
                                  type="text"
                                  placeholder="actonuser"
                                  value={username}
                                  onChange={({ target: { value } }) => setUsername(value)}
                                  required />
                          </Form.Control>
                          <Form.Message className="text-[13px] text-[#484848] opacity-[0.8]" match="typeMismatch">
                              Please provide a valid username
                          </Form.Message>
                      </Form.Field>

                      <Form.Field name="password" className="flex flex-col">
                          <div className="flex items-baseline justify-between">
                              <Form.Label className="text-[15px] font-medium leading-[35px] text-[#484848]">Senha</Form.Label>
                              <Form.Message className="text-[13px] text-[#484848] opacity-[0.8]" match="valueMissing">
                                  Please enter your password
                              </Form.Message>
                          </div>
                          <Form.Control asChild>
                              <input
                                  className="h-8 border-b-2 border-b-[#7C65B5]"
                                  type="password"
                                  placeholder="*******"
                                  value={password}
                                  onChange={({ target: { value } }) => setPassword(value)}
                                  required />
                          </Form.Control>
                          <Form.Message className="text-[13px] text-white opacity-[0.8]" match="typeMismatch">
                              Please provide a valid password
                          </Form.Message>
                      </Form.Field>

                      <Form.Submit asChild>
                        <button className="w-full bg-[#7C65B5] text-white h-[40px] flex items-center justify-center px-[15px] mt-8 font-medium leading-none focus:outline-none rounded-md hover:bg-[#634e96]">
                          {
                            loading ? (
                              <svg className="animate-spin h-5 w-5 text-[#ffffff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : "Enter"
                          }
                        </button>
                      </Form.Submit>
                    </div>

                </Form.Root>
            </div>

            <div className="hidden lg:block flex-[2] bg-cover bg-center bg-[url(https://firebasestorage.googleapis.com/v0/b/myself-dg.appspot.com/o/acton_background.JPG?alt=media&token=b223d5ee-5c4a-4118-be71-6f4385d3fde9)]">
              <div className="w-full h-full bg-[#FFFFFF75] relative">
                <Image
                  src={ActoLogo}
                  width={580}
                  alt="Acto logo"
                  className="fixed bottom-6 right-6"/>
              </div>
            </div>
        </main>
    );
}

async function toSignIn(username: string, password: string): Promise<string> {
    try {
        const loginEncrypt = btoa(`${username}:${password}`);

        // console.log("loginEncrypt", loginEncrypt);

        const response = await fetch("/api/login", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${loginEncrypt}`
            }
        });

        if (DEBUG_MODE) console.log("response", response);

        if (!response.ok) throw new Error("Failed on login");

        const responseBody = await response.json();

        if (typeof responseBody["token"] !== "string") throw new Error("token property not found from response body");

        return responseBody["token"];
    } catch (err) {
        console.error(err);
        throw err;
    }
}
