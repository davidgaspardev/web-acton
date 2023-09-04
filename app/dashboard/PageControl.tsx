import { USER_PAGE_SIZE } from "@/helpers/env";

type PageControlProps = {
    currentPage: number;
    total: number;
    onPage: (pageNumber: number) => void;
}

export default function PageControl(props: PageControlProps): JSX.Element {
    const { currentPage, total, onPage } = props;

    const pageSize = USER_PAGE_SIZE;
    const pageNumber = Math.ceil(total / pageSize);
    const pages = Array<number>();

    for (let index = 0; index < pageNumber; index++) {
        pages.push(index + 1);
    }

    return (
        <div className="h-[50px] flex flex-row justify-end items-center px-6">
            {
                pages.map((page, index) => (
                    <div
                        key={index}
                        onClick={page !== currentPage ? () => onPage(page) : undefined}
                        className={`w-6 h-6 mx-2 cursor-pointer rounded-full ${page !== currentPage ? "bg-green-400" : "bg-green-700"} flex items-center justify-center`}>
                        <h3>{page}</h3>
                    </div>
                ))
            }
        </div>
    );
}