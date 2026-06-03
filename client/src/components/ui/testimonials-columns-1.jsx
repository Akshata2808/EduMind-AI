"use client";
import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                  className="p-8 rounded-3xl border border-sage/20 bg-white/70 shadow-soft max-w-xs w-full card-3d cursor-default" 
                  key={i}
                >
                  <div className="text-xs font-semibold leading-relaxed text-slate-700">{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover border border-sage/20 shadow-sm"
                    />
                    <div className="flex flex-col">
                      <div className="font-extrabold tracking-tight text-xs text-slate-950 leading-4">{name}</div>
                      <div className="text-[10px] leading-4 text-slate-500 font-semibold">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
