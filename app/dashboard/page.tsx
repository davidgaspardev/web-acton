"use client";

import UsersApi from "@/helpers/api/users";
import LocalStorage from "@/helpers/storage";
import { MetricsInfo, UserModel } from "@/helpers/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CardUser from "./CardUser";
import ResultsApi from "@/helpers/api/results";

export default function DashboardPage() {
    const router = useRouter();
    const [ page, setPage ] = useState<number>(1);
    const [ token ] = useState<string | null>(() => {
        const localStorage = LocalStorage.getInstance();
        const token = localStorage.findToken();

        return token;
    });
    const [ users, setUsers ] = useState<UserModel[]>([]);
    const [ metrics, setMetrics ] = useState<MetricsInfo>([]);

    const loadUsers = useCallback(async () => {
        if(!token) {
            return router.push("/login");
        }

        const usersApi = UsersApi.getInstance();
        const users = await usersApi.getUsersByPage(page, { token });

        setUsers(users);
    }, [ token, page, router ]);

    const loadMetrics = useCallback(async () => {
        if(!token) {
            return router.push("/login");
        }

        const resultsApi = ResultsApi.getInstance();
        const metrics = await resultsApi.getMetrics();

        setMetrics(metrics);
    }, [ token, router ]);

    useEffect(() => {
        loadUsers();
        loadMetrics();
    }, [ loadUsers, loadMetrics ]);

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