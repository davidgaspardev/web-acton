"use client";

import UsersApi from "@/helpers/api/users";
import LocalStorage from "@/helpers/storage";
import { MetricsInfo, UserModel } from "@/helpers/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import UserCard from "./UserCard";
import ResultsApi from "@/helpers/api/results";
import MetricMethoCard, { MetricCountCard } from "./MetricCard";
import Header from "../../components/Header";
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
        <main className="flex flex-col min-h-screen">
            <Header search={search} onSearch={setSearch}/>
            <div className="flex flex-row flex-1">
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
                <section className="flex-1">
                    <div className="flex flex-col gap-2 h-[calc(100%-50px)]">
                        <div className="flex flex-row h-[45px] mt-4">
                            <div className="flex-1 flex flex-col justify-center">
                                <h1 className="font-bold text-xl">NOME:</h1>
                            </div>
                            <div className="w-80 flex flex-col justify-center">
                                <h1 className="font-bold text-xl ps-5">PRODUTO:</h1>
                            </div>
                        </div>
                        {
                            users.map((user) => (
                                <UserCard data={user} key={user.id} />
                            ))
                        }
                    </div>
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