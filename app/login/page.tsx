"use client";

import { DEBUG_MODE } from "@/helpers/env";
import LocalStorage from "@/helpers/storage";
import * as Form from "@radix-ui/react-form";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

export default function LoginPage(): JSX.Element {
    const router = useRouter();
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

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
        } catch(e) {
            console.error(e);
        } finally {
            lockRef.current = false;
        }
    }

    return (
        <main className="bg-[#7C65B5] min-h-screen flex justify-center items-center">

            <Form.Root className="max-w-[200px]" onSubmit={loginSubmit}>

                <Form.Field name="username" className="flex flex-col">
                    <div className="flex items-baseline justify-between">
                        <Form.Label className="text-[15px] font-medium leading-[35px] text-white">Nome de usuário</Form.Label>
                        <Form.Message className="text-[13px] text-white opacity-[0.8]" match="valueMissing">
                            Please enter your username
                        </Form.Message>
                        <Form.Message className="text-[13px] text-white opacity-[0.8]" match="typeMismatch">
                            Please provide a valid username
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input
                            className="bg-[#CBCBCB64]"
                            type="text"
                            value={username}
                            onChange={({ target: { value }}) => setUsername(value)}
                            required/>
                    </Form.Control>
                </Form.Field>

                <Form.Field name="password" className="flex flex-col">
                    <div className="flex items-baseline justify-between">
                        <Form.Label className="text-[15px] font-medium leading-[35px] text-white">Senha</Form.Label>
                        <Form.Message className="text-[13px] text-white opacity-[0.8]" match="valueMissing">
                            Please enter your password
                        </Form.Message>
                        <Form.Message className="text-[13px] text-white opacity-[0.8]" match="typeMismatch">
                            Please provide a valid password
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input
                            className="bg-[#CBCBCB64]"
                            type="password"
                            value={password}
                            onChange={({ target: { value }}) => setPassword(value)}
                            required/>
                    </Form.Control>
                </Form.Field>

                <Form.Submit asChild>
                    <button className="box-border w-full text-violet11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]">
                    Post question
                    </button>
                </Form.Submit>

            </Form.Root>

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

    if(DEBUG_MODE) console.log("response", response);

    if(!response.ok) throw new Error("Failed on login");

    const responseBody = await response.json();

    if (typeof responseBody["token"] !== "string") throw new Error("token property not found from response body");

    return responseBody["token"];
   } catch(err) {
    console.error(err);
    throw err;
   }
}