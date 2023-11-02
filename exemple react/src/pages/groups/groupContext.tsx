import React, { createContext, useState } from 'react';
import { GroupInterface, PersonBrutInterface } from '../../types';
import { GridRowModel } from '@mui/x-data-grid';

type GroupContextType = {

    dataBrut: GroupInterface[];
    setDataBrut: (value: GroupInterface[]) => void;

    dataGroups: GridRowModel[];
    setDataGroups: (value: GridRowModel[]) => void;
    
    currentRowId: string;
    setCurrentRowId: (value: string) => void;
    
    getGroup: () => void;
    groups: GroupInterface[];
    setGroups: (value: GroupInterface[]) => void;

    getUser: () => void;
    persons: PersonBrutInterface[];
    setPersons: (value: PersonBrutInterface[]) => void;
    
    deleteGroup: (idGroup: string, idOfFather: string) => void;
};


// Créez le contexte
const GroupContext = createContext<GroupContextType>({} as GroupContextType);

function GroupProvider({ children }: { children: React.ReactNode }) 
{   
    const [dataBrut, setDataBrut] = useState<GroupInterface[]>([]);
    const [dataGroups, setDataGroups] = useState<GridRowModel[]>([]);
    const [currentRowId, setCurrentRowId] = useState<string>(''); // to keep the id of the row modified
    
    const [groups, setGroups] = useState<GroupInterface[]>([]); // stocké la personne elle même dans le state
    
    const [persons, setPersons] = useState<PersonBrutInterface[]>([]); // stocké la personne elle même dans le state

    const getGroup = async() => {
        const response = await fetch("http://localhost:3000/group/");
        const groups = await response.json();
        setGroups(groups);
    };
    
    const getUser = async() => {
        const response = await fetch("http://localhost:3000/person/");
        const persons = await response.json();
        setPersons(persons);
    };
    
    const deleteGroup = (idGroup: string, idOfFather: string) => 
    {
        fetch("http://localhost:3000/group/deleteFather/" + idGroup)
        .then(() => 
        {
            const updatedDataGroups = dataBrut.map(group => {
                if (group._id === idOfFather && group.groups) {
                    return {
                        ...group,
                        groups: group.groups.filter(groupChild => groupChild._id !== idGroup)
                    };
                }
                return group;
            });
            setDataGroups(updatedDataGroups);
            getGroup(); // pour pouvoir le remettre dans la liste des groups
        })
    }


    return (
        <GroupContext.Provider value={{dataBrut, setDataBrut, dataGroups, setDataGroups, currentRowId, setCurrentRowId, getGroup, groups, setGroups, getUser, persons, setPersons, deleteGroup }}>
            {children}
        </GroupContext.Provider>
    );
}


export { GroupContext, GroupProvider };