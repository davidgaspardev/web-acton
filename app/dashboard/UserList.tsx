import { ResultModel, UserModel } from "@/helpers/types";
import EvoPurpleIcon from "@/assets/svg/ic-evo-purple.svg";
import Link from "next/link";
import Image from "next/image";
import { loadLinkToEVO } from "../user/[userId]/UserInfoCard";

type UserListProps = {
    users: UserModel[]
}

export default function UserList(props: UserListProps) {
    const { users } = props;

	return (
		<div className="flex flex-col  h-[calc(100vh-114px)] overflow-y-auto">
            <div className="flex flex-row h-16 mt-4 px-2 border-b border-b-[#DCDCDC]">
                <div className="flex-1 pl-2 flex flex-col justify-center">
                  <h1>CLIENTE</h1>
                  <p className="text-xs opacity-75">Nome e email do cliente</p>
                </div>
                <div className="w-[25%] pl-2 flex flex-col justify-center">
                  <h1>PRODUTO</h1>
                  <p className="text-xs opacity-75">Resultado do questionario</p>
                </div>
                <div className="w-[15%] pl-2 flex flex-col justify-center">
                  <h1>EVO</h1>
                  <p className="text-xs opacity-75">Integração com sistema EVO</p>
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


type UserCardProps = {
    data: UserModel;
}

function UserCard(props: UserCardProps): JSX.Element {
    const { fullname, email, results, id, prospectId } = props.data;

    const hasResult = results.length > 0;
    const hasEvo = !!prospectId;

    return (
        <div className="flex flex-row h-14 px-1">
          <Link className="flex-1" href={`/user/${id}`}>
            <div className="flex flex-row h-14 hover:bg-gray-100 rounded-l-sm">
                <div className="flex flex-1 flex-col justify-center pl-2">
                    <h2>{fullname}</h2>
                    { (email && email.length > 0) && (
                        <p className="text-xs opacity-40"><a href={`mailto:${email}`}>{email}</a></p>
                    )}
                </div>
                <div className="w-[29.4%]">
                    { hasResult ? (
                        <Result data={results[0]} />
                    ) : (
                        <NoResult />
                    )}
                </div>
            </div>
          </Link>
          <div className="w-[15%]">
              {
                hasEvo ? (
                  <EVO prospectId={prospectId} />
                ) : (
                  <NoEVO />
                )
              }
          </div>
        </div>
    );
}

type ResultProps = {
    data: ResultModel;
}

function Result(props: ResultProps): JSX.Element {
    const { stage, level, methodology } = props.data;
    return (
        <div className="flex flex-col justify-center h-full w-full">
            <h2><strong>{methodology}</strong></h2>
            <p className="text-sm text-[#757575]">NIVEL <strong>{level}</strong> FASE <strong>{stage}</strong></p>
        </div>
    );
}

function NoResult(): JSX.Element {
    return (
        <div className="flex flex-col justify-center h-full">
            <h1>Ainda sem resultado</h1>
        </div>
    );
}


type EVOPros = {
  prospectId: number
}

function EVO(props: EVOPros): JSX.Element {
  const { prospectId } = props;

  return (
    <Link
      href={loadLinkToEVO(prospectId)}
      target="_blank"
      className="flex flex-col justify-center items-center h-full bg-[#8061ff48] hover:bg-[#8061ff75]">
      <Image
        src={EvoPurpleIcon}
        alt="EVO icon"
        width={64}/>
    </Link>
  )
}

function NoEVO(): JSX.Element {
  return (
    <div className="flex flex-col justify-center items-center h-full bg-[#AB212148] cursor-not-allowed">
      <h1 className="text-[#AB2121]">SEM INTEGRAÇÃO</h1>
    </div>
  )
}
