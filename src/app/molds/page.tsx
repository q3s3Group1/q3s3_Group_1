"use client"
import {useEffect, useState} from "react";
import {MoldComponent} from "@/components/mold";
import {Skeleton} from "@/components/ui/skeleton";
import {getMolds} from "@/lib/api";
import {Mold} from "@/types";
import {Input} from "@/components/ui/input";
import {Toggle} from "@/components/ui/toggle"
import {RectangleHorizontalIcon, Settings} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";


export default function Page() {
    const [molds, setMolds] = useState<Mold[]>([]);
    const [displayMolds, setDisplayMolds] = useState<Mold[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [bigMode, setBigMode] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [settingsOpened, setSettingsOpened] = useState(false)
    const [healthTolerance, setHealthTolerance] = useState(0.5);

    useEffect(() => {
        setDisplayMolds(molds.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.health - b.health))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [molds, search]);

    useEffect(() => {
        const fetchMolds = async () => {
            setIsLoading(true);
            const response = await getMolds(currentPage * 30, 30)
                .catch(() => ({
                    data: []
                }));
                
            setMolds(response.data.map(mold => {
                return {
                    id: mold.id,
                    name: mold.name ?? "ID: " + mold.id.toString(),
                    description: mold.description ?? "",
                    health: mold.health ?? -1,
                    machine: mold.machine,
                    board: Number(mold.board),
                    port: Number(mold.port),
                } as Mold
            }));

            setIsLoading(false);
        };

        fetchMolds();
    }, [currentPage]);

    return (
        <div className="container mx-auto px-4">
            <Card className={"mb-5 max-w-[40rem] mx-auto"}>
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center">
                            <span className="block mr-auto">Molds [{molds.length} results]</span>
                            <Button onClick={() => setSettingsOpened(!settingsOpened)}><Settings/></Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className={settingsOpened ? "visible" : "hidden"}>
                    <div className={"grid grid-cols-2 items-center gap-y-2"}>
                        <span>Search</span>
                        <Input onInput={(term) => {
                            setSearch((term.target as HTMLInputElement).value)
                        }} placeholder="Enter name or description..."
                               className="text-zinc-900"></Input>

                        <span>Large mode</span>
                        <Toggle onClick={() => {
                            setBigMode(!bigMode);
                        }}>
                            <span className="flex items-center justify-center"><RectangleHorizontalIcon/> </span>
                        </Toggle>

                        <span>Health tolerance</span>
                        <Input step={0.1} onChange={(e) => {
                            setHealthTolerance(Number((e.target as HTMLInputElement).value))
                        }} value={healthTolerance} type={"number"} />


                    </div>
                </CardContent>
                <CardFooter className={settingsOpened ? "visible" : "hidden"}>
                    <Pagination className="">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious className="cursor-pointer"
                                                    onClick={() => setCurrentPage(currentPage == 0 ? 0 : currentPage - 1)}/>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">{currentPage}</PaginationLink>
                            </PaginationItem> <PaginationItem>
                            <PaginationNext className="cursor-pointer" onClick={() => setCurrentPage(currentPage + 1)}/>
                        </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardFooter>
            </Card>


            <div
                className={`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 grid w-full flex-wrap child:transition-all gap-5 child:cursor-pointer child-hover:shadow-2xl ${bigMode ? "!grid-cols-1 lg:!grid-cols-2 child-hover:-translate-y-1 child:!text-3xl child:flex-row" : "child:basis-52 last:basis-auto child:flex-grow child-hover:scale-105 text-lg child:flex-col last:after:flex-[9999999]"}`}>
                {isLoading ? (
                    Array.from({length: 10}).map((_, index) => (
                        <Skeleton key={index} className="h-20 w-40 rounded-md"/>
                    ))
                ) : (
                    displayMolds.map((mold: Mold) => (
                        <MoldComponent key={mold.id} tolerance={healthTolerance} mold={mold} updateMold={(mold: Mold) => {
                            setMolds(molds.map(m => m.id == mold.id ? mold : m))
                        }}/>
                    ))
                )}
            </div>


        </div>
    );
}
