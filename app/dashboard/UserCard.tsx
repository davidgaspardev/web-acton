import { ResultModel, UserModel } from "@/helpers/types";
import Link from "next/link";

type UserCardProps = {
    data: UserModel;
}

export default function UserCard(props: UserCardProps): JSX.Element {
    const { fullname, email, results, id } = props.data;

    const hasResult = results.length > 0;

    return (
        <Link href={`/user/${id}`} className="flex flex-row h-12">
            <div className="flex flex-1 flex-col justify-center bg-red-300">
                <h2>{fullname}</h2>
                { (email && email.length > 0) && (
                    <p className="text-xs opacity-40"><a href={`mailto:${email}`}>{email}</a></p>
                )}
            </div>
            <div className="w-64">
                { hasResult ? (
                    <Result data={results[0]} />
                ) : (
                    <NoResult />
                )}
            </div>
        </Link>
    );
}

type ResultProps = {
    data: ResultModel;
}

function Result(props: ResultProps): JSX.Element {
    const { stage, level, methodology } = props.data;
    return (
        <div>
            <h3>{stage}</h3>
            <h3>{level}</h3>
            <h3>{methodology}</h3>
        </div>
    );
}

function NoResult(): JSX.Element {
    return (
        <div>
            <h1>Ainda sem resultado</h1>
        </div>
    );
}