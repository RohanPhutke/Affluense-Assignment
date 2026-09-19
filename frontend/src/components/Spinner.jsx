const Spinner = ({
    size = "md",
    text = ""
}) => {
    const sizeClass = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8"
    }[size];

    return (
        <div className="flex items-center justify-center gap-2">
            <svg
                className={`${sizeClass} animate-spin text-blue-600`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-20"
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                />

                <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M21 12a9 9 0 0 1-9 9v-3a6 6 0 0 0 6-6h3Z"
                />
            </svg>

            {text && (
                <span className="text-sm text-slate-500">
                    {text}
                </span>
            )}
        </div>
    );
}

export default Spinner;