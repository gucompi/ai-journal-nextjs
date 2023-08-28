'use client'

import { updateEntry } from "@/utils/api";
import { useEffect, useState } from "react";
import { useAutosave } from 'react-autosave';
const Editor = ({entry}) => {
    const [value,setValue] = useState(entry.content);
    const [isSaving, setIsSaving] = useState(false);
    const [analysis,setAnalysis] = useState(entry.analysis);
    let  {mood,summary,color,subject,negative} = analysis;
    let analysisData = [
        {name:"Subject", value: subject},
        {name:"Summary", value:summary},
        {name:"Mood", value:mood},
        {name:"Negative", value:negative ? 'True':'False'},
    ]
    useEffect(()=>{
        mood = analysis.mood;
        summary = analysis.summary;
        color = analysis.color;
        subject = analysis.subject;
        negative = analysis.negative;
    },[analysis])            


    useAutosave({
        data: value,
        onSave: async (_data) => {
            setIsSaving(true);
            const data = await updateEntry(entry.id,_data);
            console.log(data)
            setAnalysis(data.analysis);
            setIsSaving(false);
        },
        debounceTime: 2000,
    });

    return (
        <div className="w-full h-[calc(100vh-60px)] grid grid-cols-3 gap-0 flex">
            <div className="col-span-2">
                {isSaving && <div>Saving...</div>}
                <textarea 
                    className="w-full h-full p8 text-xl"
                    value={value} 
                    onChange={e=>setValue(e.target.value)}>
                </textarea>
            </div>
            <div className="border-l border-black/10 col-span-1">
                <div className="px-6 py-10" style={{backgroundColor:color||"gray"}}>
                    <h2 className="text-2xl">Analysis</h2>
                </div>
                <ul >
                    {analysisData.map((data) => {
                        return (
                            <li key={data.name} className="px-1 py-4 border-b border-t border-black/10 flex justify-between">
                                <span className="px-4 text-lg font-semibold">{data.name}</span>
                                <span className="px-4">{String(data.value)}</span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Editor