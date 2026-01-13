# UK School Catchment Area Checker

A Next.js application that helps parents find state and grammar schools near their UK postcode.

## Features

- 🔍 Postcode lookup using the free postcodes.io API
- 🎓 Database of all 140+ UK grammar schools
- 🏫 Sample state schools (expandable with GIAS data)
- 📏 Distance calculations (miles and km)
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast - built with Next.js 14

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push this code to a GitHub repository
2. Import the project in Vercel
3. Deploy!

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Expanding State Schools Data

The grammar schools database is complete, but state schools only have sample data for West London. To add all UK state schools:

1. Download the GIAS dataset from: `https://get-information-schools.service.gov.uk/Downloads`
2. Filter for state-funded secondary schools
3. Add to `/lib/schools.js`

The GIAS CSV includes latitude and longitude coordinates for all schools.

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [postcodes.io](https://postcodes.io/) - Free UK postcode API

## License

MIT
