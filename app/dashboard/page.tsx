"use client";

import UsersApi from "@/helpers/api/users";
import LocalStorage from "@/helpers/storage";
import { MetricsInfo, UserModel } from "@/helpers/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ResultsApi from "@/helpers/api/results";
import MetricMethoCard, { MetricCountCard } from "./MetricCard";
import Header from "../../components/Header";
import PageControl from "./PageControl";
import UserList from "./UserList";

export default function DashboardPage() {
    const router = useRouter();
    const [ page, setPage ] = useState<number>(1);
    const [ token ] = useState<string | null>(() => {
        if (typeof window === "undefined")  return null;

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
            <Header search={search} onSearch={(text) => {
                if(page != 1) setPage(1);
                setSearch(text);
            }}/>
            <div className="flex flex-row flex-1">
                <section className="w-[232px]">
                    {
                        metrics.length > 0 && [
                            <MetricCountCard key={0} data={metrics} />,
                            ...metrics.map((metric) => (
                                <MetricMethoCard data={metric} key={metric.methodology} />
                            ))
                        ]
                    }
                </section>

                {/** Render user list */}
                <section className="flex-1">
                    <UserList users={users} />

                    {/** Footer with page count */}
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
