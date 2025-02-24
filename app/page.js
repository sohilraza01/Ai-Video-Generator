"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

useEffect(()=>{
  router.push("/dashboard");
},[])

  return (
    <div>
      {/* <h1>Sohil Raza</h1> */}
      {/* <Button onClick={handleRedirect}>Add Data</Button> */}
      <UserButton />
    </div>
  );
}
