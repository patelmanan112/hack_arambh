import { motion } from "framer-motion";

export function RepositorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-5 h-[160px] relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
          
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-white/5 shrink-0" />
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-4">
                <div className="h-5 w-3/5 bg-white/5 rounded-md" />
                <div className="h-5 w-5 rounded-full bg-white/5" />
              </div>
              <div className="flex gap-2 mb-3">
                <div className="h-4 w-16 bg-white/5 rounded-full" />
                <div className="h-4 w-16 bg-white/5 rounded-full" />
              </div>
              <div className="h-3 w-full bg-white/5 rounded-md mb-2" />
              <div className="h-3 w-4/5 bg-white/5 rounded-md" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
