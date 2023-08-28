const EntryCard = ({entry}) => {
    console.log(entry)
    const date = new Date(entry.createdAt).toDateString();
    return <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow">
    <div className="px-4 py-5 sm:px-6">{date}</div>
    <div className="px-4 py-5 sm:px-6">{entry.analysis?.summary || "sumary"}</div>
    <div className="px-4 py-5 sm:px-6">{entry.analysis?.mood || "mood"}</div>
</div>
}

export default EntryCard; 