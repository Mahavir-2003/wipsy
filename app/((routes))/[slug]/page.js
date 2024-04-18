"use client";
import { useParams } from "next/navigation"

const page = () => {
    const {slug} = useParams();
  return (
    <div className="w-full h-full flex justify-center items-center">{slug}</div>
  )
}

export default page