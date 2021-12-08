import React, { useEffect, useState } from 'react';
import {
    Grid,
    FormControl,
    Select,
    Checkbox,
    MenuItem,
    ListItemText,
    Stack,
    Typography,
    TextField,
    InputLabel,
    Button,
    FormControlLabel,
} from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';
import { CheckCircleOutline } from '@material-ui/icons';
import StyledSwitch from '../StyledSwitch/StyledSwitch';
import getYearAndStandard from '../../helpers/getYearAndStandard';
import isArrayItemInAnotherArray from '../../helpers/isArrayItemInAnotherArray';
import {
    BBY,
    ABY,
    DATE_VALUES,
    FILTER_CONDITION_AND,
    FILTER_CONDITION_OR,
} from '../../helpers/constants';

const useStyles = makeStyles(() => createStyles({
    formControl: {
      color: 'white',
      minWidth: 250,
      maxWidth: 250,
    },
    transparent: {
      color: 'transparent',
    },
}));

const FilterControls = ({ films, species, characters, filterCharacters }) => {
    const classes = useStyles();
    const [filmsFilter, setFilmsFilter] = useState([]);
    const [speciesFilter, setSpeciesFilter] = useState([]);
    const [fromBirthday, setFromBirthday] = useState('');
    const [includeUnknown, setIncludeUnknown] = useState(false);
    const [toBirthday, setToBirthday] = useState('');
    const [fromBirthdayValue, setFromBirthdayValue] = useState(0);
    const [toBirthdayValue, setToBirthdayValue] = useState(0);
    const [filterCondition, setFilterCondition] = useState(FILTER_CONDITION_AND);
    const [timeRangeError, setTimeRangeError] = useState(false);
    const [isAnyFilterSet, setIsAnyFilterSet] = useState(false);

    useEffect(() => {
        let newCharacters = [...characters];
        const isFilmFilter = !!filmsFilter.length;
        const isSpeciesFilter = !!speciesFilter.length;
        const isBirthDayFilter = !!fromBirthdayValue && !!toBirthdayValue && !!toBirthday && !!fromBirthday && !timeRangeError;
        const isAnyFilterBeenSet = isFilmFilter || isSpeciesFilter || isBirthDayFilter;
        setIsAnyFilterSet(isAnyFilterBeenSet);

        if (filterCondition === FILTER_CONDITION_AND) {
            if (isFilmFilter)
                newCharacters = newCharacters.filter(({ films: charactersFilms }) => isArrayItemInAnotherArray(charactersFilms, filmsFilter));
            if (isSpeciesFilter)
                newCharacters = newCharacters.filter(({ species: charactersSpecies }) => isArrayItemInAnotherArray(charactersSpecies, speciesFilter));
            if (isBirthDayFilter) {
                if (fromBirthday === BBY) {
                    if (toBirthday === BBY)
                        newCharacters = newCharacters.filter(({ birth_year }) => {
                            const [year, standard] = getYearAndStandard(birth_year);
                            return standard === BBY ? year <= fromBirthdayValue && year >= toBirthdayValue : false;
                        });
                    else
                        newCharacters = newCharacters.filter(({ birth_year }) => {
                            if (birth_year === 'unknown') return includeUnknown;
                            const [year, standard] = getYearAndStandard(birth_year);
                            return standard === BBY ? year <= fromBirthdayValue : year <= toBirthdayValue;
                        });
                } else
                    newCharacters = newCharacters.filter(({ birth_year }) => {
                        const [year, standard] = getYearAndStandard(birth_year);
                        return standard === ABY ? year >= fromBirthdayValue && year <= toBirthdayValue : false;
                    });
            }
        } else {
            let filmsFilteredCharacters = [];
            let speciesFilteredCharacters = [];
            let birthdayFilteredCharacters = [];
            if (isFilmFilter)
                filmsFilteredCharacters = newCharacters.filter(({ films: charactersFilms }) => isArrayItemInAnotherArray(charactersFilms, filmsFilter));
            if (isSpeciesFilter)
                speciesFilteredCharacters = newCharacters.filter(({ species: charactersSpecies }) => isArrayItemInAnotherArray(charactersSpecies, speciesFilter));
            if (isBirthDayFilter) {
                if (fromBirthday === BBY) {
                    if (toBirthday === BBY)
                        birthdayFilteredCharacters = newCharacters.filter(({ birth_year }) => {
                            console.log(birth_year, includeUnknown, birth_year === 'unknown');
                            if (birth_year === 'unknown') return includeUnknown;
                            const [year, standard] = getYearAndStandard(birth_year);
                            return standard === BBY ? year <= fromBirthdayValue && year >= toBirthdayValue : false;
                        });
                    else
                        birthdayFilteredCharacters = newCharacters.filter(({ birth_year }) => {
                            if (birth_year === 'unknown') return includeUnknown;
                            const [year, standard] = getYearAndStandard(birth_year);
                            return standard === BBY ? year <= fromBirthdayValue : year <= toBirthdayValue;
                        });
                } else
                    birthdayFilteredCharacters = newCharacters.filter(({ birth_year }) => {
                        if (birth_year === 'unknown') return includeUnknown;
                        const [year, standard] = getYearAndStandard(birth_year);
                        return standard === ABY ? year >= fromBirthdayValue && year <= toBirthdayValue : false;
                    });
            }
            if (isAnyFilterBeenSet)
                newCharacters = [...new Set([...birthdayFilteredCharacters, ...filmsFilteredCharacters, ...speciesFilteredCharacters])];
        }

        filterCharacters(newCharacters);
    }, [filmsFilter, speciesFilter, fromBirthday, toBirthday, filterCondition, fromBirthdayValue, toBirthdayValue, includeUnknown]);

    useEffect(() => {
        if ((fromBirthday === BBY && fromBirthday === toBirthday && +fromBirthdayValue < +toBirthdayValue)
            || (fromBirthday === ABY && fromBirthday === toBirthday && +fromBirthdayValue > +toBirthdayValue)
        ) setTimeRangeError(true)
        else setTimeRangeError(false);
    }, [fromBirthday, toBirthday, filterCondition, fromBirthdayValue, toBirthdayValue]);

    return (
        <Grid container justifyContent="space-between" alignContent="center" pb={2} spacing={2}>
            <Grid item xs={12} md={4}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <Select
                        multiple
                        value={filmsFilter}
                        onChange={(event) => setFilmsFilter(event.target.value)}
                        displayEmpty
                        renderValue={(selected) => {
                            if (selected.length) {
                                return selected.join(', ')
                            }
                            return 'All Films';
                        }}
                    >
                        {films.map((item) => (
                            <MenuItem key={item} value={item}>
                                <ListItemText primary={item}/>
                                <Checkbox
                                    color="primary"
                                    checked={filmsFilter.includes(item)}
                                    icon={<CheckCircleOutline className={classes.transparent} />}
                                    checkedIcon={<CheckCircleOutline />}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <Select
                        multiple
                        value={speciesFilter}
                        onChange={(event) => setSpeciesFilter(event.target.value)}
                        displayEmpty
                        renderValue={(selected) => {
                            if (selected.length) {
                                return selected.join(', ')
                            }
                            return 'All Species';
                        }}
                    >
                        {Object.values(species).map((item) => (
                            <MenuItem key={item} value={item}>
                                <ListItemText primary={item}/>
                                <Checkbox
                                    color="primary"
                                    checked={speciesFilter.includes(item)}
                                    icon={<CheckCircleOutline className={classes.transparent} />}
                                    checkedIcon={<CheckCircleOutline />}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{FILTER_CONDITION_AND}</Typography>
                    <StyledSwitch
                        sx={{ m: 1 }}
                        checked={filterCondition === FILTER_CONDITION_OR}
                        onChange={(event) => setFilterCondition(event.target.checked ? FILTER_CONDITION_OR : FILTER_CONDITION_AND)}
                    />
                    <Typography>{FILTER_CONDITION_OR}</Typography>
                </Stack>
            </Grid>
            {isAnyFilterSet && (
                <Grid item xs={12} md={2}>
                    <Button onClick={() => {
                        setFilmsFilter([]);
                        setSpeciesFilter([]);
                        setFromBirthday('');
                        setToBirthday('');
                        setFromBirthdayValue();
                        setToBirthdayValue();
                        setIncludeUnknown(false);
                        setFilterCondition(FILTER_CONDITION_AND);
                    }}>
                        Clear Filters
                    </Button>
                </Grid>
            )}
            <Grid item xs={12} container pt={2} spacing={2}>
                <Grid item xs={12} md={3}>
                    <TextField
                        type="number"
                        variant="outlined"
                        label="From"
                        inputProps={{ min: 0 }}
                        error={timeRangeError}
                        helperText={timeRangeError && 'From time value can\'t be more that To value'}
                        onChange={(event) => setFromBirthdayValue(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                        <InputLabel>Date Standard From</InputLabel>
                        <Select
                            value={fromBirthday}
                            label="Date Standard From"
                            onChange={(event) => setFromBirthday(event.target.value)}
                        >
                            {DATE_VALUES.map((item) => (
                                <MenuItem key={item} value={item} disabled={item === ABY && toBirthday === BBY}>
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        type="number"
                        variant="outlined"
                        label="To"
                        inputProps={{ min: 0 }}
                        error={timeRangeError}
                        helperText={timeRangeError && 'To time value can\'t be less that From value'}
                        onChange={(event) => setToBirthdayValue(event.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined" className={classes.formControl}>
                        <InputLabel>Date Standard To</InputLabel>
                        <Select
                            value={toBirthday}
                            label="Date Standard To"
                            onChange={(event) => setToBirthday(event.target.value)}
                        >
                            {DATE_VALUES.map((item) => (
                                <MenuItem key={item} value={item} disabled={item === BBY && fromBirthday === ABY}>
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeUnknown}
                                onChange={(event) => setIncludeUnknown(event.target.checked)}
                            />
                        }
                        label="Include characters with unknown birthday date"
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default FilterControls;
