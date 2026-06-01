import { useTheme } from "@/components/ThemeProvider"

export const MethodBadge = ({ method }: { method: string }) => {
    const colors = {
        GET: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
        POST: "text-green-600 bg-green-500/10 dark:text-green-400",
        DELETE: "text-red-600 bg-red-500/10 dark:text-red-400",
        PUT: "text-yellow-600 bg-yellow-500/10 dark:text-yellow-400",
    }
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-bold select-none ${colors[method as keyof typeof colors]}`}>
            {method}
        </span>
    )
}

function highlightSyntax(code: string) {
    const escaped = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")

    return escaped
        .replace(/"([^"]+)":/g, '<span class="text-orange-500 dark:text-orange-400">"$1"</span>:')
        .replace(/: "([^"]+)"/g, ': <span class="text-emerald-600 dark:text-emerald-400">"$1"</span>')
        .replace(/: (\d+\.?\d*)/g, ': <span class="text-blue-500">$1</span>')
        .replace(/: (true|false)/g, ': <span class="text-purple-500">$1</span>')
        .replace(/: (null)/g, ': <span class="text-gray-400">$1</span>')
}

export const CodeBlock = ({ code, label, className, language = "json" }: { code: string; label?: string; className?: string; language?: string }) => {
    return (
        <div className={`my-4 ${className}`}>
            {label && <div className="text-xs font-medium mb-1.5 opacity-50 uppercase tracking-wider">{label}</div>}
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
                <pre className="m-0 p-4 font-mono text-sm leading-relaxed bg-[var(--surface)] overflow-x-auto whitespace-pre-wrap break-all">
                    <code dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }} />
                </pre>
            </div>
        </div>
    )
}
