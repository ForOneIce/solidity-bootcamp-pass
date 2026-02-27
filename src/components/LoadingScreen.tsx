import { motion } from "motion/react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f0c29] overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"></div>
      
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
         {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-0"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
              }}
            />
         ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Planet System */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* Orbit Ring (Visual) */}
          <div className="absolute w-[120%] h-[120%] rounded-full border border-white/5 rotate-[75deg] scale-y-50"></div>
          <div className="absolute w-[160%] h-[160%] rounded-full border border-white/5 rotate-[-45deg] scale-y-50"></div>

          {/* Pink Planet */}
          <motion.div 
            className="relative w-32 h-32 rounded-full bg-gradient-to-br from-pink-300 via-pink-500 to-purple-600 shadow-[0_0_60px_rgba(236,72,153,0.5)]"
            animate={{ 
              boxShadow: ["0 0 40px rgba(236,72,153,0.4)", "0 0 80px rgba(236,72,153,0.7)", "0 0 40px rgba(236,72,153,0.4)"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
             {/* Planet Atmosphere/Sheen */}
             <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50"></div>
             
             {/* Craters */}
             <div className="absolute top-6 left-8 w-6 h-4 bg-pink-700/20 rounded-full rotate-[-15deg] blur-[1px]"></div>
             <div className="absolute bottom-8 right-6 w-8 h-6 bg-purple-800/20 rounded-full rotate-[10deg] blur-[2px]"></div>
             <div className="absolute top-1/2 right-4 w-4 h-3 bg-pink-800/10 rounded-full blur-[1px]"></div>
          </motion.div>

          {/* Orbiting UFO Container */}
          {/* We rotate this container to move the UFO */}
          <motion.div
            className="absolute w-[180%] h-[180%]"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
             {/* UFO Positioned on the 'orbit' */}
             <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-12 h-12">
                {/* UFO Graphics - Rotating locally to stay somewhat upright or banking */}
                <motion.div 
                  className="relative w-full h-full"
                  animate={{ rotate: -360 }} 
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                   {/* The UFO itself */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-6">
                      {/* Glass Dome */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-cyan-200/60 rounded-full border border-white/30 backdrop-blur-sm z-0"></div>
                      {/* Body */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-200 to-slate-400 rounded-[50%] border border-slate-300 z-10 shadow-lg flex items-center justify-center overflow-hidden">
                        {/* Lights */}
                        <div className="flex gap-1 mt-1">
                          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse delay-75"></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                        </div>
                      </div>
                      {/* Engine Glow */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-cyan-400/50 blur-md rounded-full"></div>
                   </div>
                </motion.div>
             </div>
          </motion.div>
        </div>

        {/* Loading Text */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-white font-serif text-xl tracking-[0.2em] uppercase mb-2">
            Herstory
          </h2>
          <p className="text-indigo-200 text-xs font-sans tracking-widest animate-pulse">
            正在前往区块链宇宙...
          </p>
        </motion.div>
      </div>
    </div>
  );
}
