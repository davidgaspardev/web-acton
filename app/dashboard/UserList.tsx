import { UserModel } from "@/helpers/types";
import UserCard from "./UserCard";

type UserListProps = {
    users: UserModel[]
}

export default function UserList(props: UserListProps) {
    const { users } = props;

	return (
		<div className="flex flex-col gap-2 h-[calc(100vh-114px)] overflow-y-auto">
            <div className="flex flex-row h-[45px] mt-4 px-2">
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
	);
}