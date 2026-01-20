import React from 'react'

function CodingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-[calc(100vh-7rem)]'>{children}</div>
  )
}

export default CodingLayout