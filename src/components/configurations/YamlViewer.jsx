import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useDashboardStore } from '../../store/dashboardStore';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const YamlViewer = ({ yaml, title }) => {
  const { theme } = useDashboardStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b dark:border-border-dark light:border-border-light">
        <h3 className="font-semibold dark:text-text-dark light:text-text-light">
          {title}
        </h3>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg dark:bg-surface-dark-hover light:bg-surface-light-hover hover:opacity-80"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-status-healthy" />
              <span className="text-sm text-status-healthy">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 dark:text-text-dark-secondary light:text-text-light-secondary" />
              <span className="text-sm dark:text-text-dark light:text-text-light">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language="yaml"
          style={theme === 'dark' ? vscDarkPlus : a11yLight}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            background: 'transparent',
          }}
          showLineNumbers
        >
          {yaml}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
