<!-- Project Comments Go Here -->
I've updated a few of the packages and recommend using Node v22, as Node v18 has reached EOL and is not compatible with this project.

I decided to use Biome for linting instead of ESLint, since it does the job of Prettier + ESLint in one package and is significantly faster.

Used Tanstack Query for built in infinite queries & caching behaviour to fetch data from the BE.