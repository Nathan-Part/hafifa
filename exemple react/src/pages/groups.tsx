import { useState, useEffect, forwardRef } from 'react';
import { DataGrid, GridCellParams, GridColDef, GridRowModel, useGridApiRef } from '@mui/x-data-grid';
import { AppBar, Box, Button, IconButton, Slide, TextField, Toolbar, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddIcon from '@mui/icons-material/Add';
import {GroupInterface, PersonBrutInterface, PersonInterface } from '../types';
import GroupBtn from '../components/buttons';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';

// Fonctions utilitaires
function getRandomColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}



const Transition = forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  import { GroupContext } from './groups/groupContext';
  import React, { useContext } from 'react';

function Groups() 
{
    
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<any[]>([]);    

    const { dataBrut } = useContext(GroupContext);
    const { setDataBrut } = useContext(GroupContext);

    const { dataGroups } = useContext(GroupContext);
    const { setDataGroups } = useContext(GroupContext);

    const { currentRowId } = useContext(GroupContext);
    const { setCurrentRowId } = useContext(GroupContext);

    const { getGroup } = useContext(GroupContext);
    const { groups } = useContext(GroupContext);
    const { setGroups } = useContext(GroupContext);
    
    const { getUser } = useContext(GroupContext);
    const { persons } = useContext(GroupContext);
    const { setPersons } = useContext(GroupContext);

    const { deleteGroup } = useContext(GroupContext);

    // useEffect(() => {
    //     getUser();
    //     getGroup();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData();
            setDataGroups(data);
            setIsLoading(false);
        };

        fetchData();
    }, []);
    
    const [open, setOpen] = useState(false); // check if dialog is open or not
    const [selectedPerson, setSelectedPerson] = useState(''); // to keep the data of user select 
    
    const [openGroup, setOpenGroup] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(''); 
    

    const getData = async () => {
        const response = await fetch("http://localhost:3000/group/hierarchy");
        const data = await response.json();
        setDataBrut(data);
        return putDataOnTheRow(data);
    }
    
    const putDataOnTheRow = (dataGroups: GroupInterface[]) => {
        const rows:GridRowModel[] = [];
        dataGroups.forEach(group => 
        {     
            group.persons.forEach(person => {
                person.color = getRandomColor(person.name);
            });
            const listGroup: GroupInterface[] = [];
            
            if(group.groups)
            {
                group.groups.forEach(group => {
                    group.color = getRandomColor(group.name);
                    listGroup.push(group);
                });
            }
    
            rows.push({
                id: group._id,
                name: group.name,
                persons: group.persons,
                groups: listGroup
            });
            
        });
        return rows;
    }

    const openGroupDialog = (id: string) => {
        setCurrentRowId(id);
        setOpenGroup(true);
        const selectedGroup = groups.find(g => g._id === id);
        const groupFiltered = groups.filter((group: GroupInterface) => 
        {
            if(!selectedGroup) return true;
    
            return group._id !== id && 
                   group.groupFather !== id && 
                   selectedGroup.groupFather !== group._id;
        });

        setGroups(groupFiltered);
    };

    const openPersonDialog = (id: string) => { 
        setCurrentRowId(id);
        setOpen(true); 
        const personFiltered = persons.filter((person: PersonInterface) => {
            if(person.groups)
            {
                return !person.groups.some(group => group._id === id);
            }
        });
        setPersons(personFiltered);
    };
    
    const closeDialog = (type: string) => 
    {  
        if(type === "person")
        {
            setOpen(false);
        }
        else if(type === "group")
        {
            setOpenGroup(false);
        }
        else if(type === "add")
        {
            setOpenNewRow(false);
        }
        getUser();
        getGroup();
        setSelectedPerson(''); // for clear the select if we change row
        setSelectedGroup('');
    };

    const submitPerson = () => {
        addPerson(selectedPerson, currentRowId);
        closeDialog("person");
        setSelectedPerson('');
    };

    const submitGroup = () => {
        addGroup(selectedGroup, currentRowId);
        closeDialog("group");
        setSelectedGroup('');
    };

    const addPerson = async(personId: string, groupId: string | null) => 
    {
        fetch("http://localhost:3000/group/addPerson/" + personId + "/" + groupId)
        .then(async () => 
        {
            setDataGroups(await getData());
            getUser();
        });
    }

    const addGroup = async(idOfThisGroup: string, rowId: string) => 
    {
        const body = {
            groupFather: rowId
        }
        fetch("http://localhost:3000/group/update/"+idOfThisGroup, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify(body) 
        })
        .then(() => 
        {
            const groupToAdd = dataGroups.find(group => group._id === idOfThisGroup);
            
            const updatedDataGroups = dataGroups.map(group => {
                if (group._id === idOfThisGroup) {
                    return {
                        ...group,
                        groupFather: rowId
                    };
                }
                if(group._id === rowId && groupToAdd) {
                    return {
                        ...group,
                        groups: group.groups ? [...group.groups, groupToAdd] : [groupToAdd]
                    }
                }
                return group;
            });

            setDataGroups(updatedDataGroups);
            // getGroup();  
        });
    }

    const [openNewRow, setOpenNewRow] = useState(false);
    const [groupName, setGroupName] = useState('');
    
    const openDialogNewRow = () => {
        setOpenNewRow(true);
    };
  
    const addRow = () => 
    {
        closeDialog("add");
        const body = {
            name: groupName
        }
        fetch("http://localhost:3000/group/create/", {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify(body) 
        })
        .then(async() => 
        {
            setDataGroups(await getData());
            getGroup();
        });
    }
    
    const putDataOnTheColumn = () => {
        const buttonStyle = {
            padding: "5px",
            borderRadius: "12px",
            color: "white",
            width: "100%"
        };

        const myButtons = (idRow: string) => (
            <>
            <Button
                variant="contained"
                className="menu"
                endIcon={<PersonAddIcon />}
                onClick={() => openPersonDialog(idRow)}
            >
                Add person
            </Button>
            <Button
                variant="contained"
                className="menu"
                color="error"
                endIcon={<GroupAddIcon />}
                onClick={() => openGroupDialog(idRow)}
            >
                Add Group
            </Button>
            </> 
        );

        const columns: GridColDef[] = [
            { field: 'id', headerName: 'ID', filterable: false, width: 100 },
            { field: 'name', editable: true, hideable: false, headerName: 'Name', width: 130 },
            {
                field: 'persons',
                headerName: 'Persons',
                width: 200,
                sortable: false,
                filterable: false,
                hideable: false,
                description: "the column of the person on this group",
                renderCell: (params) => (
                    <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", lineHeight: "normal" }}>
                        {params.value.map((person: PersonBrutInterface, index: number) => (
                            <div key={index} style={{margin: "10px"}}>
                                <span style={{ ...buttonStyle, backgroundColor: person.color }}>
                                    <span style={{ marginRight: "5px", cursor: "pointer" }}
                                        onClick={() => deletePerson(person._id, params.row.id)}>
                                        ✖
                                    </span>
                                    {person.name}
                                </span>
                            </div>
                        ))}
                    </span>
                ),
            },
            { 
                field: 'groups',
                headerName: 'Groups',
                width: 200,
                sortable: false,
                filterable: false,
                hideable: false,
                description: "the column of the person on this group",
                renderCell: (params) => (
                    <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", lineHeight: "normal" }}>
                        {params.value.map((group: GroupInterface, index: number) => (
                            <div key={index} style={{margin: "5px"}}>
                                <span style={{ ...buttonStyle, backgroundColor: group.color }}>
                                    <span style={{ marginRight: "5px", cursor: "pointer" }}
                                        onClick={() => deleteGroup(group._id, params.row.id)}>
                                        ✖
                                    </span>
                                    {group.name}
                                </span>
                            </div>
                        ))}
                    </span>
                )
            },
            { 
                field: 'buttons',
                headerName: 'Action',
                renderHeader: () => (
                    <div style={{ display: 'flex', width: 270, alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{fontWeight: "var(--unstable_DataGrid-headWeight)"}}>Action</span>
                        <Button
                            variant="contained"
                            className="menu"
                            startIcon={<AddIcon />}
                            onClick={openDialogNewRow}
                        >
                            Add row
                        </Button>
                    </div>
                  ),
                width: 310,
                sortable: false,
                filterable: false,
                hideable: false,
                description: "the column for the action on the group",
                renderCell: (params) => (
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <GroupBtn button={myButtons(params.row.id)} />
                    </span>
                )
            }
        ];
        return columns;
    }

    const columns = putDataOnTheColumn();
    
    const deletePerson = (idPerson: string, idGroup: string) => 
    {
        fetch("http://localhost:3000/person/delete/" + idPerson + "/" + idGroup)
        .then(() => 
        {
            const updatedDataGroups = dataGroups.map(group => {
                if (group._id === idGroup) {
                    return {
                        ...group,
                        persons: group.persons.filter((person:PersonBrutInterface) => person._id !== idPerson)
                    };
                }
                return group;
            });
            setDataGroups(updatedDataGroups);
            getUser();
        })
    }

    const addIds = (selectionModel: any) => {
        setSelectedIds(selectionModel);
    };

    const deleteRow = () => {
        const selectedRows = dataGroups.filter((row) => selectedIds.includes(row._id));
        console.log(selectedRows, selectedIds);
        const deleteRows = selectedRows.map(row => (
            fetch("http://localhost:3000/group/delete/" + row._id)
        ))

        Promise.all(deleteRows)
        .then(() => {
            const updatedDataGroup = dataGroups.filter(group => !selectedRows.includes(group));
            const updatedDataGroups = updatedDataGroup.map(group => {
                if (!group.groups) {
                    return group;
                }
    
                const updatedSubGroups = group.groups.filter((groupChild: GroupInterface) => !selectedIds.includes(groupChild._id));
    
                return {
                    ...group,
                    groups: updatedSubGroups
                };
            });
    
            setDataGroups(updatedDataGroups);
        });
    };

    const apiRef = useGridApiRef();
      const editRow = (params: GridCellParams) => {
        setTimeout(() => {
            const updatedValue = apiRef.current.getCellValue(params.id, params.field);
            const body = {
                name: updatedValue
            }
            fetch("http://localhost:3000/group/update/"+params.id, {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json' 
                },
                body: JSON.stringify(body) 
            })
            .then(() =>{
                const updatedDataGroups = dataBrut.map(group => 
                {
                    if(!group.groups)
                    {
                        return group;
                    }

                    const updatedSubGroups = group.groups.map((groupChild) => 
                    {
                        if(groupChild._id === params.row.id)
                        {
                            return{
                                ...groupChild,
                                color: getRandomColor(updatedValue),
                                name: updatedValue
                            }
                        }
                        return groupChild;
                    });
                    if(group._id === params.row.id)
                    {
                        return {
                            ...group,
                            name: updatedValue,
                            groups: updatedSubGroups
                        };
                    }
                    else
                    {
                        return {
                            ...group,
                            groups: updatedSubGroups
                        };
                    }
                })
                setDataGroups(updatedDataGroups);
            })
        }, 0);
    };

    return (
        
        <div style={{ width: '100%' }}>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Dialog open={open} onClose={() => closeDialog("person")}>
                        <DialogTitle>Select name</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please choose a name among the following
                            </DialogContentText>
                            <Select
                                value={selectedPerson}
                                onChange={(event) => setSelectedPerson(event.target.value)}
                                fullWidth
                            >

                                {persons.map((person: PersonBrutInterface) => (
                                    <MenuItem key={person._id} value={person._id}>{person.name}</MenuItem>
                                 ))}

                            </Select>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => closeDialog("person")}>Cancel</Button>
                            <Button onClick={submitPerson}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                    
                    <Dialog open={openGroup} onClose={() => closeDialog("group")}>
                        <DialogTitle>Select group</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please choose a group among the following
                            </DialogContentText>
                            <Select
                                value={selectedGroup}
                                onChange={(event) => setSelectedGroup(event.target.value)}
                                fullWidth
                            >
                                {groups.map((group: GroupInterface) => (
                                    <MenuItem key={group._id} value={group._id}>{group.name}</MenuItem>
                                ))}
                            </Select>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => closeDialog("group")}>Cancel</Button>
                            <Button onClick={submitGroup}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                    
                    <Dialog
                        fullScreen
                        open={openNewRow}
                        onClose={() => closeDialog("add")}
                        TransitionComponent={Transition}
                    >
                        <AppBar sx={{ position: 'relative' }}>
                            <Toolbar>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={() => closeDialog("add")}
                                    aria-label="close"
                                >
                                    <CloseIcon />
                                </IconButton>
                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                    Create new Group
                                </Typography>
                                <Button autoFocus color="inherit" onClick={addRow}>
                                    save
                                </Button>
                            </Toolbar>
                        </AppBar>
                        <Box p={3} display="flex" flexDirection="column" alignItems="center" gap={3}>
                            <form style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    onChange={(event) => setGroupName(event.target.value)}
                                    variant="outlined"
                                    margin="normal"
                                />
                            </form>
                        </Box>
                    </Dialog>


                    <DataGrid
                        rows={dataGroups}
                        columns={columns}
                        apiRef={apiRef}
                        rowHeight={100}
                        style={{ lineHeight: 'normal' }}
                        onRowSelectionModelChange={addIds}
                        onCellEditStop={editRow}
                        onCellClick={(_, event: React.MouseEvent) => {event.stopPropagation()}}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    id: false,
                                },
                            },
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            }
                        }}
                        pageSizeOptions={[5, 10, 20, 40, 80]}
                        checkboxSelection
                    />
                    {selectedIds.length > 0 && (
                        <Button
                            sx={{ marginTop: '20px' }}
                            variant="contained"
                            color="error"
                            onClick={deleteRow}
                            endIcon={<DeleteIcon />}
                        >
                            delete the {selectedIds.length} rows select
                        </Button>
                    )}
                </>
            )}
        </div>
    );
}

export default Groups;
