"use client";

import { branches } from "@/helpers/data";
import { BrancheInfo, BranchePlan, Optional } from "@/helpers/types";
import { useRef } from "react";

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
      <div>
        <h1>Academia não existe</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{branche.name}</h1>
    </div>
  );
}
