import Markdown from 'markdown-to-jsx'
import content from '../content/documentation.md?raw'

export function Documentation() {
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
            },
          }}
        >
          {content}
        </Markdown>
      </div>
    </div>
  )
}

