import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Grid,
    Toolbar,
    IconButton,
} from '@mui/material';
import { ToastsStore } from 'react-toasts';
import { makeStyles, createStyles } from '@mui/styles';
import { swapi } from '../../api/swapi';
import FavoriteCharactersSideBar from '../FavoriteCharactersSideBar/FavoriteCharactersSideBar';
import ModalWindow from '../ModalWindow/ModalWindow';
import CharacterCard from '../CharacterCard/CharacterCard';
import FilterControls from '../FilterControls/FilterControls';
import { getItemStyle, getListStyle } from '../../helpers/dragAndDropHelpers';
import useAppBar from '../../helpers/useAppBar';
import getItemId from '../../helpers/getItemId';
import laserSwordIcon from "../../assets/icons/blue-laser-sword.png";
import yodaGif from "../../assets/gif/yoda.gif";
import darthVader from "../../assets/icons/darth-vader.svg";
import SwordLoader from '../SwordLoader/SwordLoader';

const useStyles = makeStyles((theme) => createStyles({
    smallIcon: {
        width: 30,
        height: 30,
    },
    listItemBox: {
        background: 'rgba(255, 255, 255, .5)',
        borderRadius: 15,
    },
    yodaGif: {
        right: -50,
        bottom: -20,
        zIndex: -1,
        position: 'absolute',
        '@media(max-width: 450px)': {
            display: 'none',
        },
    },
}));

