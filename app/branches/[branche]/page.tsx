import { branches } from "@/helpers/data";
import Plans from "./Plans";
import Header from "../Header";
import { Banner } from "../Banner";
import { Footer } from "../Footer";

type PageProps = {
  params: {
    branche: string;
  }
}

export default function Page(props: PageProps) {
  const { branche: slug } = props.params;

  const branche = branches.find(branche => branche.slug === slug);

  if(!branche) {
    return (
      <main>
        <div className="pt-16">
          <Header />
          <h1>Unidade não existente</h1>
          <Footer />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="pt-16">
        <Header />
        <Banner />
        <Plans data={branche} />
        <Footer />
      </div>
    </main>
  );
}
