import ActoLogo from "@/assets/svg/acto-logo.svg"
import Image from "next/image";

type HeaderProps = {
    search: string;
    onSearch: (search: string) => void;
}

export default function Header(props: HeaderProps): JSX.Element {
    const { search, onSearch } = props;
    return (
        <header>
            <div className="w-full h-[58px] flex flex-row justify-between">
                <div className="flex flex-col justify-center px-6">
                    <input
                        className="bg-[#EAEDF3] rounded-md py-1 px-2 text-sm min-w-[200px]"
                        type="text"
                        value={search}
                        placeholder="Pesquisar"
                        onChange={({ target: { value }}) => onSearch(value)}/>
                </div>

                <div className="flex flex-col justify-center px-8">
                    <Image
                        src={ActoLogo}
                        alt="Acto logo"
                        height={55}/>
                </div>
            </div>

            <BottomLine/>
        </header>
    );
}


function BottomLine(): JSX.Element {
    return (
        <div className="flex flex-row h-[2px]">
            <div className="flex-1 bg-[#2DABE3]"></div>
            <div className="flex-1 bg-[#FEEB1A]"></div>
            <div className="flex-1 bg-[#E50C7E]"></div>
            <div className="flex-1 bg-[#8ABF41]"></div>
        </div>
    );
}
