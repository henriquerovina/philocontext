import { AnimatePresence, motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="bg-surface-50 dark:bg-ink-800 rounded-lg shadow-lg overflow-hidden">
      <div className="flex border-b border-ink-800/20 dark:border-surface-50/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-3 font-semibold transition ${
              activeTab === tab.id
                ? 'border-b-2 border-ink-800 dark:border-surface-50 text-ink-800 dark:text-surface-50'
                : 'text-ink-800/70 dark:text-surface-100/70 hover:text-ink-900 dark:hover:text-surface-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="p-6 max-w-none"
        >
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
