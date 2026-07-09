import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface RepositorySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function RepositorySearch({ value, onChange }: RepositorySearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full md:max-w-md"
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-white/40" />
      </div>
      <Input
        type="text"
        placeholder="Search repositories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary focus-visible:border-primary w-full h-10 rounded-lg shadow-sm backdrop-blur-md"
      />
    </motion.div>
  );
}
