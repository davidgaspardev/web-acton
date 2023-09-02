"use client";

import UsersApi from "@/helpers/api/users";
import LocalStorage from "@/helpers/storage";
import { UserModel } from "@/helpers/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CardUser from "./CardUser";

export default function DashboardPage() {
    const router = useRouter();
    const [ page, setPage ] = useState<number>(1);
    const [ token ] = useState<string | null>(() => {
        const localStorage = LocalStorage.getInstance();
        const token = localStorage.findToken();

        return token;
    });
    const [ users, setUsers ] = useState<UserModel[]>([]);

    const loadUsers = useCallback(async () => {
        if(!token) {
            return router.push("/login");
        }

        const usersApi = UsersApi.getInstance();
        const users = await usersApi.getUsersByPage(page, { token });

        setUsers(users);
    }, [ token, page, router ]);

    useEffect(() => {
        loadUsers();
    }, [ loadUsers ]);

    return (
        <div>
            <section className="flex flex-col gap-2">
            {
                users.map((user) => (
                    <CardUser data={user} key={user.id} />
                ))
            }
            </section>
        </div>
    )
}