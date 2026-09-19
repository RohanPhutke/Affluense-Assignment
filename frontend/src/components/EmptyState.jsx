const EmptyState = ({
    title,
    message
}) => {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5v9A2.25 2.25 0 0 1 18 18.75H6A2.25 2.25 0 0 1 3.75 16.5v-9A2.25 2.25 0 0 1 6 5.25h12a2.25 2.25 0 0 1 2.25 2.25Z"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m3.75 8.25 6.04 4.028a3.75 3.75 0 0 0 4.162 0L20.25 8.25"
                    />
                </svg>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-800">
                {title}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
                {message}
            </p>
        </div>
    );
}

export default EmptyState;