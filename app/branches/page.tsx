import { BottomLine } from "@/components/Header";
import { branches } from "@/helpers/data";
import { BrancheInfo } from "@/helpers/types";
import ActoLogoPurple from "@/assets/svg/acto-logo-purple.svg";
import ActoBanner from "@/assets/svg/acto-bunner.svg";
import Image from "next/image";
import Link from "next/link";

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
    <header className="fixed top-0 h-16 w-full flex flex-col bg-slate-50 z-50">
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
    <div className="w-full h-48 flex items-center justify-center"
    style={{
      backgroundImage: `url(${ActoBanner.src})`
    }}>
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
  const { name, address, neighborhood, city, state, zipCode } = props.data;

  return (
    <div className="w-[350px] h-96 rounded-b-[40px] rounded-tl-[40px] bg-[#FEF7FF] flex flex-col p-4 relative">
      <div className="flex-1">
        <Image
          src={"https://dnd1g0gk41u1l.cloudfront.net/image/filename/4079727/md_NEOri7lhqRXqTapoMqbCmIkSSpHTWBzA.jpg"}
          alt="Branche"
          width={256}
          height={0}
          className="rounded-b-[40px] rounded-tl-[40px] object-cover w-full h-full"/>
      </div>
      <div className="h-32 text-center">
        <h1 className="text-2xl mb-2"><strong>{name}</strong></h1>
        <h2 className="text-sm">{address}</h2>
        <h2 className="text-sm"><strong>{neighborhood}, {city} ({state})</strong> {zipCode}</h2>
      </div>

      <Link
        href={""}
        className="h-12 w-48 rounded-b-3xl rounded-tr-3xl bg-[#553682] text-white flex items-center justify-center absolute -bottom-3 left-[calc(50%-96px)]">
        <strong>Contratar</strong>
      </Link>
    </div>
  )
}
