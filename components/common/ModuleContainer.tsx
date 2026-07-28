import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModuleContainerProps {
  children?: ReactNode;
  moduleName: string;
}

interface ModuleContainerState {
  hasError: boolean;
  isModuleLoading: boolean;
}

/**
 * A specialized error boundary and loading manager for individual dashboard modules.
 * Ensures that a single module failure does not compromise the entire security kernel UI.
 */
// FIX: Explicitly extending Component (imported from react) to ensure that 'props', 'state', and 'setState' are correctly inherited and recognized by the TypeScript compiler.
class ModuleErrorBoundary extends Component<ModuleContainerProps, ModuleContainerState> {
  constructor(props: ModuleContainerProps) {
    super(props);
    // FIX: Correctly initialize state in the constructor after calling super(props).
    this.state = { hasError: false, isModuleLoading: true };
  }

  // FIX: Access setState inherited from Component.
  componentDidMount() {
    // Artificial delay to simulate module compilation/loading
    setTimeout(() => this.setState({ isModuleLoading: false }), 400);
  }

  // FIX: Use inherited props and setState to manage loading state during updates.
  componentDidUpdate(prevProps: ModuleContainerProps) {
    if (prevProps.moduleName !== this.props.moduleName) {
        this.setState({ isModuleLoading: true });
        setTimeout(() => this.setState({ isModuleLoading: false }), 400);
    }
  }

  public static getDerivedStateFromError(_: Error): ModuleContainerState {
    // Standard React Error Boundary synchronization for state recovery.
    return { hasError: true, isModuleLoading: false };
  }

  // FIX: Correctly access moduleName from inherited props in catch block.
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Module Error [${this.props.moduleName}]:`, error, errorInfo);
  }

  render() {
    // FIX: Access inherited state.
    if (this.state.hasError) {
      return (
        <div className="p-8 border border-red-900/30 bg-red-950/10 rounded-sm text-center">
          <h2 className="text-red-500 font-mono font-bold uppercase tracking-widest mb-2">Module_Execution_Failed</h2>
          {/* FIX: Correctly access moduleName from inherited props. */}
          <p className="text-gray-500 text-xs font-mono mb-4">The module "{this.props.moduleName}" encountered a sandbox violation or logic error.</p>
          <button 
            // FIX: Access inherited setState method.
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-wider hover:bg-gray-200"
          >
            Re-Initialize Module
          </button>
        </div>
      );
    }

    return (
        <div className="relative w-full h-full">
            <AnimatePresence>
                {/* FIX: Access isModuleLoading from inherited state. */}
                {this.state.isModuleLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-[#030303]/40 backdrop-blur-[2px]"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex gap-1.5">
                                {[1,2,3].map(i => (
                                    <motion.div 
                                        key={i}
                                        animate={{ 
                                            height: [4, 12, 4],
                                            backgroundColor: ['#7b3fe4', '#fff', '#7b3fe4']
                                        }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1 rounded-full bg-polygon-purple"
                                    />
                                ))}
                            </div>
                            {/* FIX: Access moduleName from inherited props. */}
                            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.4em] font-black">Injecting_{this.props.moduleName}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* FIX: Access children from inherited props. */}
            {this.props.children}
        </div>
    );
  }
}

export const ModuleContainer: React.FC<ModuleContainerProps> = ({ children, moduleName }) => {
  return (
    <ModuleErrorBoundary moduleName={moduleName}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative h-full w-full"
      >
        {children}
      </motion.div>
    </ModuleErrorBoundary>
  );
};