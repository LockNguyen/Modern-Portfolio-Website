import Link from "next/link";
import Image from "next/image";
import { FaLocationArrow } from "react-icons/fa6";

import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MagicButton } from "@/components/ui/magic-button";
import { links } from "@/config";

export const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      <div>
        <Spotlight
          className="-left-10 -top-40 h-screen md:-left-32 md:-top-20"
          fill="white"
        />
        <Spotlight
          className="left-full top-10 h-[80vh] w-[50vw]"
          fill="purple"
        />
        <Spotlight
          className="left-80 top-24 h-[80vh] w-[50vw]"
          fill="blue" 
        />
      </div>

      <div className="absolute left-0 top-0 flex h-screen w-full items-center justify-center bg-white bg-grid-black/[0.2] dark:bg-black-100 dark:bg-grid-white/[0.03]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black-100" />
      </div>

      <div className="relative z-10 my-20 grid grid-cols-3 gap-4">

        {/* Name & Titles */}
        <div className="z-10 col-span-3 sm:col-span-2 flex max-w-[89vw] flex-col md:max-w-2xl lg:max-w-[60vw]">
          <h2 className="max-w-80 text-xs uppercase tracking-widest text-blue-100">
            Software Engineer
          </h2>

          <div className="flex flex-wrap my-4">
            <TextGenerateEffect
              className="text-[40px] md:text-5xl lg:text-6xl whitespace-nowrap"
              words="Hi, I'm&nbsp;"
            />
            <TextGenerateEffect
              className="text-[40px] md:text-5xl lg:text-6xl whitespace-nowrap"
              words="Loc Nguyen"
              startGalaxyColorIndex={0}
              endGalaxyColorIndex={1}
            />
          </div>

          <div className="flex flex-wrap mb-4">
            <p className="text-sm md:text-lg md:tracking-wider lg:text-2xl">
              I build fullstack apps +&nbsp;
            </p>
            <p className="text-sm md:text-lg md:tracking-wider lg:text-2xl">
              create automations that save 450+ hours.
            </p>
          </div>

          <Link href="#about" className="md:mt-10">
            <MagicButton
              title="Show my work"
              icon={<FaLocationArrow />}
              position="right"
              asChild
            />
          </Link>
        </div>

        {/* SICK Profile Picture (except on small screens) */}
        <div className="col-span-1 z-0 absolute left-auto right-0 -top-[25%] sm:left-[8rem] sm:-top-[75%] sm:right-auto md:left-auto md:-right-[10%] md:-top-[15%] h-[110%] w-1/2">
          <Image
            src="/profilePictureTransparent.png"
            alt="profilePictureTransparent"
            fill // Image will fill the parent div
            style={{ objectFit: 'contain' }}
            className="opacity-80 sm:opacity-90 [mask-image:linear-gradient(black_60%,transparent_80%)] sm:[mask-image:linear-gradient(black_60%,transparent_90%)]"
            sizes="(min-width: 768px) 33vw, 0px"
          />
        </div>
      </div>
    </div>
  );
};
