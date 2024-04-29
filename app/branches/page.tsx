import { BottomLine } from "@/components/Header";
import { branches } from "@/helpers/data";
import { BrancheInfo } from "@/helpers/types";
import ActoLogoPurple from "@/assets/svg/acto-logo-purple.svg";
import ActoBanner from "@/assets/svg/acto-bunner.svg";
import IconShareFacebook from "@/assets/svg/ic-share-facebook.svg";
import IconShareInstagram from "@/assets/svg/ic-share-instagram.svg";
import IconShareLinkedIn from "@/assets/svg/ic-share-linkedin.svg";
import IconShareYouTube from "@/assets/svg/ic-share-youtube.svg";
import Image from "next/image";
import Link from "next/link";

export default function BranchgesPage(): JSX.Element {
  return (
    <main>
      <div className="pt-16">
        <Header />
        <Banner />
        <Branches />
        <Footer />
      </div>
    </main>
  );
}

export function Header(): JSX.Element {
  return (
    <header className="fixed top-0 h-16 w-full flex flex-col bg-[#FEF7FF] z-50">
      <div className="flex-1 flex flex-row justify-center">
        {
          [
            {
              name: "Home",
              link: "https://www.actoacademia.com.br/"
            },
            {
              name: "Planos",
              link: "/branches"
            },
            {
              name:  "Clube",
              link: "https://www.actoacademia.com.br/clubdevantagens"
            }
          ].map(({ name, link }, index) => (
            <Link key={index} href={link} className="h-full w-24 flex flex-col items-center justify-center">
              <h2 className="font-Bree font-bold text-xl text-[#553581]">{name}</h2>
            </Link>
          ))
        }
      </div>
      {/* <BottomLine /> */}
    </header>
  )
}

export function Banner(): JSX.Element {
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
      <div className="flex flex-row justify-center gap-16 items-center min-h-[calc(100vh-64px)] flex-wrap max-w-[800px]">
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
  const { name, address, neighborhood, city, state, zipCode, slug, imageUrl } = props.data;

  return (
    <div className="w-[350px] h-96 rounded-b-[40px] rounded-tl-[40px] bg-[#FEF7FF] flex flex-col p-4 relative">
      <div className="flex-1">
        <Image
          src={imageUrl}
          alt="Branche"
          width={256}
          height={0}
          className="rounded-b-[40px] rounded-tl-[40px] object-cover w-full h-full"/>
      </div>
      <div className="h-32 text-center font-Bree text-[#553581]">
        <h1 className="text-2xl mb-2"><strong>{name}</strong></h1>
        <h2 className="text-sm">{address}</h2>
        <h2 className="text-sm"><strong>{neighborhood}, {city} ({state})</strong> {zipCode}</h2>
      </div>

      <Link
        href={`/branches/${slug}`}
        className="h-12 w-48 font-Bree text-xl rounded-b-3xl rounded-tr-3xl bg-[#553682] text-white flex items-center justify-center absolute -bottom-5 left-[calc(50%-96px)]">
        <strong>Contratar</strong>
      </Link>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="w-full h-40 bg-[#CABBCA] flex flex-col items-center justify-center font-Bree font-bold text-[#553682]">
      <h1>Acto Academia</h1>
      <h1 className="-mt-2">CREF 001670-PJ/PE</h1>
      <div className="flex flex-row gap-4 my-2">
        <Link href={""}>
          <Image
            src={IconShareFacebook}
            alt="Facebook share"
            width={32}/>
        </Link>
        <Link href={""}>
          <Image
            src={IconShareInstagram}
            alt="Instagram share"
            width={32}/>
        </Link>
        <Link href={""}>
          <Image
            src={IconShareLinkedIn}
            alt="LinkedIn share"
            width={32}/>
        </Link>
        <Link href={""}>
          <Image
            src={IconShareYouTube}
            alt="YouTube share"
            width={32}/>
        </Link>
      </div>
      <h1>Pernambuco, Brasil - 2024</h1>
    </footer>
  );
}
