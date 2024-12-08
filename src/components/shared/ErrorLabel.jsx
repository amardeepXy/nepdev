
const ErrorLabel = ({children}) => {
    return (
        <div className="bg-red-100 border border-red-400 px-4 py-3 text-red bg-red/10 rounded relative mt-3" role="alert">
            <span className="block sm:inline">{children}</span>
        </div>
    );
};

export default ErrorLabel;