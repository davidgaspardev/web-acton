import { BottomLine } from "@/components/Header";
import { branches } from "@/helpers/data";
import { BrancheInfo } from "@/helpers/types";
import ActoLogoPurple from "@/assets/svg/acto-logo-purple.svg";
import Image from "next/image";

export default function BranchgesPage(): JSX.Element {
  return (
    <main>
      <div className="pt-16">
        <Header />
        <Banner />
        <Branches />
      </div>
    </main>
  );
}

function Header(): JSX.Element {
  return (
    <header className="fixed top-0 h-16 w-full flex flex-col bg-slate-50">
      <div className="flex-1 flex flex-row justify-center">
        {
          ["Home", "Planos", "Clube"].map((navName, index) => (
            <div key={index} className="h-full w-24 flex flex-col items-center justify-center">
              <h2>{navName}</h2>
            </div>
          ))
        }
      </div>
      {/* <BottomLine /> */}
    </header>
  )
}

function Banner(): JSX.Element {
  return (
    <div className="w-full h-48 bg-[#B297D7] flex items-center justify-center">
      <Image
        src={ActoLogoPurple}
        alt="Acto logo purple"
        width={256}
        className="max-sm:w-[180px]"/>
    </div>
  );
}

function Branches(): JSX.Element {
  return (
    <div className="flex flex-col items-center w-full my-12">
      <div className="flex flex-row justify-center gap-16 items-center h-[calc(100vh-64px)] flex-wrap max-w-[800px]">
        {
          branches.map((branche, index) => <BrancheCard key={index} data={branche} />)
        }
      </div>
    </div>
  );
}

type BrancheCardProps = {
  data: BrancheInfo
}

function BrancheCard(props: BrancheCardProps) {
  const { name } = props.data;

  return (
    <div className="w-[320px] h-80 rounded-b-[40px] rounded-tl-[40px] bg-[#FEF7FF] flex flex-col p-4">
      <div className="flex-1">
        <Image
          src={"https://dnd1g0gk41u1l.cloudfront.net/image/filename/4079727/md_NEOri7lhqRXqTapoMqbCmIkSSpHTWBzA.jpg"}
          alt="Branche"
          width={256}
          height={0}
          className="rounded-b-[40px] rounded-tl-[40px] object-cover w-full h-full"/>
      </div>
      <div className="h-24">
        <h1>{name}</h1>
      </div>
    </div>
  )
}
