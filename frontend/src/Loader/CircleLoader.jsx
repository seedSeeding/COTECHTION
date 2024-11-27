export default function CircleLoader({message}) {
    
    return (
        <span className="loading">
            <div className="loading-circle"></div>
            {message}
        </span>
    );
}