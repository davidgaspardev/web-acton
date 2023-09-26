"use client";

import { DEBUG_MODE } from "@/helpers/env";
import LocalStorage from "@/helpers/storage";
import * as Form from "@radix-ui/react-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import ActonAvatarLogin from "@/assets/svg/acton-avatar-login.svg"
import ActoLogo from "@/assets/svg/acto-logo.svg"

export default function LoginPage(): JSX.Element {
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const lockRef = useRef<boolean>(false);

    async function loginSubmit(event: FormEvent<HTMLFormElement>) {
        if (!event.defaultPrevented) event.preventDefault();
        if (lockRef.current) return;
        lockRef.current = true;

        try {
            const tokenGenerated = await toSignIn(username, password);

            const localStorage = LocalStorage.getInstance();
            localStorage.setToken(tokenGenerated);

            return router.push("/dashboard");
        } catch (e) {
            console.error(e);
        } finally {
            lockRef.current = false;
        }
    }

    return (
        <main className="bg-white min-h-screen flex flex-row">

            <div className="flex-1 min-w-[400px] flex justify-center items-center">
                <Form.Root className="max-w-[300px] w-full" onSubmit={loginSubmit}>

                  <Image
                    src={ActonAvatarLogin}
                    width={250}
                    alt="Acton avatar"
                    className="block mx-auto py-4"/>

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
                        <button className="w-full bg-[#7C65B5] text-white h-[35px] items-center justify-center px-[15px] mt-8 font-medium leading-none focus:outline-none">
                            Enter
                        </button>
                    </Form.Submit>

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

            {/* <form className="p-4"
            onSubmit={async (event) => {
                if (!event.defaultPrevented) event.preventDefault();
                if (lockRef.current) return;
                lockRef.current = true;

                try {
                    await toSignIn(username, password);
                } catch(e) {
                    console.error(e);
                } finally {
                    lockRef.current = false;
                }
            }}>
                <Input
                    label="Nome de usuário"
                    value={username}
                    onValue={setUsername} />

                <Input
                    label="Senha"
                    type="password"
                    value={password}
                    onValue={setPassword}/>

                <InputSubmit
                className="mt-4"
                    name="Logar"/>
            </form> */}
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
