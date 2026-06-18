import ReactMarkdown from 'react-markdown'

export default function ArticleRenderer({ content }: { content: string }) {
  return (
    <div className="prose-article">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 mt-8 mb-4 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold text-slate-900 mt-7 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold text-slate-900 mt-5 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-slate-700 leading-relaxed mb-4">{children}</p>,
          ul: ({ children }) => <ul className="list-none space-y-2 mb-4 pl-0">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-4">{children}</ol>,
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-slate-700">
              <span className="text-blue-400 mt-1 shrink-0">›</span>
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
          em: ({ children }) => <em className="italic text-slate-600">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-300 pl-4 py-1 my-4 bg-blue-50 rounded-r-xl text-slate-600 italic">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.startsWith('language-')
            if (isBlock) {
              return (
                <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 my-4 overflow-x-auto text-sm">
                  <code>{children}</code>
                </pre>
              )
            }
            return <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {children}
            </a>
          ),
          hr: () => <hr className="border-slate-200 my-6" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="text-left font-semibold text-slate-900 px-3 py-2 border-b border-slate-200 bg-slate-50">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 border-b border-slate-100 text-slate-700">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
