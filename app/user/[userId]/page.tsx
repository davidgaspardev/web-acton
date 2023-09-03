"use client";

import Header from "@/components/Header";
import QuizzesApi from "@/helpers/api/quizzes";
import UsersApi from "@/helpers/api/users";
import LocalStorage from "@/helpers/storage";
import { QuizData, QuizModel, UserModel } from "@/helpers/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type UserPageProps = {
    params: {
        userId: string;
    }
};

export default function UserPage(props: UserPageProps): JSX.Element {
    const { userId } = props.params;

    const router = useRouter();
    const [ token ] = useState<string | null>(() => {
        const loadStorage = LocalStorage.getInstance();
        const token = loadStorage.findToken();

        return token;
    });
    const [ user, setUser ] = useState<UserModel>();
    const [ quizzes, setQuizzes ] = useState<QuizModel[]>([]);
    const [ search, setSearch ] = useState<string>("");

    const loadUserData = useCallback(async () => {
        if(!token) {
            return router.push("/login");
        }

        const usersApi = UsersApi.getInstance();
        const userData = await usersApi.getById(userId, { token });

        setUser(userData);
    }, [ userId, token, router ]);

    const loadQuizzesData = useCallback(async () => {
        if (!user || user.results.length === 0 || !token ) return;

        const quizzesApi = QuizzesApi.getInstance();
        const quizzes = await quizzesApi.getBySessionCode(user.results[0].sessionCode, { token });

        setQuizzes(quizzes);
    }, [ user, token ]);

    useEffect(() => {
        loadQuizzesData();
    }, [user, loadQuizzesData])

    useEffect(()=> {
        loadUserData();
    }, [ loadUserData ]);

    if (!token) {
        return <h1>Não autorizado</h1>
    }

    return (
        <main className="h-screen flex flex-col">
            <Header search={search} onSearch={setSearch} />
            <div className="flex-1 flex flex-row">
                <div className="w-[50%] bg-[#EAEDF3] h-full">
                    {
                        quizzes.filter((quiz) => {
                            if (search.length > 0) {
                                return (
                                    quiz.question.toLowerCase().includes(search.toLowerCase()) ||
                                    quiz.answer.toLowerCase().includes(search.toLowerCase())
                                );
                            }

                            return true;
                        }).map((quiz) => (
                            <div key={quiz.id} className="ps-3 pb-3">
                                <h3>{quiz.question}</h3>
                                {/* <div> */}
                                    <h3 className={`inline-block px-1 ${quiz.answer == "Sim" ? "bg-[#66EF78]" : ""}${quiz.answer == "Não" ? "bg-[#F04130]" : ""}`}>{quiz.answer}</h3>
                                {/* </div> */}
                            </div>
                        ))
                    }
                </div>
                <div className="flex-1">
                    { user && (
                        <div>
                            <h1>{user.fullname}</h1>
                            <h1>{user.email}</h1>
                            <h1>{user.gender}</h1>
                            <h1>{user.whatsapp}</h1>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}