import React from 'react';

const About =({ match })=>{
    console.log(match);
    return(
        <section>
            <h1>{match.params.id}</h1>
        </section>
    )
};

export default About;

