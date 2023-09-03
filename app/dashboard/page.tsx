"use client";

import UsersApi from "@/helpers/api/users";
import LocalStorage from "@/helpers/storage";
import { MetricsInfo, UserModel } from "@/helpers/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import UserCard from "./UserCard";
import ResultsApi from "@/helpers/api/results";
import MetricMethoCard, { MetricCountCard } from "./MetricCard";
import Header from "./Header";
import PageControl from "./PageControl";

export default function DashboardPage() {
    const router = useRouter();
    const [ page, setPage ] = useState<number>(1);
    const [ token ] = useState<string | null>(() => {
        const localStorage = LocalStorage.getInstance();
        const token = localStorage.findToken();

        return token;
    });
    const [ users, setUsers ] = useState<UserModel[]>([]);
    const usersTotal = useRef<number>();

    const [ metrics, setMetrics ] = useState<MetricsInfo>([]);
    const [ search, setSearch ] = useState<string>("");

    const loadUsers = useCallback(async () => {
        if(!token) {
            return router.push("/login");
        }

        const usersApi = UsersApi.getInstance();
        const {users, total } = await usersApi.getUsersByPage(page, { token, search: search.length > 0 ? search : undefined });

        usersTotal.current = total;
        setUsers(users);
    }, [ token, page, router, search ]);

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
        <main>
            <Header search={search} onSearch={setSearch}/>
            <div className="flex flex-row">
                <section className="w-[200px]">
                    {
                        metrics.length > 0 && [
                            <MetricCountCard key={0} data={metrics} />,
                            ...metrics.map((metric) => (
                                <MetricMethoCard data={metric} key={metric.methodology} />
                            ))
                        ]
                    }
                </section>
                <section className="flex-1 flex flex-col gap-2">
                {
                    users.map((user) => (
                        <UserCard data={user} key={user.id} />
                    ))
                }
                {
                    usersTotal.current && (
                        <PageControl
                            currentPage={page}
                            total={usersTotal.current}
                            onPage={setPage}/>
                    )
                }
                </section>
            </div>
        </main>
    )
}