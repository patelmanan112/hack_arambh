import { motion } from "framer-motion";
import { ArrowRight, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RepositorySelectionFooterProps {
  selectedCount: number;
  totalSelectedSizeKb: number;
  onContinue: () => void;
  isSubmitting: boolean;
}

export function RepositorySelectionFooter({
  selectedCount,
  totalSelectedSizeKb,
  onContinue,
  isSubmitting,
}: RepositorySelectionFooterProps) {
  // Rough estimation: 1 min base + ~1 min per 100MB
  const sizeMb = totalSelectedSizeKb / 1024;
  const estimatedTimeMinutes = Math.max(1, Math.ceil(1 + sizeMb / 100));

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#09090B]/90 backdrop-blur-xl p-4 sm:p-6"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-white/40 mb-0.5">Selected</p>
            <p className="text-white font-medium text-base">
              {selectedCount} {selectedCount === 1 ? "repository" : "repositories"}
            </p>
          </div>
          
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          
          <div className="hidden sm:block">
            <p className="text-white/40 mb-0.5">Estimated Time</p>
            <p className="text-white font-medium flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-primary" />
              ~{estimatedTimeMinutes} minute{estimatedTimeMinutes !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button
            onClick={onContinue}
            disabled={selectedCount === 0 || isSubmitting}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
