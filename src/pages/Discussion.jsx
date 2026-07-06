import Markdown from 'markdown-to-jsx'
import content from '../content/discussion.md?raw'

export function Discussion() {
  return (
    <div className="max-w-4xl">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <Markdown
          options={{
            overrides: {
              h1: { component: 'h1', props: { className: 'text-4xl font-bold mb-6 tracking-tight text-foreground' } },
              h2: { component: 'h2', props: { className: 'text-2xl font-semibold mt-10 mb-4 border-b pb-2 text-foreground' } },
              h3: { component: 'h3', props: { className: 'text-xl font-medium mt-6 mb-3 text-foreground' } },
              p: { component: 'p', props: { className: 'text- leading-relaxed mb-4 text-foreground' } },
              ul: { component: 'ul', props: { className: 'list-disc list-inside space-y-2 mb-4 text-foreground' } },
              li: { component: 'li', props: { className: 'ml-4' } },
              strong: { component: 'strong', props: { className: 'font-semibold text-foreground' } },
              table: { component: 'table', props: { className: 'w-full text-sm border-collapse my-4 text-foreground' } },
              thead: { component: 'thead', props: { className: 'bg-muted text-muted-foreground' } },
              tbody: { component: 'tbody', props: { className: 'divide-y divide-border' } },
              tr: { component: 'tr', props: { className: 'border-b border-border' } },
              th: { component: 'th', props: { className: 'px-3 py-2 text-left font-semibold border border-border whitespace-nowrap' } },
              td: { component: 'td', props: { className: 'px-3 py-2 border border-border' } },
            },
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  )
}

