export function ProgressBar({ value }: { value: number }) {
    return (
        <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
                className="h-full rounded-full bg-gradient-to-r from-[#ff8a3d] to-[#f37021]"
                style={{ width: `${value}%` }}
            />
        </div>
    );
}
