import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';




interface SearchParamsHandlerProps {
    setIsPartEmpty: React.Dispatch<React.SetStateAction<{
        cpu: boolean;
        motherboard: boolean;
        graphic: boolean;
        fan: boolean;
        ram: boolean;
        ssd: boolean;
        power: boolean;
        case: boolean;
    }>>
    cpuItem: (params: { id: string }) => void;
    graphicItem: (params: { id: string }) => void;
    fanItem: (params: { id: string }) => void;
    ramItem: (params: { id: string }) => void;
    ssdItem: (params: { id: string }) => void;
    caseItem: (params: { id: string }) => void;
    powerItem: (params: { id: string }) => void;
    motherboardItem: (params: { id: string }) => void;
}




const SearchParamsHandler: React.FC<SearchParamsHandlerProps> = ({ setIsPartEmpty, cpuItem, graphicItem, fanItem, ramItem, ssdItem, caseItem, powerItem, motherboardItem }) => {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.has('cpu')) {
            setIsPartEmpty((prev) => ({ ...prev, cpu: false }));
            cpuItem({ id: searchParams.get('cpu') as string });
        } else {
            setIsPartEmpty((prev) => ({ ...prev, cpu: true }));
        }
        if (searchParams.has('graphic')) {
            setIsPartEmpty((prev) => ({ ...prev, graphic: false }));
            graphicItem({ id: searchParams.get('graphic') as string });
        } else {
            setIsPartEmpty((prev) => ({ ...prev, graphic: true }));

        }
        if (searchParams.has('fan')) {
            setIsPartEmpty((prev) => ({ ...prev, fan: false }));
            fanItem({ id: searchParams.get('fan') as string });
        } else {
            setIsPartEmpty((prev) => ({ ...prev, fan: true }));
        }
        if (searchParams.has('ram')) {
            setIsPartEmpty((prev) => ({ ...prev, ram: false }));
            ramItem({ id: searchParams.get('ram') as string });
        } else {
            setIsPartEmpty((prev) => ({ ...prev, ram: true }));

        }
        if (searchParams.has('ssd')) {
            setIsPartEmpty((prev) => ({ ...prev, ssd: false }));
            ssdItem({ id: searchParams.get('ssd') as string });
        } else {
            setIsPartEmpty((prev) => ({ ...prev, ssd: true }));

        }
        if (searchParams.has('case')) {
            setIsPartEmpty((prev) => ({ ...prev, case: false }));
            caseItem({ id: searchParams.get('case') as string });
        } else {
            setIsPartEmpty((prev) => ({ ...prev, case: true }));

        }
        if (searchParams.has('power')) {
            setIsPartEmpty((prev) => ({ ...prev, power: false }));
            powerItem({ id: searchParams.get('power') as string });
        } else {
            setIsPartEmpty((prev) => ({ ...prev, power: true }));
        }
        if (searchParams.has('motherboard')) {
            setIsPartEmpty((prev) => ({ ...prev, motherboard: false }));
            motherboardItem({ id: searchParams.get('motherboard') as string });
        } else {
            setIsPartEmpty((prev) => ({ ...prev, motherboard: true }));
        }
    }, [searchParams, setIsPartEmpty, cpuItem, graphicItem, fanItem, ramItem, ssdItem, caseItem, powerItem, motherboardItem]);

    return null;
};

export default SearchParamsHandler;
