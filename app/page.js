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
      <UserButton />
    </div>
  );
}
