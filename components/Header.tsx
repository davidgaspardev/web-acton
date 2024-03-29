import ActoLogo from "@/assets/svg/acto-logo.svg"
import Image from "next/image";

type HeaderProps = {
    search: string;
    onSearch: (search: string) => void;
}

export default function Header(props: HeaderProps): JSX.Element {
    const { search, onSearch } = props;
    return (
        <header className="w-full h-16 flex flex-row justify-between">
            <div className="flex flex-col justify-center px-6">
                <input
                    className="bg-[#C8C9CC] rounded-full py-1 px-2 text-xs min-w-[200px]"
                    type="text"
                    value={search}
                    onChange={({ target: { value }}) => onSearch(value)}/>
            </div>

            <div className="flex flex-col justify-center px-6">
                <Image
                    src={ActoLogo}
                    alt="Acto logo"
                    height={60}/>
            </div>
        </header>
    );
}