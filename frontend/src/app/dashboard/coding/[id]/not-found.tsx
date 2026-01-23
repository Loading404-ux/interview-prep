
import Link from 'next/link'
export default function NotFound() {
    return (
        <>
            <div className="max-w-5xl mx-auto text-center py-12">
                <h1 className="text-2xl font-bold text-foreground mb-2">Problem Not Found</h1>
                <p className="text-muted-foreground mb-6">The problem you're looking for doesn't exist.</p>
                <Link href="/dashboard/coding" className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer! rounded-xl border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50">
                    Back to Problems
                </Link>
            </div>
        </>
    );
}
