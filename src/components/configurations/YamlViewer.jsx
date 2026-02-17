import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDashboardStore } from '../../store/dashboardStore';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const YamlViewer = ({ yaml, title }) => {
  const { theme } = useDashboardStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden shadow-elevated">
      <CardHeader className="flex-row items-center justify-between space-y-0 py-3 border-b">
        <CardTitle className="text-sm">{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 text-xs gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </CardHeader>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language="yaml"
          style={theme === 'dark' ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.8125rem',
            background: 'transparent',
            lineHeight: 1.6,
          }}
          showLineNumbers
          lineNumberStyle={{ opacity: 0.3, fontSize: '0.75rem' }}
        >
          {yaml}
        </SyntaxHighlighter>
      </div>
    </Card>
  );
};
