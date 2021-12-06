import React from 'react';
import { Typography } from '@mui/material';

const CharacterCard = ({ character }) => (
    character && (
        <>
            <Typography variant="h6" component="h2">
                <b>Name:</b> {character.name}
            </Typography>
            <Typography variant="h6" component="h2">
                <b>Species:</b> {character.species.join(', ')}
            </Typography>
            <Typography variant="h6" component="h2">
                <b>Movies:</b> {character.films.join(', ')}
            </Typography>
            <Typography variant="h6" component="h2">
                <b>Spaceships:</b> {character.starships.length ? character.starships.join(', ') : '-'}
            </Typography>
        </>
    )
);

export default CharacterCard;