const StarWarsCharactersTable = () => {
    const classes = useStyles();
    const [characters, setCharacters] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [character, setCharacter] = useState();
    const [favorites, setFavorites] = useState([]);
    const favoritesArray = JSON.parse(localStorage.getItem('favorites') || '0');
    const [films, setFilms] = useState([]);
    const [species, setSpecies] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = React.useState(false);
    const AppBar = useAppBar(open);

    const handleDrawerOpen = () => {
      setOpen(true);
    };

    const updateFavorites = (newFavoritesArray) => {
        setFavorites(newFavoritesArray);
        localStorage.setItem('favorites', JSON.stringify(newFavoritesArray));
    };

    const handleDrawerClose = () => {
      setOpen(false);
    };

    const getCharacters = async () => {
        setLoading(true);
        let filmsData;
        let isItPossibleToNext = true;
        let speciesAccumulator = {};
        let starShipsAccumulator = {};
        let charactersAccumulator = [];
        let page = 1;

        const result = await swapi.getFilms()
        if (result.success && result.films) {
            filmsData = result.films;
        } else console.log(result.error);

        while (isItPossibleToNext) {
            await swapi.getCharacters(page)
                .then(async (result) => {
                    if (result.success && result.characters) {
                        const speciesData = [];
                        const starShipsData = [];
                        isItPossibleToNext = !!result.next;
                        const charactersWithFilms = result.characters.map(({
                            films: itemFilms,
                            species: itemSpecies,
                            starships: itemStarShips,
                            ...item
                        }) => {
                            const speciesIds = itemSpecies.length ? itemSpecies.map(getItemId) : [1];
                            const starShipIds = itemStarShips.map(getItemId);
                            speciesData.push(...[...speciesIds].filter((id) => !speciesAccumulator[id]));
                            starShipsData.push(...[...starShipIds].filter((id) => !starShipsAccumulator[id]));
                            return ({
                                ...item,
                                species: speciesIds,
                                starships: starShipIds,
                                films: itemFilms.map((film) => {
                                    const filmData = filmsData[getItemId(film) - 1];
                                    return `Episode ${filmData.episode_id}: ${filmData.title}`;
                            })});
                        });
                        const speciesObj = await ([...new Set(speciesData)].reduce(async (promiseObj, id) => {
                            const obj = await promiseObj;
                            const result = await swapi.getSpecies(id);
                            if (result.success && result.species)
                                return {...obj, [id]: result.species.name};
                            else return {...obj};
                        }, Promise.resolve({})));
                        const starShipsObj = await ([...new Set(starShipsData)].reduce(async (promiseObj, id) => {
                            const obj = await promiseObj;
                            const result = await swapi.getStarShip(id);
                            if (result.success && result.starShip)
                                return {...obj, [id]: result.starShip.name};
                            else return {...obj};
                        }, Promise.resolve({})));
                        speciesAccumulator = { ...speciesAccumulator, ...speciesObj };
                        starShipsAccumulator = { ...starShipsAccumulator, ...starShipsObj };
                        charactersAccumulator.push(...charactersWithFilms.map(({ species: itemSpecies, starships: itemStarShips, ...item }) => {
                            return ({
                                ...item,
                                species: itemSpecies.length ? itemSpecies.map((speciesId) => speciesAccumulator[speciesId]) : [speciesAccumulator[1]],
                                starships: itemStarShips.map((starShipId) => starShipsAccumulator[starShipId]),
                            });
                        }));
                    } else console.log(result.error);
                }).catch((err) => {
                    console.log(err)
                });
            page++;
        }
        setFilms(filmsData.map(({ episode_id, title }) => `Episode ${episode_id}: ${title}`));
        setSpecies(speciesAccumulator);
        setCharacters(charactersAccumulator);
        setLoading(false);
    };

    const onDragStart = () => {
        setIsDragging(true);
        handleDrawerOpen();
    };

    const onDragEnd = (result) => {
        setIsDragging(false);
        const { destination, source, draggableId } = result;

        if (!destination || destination.droppableId === source.droppableId) {
            return;
        } else {
            const { name: draggingCharacterName } = characters.find(({ name }) => name === draggableId);
            if (!favorites.includes(draggingCharacterName)) {
                updateFavorites([...favorites, draggingCharacterName]);
                ToastsStore.success(`${draggingCharacterName} has been added to the favorite characters list successfully!`);
            } else {
                ToastsStore.warning(`${draggingCharacterName} has already been added to the favorite characters list`);
                handleDrawerClose();
            };
        }
    };

    useEffect(() => {
        getCharacters();
        if (!!favoritesArray.length)
            setFavorites([...favoritesArray]);
    }, []);

    return (
        <div>
            <ModalWindow
                open={!!character}
                onClose={() => setCharacter()}
            >
                <CharacterCard character={character} />
            </ModalWindow>
            <Box p={4}>
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        {!loading && (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                sx={{ mr: 2, ...(open && { display: 'none' }) }}
                            >
                                <img alt="blue-laser-sword-icon" src={laserSwordIcon} className={classes.smallIcon}/>
                            </IconButton>
                        )}
                        <Typography variant="h6" noWrap component="div" textAlign="center">
                            Star Wars Characters
                        </Typography>
                    </Toolbar>
                </AppBar>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                        <SwordLoader />
                    </Box>
                ) : (
                    <>
                        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                            <FavoriteCharactersSideBar
                                open={open}
                                favorites={favorites}
                                isDragging={isDragging}
                                updateFavorites={updateFavorites}
                                handleDrawerClose={handleDrawerClose}
                            />
                            <Box p={{ xs:0, md: 8 }} pt={{ xs: 5, md: 8 }} height={{ xs: "100%", md: "80vh" }} overflow="hidden">
                                <Box display="flex" justifyContent="center" alignItems="center" pb={2}>
                                    <Typography fontWeight="bold" fontSize={20}>
                                        Quantity of characters: {filteredCharacters.length}
                                    </Typography>
                                    <img alt="darthVader-icon" src={darthVader} className={classes.smallIcon}/>
                                </Box>
                                <FilterControls
                                    films={films}
                                    species={species}
                                    characters={characters}
                                    filterCharacters={(newCharacters) => setFilteredCharacters(newCharacters)}
                                />
                                <Grid container justifyContent="center" height="100%" overflow="scroll">
                                    <Grid item xs={12} md={3}>
                                        <Droppable droppableId="list">
                                            {(provided) => (
                                                <List
                                                    ref={provided.innerRef}
                                                    style={getListStyle()}
                                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                                    aria-label="contacts"
                                                    className={classes.list}
                                                >
                                                    {filteredCharacters.map((item, index) => (
                                                        <Draggable
                                                            key={index}
                                                            draggableId={item.name}
                                                            index={index}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <ListItem disablePadding
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={getItemStyle(
                                                                        snapshot.isDragging,
                                                                        provided.draggableProps.style
                                                                    )}
                                                                >
                                                                    <ListItemButton onClick={() => setCharacter(item)}>
                                                                        <Grid container alignContent="center" className={classes.listItemBox}>
                                                                            <Grid item xs={2}>
                                                                                {favorites.includes(item.name) && (
                                                                                    <ListItemIcon>
                                                                                        <img alt="blue-laser-sword-icon" src={laserSwordIcon} className={classes.smallIcon} />
                                                                                    </ListItemIcon>
                                                                                )}
                                                                            </Grid>
                                                                            <Grid item>
                                                                                <ListItemText inset primary={item.name} />
                                                                            </Grid>
                                                                        </Grid>
                                                                    </ListItemButton>
                                                                </ListItem>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </List>
                                            )}
                                        </Droppable>
                                    </Grid>
                                </Grid>
                            </Box>
                        </DragDropContext>
                        <img alt="yoda-gif" src={yodaGif} className={classes.yodaGif}/>
                    </>
                )}
            </Box>
        </div>
    );
};

export default StarWarsCharactersTable;
