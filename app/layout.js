import './globals.css'

export const metadata = {
  title: 'UK School Catchment Area Checker | Find Schools Near Your Postcode',
  description: 'Find state and grammar schools near your UK postcode. Check school catchment areas, distances, and school types including grammar, secondary, and primary schools.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
