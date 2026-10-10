import { LogItem } from '@/types';
import React from 'react';



interface ConsoleListProps {
  logs: LogItem[];
}

export const FunConsoleList: React.FC<ConsoleListProps> = ({ logs }) => {
  const formatDate = (dateInput: string | Date) => {
    const date = new Date(dateInput);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 font-mono">
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-sm text-slate-400">fun_console.log</span>
      </div>
      <div className="p-4 h-64 overflow-y-auto space-y-3">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-2 rounded hover:bg-slate-800/50 transition-colors group"
          >
            <span className="text-xs text-emerald-400 font-bold whitespace-nowrap mt-0.5">
              [{formatDate(log.timestamp)}]
            </span>
            <span className="text-slate-100 group-hover:text-white">
              {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-slate-500 italic text-center mt-20">
            No logs to display...
          </div>
        )}
      </div>
    </div>
  );
};