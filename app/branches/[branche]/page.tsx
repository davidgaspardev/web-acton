type PageProps = {
  params: {
    branche: string;
  }
}

export default function Page(props: PageProps) {
  const { branche } = props.params;



  return (
    <div>
      <h1>{branche}</h1>
    </div>
  );
}
