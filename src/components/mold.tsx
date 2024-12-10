"use client";

import {Mold, MoldHistory} from "@/types";
import {CircleProgressComponent} from "./circle-progress";
import {Skeleton} from "./ui/skeleton";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {getMoldHealth, getMoldHistory} from "@/lib/api";

interface MoldComponentProps {
    mold: Mold;
    updateMold: (mold: Mold) => void;
    tolerance: number;
}

const getHealthColor = (health: number) => {
    if (health == -1) return "bg-gray-200"
    if (health <= 70) return "bg-red-600";
    if (health > 70) return "bg-[#19bb00]";
};

export function MoldComponent({mold, updateMold, tolerance}: MoldComponentProps) {
    const [showInfo, setShowInfo] = useState(false);
    const [moldHistory, setMoldHistory] = useState<MoldHistory[]>([]);
    const [moldHealth, setMoldHealth] = useState(-1);

    // useEffect(() => {
    //     getMoldHealth(mold.id, new Date(2020, 1, 30, 0, 0, 0, 0), tolerance).then(response => {
    //         setMoldHealth(response.data.health)
    //     })
    // }, [tolerance]);

    // useEffect(() => {

    //     const newMold = mold;
    //     newMold.health = moldHealth;

    //     updateMold(newMold);
        
    // }, [moldHealth]);

    // useEffect(() => {
    //     if (moldHistory.length == 0 && showInfo) {
    //         getMoldHistory(mold.id).then(r => setMoldHistory(r.data))
    //     }
    // }, [showInfo]);

    useEffect(() => {

        (async () => {
            const health = await getMoldHealth(mold.id, new Date(2020, 1, 30, 0, 0, 0, 0), tolerance);
            setMoldHealth(health.data.health);

            const newMold = mold;
            newMold.health = health.data.health;

            updateMold(newMold);
        })();

    }, [tolerance]);
    // if (false) {
    //     // Skeleton layout while loading
    //     return (
    //         <div
    //             className="basis-52 flex-grow shadow-sm rounded-lg overflow-hidden p-5 flex flex-col justify-between text-white bg-gray-300">
    //             <div className="flex flex-col gap-2">
    //                 <Skeleton className="h-8 w-2/3 bg-gray-500 rounded"/> {/* Name placeholder */}
    //                 <Skeleton className="h-4 w-1/2 bg-gray-500 rounded"/> {/* Machine name placeholder */}
    //             </div>
    //             <div className="flex justify-between items-center">
    //                 <div className="flex flex-col gap-2">
    //                     <Skeleton className="h-4 w-1/4 bg-gray-500 rounded"/> {/* Shots label placeholder */}
    //                     <Skeleton className="h-5 w-1/2 bg-gray-500 rounded"/> {/* Shots value placeholder */}
    //                     <Skeleton className="h-4 w-1/4 bg-gray-500 rounded"/> {/* Avg label placeholder */}
    //                     <Skeleton className="h-5 w-1/2 bg-gray-500 rounded"/> {/* Avg value placeholder */}
    //                 </div>
    //                 <Skeleton className="h-10 w-10 rounded-full bg-gray-500"/> {/* Circle progress placeholder */}
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <button
            className={`text-left shadow-sm rounded-lg overflow-hidden p-4 gap-5 flex justify-between text-zinc-100 ${getHealthColor(moldHealth)}`}
            onClick={() => {
                setShowInfo(!showInfo);
            }}
        >
            <Dialog open={showInfo}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{mold.name}</DialogTitle>
                        <DialogDescription>
                            <span
                                className={moldHealth == -1 ? "text-zinc-950" : "text-zinc-50"}>{mold.description == "" ? "ID: " + mold.id : mold.description}</span>
                            <div
                                className="flex child:flex child:flex-col child:flex-grow gap-3 child:p-2 child:text-zinc-950 child:last:text-zinc-800 mt-2">
                                <div><b>Board</b><span>{mold.board}</span></div>
                                <div><b>Port</b><span>{mold.port}</span></div>
                                <div><b>Status</b><span
                                    className={`${moldHealth > 70 ? "text-green-500" : "text-red-500"}`}>
                                    {mold.health > 70 ? "OK" : "Maintenance required"}
                                </span></div>
                                <div>
                                    <b>Health</b>
                                    <span>{moldHealth}%</span>
                                </div>
                                <div>
                                    <b>ID</b>
                                    <span>{mold.id}</span>
                                </div>
                            </div>
                            <span className="text-xl text-zinc-950 mt-5 block font-semibold">History</span>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>From</TableHead>
                                        <TableHead>To</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {moldHistory.map(m => (
                                        <TableRow key={m.start}>
                                            <TableCell
                                                className="font-medium">{new Intl.DateTimeFormat("nl", {
                                                timeStyle: "short",
                                                dateStyle: "short"
                                            }).format(new Date(m.start))}</TableCell>
                                            <TableCell
                                                className="font-medium">{new Intl.DateTimeFormat("nl", {
                                                timeStyle: "short",
                                                dateStyle: "short"
                                            }).format(new Date(m.end))}</TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col flex-grow">
                <span className="font-bold text-zinc-100 border-b border-white/50 mb-1">{mold.name}</span>
                <div
                    className="block font-semibold whitespace-nowrap text-ellipsis text-wrap"
                >
                    {mold.description}
                </div>
            </div>
            <div className="flex items-center gap-2 justify-between">
        <span
            className={`text-sm font-semibold px-2 py-1 rounded border border-white/50 w-28 text-center`}
        >
            {moldHealth <= 70 ? 'Maintenance Required' : 'Status OK'}
        </span>
                <div className="!text-sm">
                    <CircleProgressComponent percentage={moldHealth}/>
                </div>
            </div>
        </button>
    );
}
