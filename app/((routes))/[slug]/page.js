"use client";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

const page = () => {
    const {slug} = useParams();
    const [ID, setID] = useState(slug);
    useEffect(() => {
      // remove the space(%20) and replace it with a dash(-)
      const newSlug = decodeURIComponent(slug).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
      if(newSlug != slug){ 
        window.location.replace("/" + newSlug);
        setID(newSlug);
      }
    }, [])

  return (    
    <div className="w-full h-full flex justify-center items-center">{ID}</div>
  )
}

export default page